import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase.config';

export interface UploadImageResult {
  url: string;
  path: string;
}

/**
 * 压缩图片
 */
async function compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 按比例缩放
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

/**
 * 上传图片到帖子
 */
export async function uploadPostImage(
  postId: string,
  file: File,
  compress: boolean = true
): Promise<UploadImageResult> {
  try {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }
    
    // 压缩图片
    let uploadFile: File | Blob = file;
    if (compress && file.type !== 'image/gif') {
      uploadFile = await compressImage(file);
    }
    
    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${randomStr}.${extension}`;
    
    // 创建存储引用
    const storagePath = `posts/${postId}/${filename}`;
    const storageRef = ref(storage, storagePath);
    
    // 上传文件
    await uploadBytes(storageRef, uploadFile, {
      contentType: file.type
    });
    
    // 获取下载 URL
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      path: storagePath
    };
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
}

/**
 * 上传图片到评论
 */
export async function uploadCommentImage(
  commentId: string,
  file: File,
  compress: boolean = true
): Promise<UploadImageResult> {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }
    
    let uploadFile: File | Blob = file;
    if (compress && file.type !== 'image/gif') {
      uploadFile = await compressImage(file);
    }
    
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${randomStr}.${extension}`;
    
    const storagePath = `comments/${commentId}/${filename}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, uploadFile, {
      contentType: file.type
    });
    
    const url = await getDownloadURL(storageRef);
    
    return {
      url,
      path: storagePath
    };
  } catch (error) {
    console.error('Failed to upload comment image:', error);
    throw error;
  }
}

/**
 * 删除图片
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
}

/**
 * 批量删除图片
 */
export async function deleteImages(paths: string[]): Promise<void> {
  try {
    const deletePromises = paths.map(path => deleteImage(path));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Failed to delete images:', error);
    throw error;
  }
}