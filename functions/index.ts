import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { auth } from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

admin.initializeApp();
const db = admin.firestore();

// ── Schemas ───────────────────────────────────────────────────────────────────

const PostSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  authorId: z.string()
});

// ── Auth Triggers ─────────────────────────────────────────────────────────────

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

// ── Firestore Triggers ────────────────────────────────────────────────────────

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

// ── HTTPS Callables ───────────────────────────────────────────────────────────

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

// ── 新闻生成核心逻辑 ──────────────────────────────────────────────────────────

const NEWS_PROMPT = (topic: string) => `
You are an editorial analyst for a professional hair replacement industry publication.

Search for recent news (past 7 days) about: "${topic}"
Focus on sources from US, UK, Europe, Australia. Prioritize: trade publications, academic journals, verified news outlets.

For each article found, analyze it thoroughly and return a JSON array (raw JSON only, no markdown fences) of up to 2 items:

[
  {
    "title": "Rewritten neutral headline (not the original clickbait title)",
    "summary": "3-4 sentences. Factual, neutral. Remove all marketing language. Focus on what actually happened and why it matters.",
    "editorialNote": {
      "standpoint": "Describe the source's likely perspective or agenda (e.g. 'Industry trade group with commercial interests', 'Independent academic research', 'Brand-owned media')",
      "significance": "Why this matters to hair replacement professionals or consumers",
      "caution": "Any reason to be skeptical. Leave empty string if none."
    },
    "category": "one of: Market Trends | Technology | Products | Industry | Research",
    "tags": ["2-4 relevant tags"],
    "sourceUrl": "exact URL to the original article",
    "sourceName": "Publication name (e.g. 'Forbes', 'Hair Journal', 'PR Newswire')",
    "sourceDate": "YYYY-MM-DD or empty string if unknown",
    "marketingFlags": [
      {
        "type": "BRAND_PR | PROMOTIONAL | SOFT_AD | CONFLICT_OF_INTEREST",
        "reason": "Specific reason why this is flagged"
      }
    ],
    "isClean": true
  }
]

Marketing detection rules - add a flag if ANY of these apply:
- Source is PR Newswire, Business Wire, GlobeNewswire, or brand blog → BRAND_PR
- Article promotes a specific product with purchase language → PROMOTIONAL  
- Article is written by the brand being discussed → CONFLICT_OF_INTEREST
- Article has only positive framing with no critical analysis → SOFT_AD
- Set "isClean": false if ANY flag is added, true if marketingFlags is empty

If no relevant recent news found for this topic, return: []
Return ONLY the JSON array. No other text.
`;

async function generateNewsArticles(
  ai: GoogleGenAI,
  maxArticles: number = 10
): Promise<any[]> {
  const searchTopics = [
    "hair replacement system industry news",
    "hair system technology innovation",
    "hair system adhesive bonding new products",
  ];

  const allArticles: any[] = [];

  for (const topic of searchTopics) {
    if (allArticles.length >= maxArticles) break;

    try {
      console.info(`Searching topic: ${topic}`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: NEWS_PROMPT(topic) }] }],
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
          maxOutputTokens: 4096,
        }
      });

      const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      let articles: any[] = [];
      try {
        const parsed = JSON.parse(cleaned);
        articles = Array.isArray(parsed) ? parsed : [];
      } catch {
        console.warn(`JSON parse failed for topic: ${topic}, raw: ${cleaned.substring(0, 200)}`);
        continue;
      }

      // 基础字段验证
      const valid = articles.filter(a =>
        a.title && typeof a.title === 'string' &&
        a.summary && typeof a.summary === 'string' &&
        a.sourceUrl && typeof a.sourceUrl === 'string'
      );

      allArticles.push(...valid);
      console.info(`Got ${valid.length} articles for: ${topic}`);

      // 避免请求过快
      await new Promise(r => setTimeout(r, 2000));

    } catch (error) {
      console.error(`Error for topic "${topic}":`, error);
    }
  }

  // 去重（按 title）
  const seen = new Set<string>();
  return allArticles
    .filter(a => {
      const key = a.title?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxArticles);
}

async function saveArticlesToFirestore(articles: any[], source: string): Promise<number> {
  if (articles.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const batch = db.batch();

  for (const article of articles) {
    const ref = db.collection('newsArticles').doc();
    batch.set(ref, {
      title:         article.title || "Untitled",
      summary:       article.summary || "",
      editorialNote: article.editorialNote || { standpoint: "", significance: "", caution: "" },
      category:      article.category || "Industry",
      tags:          Array.isArray(article.tags) ? article.tags : [],
      sourceUrl:     article.sourceUrl || "",
      sourceName:    article.sourceName || "Unknown",
      sourceDate:    article.sourceDate || "",
      marketingFlags: Array.isArray(article.marketingFlags) ? article.marketingFlags : [],
      isClean:       article.isClean !== false,
      urlVerified:   false,   // 待管理员手动验证
      urlVerifiedAt: null,
      generatedDate: today,
      generatedBy:   source,
      status:        'PENDING',
      adminNote:     "",
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
      publishedAt:   null,
    });
  }

  await batch.commit();
  return articles.length;
}

// ── 每日定时任务 ──────────────────────────────────────────────────────────────

/**
 * 每天 UTC 02:00（北京时间 10:00）自动触发
 */
export const generateDailyNews = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "UTC",
    secrets: ["GEMINI_API_KEY"],
    memory: "512MiB",
    timeoutSeconds: 300,
    region: "us-central1",
  },
  async () => {
    console.info("Starting daily news generation...");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY secret not found");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const articles = await generateNewsArticles(ai, 10);
    const saved = await saveArticlesToFirestore(articles, 'AI_GEMINI');

    console.info(`Daily news generation complete. Saved ${saved} articles.`);
  }
);

