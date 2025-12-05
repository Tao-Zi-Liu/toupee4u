import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EXPERTS, KB_CATEGORIES, CONSULTATIONS } from '../constants';
import { Expert, Category, Consultation, Article, Topic } from '../types';

interface DataContextType {
  experts: Expert[];
  categories: Category[];
  consultations: Consultation[];
  addExpert: (expert: Expert) => void;
  deleteExpert: (id: string) => void;
  updateExpert: (id: string, updates: Partial<Expert>) => void;
  addTopic: (categoryId: string, topic: Topic) => void;
  updateTopic: (categoryId: string, topicId: string, updates: Partial<Topic>) => void;
  deleteTopic: (categoryId: string, topicId: string) => void;
  addArticle: (categoryId: string, topicId: string, article: Article) => void;
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

  const addTopic = (categoryId: string, topic: Topic) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, topics: [...cat.topics, topic] };
      }
      return cat;
    }));
  };

  const updateTopic = (categoryId: string, topicId: string, updates: Partial<Topic>) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          topics: cat.topics.map(t => 
            t.id === topicId ? { ...t, ...updates } : t
          )
        };
      }
      return cat;
    }));
  };

  const deleteTopic = (categoryId: string, topicId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          topics: cat.topics.filter(t => t.id !== topicId)
        };
      }
      return cat;
    }));
  };

  const addArticle = (categoryId: string, topicId: string, article: Article) => {
      setCategories(categories.map(cat => {
          if (cat.id === categoryId) {
              return {
                  ...cat,
                  topics: cat.topics.map(topic => {
                      if (topic.id === topicId) {
                          return { ...topic, articles: [...topic.articles, article] };
                      }
                      return topic;
                  })
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
      addTopic,
      updateTopic,
      deleteTopic,
      addArticle
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
