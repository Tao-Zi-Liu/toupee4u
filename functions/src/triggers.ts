// functions/src/triggers.ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { auth } from "firebase-functions/v1";
import { z } from "zod";
import { admin, db } from "./shared";

const PostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  authorId: z.string()
});

export const onUserCreated = auth.user().onCreate(async (user) => {
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('users').doc(uid).set(defaultProfile);
    await db.collection('voyagerProfiles').doc(uid).set({
      userId: uid,
      contentTags: [],
      quizCompleted: false
    });
    console.info(`Initialized profile for user: ${uid}`);
  } catch (error) {
    console.error("Failed to initialize user profile", error);
  }
});

export const onPostCreated = onDocumentCreated('posts/{postId}', async (event) => {
  const postData = event.data?.data();
  if (!postData) return;

  try {
    PostSchema.parse(postData);
    const content = (postData.content || "").toLowerCase();
    const prohibitedKeywords = ["spam", "buy-now-cheap", "malware"];
    const containsProhibited = prohibitedKeywords.some(kw => content.includes(kw));

    if (containsProhibited) {
      await event.data!.ref.update({
        moderated: true,
        status: 'FLAGGED',
        flaggedReason: 'Automated content policy violation'
      });
    }
  } catch (error) {
    console.error("Post validation failed", error);
  }
});
