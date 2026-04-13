"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMonthlyDigestManual = exports.generateMonthlyDigest = void 0;
exports.runMonthlyDigestGeneration = runMonthlyDigestGeneration;
// functions/src/digest.ts
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const genai_1 = require("@google/genai");
const shared_1 = require("./shared");
const MONTHLY_VOICE_CONFIG = {
    A: { name: "en-US-Neural2-D", gender: "MALE", hostName: "Alex" },
    B: { name: "en-US-Neural2-F", gender: "FEMALE", hostName: "Sam" },
};
// 单独生成每个 section，避免超长 JSON 解析问题
async function generateSection(ai, sectionName, sectionPrompt, articles, year, month) {
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    const prompt = `You are the editor-in-chief of "The Hair System Monthly" magazine.

Articles from ${monthName} ${year}:
${articles.slice(0, 20).map((a, i) => `${i + 1}. [${a.category}] ${a.title}: ${a.summary?.slice(0, 150)}`).join('\n')}

Write the "${sectionName}" section of the monthly digest.
${sectionPrompt}

Write 3-4 paragraphs of substantive analysis. Synthesize themes and trends — do NOT list articles.
Return ONLY the plain text content, no JSON, no markdown, no headers.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature: 0.7, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
async function generateSummary(ai, sections, year, month) {
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    const prompt = `Based on this monthly digest content for ${monthName} ${year}:
${sections.topStories.slice(0, 300)}

Write a 2-3 sentence executive summary of the month's most important developments.
Return ONLY the plain text summary, no JSON, no markdown.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature: 0.5, maxOutputTokens: 256, thinkingConfig: { thinkingBudget: 0 } },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
async function generatePodcastScript(ai, sections, summary, year, month) {
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    const prompt = `You are a script writer for "The Hair System Monthly Review" podcast.

${monthName} ${year} digest summary: ${summary}

Key themes this month:
- Top Stories: ${sections.topStories.slice(0, 300)}
- Materials & Tech: ${sections.materialsTech.slice(0, 300)}
- Market: ${sections.marketDynamics.slice(0, 300)}
- Insights: ${sections.expertInsights.slice(0, 300)}

Write a 2-host deep-dive podcast script (Host A: Alex, Host B: Sam).
- Tone: Formal, analytical, like two senior industry analysts
- Length: 20-25 exchanges
- Structure: intro → top stories → materials/tech → market → insights → outlook → sign-off

Return ONLY a JSON array, no markdown:
[{"speaker":"A","text":"..."},{"speaker":"B","text":"..."}]`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature: 0.6, maxOutputTokens: 4096, thinkingConfig: { thinkingBudget: 0 } },
    });
    const raw = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(cleaned);
    }
    catch {
        console.warn("Podcast script JSON parse failed, returning empty");
        return [];
    }
}
async function runMonthlyDigestGeneration(year, month) {
    const period = `${year}-${String(month).padStart(2, '0')}`;
    const existing = await shared_1.db.collection('monthlyDigests').doc(period).get();
    if (existing.exists) {
        console.info(`Monthly digest already exists for ${period}`);
        return { skipped: true };
    }
    const startDate = `${period}-01`;
    const endYear = month === 12 ? year + 1 : year;
    const endMonth = month === 12 ? 1 : month + 1;
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
    const newsSnap = await shared_1.db.collection('newsArticles')
        .where('status', '==', 'PUBLISHED')
        .where('generatedDate', '>=', startDate)
        .where('generatedDate', '<', endDate)
        .orderBy('generatedDate', 'asc')
        .get();
    const articles = newsSnap.docs.map(d => d.data());
    if (articles.length === 0)
        throw new Error(`No articles found for ${period}`);
    console.info(`Generating monthly digest for ${period} with ${articles.length} articles`);
    const genAI = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    // Generate each section separately
    console.info("Generating sections...");
    const [topStories, materialsTech, marketDynamics, expertInsights] = await Promise.all([
        generateSection(genAI, "Top Stories", "Focus on the most significant news and their broader industry implications.", articles, year, month),
        generateSection(genAI, "Materials & Technology", "Focus on materials science, base construction, adhesives, fiber technology innovations.", articles, year, month),
        generateSection(genAI, "Market Dynamics", "Focus on market movements, supply chain, consumer trends, regional dynamics.", articles, year, month),
        generateSection(genAI, "Expert Insights", "Synthesize professional perspectives and recommendations for practitioners.", articles, year, month),
    ]);
    const sections = { topStories, materialsTech, marketDynamics, expertInsights };
    console.info("Sections generated, creating summary...");
    const summary = await generateSummary(genAI, sections, year, month);
    console.info("Summary generated, creating podcast script...");
    const script = await generatePodcastScript(genAI, sections, summary, year, month);
    console.info(`Podcast script: ${script.length} lines`);
    const totalWords = script.reduce((sum, line) => sum + line.text.split(" ").length, 0);
    const estimatedDuration = Math.round((totalWords / 150) * 60);
    const transcript = script.map(line => `[${line.speaker === "A" ? MONTHLY_VOICE_CONFIG.A.hostName : MONTHLY_VOICE_CONFIG.B.hostName}] ${line.text}`).join("\n\n");
    await shared_1.db.collection('monthlyDigests').doc(period).set({
        period,
        year,
        month,
        title: `${monthName} ${year} — Hair System Industry Monthly Digest`,
        summary: summary || "",
        sections,
        articleCount: articles.length,
        audioUrl: "",
        audioPath: "",
        audioDuration: estimatedDuration,
        script,
        transcript,
        status: "PUBLISHED",
        createdAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
    });
    console.info(`Monthly digest generated for ${period}: ${articles.length} articles, ~${estimatedDuration}s podcast`);
    return { success: true, period, articleCount: articles.length, duration: estimatedDuration };
}
exports.generateMonthlyDigest = (0, scheduler_1.onSchedule)({
    region: "us-central1",
    schedule: "0 0 1 * *",
    timeZone: "UTC",
    timeoutSeconds: 540,
    memory: "512MiB",
    secrets: ["GEMINI_API_KEY"],
}, async () => {
    const now = new Date();
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    await runMonthlyDigestGeneration(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth() + 1);
});
exports.generateMonthlyDigestManual = (0, https_1.onCall)({
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "512MiB",
    secrets: ["GEMINI_API_KEY"],
}, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError("permission-denied", "Admin only.");
    const { year, month } = request.data;
    if (!year || !month)
        throw new https_1.HttpsError("invalid-argument", "year and month are required.");
    return await runMonthlyDigestGeneration(Number(year), Number(month));
});
//# sourceMappingURL=digest.js.map