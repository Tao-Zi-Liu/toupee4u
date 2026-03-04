
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
  COMMENT: 40,  // 每天最多5条评论得XP（5 × 8 = 40）
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

// 排行榜条目
export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL: string;
  galaxyLevel: string;
  xp: number;
  rank: number;
}

// ============================================
// 专家系统（Expert System）
// ============================================

// 专家从业类型
export type ExpertType = 
  | 'SALON_OWNER'        // 沙龙店主
  | 'STYLIST'            // 发型师
  | 'MANUFACTURER_REP'   // 厂商代表
  | 'DISTRIBUTOR'        // 经销商
  | 'INDEPENDENT';       // 独立从业者

export const EXPERT_TYPE_LABELS: Record<ExpertType, string> = {
  SALON_OWNER: 'Salon Owner',
  STYLIST: 'Hair Stylist',
  MANUFACTURER_REP: 'Manufacturer Rep',
  DISTRIBUTOR: 'Distributor',
  INDEPENDENT: 'Independent Professional',
};

// 专家擅长领域
export type ExpertSpecialty =
  | 'LACE_SYSTEMS'       // 蕾丝发系
  | 'POLY_SKIN'          // 仿皮发系
  | 'MONO_BASE'          // 单丝底
  | 'ADHESIVES'          // 粘合剂
  | 'MAINTENANCE'        // 日常维护
  | 'COLORING'           // 染色
  | 'CUSTOM_CUTTING'     // 定制修剪
  | 'SCALP_CARE'         // 头皮护理
  | 'INJECTION_TYING';   // 注射结/手工编织

export const EXPERT_SPECIALTY_LABELS: Record<ExpertSpecialty, string> = {
  LACE_SYSTEMS: 'Lace Systems',
  POLY_SKIN: 'Poly Skin Systems',
  MONO_BASE: 'Mono Base',
  ADHESIVES: 'Adhesives & Bonding',
  MAINTENANCE: 'Maintenance & Care',
  COLORING: 'Coloring & Dyeing',
  CUSTOM_CUTTING: 'Custom Cutting',
  SCALP_CARE: 'Scalp Care',
  INJECTION_TYING: 'Injection / Hand-tied',
};

// 咨询方式
export type ConsultationMode =
  | 'VIDEO'    // 视频通话
  | 'VOICE'    // 语音通话
  | 'TEXT'     // 站内文字
  | 'IN_PERSON'; // 线下到店

// 专家申请状态
export type ExpertApplicationStatus = 
  | 'DRAFT'       // 用户保存草稿（第一步完成未提交）
  | 'STEP1'       // 第一步已提交，等待审核
  | 'STEP2'       // 第一步通过，等待提交作品
  | 'REVIEWING'   // 作品审核中
  | 'APPROVED'    // 已通过
  | 'REJECTED';   // 已拒绝

// 专家申请记录
export interface ExpertApplication {
  id?: string;
  userId: string;
  displayName: string;
  email: string;
  
  // 第一步：基本信息
  expertType: ExpertType;
  yearsOfExperience: number;
  serviceCity: string;
  serviceCountry: string;
  specialties: ExpertSpecialty[];
  bio: string;                  // 个人简介
  credentials: string;          // 资质证书描述
  consultationModes: ConsultationMode[];
  
  // 第二步：作品集
  portfolioImages: string[];    // 图片URLs
  sampleArticleTitle?: string;  // 示范文章标题
  sampleArticleContent?: string; // 示范文章内容
  
  // 审核
  status: ExpertApplicationStatus;
  adminNote?: string;           // 管理员备注
  rejectionReason?: string;
  
  createdAt: any;
  updatedAt: any;
  approvedAt?: any;
}

// 专家公开主页 Profile（审核通过后创建）
export interface ExpertProfile {
  userId: string;
  displayName: string;
  photoURL: string;
  
  // 从业信息
  expertType: ExpertType;
  yearsOfExperience: number;
  serviceCity: string;
  serviceCountry: string;
  specialties: ExpertSpecialty[];
  bio: string;
  credentials: string;
  
  // 作品集
  portfolioImages: string[];
  
  // 咨询设置
  consultationModes: ConsultationMode[];
  consultationEnabled: boolean;  // 是否开放预约
  consultationPrice?: number;    // 站长统一设定
  
  // 统计
  publishedArticleCount: number;
  totalConsultations: number;
  
  // 状态
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}
// ── 专家投稿草稿 ──────────────────────────────
export type ExpertDraftStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';

export interface ExpertDraft {
  id?: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  status: ExpertDraftStatus;
  adminNote?: string;
  createdAt: any;
  updatedAt: any;
  submittedAt?: any;
  publishedAt?: any;
}
// ============================================
// 新闻资讯系统（News System）
// ============================================

export type NewsStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED';

export type NewsCategory =
  | 'Market Trends'
  | 'Technology'
  | 'Products'
  | 'Industry'
  | 'Research';

// 营销风险标记
export interface MarketingFlag {
  type: 'BRAND_PR' | 'PROMOTIONAL' | 'SOFT_AD' | 'CONFLICT_OF_INTEREST';
  reason: string;  // 具体原因说明
}

// 编辑评论
export interface EditorialNote {
  standpoint: string;   // 来源立场/背景
  significance: string; // 值得关注的原因
  caution?: string;     // 需要保持怀疑的地方
}

// 新闻资讯简报
export interface NewsArticle {
  id?: string;

  // 内容
  title: string;
  summary: string;          // AI 精简后的摘要（3-4句）
  editorialNote: EditorialNote;  // 编辑评论
  category: NewsCategory;
  tags: string[];

  // 来源
  sourceUrl: string;
  sourceName: string;       // 出版物名称
  sourceDate?: string;      // 原文发布日期 YYYY-MM-DD
  urlVerified: boolean;     // 链接是否已验证可访问
  urlVerifiedAt?: any;

  // 营销过滤
  marketingFlags: MarketingFlag[];   // 检测到的营销风险
  isClean: boolean;                  // true = 无营销内容

  // 生成信息
  generatedDate: string;    // YYYY-MM-DD
  generatedBy: 'AI_GEMINI' | 'AI_GEMINI_MANUAL';

  // 审核
  status: NewsStatus;
  adminNote?: string;       // 审核备注

  // 时间戳
  createdAt: any;
  publishedAt?: any;
}
