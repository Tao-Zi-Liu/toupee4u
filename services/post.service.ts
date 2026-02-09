// services/post.service.ts
// 论坛帖子相关服务

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorGalaxyLevel: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: Timestamp | any;
  updatedAt: Timestamp | any;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

/**
 * 创建新帖子
 */
export async function createPost(
  postData: CreatePostData,
  authorId: string,
  authorName: string,
  authorAvatar: string,
  authorGalaxyLevel: string
): Promise<string> {
  try {
    // 生成摘要（取前150个字符）
    const excerpt = postData.content.substring(0, 150) + (postData.content.length > 150 ? '...' : '');
    
    const post = {
      title: postData.title,
      content: postData.content,
      excerpt: excerpt,
      authorId: authorId,
      authorName: authorName,
      authorAvatar: authorAvatar,
      authorGalaxyLevel: authorGalaxyLevel,
      category: postData.category,
      tags: postData.tags || [],
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'posts'), post);
    console.log('✅ Post created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

/**
 * 获取帖子列表
 */
export async function getPosts(limitCount: number = 10): Promise<Post[]> {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    const posts: Post[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as Post);
    });
    
    console.log('✅ Loaded posts:', posts.length);
    return posts;
  } catch (error) {
    console.error('❌ Error getting posts:', error);
    return [];
  }
}

/**
 * 格式化时间戳为相对时间
 */
export function getRelativeTime(timestamp: Timestamp | any): string {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
