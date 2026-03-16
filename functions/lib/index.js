"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodcastManual = exports.generateInsightsManual = exports.generatePersonalizedInsight = exports.generateDailyInsights = exports.unpublishNewsArticle = exports.rejectNewsArticle = exports.publishNewsArticle = exports.verifyNewsUrl = exports.generateNewsManual = exports.generateDailyNews = exports.addXp = exports.onPostCreated = exports.onUserCreated = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const v1_1 = require("firebase-functions/v1");
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
const zod_1 = require("zod");
admin.initializeApp();
const db = admin.firestore();
// ── Schemas ───────────────────────────────────────────────────────────────────
const PostSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    content: zod_1.z.string().min(10),
    category: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    authorId: zod_1.z.string()
});
// ── Auth Triggers ─────────────────────────────────────────────────────────────
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
    }
    catch (error) {
        console.error("Failed to initialize user profile", error);
    }
});
// ── Firestore Triggers ────────────────────────────────────────────────────────
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
// ── HTTPS Callables ───────────────────────────────────────────────────────────
exports.addXp = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be logged in.');
    }
    const { amount } = zod_1.z.object({ amount: zod_1.z.number().int().positive() }).parse(request.data);
    await db.collection('users').doc(request.auth.uid).update({
        xp: admin.firestore.FieldValue.increment(amount)
    });
    return { success: true, newXpIncrement: amount };
});
// ── 新闻生成核心逻辑 ──────────────────────────────────────────────────────────
const NEWS_PROMPT = (topic, isChinese = false) => `
You are an editorial analyst for Toupee4U, a professional community platform for non-surgical hair replacement system wearers, stylists, and industry professionals.

Search for recent news and articles (past 14 days) about: "${topic}"

CONTENT SCOPE — include articles relevant to ANY of these areas:
✅ Hair systems / toupees / hairpieces: materials, base construction, adhesives, ventilation, care, customization
✅ Hair loss conditions: alopecia, androgenetic hair loss, medical hair loss — and non-surgical management
✅ Hair system users: lifestyle, confidence, mental health, community, sports/swimming with hair systems
✅ Hair professionals: stylists, salons, hair replacement specialists, installation techniques
✅ Hair care & styling: general hair care products, conditioners, treatments, salon services
✅ Material science: polyurethane (PU), silicone, TPE, lace mesh, mono, nonwoven textiles, polymer materials
✅ Fiber & hair material: human hair (Remy/non-Remy), synthetic fiber, heat-resistant fiber, fiber chemistry
✅ Adhesive technology: acrylic, silicone-based, medical-grade adhesives, tape technology
✅ Manufacturing & supply chain: hair system factories, suppliers, wholesale, production techniques
✅ Medical wigs: chemotherapy patients, medical-grade hairpieces
✅ Theatrical/stage wigs: only from a craftsmanship or materials perspective
✅ Hair transplant news: include as reference/comparison content (label as "Surgical Alternative")
✅ Upstream industries: nonwoven fabric, textile, polymer chemistry relevant to hair systems

❌ EXCLUDE strictly: fashion wigs (costume/cosplay/Halloween), hair extensions for styling, general beauty/cosmetics unrelated to hair systems, promotional content for fashion wig brands.

${isChinese ? `SOURCE LANGUAGE: This topic is in Chinese. Search Chinese-language sources (mainland China, Taiwan, Hong Kong trade media).
OUTPUT RULES FOR CHINESE SOURCES:
- Translate ALL content to English
- Do NOT include sourceUrl (set to empty string "")
- Set sourceName to format: "[Publication type] (China, translated)" e.g. "Trade Publication (China, translated)"
- Apply same editorial standards and marketing detection` : `Focus on sources from US, UK, Europe, Australia, and global trade media. Prioritize: trade publications, academic journals, industry associations, verified news outlets.`}

For each article found, analyze it thoroughly and return a JSON array (raw JSON only, no markdown fences) of up to 2 items:

[
  {
    "title": "Rewritten neutral headline in English (not the original clickbait title)",
    "summary": "3-4 sentences. Factual, neutral. Remove all marketing language. Focus on what actually happened and why it matters to hair system wearers or professionals.",
    "editorialNote": {
      "standpoint": "Describe the source's likely perspective or agenda (e.g. 'Industry trade group with commercial interests', 'Independent academic research', 'Brand-owned media')",
      "significance": "Why this matters to hair replacement professionals or consumers",
      "caution": "Any reason to be skeptical. Leave empty string if none."
    },
    "category": "one of: Market Trends | Technology | Products | Industry | Research | Lifestyle | Materials",
    "tags": ["2-4 relevant tags"],
    "sourceUrl": "exact URL to the original article, or empty string for Chinese sources",
    "sourceName": "Publication name",
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
// Full topic pool — rotated daily, 10-15 topics selected per run
const ENGLISH_TOPIC_POOL = [
    // Hair system core
    "hair system toupee base materials lace poly urethane construction",
    "hair system adhesive tape bonding application removal technique",
    "hair system cleaning maintenance care routine wearers",
    "custom hair unit ventilation hand-tied knotted hairpiece",
    "hair system density color matching styling tips professionals",
    // Hair loss & users
    "alopecia androgenetic hair loss non-surgical solution management",
    "hair loss confidence mental health community support wearers",
    "hair system wearer lifestyle swimming sports waterproof activity",
    // Materials & science
    "polyurethane silicone TPE hair system base material science",
    "Swiss French lace mono mesh hair system base durability comparison",
    "human hair Remy synthetic fiber heat-resistant hair system quality",
    "nonwoven textile polymer material hair replacement industry",
    "medical grade adhesive acrylic silicone bonding hair system",
    // Industry & professionals
    "hair salon professional stylist hair replacement installation service",
    "hair system manufacturer supplier wholesale industry supply chain",
    "hair care products conditioner treatment general salon",
    "medical wig chemotherapy cancer patient hair loss",
    "theatrical stage wig craftsmanship material technique construction",
    "hair transplant surgical restoration news comparison non-surgical",
    // Upstream industry
    "lace fabric mesh textile manufacturing hair industry upstream",
];
const CHINESE_TOPIC_POOL = [
    "发套 假发底料 PU 聚氨酯 网料 制造工艺",
    "中国假发供应链 出口 制造业 原材料",
    "发套手工打结 定制 发片 生产工艺",
];
function selectTopics(pool, count, seed) {
    // Deterministic shuffle based on date seed so same day = same topics
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (seed * 1103515245 + i * 12345) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}
async function generateNewsArticles(ai, maxArticles = 15) {
    // Use day-of-year as seed for deterministic but daily-rotating topic selection
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    // Select 12 English + 3 Chinese topics per run
    const englishTopics = selectTopics(ENGLISH_TOPIC_POOL, 12, dayOfYear);
    const chineseTopics = selectTopics(CHINESE_TOPIC_POOL, 3, dayOfYear + 999);
    const allTopics = [
        ...englishTopics.map(t => ({ topic: t, isChinese: false })),
        ...chineseTopics.map(t => ({ topic: t, isChinese: true })),
    ];
    const allArticles = [];
    // 单个topic搜索函数
    async function searchTopic(topic, isChinese) {
        try {
            console.info(`Searching topic [${isChinese ? 'CN' : 'EN'}]: ${topic}`);
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: NEWS_PROMPT(topic, isChinese) }] }],
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.2,
                    maxOutputTokens: 4096,
                }
            });
            const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
            const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            let articles = [];
            try {
                const parsed = JSON.parse(cleaned);
                articles = Array.isArray(parsed) ? parsed : [];
            }
            catch {
                console.warn(`JSON parse failed for topic: ${topic}`);
                return [];
            }
            const valid = articles.filter(a => a.title && typeof a.title === 'string' &&
                a.summary && typeof a.summary === 'string' &&
                (isChinese || (a.sourceUrl && typeof a.sourceUrl === 'string')));
            if (isChinese)
                valid.forEach(a => { a.sourceUrl = ''; });
            console.info(`Got ${valid.length} articles for: ${topic}`);
            return valid;
        }
        catch (error) {
            console.error(`Error for topic "${topic}":`, error);
            return [];
        }
    }
    // 并发批次处理，每批3个同时搜索，批次间隔1秒
    const BATCH_SIZE = 3;
    for (let i = 0; i < allTopics.length; i += BATCH_SIZE) {
        if (allArticles.length >= maxArticles)
            break;
        const batch = allTopics.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(({ topic, isChinese }) => searchTopic(topic, isChinese)));
        results.forEach(articles => allArticles.push(...articles));
        if (i + BATCH_SIZE < allTopics.length) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    // 去重（按 title）
    const seen = new Set();
    return allArticles
        .filter(a => {
        const key = a.title?.toLowerCase().trim();
        if (!key || seen.has(key))
            return false;
        seen.add(key);
        return true;
    })
        .slice(0, maxArticles);
}
async function saveArticlesToFirestore(articles, source) {
    if (articles.length === 0)
        return 0;
    const today = new Date().toISOString().split('T')[0];
    const batch = db.batch();
    for (const article of articles) {
        const ref = db.collection('newsArticles').doc();
        batch.set(ref, {
            title: article.title || "Untitled",
            summary: article.summary || "",
            editorialNote: article.editorialNote || { standpoint: "", significance: "", caution: "" },
            category: article.category || "Industry",
            tags: Array.isArray(article.tags) ? article.tags : [],
            sourceUrl: article.sourceUrl || "",
            sourceName: article.sourceName || "Unknown",
            sourceDate: article.sourceDate || "",
            marketingFlags: Array.isArray(article.marketingFlags) ? article.marketingFlags : [],
            isClean: article.isClean !== false,
            urlVerified: false, // 待管理员手动验证
            urlVerifiedAt: null,
            generatedDate: today,
            generatedBy: source,
            status: 'PENDING',
            adminNote: "",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            publishedAt: null,
        });
    }
    await batch.commit();
    return articles.length;
}
// ── 每日定时任务 ──────────────────────────────────────────────────────────────
/**
 * 每天 UTC 02:00（北京时间 10:00）自动触发
 */
exports.generateDailyNews = (0, scheduler_1.onSchedule)({
    schedule: "0 2 * * *",
    timeZone: "UTC",
    secrets: ["GEMINI_API_KEY"],
    memory: "512MiB",
    timeoutSeconds: 300,
    region: "us-central1",
}, async () => {
    console.info("Starting daily news generation...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY secret not found");
        return;
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const articles = await generateNewsArticles(ai, 10);
    const saved = await saveArticlesToFirestore(articles, 'AI_GEMINI');
    console.info(`Daily news generation complete. Saved ${saved} articles.`);
});
// ── 管理员手动触发 ────────────────────────────────────────────────────────────
/**
 * 管理员手动触发新闻生成
 */
exports.generateNewsManual = (0, https_1.onCall)({
    secrets: ["GEMINI_API_KEY"],
    memory: "512MiB",
    timeoutSeconds: 540,
    region: "us-central1",
}, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new https_1.HttpsError('internal', 'API key not configured');
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const articles = await generateNewsArticles(ai, 10);
    const saved = await saveArticlesToFirestore(articles, 'AI_GEMINI_MANUAL');
    return { success: true, count: saved };
});
// ── URL 链接验证 ──────────────────────────────────────────────────────────────
/**
 * 管理员验证新闻文章的原始链接是否可访问
 */
exports.verifyNewsUrl = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
    const { articleId, url } = zod_1.z.object({
        articleId: zod_1.z.string(),
        url: zod_1.z.string().url(),
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
    }
    catch (error) {
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
});
// ── 发布 / 拒绝新闻 ──────────────────────────────────────────────────────────
/**
 * 管理员发布新闻文章
 */
exports.publishNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().optional(),
    }).parse(request.data);
    await db.collection('newsArticles').doc(articleId).update({
        status: 'PUBLISHED',
        adminNote: adminNote || "",
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
/**
 * 管理员拒绝新闻文章
 */
exports.rejectNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().min(1),
    }).parse(request.data);
    await db.collection('newsArticles').doc(articleId).update({
        status: 'REJECTED',
        adminNote,
        rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
/**
 * 管理员将已发布文章下架
 */
exports.unpublishNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().optional(),
    }).parse(request.data);
    await db.collection('newsArticles').doc(articleId).update({
        status: 'UNPUBLISHED',
        adminNote: adminNote || "",
        publishedAt: null,
    });
    return { success: true };
});
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
/**
 * 每天 UTC 01:00 生成每日 Insight（早于新闻生成）
 */
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
        await db.collection('dailyInsights').doc(today).set({
            date: today,
            insights,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.info(`Generated ${insights.length} insights for ${today}`);
    }
    catch (error) {
        console.error("Failed to generate insights:", error);
    }
});
/**
 * 前端调用：为当前登录用户生成个性化 Insight
 */
exports.generatePersonalizedInsight = (0, https_1.onCall)({
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 30,
    region: "us-central1",
}, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be logged in.');
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new https_1.HttpsError('internal', 'API key not configured');
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
/**
 * 管理员手动触发每日 Insight 生成
 */
exports.generateInsightsManual = (0, https_1.onCall)({
    secrets: ["GEMINI_API_KEY"],
    memory: "256MiB",
    timeoutSeconds: 60,
    region: "us-central1",
}, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    }
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
    await db.collection('dailyInsights').doc(today).set({
        date: today,
        insights,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, count: insights.length, date: today };
});
// ─────────────────────────────────────────────────────────────────────────────
// PODCAST GENERATION
// ─────────────────────────────────────────────────────────────────────────────
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const storage_1 = require("firebase-admin/storage");
const ttsClient = new text_to_speech_1.TextToSpeechClient();
const PODCAST_SCRIPT_PROMPT = (articles) => `
You are a podcast script writer for "The Hair System Daily" — a friendly, informative podcast about hair replacement systems, wigs, and hair loss solutions.

