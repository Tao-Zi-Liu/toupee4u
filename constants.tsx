
import { UserTier, Category, Consultation, Expert, GlossaryTerm } from './types';
import { BookOpen, Layers, Zap, PenTool, Activity } from 'lucide-react';
import { ShieldCheck, Microscope, Droplet, BookA } from 'lucide-react';

export const EXPERTS: Expert[] = [
  {
    id: 'aris-chronis',
    name: "Dr. Aris Chronis",
    role: "Chemical Engineer",
    image: "https://placehold.co/400x400/334155/FFF?text=AC",
    specialties: ["Adhesive Chemistry", "pH Balance", "Solvent Reactions"],
    bio: "I don't care about brand marketing; I care about molecular bonds. With a PhD in Chemical Engineering, I analyze hair system adhesives at a microscopic level to determine why they fail under heat and humidity.",
    methodology: "My approach is purely data-driven. We test tensile strength, water solubility, and dermal reaction. If a glue claims to be waterproof but dissolves in sweat (saline), I will expose it.",
    stats: { experience: "15 Years", consultations: 1240, rating: 4.9 },
    availability: 'Available',
    colorTheme: 'blue',
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com"
    }
  },
  {
    id: 'elena-vance',
    name: "Elena Vance",
    role: "Celebrity Stylist",
    image: "https://placehold.co/400x400/4c1d95/FFF?text=EV",
    specialties: ["Hairline Graduation", "Density Control", "Color Correction"],
    bio: "The biggest giveaway of a hair system is perfection. Nature is imperfect. I specialize in 'destructive styling'—removing density and adding irregularities to create a hyper-realistic look.",
    methodology: "I treat a hair system like a raw canvas. I use single-knot ventilation needles to graduate the hairline and razor-cutting techniques to remove the 'wall of hair' effect found in stock pieces.",
    stats: { experience: "12 Years", consultations: 850, rating: 5.0 },
    availability: 'Booked Until Nov',
    colorTheme: 'purple',
    socials: {
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      facebook: "https://facebook.com"
    }
  },
  {
    id: 'mark-knot',
    name: "Mark 'The Knot'",
    role: "Ventilation Specialist",
    image: "https://placehold.co/400x400/0f766e/FFF?text=MS",
    specialties: ["Base Repair", "Knot Bleaching", "Custom Molds"],
    bio: "A system is only as good as its base. I focus on the structural integrity of lace and poly materials. I teach users how to repair tears and seal knots to double the lifespan of their unit.",
    methodology: "Preservation is key. I advocate for low-tension removal techniques and specific knot sealers that prevent shedding without creating a shiny scalp appearance.",
    stats: { experience: "20 Years", consultations: 2100, rating: 4.8 },
    availability: 'Available',
    colorTheme: 'teal',
    socials: {
      youtube: "https://youtube.com",
      facebook: "https://facebook.com"
    }
  },
  {
    id: 'sarah-jenkins',
    name: "Dr. Sarah Jenkins",
    role: "Dermatologist",
    image: "https://placehold.co/400x400/be185d/FFF?text=SJ",
    specialties: ["Scalp Health", "Allergy Testing", "Follicle Preservation"],
    bio: "Wearing a system shouldn't cost you your scalp health. I help men manage contact dermatitis, traction alopecia, and bacterial issues arising from long-term bonding.",
    methodology: "Health first, aesthetics second. I develop patch-test protocols and prescribe rotation schedules to let the scalp breathe and recover between bonds.",
    stats: { experience: "8 Years", consultations: 400, rating: 4.9 },
    availability: 'Available',
    colorTheme: 'pink',
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com"
    }
  },
  {
    id: 'test-expert',
    name: "Dr. Test Account",
    role: "System Validator",
    image: "https://placehold.co/400x400/10b981/FFF?text=TEST",
    specialties: ["System Diagnostics", "Protocol Verification"],
    bio: "Official testing account for the Toupee4U platform. Used to validate secure login protocols and expert dashboard functionality.",
    methodology: "Binary validation of truth states.",
    stats: { experience: "N/A", consultations: 0, rating: 5.0 },
    availability: 'Available',
    colorTheme: 'green',
    socials: {
      twitter: "https://twitter.com"
    }
  }
];

export const CONSULTATIONS: Consultation[] = [
  {
    id: 'launchpad',
    title: 'The Launchpad',
    targetAudience: 'The Pre-Buyer',
    price: 79,
    duration: '30 min',
    description: 'Strategy session to analyze bio-hair density, color, and lifestyle. Deliverable: A "System Blueprint" PDF spec sheet.'
  },
  {
    id: 'emergency',
    title: 'The Emergency Room',
    targetAudience: 'The Panic Buyer',
    price: 49,
    duration: '15 min',
    description: 'Rapid-response triage. Glue turned white? System crooked? We provide immediate, calming instruction to salvage the install.'
  },
  {
    id: 'style',
    title: 'Style Design',
    targetAudience: 'The Aesthetic Buyer',
    price: 99,
    duration: '45 min',
    description: 'Styling consultation reviewing reference photos. Deliverable: A "Style Guide" for your local barber.'
  }
];

