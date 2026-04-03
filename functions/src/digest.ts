// functions/src/digest.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { GoogleGenAI } from "@google/genai";
import { getStorage } from "firebase-admin/storage";
import { admin, db } from "./shared";
import { synthesizePodcastAudio } from "./tts";

const MONTHLY_VOICE_CONFIG = {
  A: { name: "en-US-Journey-D", gender: "MALE", hostName: "Alex" },
  B: { name: "en-US-Journey-F", gender: "FEMALE", hostName: "Sam" },
};

const MONTHLY_DIGEST_PROMPT = (articles: any[], year: number, month: number) => {
  const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
  return `
You are the editor-in-chief of "The Hair System Monthly", a premium industry magazine for hair replacement professionals and advanced users.

Here are all published news articles from ${monthName} ${year} (${articles.length} articles total):
${articles.map((a, i) => `${i + 1}. [${a.category}] ${a.title}\n   ${a.summary}`).join('\n\n')}

Write a comprehensive monthly digest with exactly 4 sections. Each section should be 3-5 paragraphs of substantive analysis — NOT a simple list of articles. Synthesize themes, identify trends, and provide expert commentary.

Return ONLY a JSON object, no markdown:
{
  "title": "${monthName} ${year} — Hair System Industry Monthly Digest",
  "sections": {
    "topStories": "3-5 paragraphs analyzing the most significant stories of the month and their broader implications for the industry...",
    "materialsTech": "3-5 paragraphs on materials science, technology innovations, base construction trends, adhesive developments...",
    "marketDynamics": "3-5 paragraphs on market movements, supply chain developments, consumer trends, regional dynamics...",
    "expertInsights": "3-5 paragraphs synthesizing professional perspectives, industry shifts, and recommendations for practitioners..."
  },
  "summary": "2-3 sentence executive summary of the month's most important developments"
}
`;
};

const MONTHLY_PODCAST_PROMPT = (digest: any, year: number, month: number) => {
  const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
  return `
You are a script writer for "The Hair System Monthly Review" — a premium, in-depth industry podcast.

This month's digest covers:
SUMMARY: ${digest.summary}

TOP STORIES: ${digest.sections.topStories.slice(0, 600)}...
MATERIALS & TECH: ${digest.sections.materialsTech.slice(0, 600)}...
MARKET DYNAMICS: ${digest.sections.marketDynamics.slice(0, 600)}...
EXPERT INSIGHTS: ${digest.sections.expertInsights.slice(0, 600)}...

Write a deep-dive 2-host podcast script for ${monthName} ${year} Monthly Review.
Guidelines:
- Tone: Formal, analytical, authoritative — like two senior industry analysts doing a monthly debrief
- Style: Structured deep dialogue. Hosts build on each other's analysis, challenge assumptions, and provide nuanced takes. Use phrases like "What struck me this month was...", "If we look at the data...", "The implications here are significant because..."
- Length: ~600-800 words total dialogue (25-35 exchanges)
- Structure: Open with month overview → Top Stories deep dive → Materials/Tech analysis → Market dynamics → Expert insights synthesis → Forward outlook → Sign-off
- NO filler phrases, NO radio-DJ energy. Pure substance.

Return ONLY a JSON array, no markdown:
[
  { "speaker": "A", "text": "Welcome to The Hair System Monthly Review. I'm Alex." },
  { "speaker": "B", "text": "And I'm Sam. ${monthName} ${year} was a particularly significant month for the industry..." },
  ...
]
`;
};

export async function runMonthlyDigestGeneration(year: number, month: number) {
  const period = `${year}-${String(month).padStart(2, '0')}`;

  const existing = await db.collection('monthlyDigests').doc(period).get();
  if (existing.exists) {
    console.info(`Monthly digest already exists for ${period}`);
    return { skipped: true };
  }

  const startDate = `${period}-01`;
  const endYear = month === 12 ? year + 1 : year;
  const endMonth = month === 12 ? 1 : month + 1;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const newsSnap = await db.collection('newsArticles')
    .where('status', '==', 'PUBLISHED')
    .where('generatedDate', '>=', startDate)
    .where('generatedDate', '<', endDate)
    .orderBy('generatedDate', 'asc')
    .get();

  const articles = newsSnap.docs.map(d => d.data());
  if (articles.length === 0) throw new Error(`No articles found for ${period}`);

  console.info(`Generating monthly digest for ${period} with ${articles.length} articles`);

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Generate digest content
  const digestResponse = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: MONTHLY_DIGEST_PROMPT(articles, year, month) }] }],
    config: { temperature: 0.7, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
  });

  const rawDigest = digestResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const cleanedDigest = rawDigest.replace(/```json/gi, "").replace(/```/g, "").trim();
  const digest = JSON.parse(cleanedDigest);

  // Generate podcast script
  const scriptResponse = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: MONTHLY_PODCAST_PROMPT(digest, year, month) }] }],
    config: { temperature: 0.6, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } },
  });

  const rawScript = scriptResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const cleanedScript = rawScript.replace(/```json/gi, "").replace(/```/g, "").trim();
  const script: { speaker: string; text: string }[] = JSON.parse(cleanedScript);

  // Synthesize audio
  const audioBuffer = await synthesizePodcastAudio(script, MONTHLY_VOICE_CONFIG);

  const bucket = getStorage().bucket();
  const audioFileName = `podcasts/monthly_${period}.mp3`;
  const audioFile = bucket.file(audioFileName);
  await audioFile.save(audioBuffer, { metadata: { contentType: "audio/mpeg" } });
  await audioFile.makePublic();
  const audioUrl = `https://storage.googleapis.com/${bucket.name}/${audioFileName}`;

  const totalWords = script.reduce((sum, line) => sum + line.text.split(" ").length, 0);
  const estimatedDuration = Math.round((totalWords / 150) * 60);
  const transcript = script.map(line =>
    `[${line.speaker === "A" ? MONTHLY_VOICE_CONFIG.A.hostName : MONTHLY_VOICE_CONFIG.B.hostName}] ${line.text}`
  ).join("\n\n");

  await db.collection('monthlyDigests').doc(period).set({
    period,
    year,
    month,
    title: digest.title,
    summary: digest.summary,
    sections: digest.sections,
    articleCount: articles.length,
    audioUrl,
    audioPath: audioFileName,
    audioDuration: estimatedDuration,
    script,
    transcript,
    status: "PUBLISHED",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.info(`Monthly digest generated for ${period}: ${articles.length} articles, ~${estimatedDuration}s podcast`);
  return { success: true, period, articleCount: articles.length, duration: estimatedDuration };
}

// Scheduled: every 1st of the month at UTC 00:00
export const generateMonthlyDigest = onSchedule(
  {
    region: "us-central1",
    schedule: "0 0 1 * *",
    timeZone: "UTC",
    timeoutSeconds: 540,
    memory: "512MiB" as any,
    secrets: ["GEMINI_API_KEY"],
  },
  async () => {
    const now = new Date();
    const lastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    await runMonthlyDigestGeneration(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth() + 1);
  }
);

// Manual trigger from admin panel
export const generateMonthlyDigestManual = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "512MiB" as any,
    secrets: ["GEMINI_API_KEY"],
  },
  async (request) => {
    if (!request.auth?.token?.isAdmin) throw new HttpsError("permission-denied", "Admin only.");
    const { year, month } = request.data;
    if (!year || !month) throw new HttpsError("invalid-argument", "year and month are required.");
    return await runMonthlyDigestGeneration(Number(year), Number(month));
  }
);
