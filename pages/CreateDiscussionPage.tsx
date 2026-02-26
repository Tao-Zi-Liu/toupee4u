import { createPost, updatePost } from '../services/post.service';
import { uploadPostImage } from '../services/image.service';
import { Image, X } from 'lucide-react';
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import { smartModerate } from '../services/moderation.service';
import React, { useState, useEffect } from 'react';
import { logModerationAction } from '../services/moderation-log.service';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ImageIcon as ImageIcon, Hash } from 'lucide-react';
import { AlertCircle, Type, Paperclip } from 'lucide-react';

export const CreateDiscussionPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Troubleshooting');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warningBypass, setWarningBypass] = useState(false);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  useEffect(() => {
    async function loadUser() {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const profile = await getCompleteUserProfile(currentUser.uid);
      setUserProfile(profile);
    }
    loadUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (!userProfile) {
      setError('User profile not loaded');
      return;
    }

    if (!userProfile.userId) {
      setError('User ID is missing. Please try logging out and back in.');
      console.error('User profile missing userId:', userProfile);
      return;
    }

    if (!userProfile.displayName) {
      console.warn('User profile missing displayName, using default');
      userProfile.displayName = 'Anonymous';
    }

    // Content moderation check (only if not bypassing warning)
    if (!warningBypass) {
      const combinedText = `${title}\n\n${content}`;
      const modResult = await smartModerate(combinedText);
      
      if (!modResult.isClean) {
              if (modResult.severity === 'high') {
                // 记录阻止日志
                await logModerationAction(
                  combinedText,
                  userProfile.userId,
                  userProfile.displayName,
                  modResult,
                  'blocked',
                  'hybrid',
                  title
                );
                
                setError('Your post does not meet our community guidelines. Please review and edit your content before posting.');
                return;
              } else {
                // 记录警告日志
                await logModerationAction(
                  combinedText,
                  userProfile.userId,
                  userProfile.displayName,
                  modResult,
                  'warned',
                  'hybrid',
                  title
                );
                
                setError('We noticed some issues with your post. Please review your content, or click Submit again to post anyway.');
                setWarningBypass(true);
                return;
              }
            } else {
              // 记录通过日志
              await logModerationAction(
                combinedText,
                userProfile.userId,
                userProfile.displayName,
                modResult,
                'passed',
                'hybrid',
                title
              );
            }
          }

    // Reset bypass flag
    setWarningBypass(false);
    setLoading(true);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.filter(tag => tag.trim())
      };

      const postId = await createPost(
        postData,
        userProfile.userId,
        userProfile.displayName,
        userProfile.photoURL,
        userProfile.galaxyLevel
      );

      // 上传图片
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        try {
          const uploadPromises = selectedImages.map(file => uploadPostImage(postId, file));
          const uploadResults = await Promise.all(uploadPromises);
          
          const imageUrls = uploadResults.map(result => result.url);
          const imagePaths = uploadResults.map(result => result.path);
          
          // 更新帖子添加图片URL
          await updatePost(postId, {
            images: imageUrls,
            imagePaths: imagePaths
          });
        } catch (uploadError) {
          console.error('Failed to upload images:', uploadError);
          // 图片上传失败不阻止帖子发布
        } finally {
          setUploadingImages(false);
        }
}

      // 如果通过审核发布了，记录包含postId的日志
      await logModerationAction(
        `${title}\n\n${content}`,
        userProfile.userId,
        userProfile.displayName,
        { isClean: true, issues: [], severity: 'low', suggestions: [] },
        'passed',
        'hybrid',
        title,
        postId
      );
      navigate('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 添加标签
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
        if (newTag && !tags.includes(newTag) && tags.length < 5) {
          setTags([...tags, newTag]);
        }
        setTagInput('');
      }
    };

    // 删除标签
    const handleRemoveTag = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };

  // 处理图片选择
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      
      // 限制最多5张图片
      if (selectedImages.length + files.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }
      
      // 验证每个文件
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });
      
      // 添加图片
      setSelectedImages([...selectedImages, ...validFiles]);
      
      // 生成预览URL
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    };

    // 删除图片
    const handleRemoveImage = (index: number) => {
      const newImages = selectedImages.filter((_, i) => i !== index);
      const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);
      
      // 释放预览URL
      URL.revokeObjectURL(imagePreviewUrls[index]);
      
      setSelectedImages(newImages);
      setImagePreviewUrls(newPreviews);
    };

  const categories = ['Troubleshooting', 'Review', 'Lifestyle', 'Science', 'Adhesives', 'Newbie Help'];

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/forum" 
          className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-slate-300 hover:text-white hover:border-dark-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Initiate New Sequence</h1>
          <p className="text-slate-300 text-sm">Open a frequency for community analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4" /> Subject Line
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hairline lifting after 3 days with Ghost Bond..."
                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> Quantum Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      category === cat 
                        ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' 
                        : 'bg-dark-900 border-dark-600 text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4" /> Observation Data
              </label>
<div className="space-y-2">
  <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="Describe your system specs (Base type, Adhesive used) and the issue in detail..."
    className="w-full h-64 bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none"
  />
  
  {/* 附件按钮行 */}
  <div className="flex gap-2">
    <label className="p-2 bg-dark-800 rounded-lg text-slate-300 hover:text-white border border-dark-600 hover:border-brand-blue transition-colors cursor-pointer" title="Attach Image">
      <ImageIcon className="w-4 h-4" />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
    </label>
    <button type="button" className="p-2 bg-dark-800 rounded-lg text-slate-300 hover:text-white border border-dark-600 hover:border-brand-blue transition-colors" title="Attach File">
      <Paperclip className="w-4 h-4" />
    </button>
  </div>
  
  {/* 图片预览 */}
  {imagePreviewUrls.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {imagePreviewUrls.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border border-dark-600"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>    
            {/* 标签输入 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4" /> Tags
                <span className="text-slate-600 normal-case font-normal">(Press Enter to add, max 5)</span>
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-dark-900 border border-dark-600 rounded-xl min-h-[48px] items-center focus-within:border-brand-blue transition-colors">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/30 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? "e.g. ghost-bond, lace-base..." : "Add more..."}
                    className="flex-1 min-w-[120px] bg-transparent text-white placeholder-slate-600 outline-none text-sm"
                  />
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-dark-700 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/forum')}
                className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-dark-700 transition-colors"
              >
                Abort
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {loading ? 'Processing...' : 'Transmit'}
              </button>
            </div>

          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mt-1">Protocol Guidelines</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-300 list-disc pl-4">
              <li>
                <strong className="text-slate-300">Be Specific:</strong> Mention your base type (Lace vs Poly) and adhesive brand.
              </li>
              <li>
                <strong className="text-slate-300">Upload Visuals:</strong> Close-up shots of the hairline help experts diagnose "lift".
              </li>
              <li>
                <strong className="text-slate-300">Respect Privacy:</strong> Blur faces if necessary.
              </li>
            </ul>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Related Knowledge Base</h3>
            <div className="space-y-3">
              <Link to="/kb/foundations" className="block p-3 rounded-lg bg-dark-900 border border-dark-600 hover:border-brand-blue transition-colors text-xs text-slate-300 hover:text-white">
                Foundations: Base Types Explained
              </Link>
              <Link to="/kb/securement" className="block p-3 rounded-lg bg-dark-900 border border-dark-600 hover:border-brand-blue transition-colors text-xs text-slate-300 hover:text-white">
                Securement: Choosing the Right Glue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