Today's news articles:
${articles.map((a, i) => `${i + 1}. TITLE: ${a.title}\nSUMMARY: ${a.summary}`).join('\n\n')}

Write a natural, engaging 2-host podcast script (Host A: Alex, Host B: Sam) that covers these stories.
Guidelines:
- Warm, conversational tone — like two knowledgeable friends talking
- 2-3 minutes when read aloud (~200-300 words total dialogue, MAX 15 exchanges)
- Start with a brief intro, cover 2-3 stories briefly, end with a sign-off
- Hosts react to each other, add context, occasionally add light humor
- Make it feel like NotebookLM's Audio Overview style

Return ONLY a JSON array, no markdown, no preamble:
[
  { "speaker": "A", "text": "Hey everyone, welcome to The Hair System Daily..." },
  { "speaker": "B", "text": "..." },
  ...
]
`;
async function synthesizePodcastAudio(script) {
    // Voice config for each host
    const voices = {
        A: { languageCode: "en-US", name: "en-US-Neural2-D", ssmlGender: "MALE" },
        B: { languageCode: "en-US", name: "en-US-Neural2-F", ssmlGender: "FEMALE" },
    };
    const audioChunks = [];
    for (const line of script) {
        const voice = voices[line.speaker] || voices["A"];
        const [response] = await ttsClient.synthesizeSpeech({
            input: { text: line.text },
            voice,
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: line.speaker === "A" ? 1.0 : 0.92,
            },
        });
        if (response.audioContent) {
            audioChunks.push(Buffer.from(response.audioContent));
        }
    }
    return Buffer.concat(audioChunks);
}
async function runPodcastGeneration() {
    const today = new Date().toISOString().split("T")[0];
    // Check if already generated today
    const existing = await db.collection("podcasts")
        .where("generatedDate", "==", today)
        .limit(1)
        .get();
    if (!existing.empty) {
        console.info(`Podcast already generated for ${today}`);
        return { skipped: true };
    }
    // Fetch most recent published news articles (up to 6)
    const newsSnap = await db.collection("newsArticles")
        .where("status", "==", "PUBLISHED")
        .orderBy("publishedAt", "desc")
        .limit(6)
        .get();
    let articles = newsSnap.docs.map(d => d.data());
    if (articles.length === 0) {
        throw new Error("No articles available for podcast generation");
    }
    // Generate script with Gemini
    const genAI = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const scriptResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: PODCAST_SCRIPT_PROMPT(articles) }] }],
        config: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            thinkingConfig: { thinkingBudget: 0 },
        },
    });
    const rawScript = scriptResponse.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanedScript = rawScript.replace(/```json/gi, "").replace(/```/g, "").trim();
    const script = JSON.parse(cleanedScript);
    if (!Array.isArray(script) || script.length === 0) {
        throw new Error("Failed to generate podcast script");
    }
    // Synthesize audio
    const audioBuffer = await synthesizePodcastAudio(script);
    // Upload to Firebase Storage
    const bucket = (0, storage_1.getStorage)().bucket();
    const fileName = `podcasts/${today}_daily.mp3`;
    const file = bucket.file(fileName);
    await file.save(audioBuffer, { metadata: { contentType: "audio/mpeg" } });
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    // Calculate duration (rough estimate: ~150 words per minute)
    const totalWords = script.reduce((sum, line) => sum + line.text.split(" ").length, 0);
    const estimatedDuration = Math.round((totalWords / 150) * 60);
    // Extract transcript
    const transcript = script.map(line => `[${line.speaker === "A" ? "Alex" : "Sam"}] ${line.text}`).join("\n\n");
    // Save to Firestore
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
// Scheduled: every day at 8:00 AM UTC
// generateDailyPodcast disabled - use manual trigger instead
// Manual trigger from admin panel
exports.generatePodcastManual = (0, https_1.onCall)({
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "512MiB",
    secrets: ["GEMINI_API_KEY"],
}, async (request) => {
    if (!request.auth?.token?.isAdmin) {
        throw new https_1.HttpsError("permission-denied", "Admin only.");
    }
    return await runPodcastGeneration();
});
//# sourceMappingURL=index.js.map