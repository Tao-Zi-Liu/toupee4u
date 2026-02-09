// pages/PostDetailPage.tsx
// 帖子详情页

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Clock,
  Eye
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Post, getRelativeTime, incrementPostViews, togglePostLike, checkUserLiked } from '../services/post.service';
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import { Comment, getComments, createComment } from '../services/post.service';
import { updatePost, deletePost } from '../services/post.service';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!postId) {
        navigate('/forum');
        return;
      }

      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        
        if (postDoc.exists()) {
          const postData = {
            id: postDoc.id,
            ...postDoc.data()
          } as Post;
          
          setPost(postData);
          setLikeCount(postData.likes || 0);
          
          // 增加浏览量
          incrementPostViews(postId);
          
          // 检查当前用户是否已点赞
          const currentUser = getCurrentUser();
          if (currentUser) {
            const liked = await checkUserLiked(postId, currentUser.uid);
            setIsLiked(liked);
          }
          const commentsList = await getComments(postId);
          setComments(commentsList);
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

  // 处理评论提交
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }
    
    if (!commentContent.trim()) {
      alert('Please enter a comment');
      return;
    }
    
    if (!postId || commentLoading) return;
    
    setCommentLoading(true);
    
    try {
      const profile = await getCompleteUserProfile(currentUser.uid);
      
      const commentId = await createComment(
        postId,
        commentContent.trim(),
        currentUser.uid,
        profile.displayName,
        profile.photoURL,
        profile.galaxyLevel
      );
      
      // 添加新评论到列表
      const newComment: Comment = {
        id: commentId,
        postId: postId,
        content: commentContent.trim(),
        authorId: currentUser.uid,
        authorName: profile.displayName,
        authorAvatar: profile.photoURL,
        authorGalaxyLevel: profile.galaxyLevel,
        createdAt: new Date()
      };
      
      setComments([...comments, newComment]);
      setCommentContent('');
      
      // 更新帖子的评论数
      if (post) {
        setPost({ ...post, comments: post.comments + 1 });
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  // 开始编辑
  const handleStartEdit = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditTags(post.tags);
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
    setEditCategory('');
    setEditTags([]);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!post || !postId) return;
    
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Title and content are required');
      return;
    }
    
    setEditLoading(true);
    
    try {
      await updatePost(postId, editTitle.trim(), editContent.trim(), editCategory, editTags);
      
      // 更新本地状态
      setPost({
        ...post,
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        tags: editTags
      });
      
      setIsEditing(false);
      alert('Post updated successfully!');
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // 删除帖子
  const handleDelete = async () => {
    if (!postId) return;
    
    try {
      await deletePost(postId);
      alert('Post deleted successfully!');
      navigate('/forum');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

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

  // 检查是否是作者
  const currentUser = getCurrentUser();
  const isAuthor = currentUser && post && currentUser.uid === post.authorId;

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
            
            {isAuthor && !isEditing && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleStartEdit}
                  className="px-4 py-2 bg-dark-900 border border-dark-600 text-slate-300 hover:text-white hover:border-brand-blue rounded-lg transition-all text-sm font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-lg transition-all text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-3xl font-bold text-white bg-dark-900 border border-dark-600 rounded-xl p-4 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all mb-3"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white mb-3">
              {post.title}
            </h1>
          )}

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
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 bg-dark-900 border border-dark-600 rounded-xl p-4 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  disabled={editLoading}
                  className="px-6 py-2 bg-dark-900 border border-dark-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          )}
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

      {/* Comments Section */}
        {!isEditing && (
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({post.comments})
            </h3>
            
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none h-24"
                disabled={commentLoading}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={commentLoading || !commentContent.trim()}
                  className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-dark-900 rounded-xl p-4 border border-dark-700">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {comment.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">
                            {comment.authorName}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                            {comment.authorGalaxyLevel}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-3">Delete Post?</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone. All comments and likes will also be deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-dark-900 border border-dark-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
