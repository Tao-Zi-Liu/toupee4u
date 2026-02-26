import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface SearchFilters {
  keyword?: string;
  category?: string;
  sortBy?: 'newest' | 'popular' | 'mostComments';
}

export async function searchPosts(filters: SearchFilters) {
  try {
    let q = query(collection(db, 'posts'));
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    
    // Sorting
    switch (filters.sortBy) {
      case 'popular':
        q = query(q, orderBy('likeCount', 'desc'));
        break;
      case 'mostComments':
        q = query(q, orderBy('commentCount', 'desc'));
        break;
      default: // newest
        q = query(q, orderBy('createdAt', 'desc'));
    }
    
    q = query(q, limit(50));
    
    const snapshot = await getDocs(q);
    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Client-side keyword filtering (Firestore doesn't support full-text search)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      posts = posts.filter(post => 
        post.title?.toLowerCase().includes(keyword) ||
        post.content?.toLowerCase().includes(keyword)
      );
    }
    
    return posts;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export function saveSearchHistory(keyword: string) {
  const history = getSearchHistory();
  const updated = [keyword, ...history.filter(k => k !== keyword)].slice(0, 10);
  localStorage.setItem('search_history', JSON.stringify(updated));
}

export function getSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  } catch {
    return [];
  }
}

export function clearSearchHistory() {
  localStorage.removeItem('search_history');
}