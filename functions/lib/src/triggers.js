"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPostCreated = exports.onUserCreated = void 0;
// functions/src/triggers.ts
const firestore_1 = require("firebase-functions/v2/firestore");
const v1_1 = require("firebase-functions/v1");
const zod_1 = require("zod");
const shared_1 = require("./shared");
const PostSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    content: zod_1.z.string().min(10),
    category: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    authorId: zod_1.z.string()
});
exports.onUserCreated = v1_1.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;
    const defaultProfile = {
        userId: uid,
        email: email || "",
        displayName: displayName || "New Voyager",
        photoURL: photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "V")}&background=random`,
        role: 'VOYAGER',
        galaxyLevel: 'NEBULA',
        xp: 0,
        membershipTier: 'free',
        isExpert: false,
        createdAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: shared_1.admin.firestore.FieldValue.serverTimestamp()
    };
    try {
        await shared_1.db.collection('users').doc(uid).set(defaultProfile);
        await shared_1.db.collection('voyagerProfiles').doc(uid).set({
            userId: uid,
            contentTags: [],
            quizCompleted: false
        });
        console.info(`Initialized profile for user: ${uid}`);
    }
    catch (error) {
        console.error("Failed to initialize user profile", error);
    }
});
exports.onPostCreated = (0, firestore_1.onDocumentCreated)('posts/{postId}', async (event) => {
    const postData = event.data?.data();
    if (!postData)
        return;
    try {
        PostSchema.parse(postData);
        const content = (postData.content || "").toLowerCase();
        const prohibitedKeywords = ["spam", "buy-now-cheap", "malware"];
        const containsProhibited = prohibitedKeywords.some(kw => content.includes(kw));
        if (containsProhibited) {
            await event.data.ref.update({
                moderated: true,
                status: 'FLAGGED',
                flaggedReason: 'Automated content policy violation'
            });
        }
    }
    catch (error) {
        console.error("Post validation failed", error);
    }
});
//# sourceMappingURL=triggers.js.map