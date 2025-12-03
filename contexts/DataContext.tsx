import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EXPERTS, KB_CATEGORIES, CONSULTATIONS } from '../constants';
import { Expert, Category, Consultation, Article } from '../types';

interface DataContextType {
  experts: Expert[];
  categories: Category[];
  consultations: Consultation[];
  addExpert: (expert: Expert) => void;
  deleteExpert: (id: string) => void;
  updateExpert: (id: string, updates: Partial<Expert>) => void;
  addArticle: (categoryId: string, article: Article) => void;
  updateArticle: (categoryId: string, articleId: string, updates: Partial<Article>) => void;
  deleteArticle: (categoryId: string, articleId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with the constants
  const [experts, setExperts] = useState<Expert[]>(EXPERTS);
  const [categories, setCategories] = useState<Category[]>(KB_CATEGORIES);
  const [consultations, setConsultations] = useState<Consultation[]>(CONSULTATIONS);

  const addExpert = (expert: Expert) => {
    setExperts([...experts, expert]);
  };

  const deleteExpert = (id: string) => {
    setExperts(experts.filter(e => e.id !== id));
  };

  const updateExpert = (id: string, updates: Partial<Expert>) => {
    setExperts(experts.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const addArticle = (categoryId: string, article: Article) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, articles: [...cat.articles, article] };
      }
      return cat;
    }));
  };

  const updateArticle = (categoryId: string, articleId: string, updates: Partial<Article>) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          articles: cat.articles.map(art => 
            art.id === articleId ? { ...art, ...updates } : art
          )
        };
      }
      return cat;
    }));
  };

  const deleteArticle = (categoryId: string, articleId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          articles: cat.articles.filter(art => art.id !== articleId)
        };
      }
      return cat;
    }));
  };

  return (
    <DataContext.Provider value={{ 
      experts, 
      categories, 
      consultations,
      addExpert,
      deleteExpert,
      updateExpert,
      addArticle,
      updateArticle,
      deleteArticle
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};