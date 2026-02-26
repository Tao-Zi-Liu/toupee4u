
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Clock, 
  Eye, 
  Trash2, 
  Heart, 
  Bookmark, 
  UserPlus, 
  UserMinus,
  AlertCircle,
  MoreHorizontal,
  // Added RefreshCw and Edit3 to resolve line 308, 370, and 485 errors
  RefreshCw,
  Edit3
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { 
  Post, 
  getRelativeTime, 
  incrementPostViews, 
  togglePostLike, 
  checkUserLiked,
  Comment, 
  getComments, 
  createComment, 
  deleteComment, 
  toggleCommentLike, 
  checkCommentLiked,
  updatePost, 
  deletePost 
} from '../services/post.service';
import { getCurrentUser, getCompleteUserProfile, searchUsers } from '../services/auth.service';
import { createNotification } from '../services/notification.service';
import { toggleBookmark, checkBookmarked } from '../services/bookmark.service';
import { checkIsFollowing, followUser, unfollowUser } from '../services/follow.service';
import { ImageLightbox } from '../components/ImageLightbox';

// 解析评论内容，高亮@用户名
function renderCommentContent(content: string) {
  const parts = content.split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-brand-blue font-bold">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

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
  const [editLoading, setEditLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{ [key: string]: boolean }>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<{ [key: string]: number }>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionUsers, setMentionUsers] = useState<any[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBtnLoading, setFollowBtnLoading] = useState(false);

  const currentUser = getCurrentUser();
  const isAuthor = currentUser && post && currentUser.uid === post?.authorId;

  useEffect(() => {
    if (!currentUser || !post?.authorId || currentUser.uid === post.authorId) return;
    checkIsFollowing(currentUser.uid, post.authorId).then(setIsFollowing);
  }, [post?.authorId, post?.id]);

  const handleFollow = async () => {
    if (!currentUser || !post) return;
    setFollowBtnLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.uid, post.authorId);
        setIsFollowing(false);
      } else {
        await followUser(currentUser.uid, post.authorId, post.authorName, post.authorAvatar || '');
        setIsFollowing(true);
      }
    } finally {
      setFollowBtnLoading(false);
    }
  };

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
          incrementPostViews(postId);
          
          const currentUser = getCurrentUser();
          if (currentUser) {
            const liked = await checkUserLiked(postId, currentUser.uid);
            setIsLiked(liked);
            const bookmarked = await checkBookmarked(currentUser.uid, postId);
            setIsBookmarked(bookmarked);
          }

          const commentsList = await getComments(postId);
          setComments(commentsList);
          
          const likeCounts: { [key: string]: number } = {};
          const likes: { [key: string]: boolean } = {};
          
          for (const comment of commentsList) {
            likeCounts[comment.id] = comment.likes || 0;
            if (currentUser) {
              const liked = await checkCommentLiked(comment.id, currentUser.uid);
              likes[comment.id] = liked;
            }
          }
          setCommentLikeCounts(likeCounts);
          setCommentLikes(likes);
        } else {
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

  const handleCommentInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommentContent(value);
    
    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        setMentionSearch(textAfterAt);
        setMentionStartIndex(atIndex);
        const users = await searchUsers(textAfterAt);
        setMentionUsers(users);
        setShowMentionDropdown(users.length > 0);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMentionSelect = (user: any) => {
    const beforeMention = commentContent.substring(0, mentionStartIndex);
    const afterMention = commentContent.substring(mentionStartIndex + mentionSearch.length + 1);
    const newContent = `${beforeMention}@${user.displayName} ${afterMention}`;
    setCommentContent(newContent);
    setShowMentionDropdown(false);
    
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
        const newCursorPos = beforeMention.length + user.displayName.length + 2;
        commentInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser || !commentContent.trim() || commentLoading) return;
    
    setCommentLoading(true);
    try {
      const profile = await getCompleteUserProfile(currentUser.uid);
      const commentId = await createComment(
        postId!,
        commentContent.trim(),
        currentUser.uid,
        profile.displayName,
        profile.photoURL,
        profile.galaxyLevel
      );
      
      const newComment: Comment = {
        id: commentId,
        postId: postId!,
        content: commentContent.trim(),
        authorId: currentUser.uid,
        authorName: profile.displayName,
        authorAvatar: profile.photoURL,
        authorGalaxyLevel: profile.galaxyLevel,
        likes: 0,
        createdAt: new Date()
      };

      setCommentLikeCounts(prev => ({ ...prev, [commentId]: 0 }));
      setCommentLikes(prev => ({ ...prev, [commentId]: false }));
      setComments(prev => [...prev, newComment]);
      setCommentContent('');
      
      if (post && post.authorId !== currentUser.uid) {
        await createNotification(
          post.authorId,
          currentUser.uid,
          profile.displayName,
          profile.photoURL,
          'comment',
          'post',
          postId!,
          post.title,
          commentContent.trim().slice(0, 50)
        );
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !postId || likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await togglePostLike(postId, currentUser.uid);
      setIsLiked(result.liked);
      setLikeCount(result.newLikeCount);
      
      if (result.liked && post && post.authorId !== currentUser.uid) {
        const profile = await getCompleteUserProfile(currentUser.uid);
        await createNotification(
          post.authorId,
          currentUser.uid,
          profile.displayName,
          profile.photoURL,
          'like',
          'post',
          postId,
          post.title
        );
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || !post || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      const result = await toggleBookmark(currentUser.uid, postId!, {
        title: post.title,
        excerpt: post.excerpt || '',
        authorName: post.authorName,
        category: post.category,
        images: post.images || []
      });
      setIsBookmarked(result.bookmarked);
    } finally {
      setBookmarkLoading(false);
    }
  };

  /* FIX: Implemented missing handleDeleteComment handler to fix line 504 error */
  const handleDeleteComment = async (commentId: string) => {
    if (!postId || !window.confirm('Delete this response?')) return;
    try {
      await deleteComment(commentId, postId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  };

  /* FIX: Implemented missing handleCommentLike handler to fix line 509 error */
  const handleCommentLike = async (commentId: string) => {
    if (!currentUser) return;
    try {
      const { liked, newLikeCount } = await toggleCommentLike(commentId, currentUser.uid);
      setCommentLikes(prev => ({ ...prev, [commentId]: liked }));
      setCommentLikeCounts(prev => ({ ...prev, [commentId]: newLikeCount }));
    } catch (error) {
      console.error('Comment like error:', error);
    }
  };

  /* FIX: Implemented missing handleDelete handler for post deletion to fix line 529 error */
  const handleDelete = async () => {
    if (!postId || !post) return;
    try {
      await deletePost(postId);
      navigate('/forum');
    } catch (error) {
      console.error('Delete post error:', error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 flex-col gap-4">
        <RefreshCw className="w-10 h-10 text-brand-blue animate-spin" />
        <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">Reconstructing signal...</div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Matrix
        </Link>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Signal ID: {post.id.slice(0,8)}</span>
        </div>
      </div>

      <div className="bg-dark-800 border border-dark-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-dark-700 bg-dark-900/40">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple p-[2px] shadow-lg shadow-blue-500/10">
                 <div className="w-full h-full rounded-2xl bg-dark-900 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                    {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                    ) : post.authorName[0]}
                 </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg">{post.authorName}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${post.authorGalaxyLevel === 'SUPERNOVA' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-slate-400 border-dark-600 bg-dark-900'}`}>
                    {post.authorGalaxyLevel}
                  </span>
                  {!isAuthor && currentUser && (
                      <button 
                        onClick={handleFollow}
                        disabled={followBtnLoading}
                        className={`ml-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isFollowing ? 'bg-dark-700 text-slate-300' : 'bg-brand-blue text-white shadow-lg shadow-blue-500/20'
                        }`}
                      >
                        {isFollowing ? <><UserMinus className="w-3 h-3 inline mr-1" /> Unfollow</> : <><UserPlus className="w-3 h-3 inline mr-1" /> Follow</>}
                      </button>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getRelativeTime(post.createdAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views} Views</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthor && !isEditing && (
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(true); setEditTitle(post.title); setEditContent(post.content); }} className="p-2 bg-dark-900 border border-dark-600 text-slate-400 hover:text-white rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setShowDeleteConfirm(true)} className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
              <button className="p-2 text-slate-500 hover:text-white rounded-xl transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-3xl font-bold text-white bg-dark-900 border border-dark-600 rounded-2xl p-4 focus:border-brand-blue outline-none"
                />
                <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-80 bg-dark-900 border border-dark-600 rounded-2xl p-4 text-white focus:border-brand-blue outline-none resize-none"
                />
                <div className="flex justify-end gap-3">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-slate-400 font-bold uppercase tracking-widest text-xs">Abort</button>
                    <button onClick={async () => {
                        setEditLoading(true);
                        await updatePost(post.id, { title: editTitle, content: editContent });
                        setPost({...post, title: editTitle, content: editContent});
                        setIsEditing(false);
                        setEditLoading(false);
                    }} className="px-8 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">Commit Changes</button>
                </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight leading-tight">{post.title}</h1>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-dark-900 text-slate-400 border border-dark-600 uppercase tracking-[0.1em]">{post.category}</span>
                {post.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 uppercase tracking-[0.1em]">#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
            <div className="p-8">
                <div className="prose prose-invert max-w-none mb-10">
                    <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
                    {post.images && post.images.length > 0 && (
                        <div className={`grid gap-4 mt-8 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {post.images.map((url, i) => (
                                <img key={i} src={url} alt="Observation Data" className="w-full rounded-2xl border border-dark-700 cursor-pointer hover:border-brand-blue transition-colors shadow-2xl" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-dark-700">
                    <div className="flex items-center gap-6">
                        <button onClick={handleLike} disabled={likeLoading} className={`flex items-center gap-2.5 transition-all group ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}>
                            <div className={`p-2.5 rounded-xl transition-all ${isLiked ? 'bg-red-500/10' : 'bg-dark-900 group-hover:bg-red-500/5'}`}>
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            </div>
                            <span className="font-bold text-lg">{likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2.5 text-slate-400 hover:text-brand-blue group transition-all">
                            <div className="p-2.5 rounded-xl bg-dark-900 group-hover:bg-brand-blue/5">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg">{comments.length}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleBookmark} disabled={bookmarkLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${isBookmarked ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-dark-900 border-dark-700 text-slate-400 hover:border-amber-500/50'}`}>
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Stored' : 'Save'}
                        </button>
                        <button className="p-2.5 bg-dark-900 border border-dark-700 rounded-xl text-slate-400 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-brand-blue" /> Interfacial Responses ({comments.length})
        </h3>

        <form onSubmit={handleCommentSubmit} className="mb-10 group/form">
            <div className="relative">
                <textarea
                    ref={commentInputRef}
                    value={commentContent}
                    onChange={handleCommentInput}
                    placeholder="Provide constructive observation... (use @ to mention)"
                    className="w-full bg-dark-900 border border-dark-700 rounded-2xl p-5 text-white placeholder-slate-600 focus:border-brand-blue outline-none transition-all resize-none h-28"
                />
                {showMentionDropdown && (
                    <div className="absolute bottom-full left-0 w-64 mb-2 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                        {mentionUsers.map(user => (
                            <button key={user.userId} onClick={() => handleMentionSelect(user)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-dark-700 text-left transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-dark-900 overflow-hidden"><img src={user.photoURL} alt="" className="w-full h-full object-cover" /></div>
                                <div>
                                    <p className="text-sm font-bold text-white">{user.displayName}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">{user.galaxyLevel}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-4">
                <button type="submit" disabled={!commentContent.trim() || commentLoading} className="px-10 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center gap-2">
                    {commentLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Transmit Response'}
                </button>
            </div>
        </form>

        <div className="space-y-6">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-4 p-5 bg-dark-900/40 rounded-2xl border border-dark-700/50 hover:border-dark-700 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 flex-shrink-0 flex items-center justify-center font-bold text-slate-400 overflow-hidden border border-dark-700">
                        {comment.authorAvatar ? <img src={comment.authorAvatar} alt="" className="w-full h-full object-cover" /> : comment.authorName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{comment.authorName}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-dark-700 bg-dark-900 text-slate-500 uppercase">{comment.authorGalaxyLevel}</span>
                                <span className="text-[10px] text-slate-600 font-mono">{getRelativeTime(comment.createdAt)}</span>
                            </div>
                            {currentUser?.uid === comment.authorId && (
                                <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            )}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{renderCommentContent(comment.content)}</p>
                        <div className="mt-3">
                            <button onClick={() => handleCommentLike(comment.id)} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${commentLikes[comment.id] ? 'text-red-500' : 'text-slate-600 hover:text-red-400'}`}>
                                <Heart className={`w-3.5 h-3.5 ${commentLikes[comment.id] ? 'fill-current' : ''}`} /> {commentLikeCounts[comment.id]} Response-Hits
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {lightboxOpen && <ImageLightbox images={post.images || []} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><AlertCircle className="w-10 h-10" /></div>
                <h3 className="text-xl font-bold text-white mb-2">Terminate Signal?</h3>
                <p className="text-slate-400 text-sm mb-8">This action is permanent and will remove all associated interfacial data nodes.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 text-slate-400 font-bold uppercase tracking-widest text-xs">Abort</button>
                    <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all">Confirm Termination</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
