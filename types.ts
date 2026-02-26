
import { LucideIcon } from 'lucide-react';

export enum UserTier {
  NEBULA = 'Nebula',
  NOVA = 'Nova',
  GALAXY = 'Galaxy',
  SUPERNOVA = 'Supernova'
}

export interface Article {
  id: string;
  title: string;
  content: string; // HTML or Markdown string
  readTime: string;
  tier: UserTier;
  category?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string; // Display name of parent category
  description: string; // The "Overview" content (previously the article content)
  readTime: string; // Aggregate read time
  tier: UserTier;
  articles: Article[]; // The new 3rd level
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  physicsTheme: string;
  topics: Topic[]; // Renamed from articles to topics
}

export interface Consultation {
  id: string;
  title: string;
  targetAudience: string;
  price: number;
  duration: string;
  description: string;
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  image: string;
  specialties: string[];
  bio: string;
  methodology: string;
  stats: {
    experience: string;
    consultations: number;
    rating: number;
  };
  availability: 'Available' | 'Booked Until Nov';
  colorTheme: string; // tailwind color class prefix (e.g., 'blue', 'purple')
  socials?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'Materials' | 'Anatomy' | 'Adhesives' | 'Maintenance' | 'Styling' | 'Chemistry';
}
// ============================================
// 用户系统：角色、等级、Profile
// ============================================

// 用户角色（三大轨道）
export type UserRole = 'VOYAGER' | 'ARCHITECT' | 'SOURCE';

export const USER_ROLES = {
  VOYAGER: 'VOYAGER',    // 探索者（C端用户/脱发者）
  ARCHITECT: 'ARCHITECT', // 架构师（发型师/门店）
  SOURCE: 'SOURCE'        // 源点（供应商/专家）
} as const;

// 星系等级（社区地位）- 重命名为 GalaxyLevel 避免与 UserTier 冲突
export type GalaxyLevel = 'NEBULA' | 'NOVA' | 'GALAXY' | 'SUPERNOVA';

export const GALAXY_LEVELS = {
  NEBULA: 'NEBULA',         // L1 新生状态
  NOVA: 'NOVA',             // L2 活跃状态
  GALAXY: 'GALAXY',         // L3 核心状态
  SUPERNOVA: 'SUPERNOVA'    // L4 传说状态
} as const;

// 付费会员等级（内容访问权限）- 与 UserTier 保持一致
export type MembershipTier = 'free' | 'nova' | 'galaxy' | 'supernova';

// Voyager相关类型
export type HairPattern = 
  | 'FRONTAL_RECEDING'  // 前端发际线后移
  | 'VERTEX'            // 头顶O型稀疏
  | 'FULL'              // 全秃
  | 'DIFFUSE';          // 弥漫性稀疏

export type ExperienceLevel = 'NEWBIE' | 'VETERAN';

export type ActivityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// Architect相关类型
export type ArchitectSkill = 
  | 'CUT_IN'        // 修剪
  | 'CUSTOM'        // 定制
  | 'MAINTENANCE'   // 清洗护理
  | 'COLORING';     // 染发

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

// ============================================
// 用户数据结构
// ============================================

// 主用户接口
export interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  
  // 角色与等级
  role: UserRole;
  galaxyLevel: GalaxyLevel;  // 社区等级
  xp: number;                // 经验值
  
  // 付费会员（内容访问权限）
  membershipTier: MembershipTier;
  
  // 时间戳
  createdAt: any;
  lastLoginAt?: any;
  // Added bio property to User interface
  bio?: string;
}

// Voyager扩展Profile
export interface VoyagerProfile {
  userId: string;
  
  // Quiz收集的数据
  hairPattern?: HairPattern;
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
  
  // 系统生成的标签
  contentTags: string[];
  
  // 用于推荐"同类人"
  matchGroup?: string;
  
  // Quiz完成状态
  quizCompleted: boolean;
  quizCompletedAt?: any;
}

// Architect扩展Profile
export interface ArchitectProfile {
  userId: string;
  
  businessName: string;
  
  location: {
    city: string;
    country: string;
    coordinates?: [number, number]; // [lat, lng]
  };
  
  skills: ArchitectSkill[];
  
  // 认证状态
  verificationStatus: VerificationStatus;
  licenseDocUrl?: string;
  
  // 业务信息
  bio?: string;
  portfolio?: string[]; // 作品集图片URLs
  
  verifiedAt?: any;
}

// Source扩展Profile
export interface SourceProfile {
  userId: string;
  
  companyName: string;
  website?: string;
  
  location: {
    city: string;
    country: string;
  };
  
  // 供应商类型
  supplierType: 'MANUFACTURER' | 'DISTRIBUTOR' | 'EXPERT';
  
  // 认证状态
  verificationStatus: VerificationStatus;
  businessLicenseUrl?: string;
  
  verifiedAt?: any;
}

// 完整的用户数据（联合查询后的结果）
export interface CompleteUserProfile extends User {
  voyagerProfile?: VoyagerProfile;
  architectProfile?: ArchitectProfile;
  sourceProfile?: SourceProfile;
}
// ============================================
// 积分系统（XP System）
// ============================================

// 积分行为类型
export type XPActionType =
  | 'DAILY_CHECKIN'       // 每日签到 +2
  | 'VIEW_POST'           // 浏览帖子 +1（每篇上限1次，每日上限5）
  | 'LIKE_POST'           // 点赞帖子 +2（每日上限10）
  | 'COMMENT'             // 评论/回复 +8
  | 'READ_KB_ARTICLE'     // 阅读KB文章 +10
  | 'RECEIVED_LIKE'       // 被他人点赞 +5
  | 'CREATE_POST';        // 发帖消耗 -5

// 各行为对应的XP值
export const XP_RULES: Record<XPActionType, number> = {
  DAILY_CHECKIN: 2,
  VIEW_POST: 1,
  LIKE_POST: 2,
  COMMENT: 8,
  READ_KB_ARTICLE: 10,
  RECEIVED_LIKE: 5,
  CREATE_POST: -5,
};

// 每日XP上限
export const XP_DAILY_LIMITS: Partial<Record<XPActionType, number>> = {
  VIEW_POST: 5,
  LIKE_POST: 10,
};

// 发帖所需最低XP门槛
export const XP_POST_THRESHOLD = 100;

// 积分兑换折扣门槛
export const XP_DISCOUNT_THRESHOLDS = {
  NOVA_HALF_PRICE: 500,
  GALAXY_HALF_PRICE: 2000,
};

// 积分冻结天数
export const XP_FREEZE_DAYS = 180;

// 签到连续无互动天数上限
export const XP_ZOMBIE_CHECKIN_DAYS = 3;

// 单条XP记录
export interface XPRecord {
  id?: string;
  userId: string;
  action: XPActionType;
  delta: number;
  targetId?: string;
  createdAt: any;
}

// 用户XP状态
export interface UserXPStats {
  userId: string;
  totalXp: number;
  availableXp: number;
  lastCheckinDate?: string;
  consecutiveCheckinDays: number;
  lastInteractionDate?: string;
  dailyXpLog: {
    date: string;
    VIEW_POST?: number;
    LIKE_POST?: number;
  };
  isFrozen: boolean;
  lastActiveDate?: string;
  canPost: boolean;
  discountUsed?: {
    NOVA_HALF_PRICE?: boolean;
    GALAXY_HALF_PRICE?: boolean;
  };
  updatedAt: any;
}
