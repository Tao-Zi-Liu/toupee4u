import {
  doc, setDoc, getDoc, collection,
  getDocs, serverTimestamp, updateDoc, increment
} from 'firebase/firestore';
import { db } from '../firebase.config';

export interface ArticleProgress {
  articleId: string;
  topicId: string;
  categoryId: string;
  articleTitle: string;
  categoryName: string;
  readAt: any;
  readTimeSeconds: number;
}

export interface ReadingStats {
  totalArticlesRead: number;
  totalReadTimeSeconds: number;
  categoryProgress: {
    categoryId: string;
    categoryName: string;
    totalArticles: number;
    readArticles: number;
    percentage: number;
  }[];
  recentlyRead: ArticleProgress[];
}

// ── 标记文章为已读 ──────────────────────────
export async function markArticleRead(
  userId: string,
  data: {
    articleId: string;
    topicId: string;
    categoryId: string;
    articleTitle: string;
    categoryName: string;
    readTimeSeconds: number;
  }
): Promise<void> {
  try {
    const progressRef = doc(
      db, 'userProgress', userId, 'articles', data.articleId
    );
    await setDoc(progressRef, {
      ...data,
      readAt: serverTimestamp()
    }, { merge: true });

    // 更新总阅读时长
    const statsRef = doc(db, 'userProgress', userId);
    await setDoc(statsRef, {
      totalReadTimeSeconds: increment(data.readTimeSeconds),
      lastActiveAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Failed to mark article as read:', error);
  }
}

// ── 检查文章是否已读 ──────────────────────────
export async function checkArticleRead(
  userId: string,
  articleId: string
): Promise<boolean> {
  try {
    const progressRef = doc(db, 'userProgress', userId, 'articles', articleId);
    const snap = await getDoc(progressRef);
    return snap.exists();
  } catch {
    return false;
  }
}

// ── 获取用户所有阅读记录 ──────────────────────
export async function getUserReadingStats(
  userId: string,
  allCategories: { id: string; name: string; topics: { articles: { id: string }[] }[] }[]
): Promise<ReadingStats> {
  try {
    // 获取总阅读时长
    const statsSnap = await getDoc(doc(db, 'userProgress', userId));
    const totalReadTimeSeconds = statsSnap.exists()
      ? (statsSnap.data().totalReadTimeSeconds || 0)
      : 0;

    // 获取所有已读文章
    const articlesSnap = await getDocs(
      collection(db, 'userProgress', userId, 'articles')
    );
    const readArticleIds = new Set<string>();
    const recentlyRead: ArticleProgress[] = [];

    articlesSnap.forEach(doc => {
      readArticleIds.add(doc.id);
      recentlyRead.push({ articleId: doc.id, ...doc.data() } as ArticleProgress);
    });

    // 排序最近阅读
    recentlyRead.sort((a, b) => {
      const aTime = a.readAt?.toMillis?.() || 0;
      const bTime = b.readAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    // 计算每个分类的完成进度
    const categoryProgress = allCategories.map(cat => {
      const totalArticles = cat.topics.reduce(
        (acc, t) => acc + (t.articles?.length || 0), 0
      );
      const readArticles = cat.topics.reduce((acc, t) => {
        return acc + (t.articles?.filter(a => readArticleIds.has(a.id)).length || 0);
      }, 0);

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        totalArticles,
        readArticles,
        percentage: totalArticles > 0 ? Math.round((readArticles / totalArticles) * 100) : 0
      };
    });

    return {
      totalArticlesRead: readArticleIds.size,
      totalReadTimeSeconds,
      categoryProgress,
      recentlyRead: recentlyRead.slice(0, 5)
    };
  } catch (error) {
    console.error('Failed to get reading stats:', error);
    return {
      totalArticlesRead: 0,
      totalReadTimeSeconds: 0,
      categoryProgress: [],
      recentlyRead: []
    };
  }
}