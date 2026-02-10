import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { z } from "zod";

admin.initializeApp();

const db = admin.firestore();

// --- Schemas ---

const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(2),
  photoURL: z.string().url(),
  role: z.enum(['VOYAGER', 'ARCHITECT', 'SOURCE']),
  galaxyLevel: z.enum(['NEBULA', 'NOVA', 'GALAXY', 'SUPERNOVA']),
  xp: z.number().nonnegative(),
  membershipTier: z.enum(['free', 'kinetic', 'quantum']),
  createdAt: z.any()
});

const PostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  authorId: z.string()
});

// --- Auth Triggers ---

/**
 * Triggered when a new user is created in Firebase Auth.
 * Ensures the Firestore profile is initialized with default values securely.
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    // Validate the object before writing to DB
    const validatedData = UserProfileSchema.parse({
      ...defaultProfile,
      uid: uid // for schema matching
    });

    await db.collection('users').doc(uid).set(validatedData);
    
    // Initialize empty Voyager profile
    await db.collection('voyagerProfiles').doc(uid).set({
      userId: uid,
      contentTags: [],
      quizCompleted: false
    });

    functions.logger.info(`Initialized profile for user: ${uid}`);
  } catch (error) {
    functions.logger.error("Failed to initialize user profile", error);
  }
});

// --- Firestore Triggers ---

/**
 * Moderation trigger for new forum posts.
 * Checks for prohibited keywords or potential spam using Zod and basic logic.
 */
export const onPostCreated = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snapshot, context) => {
    const postData = snapshot.data();
    
    try {
      // Validate structure
      PostSchema.parse(postData);

      const content = (postData.content || "").toLowerCase();
      const prohibitedKeywords = ["spam", "buy-now-cheap", "malware"];
      
      const containsProhibited = prohibitedKeywords.some(kw => content.includes(kw));

      if (containsProhibited) {
        await snapshot.ref.update({
          moderated: true,
          status: 'FLAGGED',
          flaggedReason: 'Automated content policy violation'
        });
        functions.logger.warn(`Post ${context.params.postId} flagged by auto-moderation.`);
      }
    } catch (error) {
      functions.logger.error("Post validation failed", error);
    }
  });

// --- HTTPS Callables ---

/**
 * Securely updates a user's XP. Only system logic should do this.
 */
export const addXp = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  }

  const { amount } = z.object({ amount: z.number().int().positive() }).parse(data);
  const uid = context.auth.uid;

  const userRef = db.collection('users').doc(uid);
  
  await userRef.update({
    xp: admin.firestore.FieldValue.increment(amount)
  });

  return { success: true, newXpIncrement: amount };
});
