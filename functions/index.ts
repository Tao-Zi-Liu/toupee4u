// functions/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { z } from "zod";

// ── Shared init (must be first) ───────────────────────────────────────────────
export { } from "./src/shared";

// ── Triggers ──────────────────────────────────────────────────────────────────
export { onUserCreated, onPostCreated } from "./src/triggers";

// ── News ──────────────────────────────────────────────────────────────────────
export {
  generateDailyNews,
  generateNewsManual,
  verifyNewsUrl,
  publishNewsArticle,
  rejectNewsArticle,
  unpublishNewsArticle,
} from "./src/news";

// ── Insights ──────────────────────────────────────────────────────────────────
export {
  generateDailyInsights,
  generatePersonalizedInsight,
  generateInsightsManual,
} from "./src/insights";

// ── Podcast ───────────────────────────────────────────────────────────────────
export { generatePodcastManual } from "./src/podcast";

// ── Monthly Digest ────────────────────────────────────────────────────────────
export { generateMonthlyDigest, generateMonthlyDigestManual } from "./src/digest";

// ── Cleanup ───────────────────────────────────────────────────────────────────
export { dailyCleanup } from "./src/cleanup";

// ── Misc Callables ────────────────────────────────────────────────────────────
// (addXp stays here as it's small and standalone)

const db = admin.firestore();

export const addXp = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in.');
  }
  const { amount } = z.object({ amount: z.number().int().positive() }).parse(request.data);
  await db.collection('users').doc(request.auth.uid).update({
    xp: admin.firestore.FieldValue.increment(amount)
  });
  return { success: true, newXpIncrement: amount };
});
