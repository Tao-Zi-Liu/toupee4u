"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyCleanup = void 0;
// functions/src/cleanup.ts
const scheduler_1 = require("firebase-functions/v2/scheduler");
const storage_1 = require("firebase-admin/storage");
const shared_1 = require("./shared");
exports.dailyCleanup = (0, scheduler_1.onSchedule)({
    region: "us-central1",
    schedule: "0 3 * * *",
    timeZone: "UTC",
    memory: "256MiB",
}, async () => {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - 14);
    const cutoffDate = cutoff.toISOString().split('T')[0];
    console.info(`Cleanup: removing content before ${cutoffDate}`);
    // 清理 newsArticles
    const newsSnap = await shared_1.db.collection('newsArticles')
        .where('generatedDate', '<', cutoffDate)
        .limit(200)
        .get();
    const newsBatch = shared_1.db.batch();
    newsSnap.docs.forEach(doc => newsBatch.delete(doc.ref));
    await newsBatch.commit();
    console.info(`Deleted ${newsSnap.size} news articles`);
    // 清理 podcasts + Storage 音频文件
    const podcastSnap = await shared_1.db.collection('podcasts')
        .where('generatedDate', '<', cutoffDate)
        .limit(50)
        .get();
    const bucket = (0, storage_1.getStorage)().bucket();
    const podcastBatch = shared_1.db.batch();
    for (const doc of podcastSnap.docs) {
        const data = doc.data();
        if (data.audioPath) {
            try {
                await bucket.file(data.audioPath).delete();
            }
            catch (err) {
                console.warn(`Audio file not found: ${data.audioPath}`);
            }
        }
        podcastBatch.delete(doc.ref);
    }
    await podcastBatch.commit();
    console.info(`Deleted ${podcastSnap.size} podcasts`);
});
//# sourceMappingURL=cleanup.js.map