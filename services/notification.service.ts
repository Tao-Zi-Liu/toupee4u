import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, serverTimestamp, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'comment' | 'like' | 'mention';
  targetType: 'post' | 'comment';
  targetId: string;
  targetTitle?: string;
  content?: string;
  isRead: boolean;
  createdAt: any;
}

export async function createNotification(
  recipientId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  type: 'comment' | 'like' | 'mention',
  targetType: 'post' | 'comment',
  targetId: string,
  targetTitle?: string,
  content?: string
): Promise<void> {
  // 不要给自己发通知
  if (recipientId === senderId) {
    return;
  }

  try {
    // 过滤 undefined 字段，Firestore 不接受 undefined
    const data: Record<string, any> = {
      recipientId,
      senderId,
      senderName,
      senderAvatar,
      type,
      targetType,
      targetId,
      isRead: false,
      createdAt: serverTimestamp()
    };
    if (targetTitle !== undefined) data.targetTitle = targetTitle;
    if (content !== undefined) data.content = content;
    await addDoc(collection(db, 'notifications'), data);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export async function getUserNotifications(userId: string, limitCount = 20): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
}

export async function markAsRead(notificationId: string): Promise<void> {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { isRead: true })
    );
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const q = query(
    collection(db, 'notifications'),
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    callback(notifications);
  });
}