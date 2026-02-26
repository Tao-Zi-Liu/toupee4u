import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ModerationResult } from './moderation.service';

export interface ModerationLog {
  content: string;
  title?: string;
  userId: string;
  userName: string;
  result: ModerationResult;
  action: 'blocked' | 'warned' | 'passed';
  moderationType: 'rule' | 'ai' | 'hybrid';
  timestamp: any;
  postId?: string;
}

export async function logModerationAction(
  content: string,
  userId: string,
  userName: string,
  result: ModerationResult,
  action: 'blocked' | 'warned' | 'passed',
  moderationType: 'rule' | 'ai' | 'hybrid',
  title?: string,
  postId?: string
): Promise<void> {
  try {
    const logData: any = {
                content,
                userId,
                userName,
                result,
                action,
                moderationType,
                timestamp: serverTimestamp()
              };

              if (title) logData.title = title;
              if (postId) logData.postId = postId;

              await addDoc(collection(db, 'moderationLogs'), logData);
  } catch (error) {
    console.error('Failed to log moderation action:', error);
  }
}