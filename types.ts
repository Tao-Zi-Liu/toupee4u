
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
