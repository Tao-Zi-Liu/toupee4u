"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsightsManual = exports.generatePersonalizedInsight = exports.generateDailyInsights = void 0;
// functions/src/insights.ts
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const genai_1 = require("@google/genai");
const shared_1 = require("./shared");
const DAILY_INSIGHTS_PROMPT = () => `
You are a content writer for a professional hair replacement industry community platform called Toupee4U.

Generate exactly 4 insights for today. Return a JSON array (raw JSON only, no markdown fences):

[
  {
    "type": "INDUSTRY_FACT",
    "text": "One specific, data-backed industry fact about the hair replacement or hair loss market. Include a number or statistic. Max 2 sentences.",
    "emoji": "📊"
  },
  {
    "type": "CARE_TIP",
    "text": "One specific, actionable care tip for hair system wearers. Be precise about materials, timing, or technique. Max 2 sentences.",
    "emoji": "💡"
  },
  {
    "type": "KB_HIGHLIGHT",
    "text": "One advanced technical fact about hair systems that most people don't know — about base materials, adhesives, fiber chemistry, or attachment methods. Max 2 sentences.",
    "emoji": "🔬"
  },
  {
    "type": "MOTIVATIONAL",
    "text": "One short, genuine motivational statement relevant to hair system wearers or professionals. Avoid clichés. Max 1 sentence.",
    "emoji": "⚡"
  }
]

Rules:
- Be specific and technical, not generic
- No marketing language
- No brand names
- Return ONLY the JSON array
`;
const PERSONALIZED_INSIGHT_PROMPT = (profile) => `
You are a personal advisor on the Toupee4U hair replacement community platform.

Generate ONE personalized insight for this user:
- Community level: ${profile.galaxyLevel}
- Role: ${profile.role}
- Hair pattern: ${profile.hairPattern || 'unknown'}
- Experience: ${profile.experienceLevel || 'unknown'}
- Membership: ${profile.membershipTier}

Return a JSON object (raw JSON only, no markdown fences):
{
  "type": "PERSONALIZED",
  "text": "A single, specific, genuinely useful tip tailored to this user's profile. Reference their experience level and hair pattern if known. Max 2 sentences.",
  "emoji": "✨"
}

Rules:
- Be specific to their profile, not generic
- For NEWBIE: focus on basics and common mistakes to avoid
- For VETERAN: focus on advanced techniques or optimization
- For ARCHITECT role: focus on client management or professional tips
- No marketing language, no brand names
- Return ONLY the JSON object
`;
exports.generateDailyInsights = (0, scheduler_1.onSchedule)({
    schedule: "0 1 * * *",
    timeZone: "UTC",
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 60,
    region: "us-central1",
}, async () => {
    console.info("Generating daily insights...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY not found");
        return;
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: DAILY_INSIGHTS_PROMPT() }] }],
            config: { temperature: 0.7, maxOutputTokens: 1024 }
        });
        const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const insights = JSON.parse(cleaned);
        if (!Array.isArray(insights) || insights.length === 0) {
            console.error("Invalid insights response");
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        await shared_1.db.collection('dailyInsights').doc(today).set({
            date: today, insights, generatedAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
        });
        console.info(`Generated ${insights.length} insights for ${today}`);
    }
    catch (error) {
        console.error("Failed to generate insights:", error);
    }
});
exports.generatePersonalizedInsight = (0, https_1.onCall)({ secrets: ["GEMINI_API_KEY"], memory: "256MiB", timeoutSeconds: 30, region: "us-central1" }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Must be logged in.');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new https_1.HttpsError('internal', 'API key not configured');
    const userDoc = await shared_1.db.collection('users').doc(request.auth.uid).get();
    const voyagerDoc = await shared_1.db.collection('voyagerProfiles').doc(request.auth.uid).get();
    const user = userDoc.data() || {};
    const voyager = voyagerDoc.data() || {};
    const profile = {
        galaxyLevel: user.galaxyLevel || 'NEBULA',
        role: user.role || 'VOYAGER',
        hairPattern: voyager.hairPattern,
        experienceLevel: voyager.experienceLevel,
        membershipTier: user.membershipTier || 'free',
    };
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: PERSONALIZED_INSIGHT_PROMPT(profile) }] }],
        config: { temperature: 0.8, maxOutputTokens: 256 }
    });
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const insight = JSON.parse(cleaned);
    return { insight };
});
exports.generateInsightsManual = (0, https_1.onCall)({ secrets: ["GEMINI_API_KEY"], memory: "256MiB", timeoutSeconds: 60, region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new https_1.HttpsError('internal', 'API key not configured');
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: DAILY_INSIGHTS_PROMPT() }] }],
        config: { temperature: 0.7, maxOutputTokens: 1024 }
    });
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const insights = JSON.parse(cleaned);
    if (!Array.isArray(insights) || insights.length === 0) {
        throw new https_1.HttpsError('internal', 'Failed to generate insights');
    }
    const today = new Date().toISOString().split('T')[0];
    await shared_1.db.collection('dailyInsights').doc(today).set({
        date: today, insights, generatedAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, count: insights.length, date: today };
});
//# sourceMappingURL=insights.js.map