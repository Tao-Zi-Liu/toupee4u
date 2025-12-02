import { LucideIcon } from 'lucide-react';

export enum UserTier {
  OBSERVER = 'Observer',
  KINETIC = 'Kinetic Force',
  QUANTUM = 'Quantum State'
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string; // HTML or Markdown string
  readTime: string;
  tier: UserTier;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  physicsTheme: string;
  articles: Article[];
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
}
