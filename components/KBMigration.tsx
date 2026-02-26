import React, { useState } from 'react';
import { db } from '../firebase.config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// 直接内联静态数据，避免依赖问题
const STATIC_CATEGORIES = [
  {
    id: 'foundations',
    name: 'Fundamentals',
    description: 'Core concepts of non-surgical hair replacement.',
    physicsTheme: 'System Mechanics',
    iconName: 'Layers',
    order: 1,
    topics: [
      {
        id: 'cap-construction',
        title: 'Cap Construction & Base Types',
        category: 'Fundamentals',
        readTime: '15 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>The Physics of Immersion vs. Cost</h3><p>Understanding the architecture of a hair system is crucial for balancing realism with budget. This module covers the three primary base materials: Lace, Monofilament, and Skin.</p>',
        articles: [
          {
            id: 'lace-mechanics',
            title: 'Lace Mechanics: Swiss vs. French',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: '<p>Detailed comparison of lace denier and durability.</p>'
          },
          {
            id: 'poly-thickness',
            title: 'Poly Skin Thickness Guide',
            tier: 'NOVA',
            readTime: '7 min',
            order: 2,
            content: '<p>How thickness (0.03mm vs 0.08mm) affects invisibility and lifespan.</p>'
          }
        ]
      },
      {
        id: 'sizing-fit',
        title: 'Sizing, Fit, and Security',
        category: 'Fundamentals',
        readTime: '12 min',
        tier: 'NOVA',
        order: 2,
        description: '<h3>The Geometry of Cranial Surface Area</h3><p>A secure bond starts with precise topography. A gap of just 2mm can lead to adhesive failure due to sweat accumulation.</p>',
        articles: [
          {
            id: 'template-creation',
            title: 'Creating a Custom Template',
            tier: 'NOVA',
            readTime: '8 min',
            order: 1,
            content: '<p>Step-by-step guide to using saran wrap and tape for a mold.</p>'
          },
          {
            id: 'measurement-guide',
            title: 'Standard Measurement Protocol',
            tier: 'NEBULA',
            readTime: '4 min',
            order: 2,
            content: '<p>How to measure front-to-back and ear-to-ear correctly.</p>'
          }
        ]
      }
    ]
  },
  {
    id: 'base-fiber',
    name: 'Materials',
    description: 'Detailed material science of hair fibers.',
    physicsTheme: 'Material Science',
    iconName: 'Microscope',
    order: 2,
    topics: [
      {
        id: 'human-vs-synthetic',
        title: 'Human Hair vs. Synthetic',
        category: 'Materials',
        readTime: '20 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>Organic vs. Engineered Polymers</h3><p>A detailed, side-by-side comparison of the look, feel, cost, and maintenance requirements of the two major fiber types.</p>',
        articles: [
          {
            id: 'human-hair-biology',
            title: 'The Biology of Human Hair',
            tier: 'NEBULA',
            readTime: '6 min',
            order: 1,
            content: '<h3>The Cuticle Structure</h3><p>Human hair is defined by its overlapping cuticle layers...</p>'
          },
          {
            id: 'synthetic-polymers',
            title: 'Synthetic Fiber Engineering',
            tier: 'NOVA',
            readTime: '8 min',
            order: 2,
            content: '<h3>Kanekalon & Cyberhair</h3><p>Modern synthetics are engineered polymers...</p>'
          }
        ]
      },
      {
        id: 'color-theory',
        title: 'Color Theory: Oxidation & Codes',
        category: 'Materials',
        readTime: '15 min',
        tier: 'GALAXY',
        order: 2,
        description: '<h3>The Red Undertone Phenomenon</h3><p>All human hair systems oxidize (turn red/orange) over time due to UV exposure.</p>',
        articles: [
          {
            id: 'color-codes',
            title: 'Decoding Industry Color Codes',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: '<p>Standard industry charts explained.</p>'
          },
          {
            id: 'oxidation-correction',
            title: 'Correcting Oxidation (Red Tones)',
            tier: 'GALAXY',
            readTime: '10 min',
            order: 2,
            content: '<p>Practical guide on neutralizing unwanted red and orange brassy tones using scientific color theory.</p>'
          }
        ]
      }
    ]
  }
];

export const KBMigration: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const runMigration = async () => {
    setStatus('running');
    setLog([]);

    try {
      for (const category of STATIC_CATEGORIES) {
        const { topics, ...categoryData } = category;

        // 写入分类
        await setDoc(doc(db, 'kb_categories', category.id), {
          ...categoryData,
          createdAt: serverTimestamp()
        });
        addLog(`✅ Category: ${category.name}`);

        for (const topic of topics) {
          const { articles, ...topicData } = topic;

          // 写入主题
          await setDoc(
            doc(db, 'kb_categories', category.id, 'kb_topics', topic.id),
            { ...topicData, createdAt: serverTimestamp() }
          );
          addLog(`  ✅ Topic: ${topic.title}`);

          for (const article of articles) {
            // 写入文章
            await setDoc(
              doc(db, 'kb_categories', category.id, 'kb_topics', topic.id, 'kb_articles', article.id),
              { ...article, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
            );
            addLog(`    ✅ Article: ${article.title}`);
          }
        }
      }

      addLog('');
      addLog('🎉 Migration complete!');
      setStatus('done');
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
        <h2 className="text-xl font-bold text-white mb-2">KB Data Migration</h2>
        <p className="text-slate-400 text-sm mb-6">
          This will migrate static KB data to Firestore. Run once only.
        </p>

        <button
          onClick={runMigration}
          disabled={status === 'running' || status === 'done'}
          className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'idle' && 'Run Migration'}
          {status === 'running' && 'Migrating...'}
          {status === 'done' && '✅ Done!'}
          {status === 'error' && 'Retry'}
        </button>

        {log.length > 0 && (
          <div className="mt-6 bg-dark-900 rounded-xl p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i} className={line.includes('❌') ? 'text-red-400' : line.includes('🎉') ? 'text-green-400' : 'text-slate-300'}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};