// pages/PostDetailPage.tsx
// 帖子详情页

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Clock,
  User,
  Eye
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Post, getRelativeTime, incrementPostViews } from '../services/post.service';
import { togglePostLike, checkUserLiked } from '../services/post.service';
import { getCurrentUser } from '../services/auth.service';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    async function loadPost() {
      if (!postId) {
        navigate('/forum');
        return;
      }

      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        
        if (postDoc.exists()) {
          setPost({
            id: postDoc.id,
            ...postDoc.data()
          } as Post);
          setPost(postData);
          setLikeCount(postData.likes || 0);
          // 增加浏览量
            incrementPostViews(postId);
            const currentUser = getCurrentUser();
              if (currentUser) {
                const liked = await checkUserLiked(postId, currentUser.uid);
                setIsLiked(liked);
              }
            }
        } else {
          console.error('Post not found');
          navigate('/forum');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId, navigate]);

  // 处理点赞
const handleLike = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Please login to like posts');
    return;
  }
  
  if (!postId || likeLoading) return;
  
  setLikeLoading(true);
  
  try {
    const result = await togglePostLike(postId, currentUser.uid);
    setIsLiked(result.liked);
    setLikeCount(result.newLikeCount);
  } catch (error) {
    console.error('Failed to toggle like:', error);
    alert('Failed to update like. Please try again.');
  } finally {
    setLikeLoading(false);
  }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/forum')}
          className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-slate-300 hover:text-white hover:border-dark-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm text-slate-500">Back to Forum</h1>
        </div>
      </div>

      {/* Post Content */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        
        {/* Post Header */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg">
                {post.authorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{post.authorName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                    {post.authorGalaxyLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{getRelativeTime(post.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            {post.title}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-dark-900 text-slate-300 border border-dark-600 font-medium">
              {post.category}
            </span>
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Post Body */}
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-6 py-4 border-t border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-slate-400 hover:text-brand-blue'
              } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-semibold">{likeCount}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.comments}</span>
            </button>
            <div className="flex items-center gap-2 text-slate-400">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-semibold">{post.views || 0}</span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-semibold">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section - Placeholder */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({post.comments})
        </h3>
        <div className="text-center py-8 text-slate-500">
          Comments coming soon...
        </div>
      </div>

    </div>
  );
};