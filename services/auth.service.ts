// services/auth.service.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
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

// ── Providers ─────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── 创建用户 Firestore 档案（内部复用）────────
async function createUserProfile(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  role: UserRole = 'VOYAGER'
): Promise<User> {
  const user: User = {
    userId: uid,
    email,
    displayName,
    photoURL: photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    role,
    galaxyLevel: 'NEBULA',
    xp: 0,
    membershipTier: 'free',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', uid), user);

  if (role === 'VOYAGER') {
    await setDoc(doc(db, 'voyagerProfiles', uid), {
      userId: uid,
      contentTags: [],
      quizCompleted: false,
    });
  } else if (role === 'ARCHITECT') {
    await setDoc(doc(db, 'architectProfiles', uid), {
      userId: uid,
      businessName: '',
      location: { city: '', country: '' },
      skills: [],
      verificationStatus: 'PENDING',
    });
  }

  await initUserXPStats(uid);
  return user;
}

// ── 邮箱+密码注册 ─────────────────────────────
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'VOYAGER'
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // 发送验证邮件
    await sendEmailVerification(firebaseUser, {
      url: `${window.location.origin}/login?verified=true`,
    });

    const user = await createUserProfile(
      firebaseUser.uid, email, displayName,
      firebaseUser.photoURL || '', role
    );

    return user;
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
}

// ── Google 登录 ───────────────────────────────
export async function loginWithGoogle(): Promise<CompleteUserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // 检查是否已有档案
    const existing = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!existing.exists()) {
      // 首次 Google 登录，创建档案
      await createUserProfile(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || 'New Voyager',
        firebaseUser.photoURL || '',
      );
    } else {
      // 更新最后登录时间
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        lastLoginAt: serverTimestamp(),
        photoURL: firebaseUser.photoURL || existing.data().photoURL,
      }, { merge: true });
    }

    const profile = await getCompleteUserProfile(firebaseUser.uid);
    if (!profile) throw new Error('Failed to load user profile');
    return profile;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') throw new Error('Sign-in cancelled');
    throw new Error(getErrorMessage(error.code));
  }
}

// ── 邮箱+密码登录 ─────────────────────────────
export async function loginUser(
  email: string,
  password: string
): Promise<CompleteUserProfile> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // 检查邮箱验证状态
    if (!firebaseUser.emailVerified) {
      await signOut(auth);
      throw new Error('EMAIL_NOT_VERIFIED');
    }

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      lastLoginAt: serverTimestamp()
    }, { merge: true });

    const profile = await getCompleteUserProfile(firebaseUser.uid);
    if (!profile) throw new Error('User profile not found');
    return profile;
  } catch (error: any) {
    if (error.message === 'EMAIL_NOT_VERIFIED') throw error;
    throw new Error(getErrorMessage(error.code));
  }
}

// ── 重发验证邮件 ──────────────────────────────
export async function resendVerificationEmail(email: string, password: string): Promise<void> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user, {
      url: `${window.location.origin}/login?verified=true`,
    });
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
}

// ── 忘记密码 ──────────────────────────────────
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
    });
  } catch (error: any) {
    throw new Error(getErrorMessage(error.code));
  }
}

// ── 登出 ──────────────────────────────────────
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to log out');
  }
}

// ── Profile 读取 ──────────────────────────────
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() as User : null;
  } catch {
    return null;
  }
}

export async function getCompleteUserProfile(uid: string): Promise<CompleteUserProfile | null> {
  try {
    const user = await getUserProfile(uid);
    if (!user) return null;

    const complete: CompleteUserProfile = { ...user };

    if (user.role === 'VOYAGER') {
      const snap = await getDoc(doc(db, 'voyagerProfiles', uid));
      if (snap.exists()) complete.voyagerProfile = snap.data() as VoyagerProfile;
    } else if (user.role === 'ARCHITECT') {
      const snap = await getDoc(doc(db, 'architectProfiles', uid));
      if (snap.exists()) complete.architectProfile = snap.data() as ArchitectProfile;
    }

    return complete;
  } catch {
    return null;
  }
}

// ── Auth 监听 ─────────────────────────────────
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

// ── 错误消息 ──────────────────────────────────
function getErrorMessage(errorCode: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use':    'This email is already registered',
    'auth/invalid-email':           'Invalid email address',
    'auth/weak-password':           'Password must be at least 6 characters',
    'auth/user-not-found':          'No account found with this email',
    'auth/wrong-password':          'Incorrect password',
    'auth/invalid-credential':      'Incorrect email or password',
    'auth/too-many-requests':       'Too many attempts. Please try again later',
    'auth/network-request-failed':  'Network error. Please check your connection',
    'auth/popup-blocked':           'Popup was blocked. Please allow popups for this site',
    'auth/account-exists-with-different-credential': 'An account already exists with this email',
  };
  return messages[errorCode] || 'An error occurred. Please try again';
}

// ── 以下保持原有函数不变 ──────────────────────
export async function updateVoyagerProfile(
  userId: string,
  quizData: {
    hairPattern: HairPattern;
    experienceLevel: ExperienceLevel;
    activityLevel: ActivityLevel;
  }
): Promise<void> {
  const contentTags: string[] = [];
  if (quizData.experienceLevel === 'NEWBIE') {
    contentTags.push('WIKI_BASICS', 'GETTING_STARTED', 'TUTORIALS');
  } else {
    contentTags.push('ADVANCED_TECHNIQUES', 'EXPERT_TIPS', 'COMMUNITY_DISCUSSIONS');
  }
  if (quizData.activityLevel === 'HIGH') {
    contentTags.push('ADHESIVES_SWEAT_PROOF', 'SPORTS_ACTIVITIES', 'MAINTENANCE_INTENSIVE');
  } else if (quizData.activityLevel === 'MEDIUM') {
    contentTags.push('DAILY_MAINTENANCE', 'STANDARD_ADHESIVES');
  } else {
    contentTags.push('GENTLE_CARE', 'BASIC_MAINTENANCE');
  }
  contentTags.push(`PATTERN_${quizData.hairPattern}`);
  const matchGroup = `GROUP_${quizData.hairPattern}_${quizData.experienceLevel}`;
  await setDoc(doc(db, 'voyagerProfiles', userId), {
    ...quizData,
    contentTags,
    matchGroup,
    quizCompleted: true,
    quizCompletedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateUserProfile(
  userId: string,
  updates: { displayName?: string; bio?: string; photoURL?: string }
): Promise<void> {
  const updateData: any = {};
  if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.photoURL !== undefined) updateData.photoURL = updates.photoURL;
  await setDoc(doc(db, 'users', userId), updateData, { merge: true });
}

export async function searchUsers(keyword: string): Promise<{
  userId: string; displayName: string; photoURL: string; galaxyLevel: string;
}[]> {
  if (!keyword.trim()) return [];
  const snapshot = await getDocs(collection(db, 'users'));
  const results: any[] = [];
  snapshot.forEach(d => {
    const data = d.data();
    if (data.displayName?.toLowerCase().includes(keyword.toLowerCase())) {
      results.push({ userId: d.id, displayName: data.displayName, photoURL: data.photoURL || '', galaxyLevel: data.galaxyLevel || 'NEBULA' });
    }
  });
  return results.slice(0, 5);
}
