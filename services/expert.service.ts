// services/expert.service.ts
import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  ExpertApplication, ExpertApplicationStatus,
  ExpertProfile, ExpertDraft, ExpertDraftStatus
} from '../types';

const APPLICATIONS_COL = 'expertApplications';
const EXPERT_PROFILES_COL = 'expertProfiles';

// ── 申请 ──────────────────────────────────────

/** 提交或更新第一步申请 */
export async function submitExpertApplicationStep1(
  userId: string,
  data: Omit<ExpertApplication, 'id' | 'userId' | 'portfolioImages' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  // 检查是否已有申请
  const existing = await getMyApplication(userId);
  
  if (existing?.id) {
    await updateDoc(doc(db, APPLICATIONS_COL, existing.id), {
      ...data,
      status: 'STEP1' as ExpertApplicationStatus,
      updatedAt: serverTimestamp(),
    });
    return existing.id;
  }

  const ref = await addDoc(collection(db, APPLICATIONS_COL), {
    userId,
    ...data,
    portfolioImages: [],
    status: 'STEP1' as ExpertApplicationStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** 提交第二步作品集 */
export async function submitExpertApplicationStep2(
  applicationId: string,
  portfolioImages: string[],
  sampleArticleTitle?: string,
  sampleArticleContent?: string,
): Promise<void> {
  await updateDoc(doc(db, APPLICATIONS_COL, applicationId), {
    portfolioImages,
    sampleArticleTitle: sampleArticleTitle ?? '',
    sampleArticleContent: sampleArticleContent ?? '',
    status: 'REVIEWING' as ExpertApplicationStatus,
    updatedAt: serverTimestamp(),
  });
}

/** 获取当前用户的申请 */
export async function getMyApplication(userId: string): Promise<ExpertApplication | null> {
  const q = query(
    collection(db, APPLICATIONS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as ExpertApplication;
}

// ── 管理员操作 ────────────────────────────────

/** 获取所有申请（管理员） */
export async function getAllApplications(
  status?: ExpertApplicationStatus
): Promise<ExpertApplication[]> {
  let q;
  if (status) {
    q = query(
      collection(db, APPLICATIONS_COL),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, APPLICATIONS_COL), orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExpertApplication));
}

/** 第一步审核通过 → 进入第二步 */
export async function approveStep1(applicationId: string): Promise<void> {
  await updateDoc(doc(db, APPLICATIONS_COL, applicationId), {
    status: 'STEP2' as ExpertApplicationStatus,
    updatedAt: serverTimestamp(),
  });
}

/** 最终审核通过 → 创建 ExpertProfile + 更新 user.isExpert */
export async function approveExpert(
  applicationId: string,
  consultationPrice: number,
): Promise<void> {
  const appDoc = await getDoc(doc(db, APPLICATIONS_COL, applicationId));
  if (!appDoc.exists()) throw new Error('Application not found');
  const app = appDoc.data() as ExpertApplication;

  // 创建 ExpertProfile
  const profile: Omit<ExpertProfile, 'userId'> = {
    displayName: app.displayName,
    photoURL: '',
    expertType: app.expertType,
    yearsOfExperience: app.yearsOfExperience,
    serviceCity: app.serviceCity,
    serviceCountry: app.serviceCountry,
    specialties: app.specialties,
    bio: app.bio,
    credentials: app.credentials,
    portfolioImages: app.portfolioImages,
    consultationModes: app.consultationModes,
    consultationEnabled: false,
    consultationPrice,
    publishedArticleCount: 0,
    totalConsultations: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, EXPERT_PROFILES_COL, app.userId), profile);

  // 更新用户 isExpert 标志
  await updateDoc(doc(db, 'users', app.userId), {
    isExpert: true,
    updatedAt: serverTimestamp(),
  });

  // 更新申请状态
  await updateDoc(doc(db, APPLICATIONS_COL, applicationId), {
    status: 'APPROVED' as ExpertApplicationStatus,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** 拒绝申请 */
export async function rejectApplication(
  applicationId: string,
  reason: string,
): Promise<void> {
  await updateDoc(doc(db, APPLICATIONS_COL, applicationId), {
    status: 'REJECTED' as ExpertApplicationStatus,
    rejectionReason: reason,
    updatedAt: serverTimestamp(),
  });
}

// ── 专家主页 ──────────────────────────────────

/** 获取专家公开 Profile */
export async function getExpertProfile(userId: string): Promise<ExpertProfile | null> {
  const snap = await getDoc(doc(db, EXPERT_PROFILES_COL, userId));
  if (!snap.exists()) return null;
  return { userId: snap.id, ...snap.data() } as ExpertProfile;
}

/** 获取所有活跃专家（用于专家列表页） */
export async function getAllExperts(): Promise<ExpertProfile[]> {
  const q = query(
    collection(db, EXPERT_PROFILES_COL),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ userId: d.id, ...d.data() } as ExpertProfile));
}

// ── 专家工作台 ────────────────────────────────

export async function updateExpertProfile(
  userId: string,
  updates: Partial<Pick<ExpertProfile, 'consultationEnabled' | 'bio' | 'credentials' | 'consultationModes'>>
): Promise<void> {
  await updateDoc(doc(db, EXPERT_PROFILES_COL, userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getExpertDrafts(userId: string): Promise<ExpertDraft[]> {
  const q = query(
    collection(db, 'expertDrafts'),
    where('authorId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExpertDraft));
}

export async function saveExpertDraft(
  userId: string,
  draft: Omit<ExpertDraft, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>,
  draftId?: string
): Promise<string> {
  if (draftId) {
    await updateDoc(doc(db, 'expertDrafts', draftId), {
      ...draft,
      updatedAt: serverTimestamp(),
    });
    return draftId;
  }
  const ref = await addDoc(collection(db, 'expertDrafts'), {
    ...draft,
    authorId: userId,
    status: 'DRAFT' as ExpertDraftStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function submitDraftForReview(draftId: string): Promise<void> {
  await updateDoc(doc(db, 'expertDrafts', draftId), {
    status: 'PENDING_REVIEW' as ExpertDraftStatus,
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteExpertDraft(draftId: string): Promise<void> {
  await deleteDoc(doc(db, 'expertDrafts', draftId));
}