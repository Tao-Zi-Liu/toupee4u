// services/auth.service.ts
// 用户认证服务：注册、登录、登出（支持新的角色和等级系统）

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { initUserXPStats } from './xp.service';
import { auth, db } from '../firebase.config';
import { 
  User, 
  UserRole, 
  GalaxyLevel,
  MembershipTier,
  VoyagerProfile,
  ArchitectProfile,
  CompleteUserProfile,
  HairPattern,
  ExperienceLevel,
  ActivityLevel
} from '../types';

/**
 * 注册新用户
 * @param email 邮箱
 * @param password 密码
 * @param displayName 显示名称
 * @param role 用户角色（可选，默认为VOYAGER）
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'VOYAGER'
): Promise<User> {
  try {
    // 1. 在Firebase Auth创建用户
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. 创建主用户档案
    const user: User = {
      userId: firebaseUser.uid,
      email: firebaseUser.email || email,
      displayName: displayName,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
      
      // 新增字段
      role: role,
      galaxyLevel: 'NEBULA',  // 注册即为星云等级
      xp: 0,                   // 初始经验值为0
      
      // 付费会员默认为free
      membershipTier: 'free',
      
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };

    // 3. 保存到 Firestore users collection
    await setDoc(doc(db, 'users', firebaseUser.uid), user);

    // 4. 根据角色创建对应的扩展Profile
    if (role === 'VOYAGER') {
      const voyagerProfile: VoyagerProfile = {
        userId: firebaseUser.uid,
        contentTags: [],
        quizCompleted: false
      };
      await setDoc(doc(db, 'voyagerProfiles', firebaseUser.uid), voyagerProfile);
    } else if (role === 'ARCHITECT') {
      const architectProfile: Partial<ArchitectProfile> = {
        userId: firebaseUser.uid,
        businessName: '',
        location: {
          city: '',
          country: ''
        },
        skills: [],
        verificationStatus: 'PENDING'
      };
      await setDoc(doc(db, 'architectProfiles', firebaseUser.uid), architectProfile);
    }
    // 5. 初始化XP积分档案
    await initUserXPStats(firebaseUser.uid);

    return user;
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
): Promise<CompleteUserProfile> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 获取完整的用户档案
    const completeProfile = await getCompleteUserProfile(firebaseUser.uid);

    if (!completeProfile) {
      throw new Error('User profile not found');
    }

    // 更新最后登录时间
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      lastLoginAt: serverTimestamp()
    }, { merge: true });

    return completeProfile;
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
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    throw new Error('Failed to log out');
  }
}

/**
 * 获取基础用户档案
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    }

    return null;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return null;
  }
}

/**
 * 获取完整的用户档案（包括扩展Profile）
 */
export async function getCompleteUserProfile(uid: string): Promise<CompleteUserProfile | null> {
  try {
    // 1. 获取基础用户信息
    const user = await getUserProfile(uid);
    if (!user) return null;

    const completeProfile: CompleteUserProfile = { ...user };

    // 2. 根据角色获取扩展Profile
    if (user.role === 'VOYAGER') {
      const voyagerDoc = await getDoc(doc(db, 'voyagerProfiles', uid));
      if (voyagerDoc.exists()) {
        completeProfile.voyagerProfile = voyagerDoc.data() as VoyagerProfile;
      }
    } else if (user.role === 'ARCHITECT') {
      const architectDoc = await getDoc(doc(db, 'architectProfiles', uid));
      if (architectDoc.exists()) {
        completeProfile.architectProfile = architectDoc.data() as ArchitectProfile;
      }
    }

    return completeProfile;
  } catch (error) {
    console.error('❌ Error fetching complete user profile:', error);
    return null;
  }
}

/**
 * 监听认证状态变化
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 获取当前登录用户
 */
export function getCurrentUser(): FirebaseUser | null {
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
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
}
/**
 * 更新Voyager Profile（保存Quiz数据）
 */
export async function updateVoyagerProfile(
  userId: string,
  quizData: {
    hairPattern: HairPattern;
    experienceLevel: ExperienceLevel;
    activityLevel: ActivityLevel;
  }
): Promise<void> {
  try {
    const voyagerProfileRef = doc(db, 'voyagerProfiles', userId);
    
    // 根据Quiz数据生成内容标签
    const contentTags: string[] = [];
    
    // 根据经验等级添加标签
    if (quizData.experienceLevel === 'NEWBIE') {
      contentTags.push('WIKI_BASICS', 'GETTING_STARTED', 'TUTORIALS');
    } else {
      contentTags.push('ADVANCED_TECHNIQUES', 'EXPERT_TIPS', 'COMMUNITY_DISCUSSIONS');
    }
    
    // 根据活动强度添加标签
    if (quizData.activityLevel === 'HIGH') {
      contentTags.push('ADHESIVES_SWEAT_PROOF', 'SPORTS_ACTIVITIES', 'MAINTENANCE_INTENSIVE');
    } else if (quizData.activityLevel === 'MEDIUM') {
      contentTags.push('DAILY_MAINTENANCE', 'STANDARD_ADHESIVES');
    } else {
      contentTags.push('GENTLE_CARE', 'BASIC_MAINTENANCE');
    }
    
    // 根据发量类型添加标签
    contentTags.push(`PATTERN_${quizData.hairPattern}`);
    
    // 生成匹配组（用于推荐同类人）
    const matchGroup = `GROUP_${quizData.hairPattern}_${quizData.experienceLevel}`;
    
    // 更新Firestore
    await setDoc(voyagerProfileRef, {
      hairPattern: quizData.hairPattern,
      experienceLevel: quizData.experienceLevel,
      activityLevel: quizData.activityLevel,
      contentTags: contentTags,
      matchGroup: matchGroup,
      quizCompleted: true,
      quizCompletedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('❌ Error updating voyager profile:', error);
    throw new Error('Failed to save quiz data');
  }
}
/**
 * 更新用户基础资料
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    displayName?: string;
    bio?: string;
    photoURL?: string;
  }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData: any = {};
    
    if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;
    
    await setDoc(userRef, updateData, { merge: true });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
}

/**
 * 搜索用户（用于@提及功能）
 */
export async function searchUsers(keyword: string): Promise<{
  userId: string;
  displayName: string;
  photoURL: string;
  galaxyLevel: string;
}[]> {
  try {
    if (!keyword.trim()) return [];
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const results: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.displayName &&
        data.displayName.toLowerCase().includes(keyword.toLowerCase())
      ) {
        results.push({
          userId: doc.id,
          displayName: data.displayName,
          photoURL: data.photoURL || '',
          galaxyLevel: data.galaxyLevel || 'NEBULA'
        });
      }
    });
    
    return results.slice(0, 5); // 最多返回5个结果
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}