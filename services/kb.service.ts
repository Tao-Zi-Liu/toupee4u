
import {collection, doc,getDocs, getDoc,addDoc,updateDoc,deleteDoc,setDoc,query,orderBy,serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase.config';

// ============================================
// 类型定义
// ============================================

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  readTime: string;
  tier: string;
  order: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface KBTopic {
  id: string;
  title: string;
  description: string;
  readTime: string;
  tier: string;
  category: string;
  order: number;
  articles: KBArticle[];
}

export interface KBCategory {
  id: string;
  name: string;
  description: string;
  physicsTheme: string;
  iconName: string;
  order: number;
  topics: KBTopic[];
}

export interface KBSearchResult {
  articleId: string;
  articleTitle: string;
  topicId: string;
  topicTitle: string;
  categoryId: string;
  categoryName: string;
  excerpt: string;
  tier: string;
  readTime: string;
}

// ============================================
// 读取所有分类（含主题和文章）
// ============================================

export async function getKBCategories(): Promise<KBCategory[]> {
  try {
    const categoriesQuery = query(
      collection(db, 'kb_categories'),
      orderBy('order', 'asc')
    );
    const categoriesSnap = await getDocs(categoriesQuery);
    const categories: KBCategory[] = [];

    for (const categoryDoc of categoriesSnap.docs) {
      const categoryData = categoryDoc.data();

      // 读取该分类下的主题
      const topicsQuery = query(
        collection(db, 'kb_categories', categoryDoc.id, 'kb_topics'),
        orderBy('order', 'asc')
      );
      const topicsSnap = await getDocs(topicsQuery);
      const topics: KBTopic[] = [];

      for (const topicDoc of topicsSnap.docs) {
        const topicData = topicDoc.data();

        // 读取该主题下的文章
        const articlesQuery = query(
          collection(db, 'kb_categories', categoryDoc.id, 'kb_topics', topicDoc.id, 'kb_articles'),
          orderBy('order', 'asc')
        );
        const articlesSnap = await getDocs(articlesQuery);
        const articles: KBArticle[] = [];

        articlesSnap.forEach(articleDoc => {
          articles.push({
            id: articleDoc.id,
            ...articleDoc.data()
          } as KBArticle);
        });

        topics.push({
          id: topicDoc.id,
          ...topicData,
          articles
        } as KBTopic);
      }

      categories.push({
        id: categoryDoc.id,
        ...categoryData,
        topics
      } as KBCategory);
    }

    console.log('✅ KB categories loaded:', categories.length);
    return categories;
  } catch (error) {
    console.error('❌ Failed to load KB categories:', error);
    return [];
  }
}

// ============================================
// 创建分类
// ============================================

export async function createKBCategory(data: {
  name: string;
  description: string;
  physicsTheme: string;
  iconName: string;
  order: number;
}): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'kb_categories'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Failed to create KB category:', error);
    throw error;
  }
}

// ============================================
// 创建主题
// ============================================

export async function createKBTopic(
  categoryId: string,
  data: {
    title: string;
    description: string;
    readTime: string;
    tier: string;
    category: string;
    order: number;
  }
): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, 'kb_categories', categoryId, 'kb_topics'),
      {
        ...data,
        createdAt: serverTimestamp()
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('❌ Failed to create KB topic:', error);
    throw error;
  }
}

// ============================================
// 创建文章
// ============================================

export async function createKBArticle(
  categoryId: string,
  topicId: string,
  data: {
    title: string;
    content: string;
    readTime: string;
    tier: string;
    order: number;
  }
): Promise<string> {
  try {
    const docRef = await addDoc(
      collection(db, 'kb_categories', categoryId, 'kb_topics', topicId, 'kb_articles'),
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    );
    return docRef.id;
  } catch (error) {
    console.error('❌ Failed to create KB article:', error);
    throw error;
  }
}

// ============================================
// 更新文章
// ============================================

export async function updateKBArticle(
  categoryId: string,
  topicId: string,
  articleId: string,
  data: { title?: string; content?: string; readTime?: string; tier?: string }
): Promise<void> {
  try {
    const articleRef = doc(
      db, 'kb_categories', categoryId, 'kb_topics', topicId, 'kb_articles', articleId
    );
    await updateDoc(articleRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('❌ Failed to update KB article:', error);
    throw error;
  }
}

// ============================================
// 删除文章
// ============================================

export async function deleteKBArticle(
  categoryId: string,
  topicId: string,
  articleId: string
): Promise<void> {
  try {
    await deleteDoc(
      doc(db, 'kb_categories', categoryId, 'kb_topics', topicId, 'kb_articles', articleId)
    );
  } catch (error) {
    console.error('❌ Failed to delete KB article:', error);
    throw error;
  }
}

// ============================================
// 全文搜索 KB 文章
// ============================================

export async function searchKBArticles(keyword: string): Promise<KBSearchResult[]> {
  if (!keyword.trim()) return [];

  try {
    const categories = await getKBCategories();
    const results: KBSearchResult[] = [];
    const kw = keyword.toLowerCase();

    for (const category of categories) {
      for (const topic of category.topics) {
        for (const article of topic.articles || []) {
          if ((article as any).status === 'draft') continue;

          const titleMatch = article.title.toLowerCase().includes(kw);
          const contentMatch = article.content.toLowerCase().includes(kw);

          if (titleMatch || contentMatch) {
            const plainText = article.content.replace(/<[^>]*>/g, '');
            const matchIndex = plainText.toLowerCase().indexOf(kw);
            const start = Math.max(0, matchIndex - 60);
            const excerpt =
              (start > 0 ? '...' : '') +
              plainText.substring(start, start + 150) +
              (start + 150 < plainText.length ? '...' : '');

            results.push({
              articleId: article.id,
              articleTitle: article.title,
              topicId: topic.id,
              topicTitle: topic.title,
              categoryId: category.id,
              categoryName: category.name,
              excerpt,
              tier: article.tier,
              readTime: article.readTime
            });
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error('KB search failed:', error);
    return [];
  }
}
