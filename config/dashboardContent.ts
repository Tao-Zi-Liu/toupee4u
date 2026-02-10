
// config/dashboardContent.ts
// 根据用户Quiz数据配置个性化Dashboard内容

import { ExperienceLevel, ActivityLevel, HairPattern } from '../types';

export interface DashboardBanner {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  icon: string;
}

export interface RecommendedTopic {
  tag: string;
  label: string;
  color: string;
}

export interface FeaturedArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  tier: string;
}

/* FIX: Added DashboardConfig interface to allow safe property access for specialBanner */
export interface DashboardConfig {
  banner: DashboardBanner;
  featuredArticles: FeaturedArticle[];
  recommendedTopics: RecommendedTopic[];
  communitySpotlight: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
  specialBanner?: DashboardBanner;
}

// 新手用户的Dashboard配置
export const NEWBIE_DASHBOARD = {
  banner: {
    title: "Welcome to the Nebula Phase",
    description: "Start your journey with our comprehensive beginner's guide",
    ctaText: "Read the Essentials",
    ctaLink: "/kb/fundamentals",
    bgGradient: "from-blue-900 to-indigo-900",
    icon: "🌱"
  } as DashboardBanner,
  
  featuredArticles: [
    {
      id: "getting-started",
      title: "New to Hair Systems? Start Here",
      excerpt: "Everything you need to know before your first purchase",
      category: "Fundamentals",
      readTime: "8 min",
      tier: "free"
    },
    {
      id: "measuring-guide",
      title: "How to Measure Your Head Correctly",
      excerpt: "Step-by-step guide with photos and templates",
      category: "Getting Started",
      readTime: "10 min",
      tier: "free"
    },
    {
      id: "first-attachment",
      title: "Your First Attachment: A Complete Walkthrough",
      excerpt: "What to expect and how to prepare for day one",
      category: "Tutorials",
      readTime: "12 min",
      tier: "free"
    }
  ] as FeaturedArticle[],
  
  recommendedTopics: [
    { tag: "newbie-questions", label: "Newbie Questions", color: "blue" },
    { tag: "measuring-help", label: "Measuring Help", color: "green" },
    { tag: "product-recommendations", label: "Product Recommendations", color: "purple" }
  ] as RecommendedTopic[],
  
  communitySpotlight: {
    title: "50 People Started Their Journey This Week",
    description: "Join others at the same stage and share experiences",
    ctaText: "Find Your Community",
    ctaLink: "/forum?filter=newbie"
  }
};

// 老手用户的Dashboard配置
export const VETERAN_DASHBOARD = {
  banner: {
    title: "Explore the Galaxy",
    description: "Advanced techniques and the latest innovations in hair systems",
    ctaText: "View Latest Discussions",
    ctaLink: "/forum?filter=advanced",
    bgGradient: "from-purple-900 to-pink-900",
    icon: "🎯"
  } as DashboardBanner,
  
  featuredArticles: [
    {
      id: "advanced-techniques",
      title: "Bio-Skin vs Lace: Hybrid Construction Analysis",
      excerpt: "Deep dive into mixed-base engineering and ventilation patterns",
      category: "Advanced Techniques",
      readTime: "15 min",
      tier: "kinetic"
    },
    {
      id: "adhesive-comparison",
      title: "2024 Adhesive Performance Study",
      excerpt: "Lab-tested hold times under extreme conditions",
      category: "Technical Reviews",
      readTime: "20 min",
      tier: "kinetic"
    },
    {
      id: "diy-cutting",
      title: "Precision Hairline Customization: Expert Guide",
      excerpt: "Professional cutting techniques you can do at home",
      category: "DIY Mastery",
      readTime: "18 min",
      tier: "quantum"
    }
  ] as FeaturedArticle[],
  
  recommendedTopics: [
    { tag: "adhesive-testing", label: "Adhesive Testing", color: "red" },
    { tag: "diy-cutting", label: "DIY Cutting", color: "orange" },
    { tag: "new-products", label: "New Products", color: "cyan" }
  ] as RecommendedTopic[],
  
  communitySpotlight: {
    title: "This Week's Expert Challenge",
    description: "Share your hairline detail shots and win a Nova badge",
    ctaText: "Join the Challenge",
    ctaLink: "/forum/challenges/hairline-detail"
  }
};

// 高强度运动用户的额外推荐
export const HIGH_ACTIVITY_ADDITIONS = {
  specialBanner: {
    title: "⚡ Athletic Performance Pack",
    description: "Because you chose high-intensity activities, we recommend waterproof adhesives",
    ctaText: "Browse Sweat-Proof Options",
    ctaLink: "/kb/materials?filter=sweat-proof",
    bgGradient: "from-green-900 to-teal-900",
    icon: "🏋️"
  } as DashboardBanner,
  
  additionalTopics: [
    { tag: "sports-approved", label: "Sports Approved", color: "green" },
    { tag: "swimming-tips", label: "Swimming Tips", color: "blue" }
  ] as RecommendedTopic[]
};

// 根据用户Profile获取Dashboard配置
/* FIX: Explicitly typed return value as DashboardConfig to resolve property access errors */
export function getDashboardConfig(
  experienceLevel: ExperienceLevel,
  activityLevel: ActivityLevel
): DashboardConfig {
  const baseConfig = experienceLevel === 'NEWBIE' ? NEWBIE_DASHBOARD : VETERAN_DASHBOARD;
  
  // 如果是高强度运动用户，添加特殊推荐
  if (activityLevel === 'HIGH') {
    return {
      ...baseConfig,
      specialBanner: HIGH_ACTIVITY_ADDITIONS.specialBanner,
      recommendedTopics: [
        ...baseConfig.recommendedTopics,
        ...HIGH_ACTIVITY_ADDITIONS.additionalTopics
      ]
    };
  }
  
  return baseConfig;
}