export const KB_CATEGORIES: Category[] = [
  {
    id: 'foundations',
    name: 'Fundamentals',
    description: 'Core concepts of non-surgical hair replacement.',
    physicsTheme: 'System Mechanics',
    icon: Layers,
    topics: [
      {
        id: 'cap-construction',
        title: 'Cap Construction & Base Types',
        category: 'Fundamentals',
        readTime: '15 min',
        tier: UserTier.NEBULA,
        description: `
          <h3>The Physics of Immersion vs. Cost</h3>
          <p>Understanding the architecture of a hair system is crucial for balancing realism with budget. This module covers the three primary base materials: Lace, Monofilament, and Skin.</p>
        `,
        articles: [
            {
                id: 'lace-mechanics',
                title: 'Lace Mechanics: Swiss vs. French',
                tier: UserTier.NEBULA,
                readTime: '5 min',
                content: `<p>Detailed comparison of lace denier and durability.</p>`
            },
            {
                id: 'poly-thickness',
                title: 'Poly Skin Thickness Guide',
                tier: UserTier.NOVA,
                readTime: '7 min',
                content: `<p>How thickness (0.03mm vs 0.08mm) affects invisibility and lifespan.</p>`
            }
        ]
      },
      {
        id: 'sizing-fit',
        title: 'Sizing, Fit, and Security',
        category: 'Fundamentals',
        readTime: '12 min',
        tier: UserTier.NOVA,
        description: `
          <h3>The Geometry of Cranial Surface Area</h3>
          <p>A secure bond starts with precise topography. A gap of just 2mm can lead to adhesive failure due to sweat accumulation.</p>
        `,
        articles: [
            {
                id: 'template-creation',
                title: 'Creating a Custom Template',
                tier: UserTier.NOVA,
                readTime: '8 min',
                content: `<p>Step-by-step guide to using saran wrap and tape for a mold.</p>`
            },
            {
                id: 'measurement-guide',
                title: 'Standard Measurement Protocol',
                tier: UserTier.NEBULA,
                readTime: '4 min',
                content: `<p>How to measure front-to-back and ear-to-ear correctly.</p>`
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
    icon: Microscope,
    topics: [
      {
        id: 'human-vs-synthetic',
        title: 'Human Hair vs. Synthetic',
        category: 'Materials',
        readTime: '20 min',
        tier: UserTier.NEBULA,
        description: `
          <h3>Organic vs. Engineered Polymers</h3>
          <p>A detailed, side-by-side comparison of the look, feel, cost, and maintenance requirements of the two major fiber types.</p>
        `,
        articles: [
            {
                id: 'human-hair-biology',
                title: 'The Biology of Human Hair',
                tier: UserTier.NEBULA,
                readTime: '6 min',
                content: `<h3>The Cuticle Structure</h3><p>Human hair is defined by its overlapping cuticle layers...</p>`
            },
            {
                id: 'synthetic-polymers',
                title: 'Synthetic Fiber Engineering',
                tier: UserTier.NOVA,
                readTime: '8 min',
                content: `<h3>Kanekalon & Cyberhair</h3><p>Modern synthetics are engineered polymers...</p>`
            }
        ]
      },
      {
        id: 'color-theory',
        title: 'Color Theory: Oxidation & Codes',
        category: 'Materials',
        readTime: '15 min',
        tier: UserTier.GALAXY,
        description: `
          <h3>The Red Undertone Phenomenon</h3>
          <p>All human hair systems oxidize (turn red/orange) over time due to UV exposure.</p>
        `,
        articles: [
            {
                id: 'color-codes',
                title: 'Decoding Industry Color Codes',
                tier: UserTier.NEBULA,
                readTime: '5 min',
                content: `<p>Standard industry charts explained.</p>`
            },
            {
                id: 'oxidation-correction',
                title: 'Correcting Oxidation (Red Tones)',
                /* FIX: Added missing properties to resolve line 233 missing property error */
                content: `<p>Practical guide on neutralizing unwanted red and orange brassy tones using scientific color theory.</p>`,
                readTime: '10 min',
                tier: UserTier.GALAXY
            }
        ]
      }
    ]
  }
];

/* FIX: Added INDUSTRY_NEWS export to fix missing member error in Home.tsx and IndustryNewsPage.tsx */
export const INDUSTRY_NEWS = [
  {
    id: 'n1',
    title: 'New Bio-Bond Formulation Breakthrough',
    snippet: 'Researchers announce a new protein-based adhesive that mimics natural scalp oils.',
    source: 'DermScience',
    date: 'Oct 15, 2024',
    category: 'Science',
    link: '#'
  },
  {
    id: 'n2',
    title: 'Global Lace Supply Chain Update',
    snippet: 'Manufacturing output in Swiss regions expected to stabilize by Q4 2024.',
    source: 'Systems Weekly',
    date: 'Oct 13, 2024',
    category: 'Supply Chain',
    link: '#'
  },
  {
    id: 'n3',
    title: 'Synthetic Fiber Heat Resistance Report',
    snippet: 'Latest generation of high-temp synthetic fibers can withstand up to 350°F safely.',
    source: 'Material Engineering',
    date: 'Oct 10, 2024',
    category: 'Materials',
    link: '#'
  }
];

/* FIX: Added GLOSSARY_TERMS export to fix missing member error in GlossaryPage.tsx */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { id: 'g1', term: 'Adhesion', definition: 'The physical state in which two surfaces are held together by interfacial forces.', category: 'Chemistry' },
  { id: 'g2', term: 'Denier', definition: 'A unit of weight by which the fineness of silk, rayon, or nylon yarn is measured.', category: 'Materials' },
  { id: 'g3', term: 'Oxidation', definition: 'The process of a substance combining with oxygen, leading to color changes in hair fibers.', category: 'Chemistry' },
  { id: 'g4', term: 'Ventilation', definition: 'The process of hand-tying hair fibers into a base material.', category: 'Anatomy' }
];
