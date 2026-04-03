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
exports.addXp = exports.dailyCleanup = exports.generateMonthlyDigestManual = exports.generateMonthlyDigest = exports.generatePodcastManual = exports.generateInsightsManual = exports.generatePersonalizedInsight = exports.generateDailyInsights = exports.unpublishNewsArticle = exports.rejectNewsArticle = exports.publishNewsArticle = exports.verifyNewsUrl = exports.generateNewsManual = exports.generateDailyNews = exports.onPostCreated = exports.onUserCreated = void 0;
// functions/index.ts
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const zod_1 = require("zod");
// ── Triggers ──────────────────────────────────────────────────────────────────
var triggers_1 = require("./src/triggers");
Object.defineProperty(exports, "onUserCreated", { enumerable: true, get: function () { return triggers_1.onUserCreated; } });
Object.defineProperty(exports, "onPostCreated", { enumerable: true, get: function () { return triggers_1.onPostCreated; } });
// ── News ──────────────────────────────────────────────────────────────────────
var news_1 = require("./src/news");
Object.defineProperty(exports, "generateDailyNews", { enumerable: true, get: function () { return news_1.generateDailyNews; } });
Object.defineProperty(exports, "generateNewsManual", { enumerable: true, get: function () { return news_1.generateNewsManual; } });
Object.defineProperty(exports, "verifyNewsUrl", { enumerable: true, get: function () { return news_1.verifyNewsUrl; } });
Object.defineProperty(exports, "publishNewsArticle", { enumerable: true, get: function () { return news_1.publishNewsArticle; } });
Object.defineProperty(exports, "rejectNewsArticle", { enumerable: true, get: function () { return news_1.rejectNewsArticle; } });
Object.defineProperty(exports, "unpublishNewsArticle", { enumerable: true, get: function () { return news_1.unpublishNewsArticle; } });
// ── Insights ──────────────────────────────────────────────────────────────────
var insights_1 = require("./src/insights");
Object.defineProperty(exports, "generateDailyInsights", { enumerable: true, get: function () { return insights_1.generateDailyInsights; } });
Object.defineProperty(exports, "generatePersonalizedInsight", { enumerable: true, get: function () { return insights_1.generatePersonalizedInsight; } });
Object.defineProperty(exports, "generateInsightsManual", { enumerable: true, get: function () { return insights_1.generateInsightsManual; } });
// ── Podcast ───────────────────────────────────────────────────────────────────
var podcast_1 = require("./src/podcast");
Object.defineProperty(exports, "generatePodcastManual", { enumerable: true, get: function () { return podcast_1.generatePodcastManual; } });
// ── Monthly Digest ────────────────────────────────────────────────────────────
var digest_1 = require("./src/digest");
Object.defineProperty(exports, "generateMonthlyDigest", { enumerable: true, get: function () { return digest_1.generateMonthlyDigest; } });
Object.defineProperty(exports, "generateMonthlyDigestManual", { enumerable: true, get: function () { return digest_1.generateMonthlyDigestManual; } });
// ── Cleanup ───────────────────────────────────────────────────────────────────
var cleanup_1 = require("./src/cleanup");
Object.defineProperty(exports, "dailyCleanup", { enumerable: true, get: function () { return cleanup_1.dailyCleanup; } });
// ── Misc Callables ────────────────────────────────────────────────────────────
// (addXp stays here as it's small and standalone)
const db = admin.firestore();
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
//# sourceMappingURL=index.js.map