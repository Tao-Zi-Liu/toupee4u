"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpublishNewsArticle = exports.rejectNewsArticle = exports.publishNewsArticle = exports.verifyNewsUrl = exports.generateNewsManual = exports.generateDailyNews = void 0;
// functions/src/news.ts
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const genai_1 = require("@google/genai");
const zod_1 = require("zod");
const shared_1 = require("./shared");
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
    "isClean": true,
    "isFeatured": false
  }
]

Marketing detection rules - add a flag if ANY of these apply:
- Source is PR Newswire, Business Wire, GlobeNewswire, or brand blog → BRAND_PR
- Article promotes a specific product with purchase language → PROMOTIONAL
- Article is written by the brand being discussed → CONFLICT_OF_INTEREST
- Article has only positive framing with no critical analysis → SOFT_AD
- Set "isClean": false if ANY flag is added, true if marketingFlags is empty

Featured detection rules - set "isFeatured": true if ANY of these apply:
- Source is a government agency, legislative body, or official health authority (e.g. FDA, NHS, state legislature)
- Source is a major corporation (Fortune 500 or equivalent), large industry association, or academic institution
- Source is a well-known non-profit, charity, or public interest organization
- The article reports on a regulatory change, official policy, or scientific study with institutional backing
- Otherwise set "isFeatured": false

If no relevant recent news found for this topic, return: []
Return ONLY the JSON array. No other text.
`;
const ENGLISH_TOPIC_POOL = [
    "hair system toupee base materials lace poly urethane construction",
    "hair system adhesive tape bonding application removal technique",
    "hair system cleaning maintenance care routine wearers",
    "custom hair unit ventilation hand-tied knotted hairpiece",
    "hair system density color matching styling tips professionals",
    "alopecia androgenetic hair loss non-surgical solution management",
    "hair loss confidence mental health community support wearers",
    "hair system wearer lifestyle swimming sports waterproof activity",
    "polyurethane silicone TPE hair system base material science",
    "Swiss French lace mono mesh hair system base durability comparison",
    "human hair Remy synthetic fiber heat-resistant hair system quality",
    "nonwoven textile polymer material hair replacement industry",
    "medical grade adhesive acrylic silicone bonding hair system",
    "hair salon professional stylist hair replacement installation service",
    "hair system manufacturer supplier wholesale industry supply chain",
    "hair care products conditioner treatment general salon",
    "medical wig chemotherapy cancer patient hair loss",
    "theatrical stage wig craftsmanship material technique construction",
    "hair transplant surgical restoration news comparison non-surgical",
    "lace fabric mesh textile manufacturing hair industry upstream",
];
const CHINESE_TOPIC_POOL = [
    "发套 假发底料 PU 聚氨酯 网料 制造工艺",
    "中国假发供应链 出口 制造业 原材料",
    "发套手工打结 定制 发片 生产工艺",
];
function selectTopics(pool, count, seed) {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (seed * 1103515245 + i * 12345) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}
async function generateNewsArticles(ai, maxArticles = 15) {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const englishTopics = selectTopics(ENGLISH_TOPIC_POOL, 12, dayOfYear);
    const chineseTopics = selectTopics(CHINESE_TOPIC_POOL, 3, dayOfYear + 999);
    const allTopics = [
        ...englishTopics.map(t => ({ topic: t, isChinese: false })),
        ...chineseTopics.map(t => ({ topic: t, isChinese: true })),
    ];
    const allArticles = [];
    async function searchTopic(topic, isChinese) {
        try {
            console.info(`Searching topic [${isChinese ? 'CN' : 'EN'}]: ${topic}`);
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: NEWS_PROMPT(topic, isChinese) }] }],
                config: { tools: [{ googleSearch: {} }], temperature: 0.2, maxOutputTokens: 4096 }
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
    const batch = shared_1.db.batch();
    for (const article of articles) {
        const ref = shared_1.db.collection('newsArticles').doc();
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
            isFeatured: article.isFeatured === true,
            urlVerified: false,
            urlVerifiedAt: null,
            generatedDate: today,
            generatedBy: source,
            status: article.isClean !== false ? 'PUBLISHED' : 'DRAFT',
            adminNote: article.isClean !== false ? "" : "Auto-flagged: contains marketing content, pending review.",
            createdAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
            publishedAt: article.isClean !== false ? shared_1.admin.firestore.FieldValue.serverTimestamp() : null,
        });
    }
    await batch.commit();
    return articles.length;
}
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
exports.generateNewsManual = (0, https_1.onCall)({ secrets: ["GEMINI_API_KEY"], memory: "512MiB", timeoutSeconds: 540, region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new https_1.HttpsError('internal', 'API key not configured');
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const articles = await generateNewsArticles(ai, 10);
    const saved = await saveArticlesToFirestore(articles, 'AI_GEMINI_MANUAL');
    return { success: true, count: saved };
});
exports.verifyNewsUrl = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
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
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Toupee4U-NewsVerifier/1.0)' }
        });
        clearTimeout(timeout);
        statusCode = res.status;
        accessible = res.status >= 200 && res.status < 400;
    }
    catch (error) {
        console.warn(`URL verification failed for ${url}:`, error.message);
    }
    await shared_1.db.collection('newsArticles').doc(articleId).update({
        urlVerified: accessible,
        urlStatusCode: statusCode,
        urlVerifiedAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
    });
    return { accessible, statusCode };
});
exports.publishNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().optional(),
    }).parse(request.data);
    await shared_1.db.collection('newsArticles').doc(articleId).update({
        status: 'PUBLISHED',
        adminNote: adminNote || "",
        publishedAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
exports.rejectNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().min(1),
    }).parse(request.data);
    await shared_1.db.collection('newsArticles').doc(articleId).update({
        status: 'REJECTED',
        adminNote,
        rejectedAt: shared_1.admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
exports.unpublishNewsArticle = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.token?.isAdmin)
        throw new https_1.HttpsError('permission-denied', 'Admin only.');
    const { articleId, adminNote } = zod_1.z.object({
        articleId: zod_1.z.string(),
        adminNote: zod_1.z.string().optional(),
    }).parse(request.data);
    await shared_1.db.collection('newsArticles').doc(articleId).update({
        status: 'UNPUBLISHED',
        adminNote: adminNote || "",
        publishedAt: null,
    });
    return { success: true };
});
//# sourceMappingURL=news.js.map