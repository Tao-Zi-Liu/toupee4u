// services/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase.config';

// 用户数据类型
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  membershipTier: 'free' | 'kinetic' | 'quantum';
  isExpert: boolean;
  createdAt: any;
}

/**
 * 注册新用户
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<UserProfile> {
  try {
    // 1. 在Firebase Auth创建用户
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. 在Firestore创建用户档案
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
      membershipTier: 'free',
      isExpert: false,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    console.log('✅ User registered:', user.uid);
    return userProfile;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    throw new Error(getErrorMessage(error.code));
  }
}

/**
 * 登录用户
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 从Firestore获取用户档案
    const userProfile = await getUserProfile(user.uid);

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    console.log('✅ User logged in:', user.uid);
    return userProfile;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    throw new Error(getErrorMessage(error.code));
  }
}

/**
 * 登出
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log('✅ User logged out');
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    throw new Error('Failed to log out');
  }
}

/**
 * 获取用户档案
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return null;
  }
}

/**
 * 监听认证状态变化
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 获取当前登录用户
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * 错误消息转换
 */
function getErrorMessage(errorCode: string): string {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
}