// ── 管理员手动触发 ────────────────────────────────────────────────────────────

/**
 * 管理员手动触发新闻生成
 */
export const generateNewsManual = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    memory: "512MiB",
    timeoutSeconds: 540,
    region: "us-central1",
  },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new HttpsError('internal', 'API key not configured');

    const ai = new GoogleGenAI({ apiKey });
    const articles = await generateNewsArticles(ai, 10);
    const saved = await saveArticlesToFirestore(articles, 'AI_GEMINI_MANUAL');

    return { success: true, count: saved };
  }
);

// ── URL 链接验证 ──────────────────────────────────────────────────────────────

/**
 * 管理员验证新闻文章的原始链接是否可访问
 */
export const verifyNewsUrl = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const { articleId, url } = z.object({
      articleId: z.string(),
      url: z.string().url(),
    }).parse(request.data);

    let accessible = false;
    let statusCode = 0;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Toupee4U-NewsVerifier/1.0)'
        }
      });

      clearTimeout(timeout);
      statusCode = res.status;
      accessible = res.status >= 200 && res.status < 400;

    } catch (error: any) {
      console.warn(`URL verification failed for ${url}:`, error.message);
      accessible = false;
    }

    // 更新 Firestore
    await db.collection('newsArticles').doc(articleId).update({
      urlVerified: accessible,
      urlStatusCode: statusCode,
      urlVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { accessible, statusCode };
  }
);

// ── 发布 / 拒绝新闻 ──────────────────────────────────────────────────────────

/**
 * 管理员发布新闻文章
 */
export const publishNewsArticle = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const { articleId, adminNote } = z.object({
      articleId: z.string(),
      adminNote: z.string().optional(),
    }).parse(request.data);

    await db.collection('newsArticles').doc(articleId).update({
      status: 'PUBLISHED',
      adminNote: adminNote || "",
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);

/**
 * 管理员拒绝新闻文章
 */
export const rejectNewsArticle = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const { articleId, adminNote } = z.object({
      articleId: z.string(),
      adminNote: z.string().min(1),
    }).parse(request.data);

    await db.collection('newsArticles').doc(articleId).update({
      status: 'REJECTED',
      adminNote,
    });

    return { success: true };
  }
);

/**
 * 管理员将已发布文章下架
 */
export const unpublishNewsArticle = onCall(
  { region: "us-central1" },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const { articleId, adminNote } = z.object({
      articleId: z.string(),
      adminNote: z.string().optional(),
    }).parse(request.data);

    await db.collection('newsArticles').doc(articleId).update({
      status: 'UNPUBLISHED',
      adminNote: adminNote || "",
      publishedAt: null,
    });

    return { success: true };
  }
);

// ── AI Insight 系统 ───────────────────────────────────────────────────────────

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

const PERSONALIZED_INSIGHT_PROMPT = (profile: {
  galaxyLevel: string;
  role: string;
  hairPattern?: string;
  experienceLevel?: string;
  membershipTier: string;
}) => `
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

/**
 * 每天 UTC 01:00 生成每日 Insight（早于新闻生成）
 */
export const generateDailyInsights = onSchedule(
  {
    schedule: "0 1 * * *",
    timeZone: "UTC",
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 60,
    region: "us-central1",
  },
  async () => {
    console.info("Generating daily insights...");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) { console.error("GEMINI_API_KEY not found"); return; }

    const ai = new GoogleGenAI({ apiKey });

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
      await db.collection('dailyInsights').doc(today).set({
        date: today,
        insights,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.info(`Generated ${insights.length} insights for ${today}`);
    } catch (error) {
      console.error("Failed to generate insights:", error);
    }
  }
);

/**
 * 前端调用：为当前登录用户生成个性化 Insight
 */
export const generatePersonalizedInsight = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 30,
    region: "us-central1",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be logged in.');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new HttpsError('internal', 'API key not configured');

    // 读取用户 profile
    const userDoc = await db.collection('users').doc(request.auth.uid).get();
    const voyagerDoc = await db.collection('voyagerProfiles').doc(request.auth.uid).get();

    const user = userDoc.data() || {};
    const voyager = voyagerDoc.data() || {};

    const profile = {
      galaxyLevel: user.galaxyLevel || 'NEBULA',
      role: user.role || 'VOYAGER',
      hairPattern: voyager.hairPattern,
      experienceLevel: voyager.experienceLevel,
      membershipTier: user.membershipTier || 'free',
    };

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: PERSONALIZED_INSIGHT_PROMPT(profile) }] }],
      config: { temperature: 0.8, maxOutputTokens: 256 }
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const insight = JSON.parse(cleaned);

    return { insight };
  }
);

/**
 * 管理员手动触发每日 Insight 生成
 */
export const generateInsightsManual = onCall(
  {
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 60,
    region: "us-central1",
  },
  async (request) => {
    if (!request.auth?.token?.isAdmin) {
      throw new HttpsError('permission-denied', 'Admin only.');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new HttpsError('internal', 'API key not configured');

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: DAILY_INSIGHTS_PROMPT() }] }],
      config: { temperature: 0.7, maxOutputTokens: 1024 }
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const insights = JSON.parse(cleaned);

    if (!Array.isArray(insights) || insights.length === 0) {
      throw new HttpsError('internal', 'Failed to generate insights');
    }

    const today = new Date().toISOString().split('T')[0];
    await db.collection('dailyInsights').doc(today).set({
      date: today,
      insights,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, count: insights.length, date: today };
  }
);
