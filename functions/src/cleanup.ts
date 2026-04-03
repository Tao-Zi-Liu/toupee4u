// functions/src/cleanup.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getStorage } from "firebase-admin/storage";
import { db } from "./shared";

export const dailyCleanup = onSchedule(
  {
    region: "us-central1",
    schedule: "0 3 * * *",
    timeZone: "UTC",
    memory: "256MiB" as any,
  },
  async () => {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - 14);
    const cutoffDate = cutoff.toISOString().split('T')[0];

    console.info(`Cleanup: removing content before ${cutoffDate}`);

    // 清理 newsArticles
    const newsSnap = await db.collection('newsArticles')
      .where('generatedDate', '<', cutoffDate)
      .limit(200)
      .get();
    const newsBatch = db.batch();
    newsSnap.docs.forEach(doc => newsBatch.delete(doc.ref));
    await newsBatch.commit();
    console.info(`Deleted ${newsSnap.size} news articles`);

    // 清理 podcasts + Storage 音频文件
    const podcastSnap = await db.collection('podcasts')
      .where('generatedDate', '<', cutoffDate)
      .limit(50)
      .get();
    const bucket = getStorage().bucket();
    const podcastBatch = db.batch();
    for (const doc of podcastSnap.docs) {
      const data = doc.data();
      if (data.audioPath) {
        try {
          await bucket.file(data.audioPath).delete();
        } catch (err) {
          console.warn(`Audio file not found: ${data.audioPath}`);
        }
      }
      podcastBatch.delete(doc.ref);
    }
    await podcastBatch.commit();
    console.info(`Deleted ${podcastSnap.size} podcasts`);
  }
);
