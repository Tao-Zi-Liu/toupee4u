// functions/src/podcast.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import { getStorage } from "firebase-admin/storage";
import { admin, db } from "./shared";
import { synthesizePodcastAudio, VOICE_POOLS } from "./tts";

const PODCAST_SCRIPT_PROMPT = (articles: any[], hostA: string, hostB: string) => `
You are a script writer for "The Hair System Daily", a premium, cutting-edge industry briefing for hair replacement professionals, stylists, and advanced users.

Today's news articles:
${articles.map((a, i) => `${i + 1}. TITLE: ${a.title}\nSUMMARY: ${a.summary}`).join('\n\n')}

Write a 2-host industry briefing script (Host A: ${hostA}, Host B: ${hostB}) that covers these stories.
Guidelines:
- Tone: Think NPR's "Planet Money" or Bloomberg's "Odd Lots" — two smart, curious professionals who genuinely find this industry fascinating. Warm but substantive.
- Style: Conversational but informed. Hosts can react to each other naturally ("That's a big shift", "Exactly, and what's interesting is..."), show genuine curiosity, and occasionally note surprising or counterintuitive findings.
- Focus: Emphasize practical implications for wearers and professionals — what does this mean for someone choosing a base material, or a stylist advising a client?
- Rule: NO dry recitation of facts. NO radio-DJ hype. Find the human angle in every story.

Return ONLY a JSON array, no markdown, no preamble:
[
  { "speaker": "A", "text": "Welcome to The Hair System Daily. I'm ${hostA}." },
  { "speaker": "B", "text": "And I'm ${hostB}. Today we're analyzing..." },
  ...
]
`;

export async function runPodcastGeneration() {
  const today = new Date().toISOString().split("T")[0];

  const existing = await db.collection("podcasts")
    .where("generatedDate", "==", today)
    .limit(1)
    .get();
  if (!existing.empty) {
    console.info(`Podcast already generated for ${today}`);
    return { skipped: true };
  }

  const newsSnap = await db.collection("newsArticles")
    .where("status", "==", "PUBLISHED")
    .orderBy("publishedAt", "desc")
    .limit(6)
    .get();

  const articles = newsSnap.docs.map(d => d.data());
  if (articles.length === 0) throw new Error("No articles available for podcast generation");

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyVoiceConfig = VOICE_POOLS[dayOfYear % VOICE_POOLS.length];

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const scriptResponse = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: PODCAST_SCRIPT_PROMPT(articles, dailyVoiceConfig.A.hostName, dailyVoiceConfig.B.hostName) }] }],
    config: { temperature: 0.5, maxOutputTokens: 4096, thinkingConfig: { thinkingBudget: 0 } },
  });

  const rawScript = scriptResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  const cleanedScript = rawScript.replace(/```json/gi, "").replace(/```/g, "").trim();
  const script: { speaker: string; text: string }[] = JSON.parse(cleanedScript);
  if (!Array.isArray(script) || script.length === 0) throw new Error("Failed to generate podcast script");

  const audioBuffer = await synthesizePodcastAudio(script, dailyVoiceConfig);

  const bucket = getStorage().bucket();
  const fileName = `podcasts/${today}_daily.mp3`;
  const file = bucket.file(fileName);
  await file.save(audioBuffer, { metadata: { contentType: "audio/mpeg" } });
  await file.makePublic();
  const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  const totalWords = script.reduce((sum, line) => sum + line.text.split(" ").length, 0);
  const estimatedDuration = Math.round((totalWords / 150) * 60);
  const transcript = script.map(line =>
    `[${line.speaker === "A" ? dailyVoiceConfig.A.hostName : dailyVoiceConfig.B.hostName}] ${line.text}`
  ).join("\n\n");

  await db.collection("podcasts").add({
    title: `The Hair System Daily — ${today}`,
    description: `Today's hair system and hair replacement news digest, featuring ${articles.length} stories.`,
    audioUrl,
    audioPath: fileName,
    duration: estimatedDuration,
    status: "PUBLISHED",
    generatedDate: today,
    script,
    transcript,
    tags: ["daily", "news", "hair system"],
    episodeNumber: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    sourceArticleCount: articles.length,
  });

  console.info(`Podcast generated for ${today}: ${script.length} lines, ~${estimatedDuration}s`);
  return { success: true, date: today, lines: script.length, duration: estimatedDuration };
}

export const generatePodcastManual = onCall(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "512MiB" as any,
    secrets: ["GEMINI_API_KEY", "ELEVENLABS_API_KEY"],
  },
  async (request) => {
    if (!request.auth?.token?.isAdmin) throw new HttpsError("permission-denied", "Admin only.");
    return await runPodcastGeneration();
  }
);
