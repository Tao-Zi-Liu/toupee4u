import { UserTier, Category, Consultation, Expert, GlossaryTerm } from './types';
import { BookOpen, Layers, Zap, PenTool, Activity, ShieldCheck, Microscope, Droplet } from 'lucide-react';

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
        tier: UserTier.OBSERVER,
        description: `
          <h3>The Physics of Immersion vs. Cost</h3>
          <p>Understanding the architecture of a hair system is crucial for balancing realism with budget. This module covers the three primary base materials: Lace, Monofilament, and Skin.</p>
          <div class="bg-blue-50 p-4 rounded-md my-4 border-l-4 border-blue-500">
             <strong>Analyst Note:</strong> Monofilament is the "Toyota" of bases—reliable and lasts 6+ months. Swiss Lace is the "Ferrari"—high performance, invisible, but fragile (2-3 months).
          </div>
        `,
        articles: [
            {
                id: 'lace-mechanics',
                title: 'Lace Mechanics: Swiss vs. French',
                tier: UserTier.OBSERVER,
                readTime: '5 min',
                content: `<p>Detailed comparison of lace denier and durability.</p>`
            },
            {
                id: 'poly-thickness',
                title: 'Poly Skin Thickness Guide',
                tier: UserTier.KINETIC,
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
        tier: UserTier.KINETIC,
        description: `
          <h3>The Geometry of Cranial Surface Area</h3>
          <p>A secure bond starts with precise topography. A gap of just 2mm can lead to adhesive failure due to sweat accumulation.</p>
        `,
        articles: [
            {
                id: 'template-creation',
                title: 'Creating a Custom Template',
                tier: UserTier.KINETIC,
                readTime: '8 min',
                content: `<p>Step-by-step guide to using saran wrap and tape for a mold.</p>`
            },
            {
                id: 'measurement-guide',
                title: 'Standard Measurement Protocol',
                tier: UserTier.OBSERVER,
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
        tier: UserTier.OBSERVER,
        description: `
          <h3>Organic vs. Engineered Polymers</h3>
          <p>A detailed, side-by-side comparison of the look, feel, cost, and maintenance requirements of the two major fiber types. Explore the sub-articles below for chemical composition analysis.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Appearance & Texture:</strong> Human hair has natural cuticle irregularities that scatter light realistically. Kanekalon (synthetic) can reflect too much light (shine) unless treated.</li>
            <li><strong>Longevity:</strong> Human hair lasts 3-12 months but requires hydration. Synthetic fibers last 2-4 months and succumb to "friction burn".</li>
            <li><strong>Styling Physics:</strong> Human hair bonds can be reshaped with heat (hydrogen bonds). Synthetic hair has "memory" and returns to its factory curl pattern unless steam-set.</li>
          </ul>
        `,
        articles: [
            {
                id: 'human-hair-biology',
                title: 'The Biology of Human Hair',
                tier: UserTier.OBSERVER,
                readTime: '6 min',
                content: `
                    <h3>The Cuticle Structure</h3>
                    <p>Human hair is defined by its overlapping cuticle layers (like roof shingles). This structure captures moisture but also causes tangling if the cuticles are not aligned (Non-Remy).</p>
                    <p>When selecting a system, "Virgin" hair retains this structure intact, whereas "processed" hair often has the cuticles stripped via acid baths.</p>
                `
            },
            {
                id: 'synthetic-polymers',
                title: 'Synthetic Fiber Engineering',
                tier: UserTier.KINETIC,
                readTime: '8 min',
                content: `
                    <h3>Kanekalon & Cyberhair</h3>
                    <p>Modern synthetics are engineered polymers designed to mimic the mass and movement of biological hair. However, they lack the ability to absorb water.</p>
                    <p><strong>Friction Burn:</strong> The main failure mode of synthetics. Constant rubbing against collars creates heat, which kinks the fiber ends permanently.</p>
                `
            },
            {
                id: 'heat-resistance',
                title: 'Thermodynamics: Heat Resistance',
                tier: UserTier.KINETIC,
                readTime: '5 min',
                content: `
                    <h3>Melting Points</h3>
                    <p>Standard synthetic fibers melt at ~200°F. Human hair burns at ~450°F but takes damage earlier.</p>
                    <p>Heat Defiant (HD) synthetics can withstand up to 350°F, but they are stiffer and more prone to tangling due to surface friction.</p>
                `
            }
        ]
      },
      {
        id: 'color-theory',
        title: 'Color Theory: Oxidation & Codes',
        category: 'Materials',
        readTime: '15 min',
        tier: UserTier.QUANTUM,
        description: `
          <h3>The Red Undertone Phenomenon</h3>
          <p>All human hair systems oxidize (turn red/orange) over time due to UV exposure. This is a chemical reaction breaking down the ash toner.</p>
        `,
        articles: [
            {
                id: 'color-codes',
                title: 'Decoding Industry Color Codes',
                tier: UserTier.OBSERVER,
                readTime: '5 min',
                content: `<p>What does #1B, #2, and #22 mean? Standard industry charts explained.</p>`
            },
            {
                id: 'oxidation-correction',
                title: 'Correcting Oxidation (Red Tones)',
                tier: UserTier.QUANTUM,
                readTime: '10 min',
                content: `<p>Using blue/violet depositing shampoos to neutralize brassy tones chemically.</p>`
            }
        ]
      }
    ]
  },
  {
    id: 'securement',
    name: 'Application',
    description: 'Adhesives, tapes, and bonding techniques.',
    physicsTheme: 'Bonding Physics',
    icon: Droplet,
    topics: [
      {
        id: 'app-methods-cap',
        title: 'Application Methods by Cap Type',
        category: 'Application',
        readTime: '20 min',
        tier: UserTier.KINETIC,
        description: `
          <h3>Matching Mechanics to Material</h3>
          <p>Specific instructions for securing and blending different base types. The choice of adhesive must match the porosity of the base.</p>
        `,
        articles: [
            {
                id: 'liquid-adhesive',
                title: 'Liquid Adhesives: Acrylic vs Water',
                tier: UserTier.KINETIC,
                readTime: '10 min',
                content: `<p>Ghost Bond (Water) vs. Ultra Hold (Acrylic). When to use which.</p>`
            },
            {
                id: 'tape-bonding',
                title: 'Tape Bonding Protocols',
                tier: UserTier.OBSERVER,
                readTime: '8 min',
                content: `<p>Perimeter bonding with Walker Tape. Minis vs Rolls.</p>`
            }
        ]
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Care',
    description: 'Cleaning, repairs, and longevity.',
    physicsTheme: 'Entropy Control',
    icon: PenTool,
    topics: [
      {
        id: 'washing-guidelines',
        title: 'Washing & Product Guidelines',
        category: 'Care',
        readTime: '15 min',
        tier: UserTier.OBSERVER,
        description: `
          <h3>Chemical Interaction with Fiber</h3>
          <p>Step-by-step instructions for washing synthetic hair vs. human hair, and a guide to specialized wig-safe shampoos and conditioners.</p>
        `,
        articles: [
            {
                id: 'washing-human',
                title: 'Protocol: Washing Human Hair',
                tier: UserTier.OBSERVER,
                readTime: '7 min',
                content: `<p>Sulfate-free requirements and hydration techniques.</p>`
            },
            {
                id: 'washing-synthetic',
                title: 'Protocol: Washing Synthetic Fiber',
                tier: UserTier.OBSERVER,
                readTime: '6 min',
                content: `<p>Cold water only. Why heat destroys the curl pattern during washing.</p>`
            }
        ]
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Living, swimming, and dating with a system.',
    physicsTheme: 'Applied Dynamics',
    icon: Activity,
    topics: [
      {
        id: 'hydrodynamics',
        title: 'Hydrodynamics: Swimming & Sweat',
        category: 'Lifestyle',
        readTime: '10 min',
        tier: UserTier.QUANTUM,
        description: `
          <h3>Water Resistance vs. Waterproof</h3>
          <p>No bond is truly waterproof forever. Water softens acrylic bonds over time.</p>
        `,
        articles: [
            {
                id: 'swimming-protocol',
                title: 'The Swimmer\'s Protocol',
                tier: UserTier.QUANTUM,
                readTime: '6 min',
                content: `<p>Using scalp protectors and waterproof sealants for active lifestyles.</p>`
            }
        ]
      }
    ]
  }
];

export const INDUSTRY_NEWS = [
  {
    id: 1,
    source: "Hair Replacement Association",
    date: "Oct 12, 2023",
    title: "Global Swiss Lace Shortage: Supply Chain Update Q4",
    snippet: "Manufacturers report a 30% drop in raw lace availability due to textile labor shortages in Southeast Asia. Expect price increases.",
    link: "#",
    category: "Supply Chain"
  },
  {
    id: 2,
    source: "Dermatology Weekly",
    date: "Oct 10, 2023",
    title: "New Peptide Serum Approved for Under-Adhesive Use",
    snippet: "FDA clears 'ScalpGuard+', a barrier serum claimed to reduce contact dermatitis by 40% without compromising bond strength.",
    link: "#",
    category: "Innovation"
  },
  {
    id: 3,
    source: "Walker Tape Co. Press",
    date: "Oct 05, 2023",
    title: "Walker Tape Announces 'Ultra-Matte' Liquid Adhesive",
    snippet: "The new formula promises zero-shine even under direct flash photography, targeting the high-definition film industry.",
    link: "#",
    category: "Product Launch"
  },
  {
    id: 4,
    source: "TechCrunch",
    date: "Sep 28, 2023",
    title: "AI-Generated Hairlines: The Future of Custom Systems?",
    snippet: "Startup 'FollicleAI' raises $12M to 3D print bio-synthetic hair bases using scans from your phone.",
    link: "#",
    category: "Technology"
  },
  {
    id: 5,
    source: "Consumer Reports",
    date: "Sep 20, 2023",
    title: "Adhesive Safety: Formaldehyde Traces Found in Budget Brands",
    snippet: "Lab tests reveal concerning levels of toxic compounds in generic adhesives sold on express shipping platforms.",
    link: "#",
    category: "Safety"
  },
  {
    id: 6,
    source: "Men's Health",
    date: "Sep 15, 2023",
    title: "The Stigma is Fading: Hair System Sales Up 200%",
    snippet: "Gen Z men are embracing non-surgical replacement faster than any previous generation.",
    link: "#",
    category: "Market Trend"
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { id: '1', term: 'Poly (Polyurethane)', definition: 'A skin-like material used for the base of hair systems. It is durable, easy to clean, and non-porous.', category: 'Materials' },
  { id: '2', term: 'French Lace', definition: 'A durable, yet undetectable mesh base material. It is more robust than Swiss Lace but slightly more visible.', category: 'Materials' },
  { id: '3', term: 'Swiss Lace', definition: 'The finest, most undetectable lace available. It is very fragile and typically used for front hairlines.', category: 'Materials' },
  { id: '4', term: 'V-Loop', definition: 'A ventilation technique where hair is looped through the base in a V-shape without knots, offering a very natural appearance but lower durability.', category: 'Anatomy' },
  { id: '5', term: 'Bleached Knots', definition: 'A chemical process applied to the root knots of dark hair to remove pigment, making them invisible against the scalp.', category: 'Maintenance' },
  { id: '6', term: 'Graduated Hairline', definition: 'A styling technique where density increases gradually from the front edge backwards, mimicking natural growth patterns.', category: 'Styling' },
  { id: '7', term: 'Remys Hair', definition: 'Human hair collected with the cuticle layer intact and aligned in one direction to prevent tangling.', category: 'Materials' },
  { id: '8', term: 'Ghost Bond', definition: 'A popular water-based white adhesive that turns clear when dry. Known for being safe on lace and skin.', category: 'Adhesives' },
  { id: '9', term: 'Walker Tape', definition: 'A brand synonymous with double-sided adhesive tapes used for perimeter bonding.', category: 'Adhesives' },
  { id: '10', term: 'Denier', definition: 'A unit of measure for the linear mass density of fibers. Lower denier generally means finer, more natural looking hair.', category: 'Materials' },
  { id: '11', term: 'Base Contour', definition: 'The curvature shape of the hair system base (e.g., A, AA, C, CC) designed to match the user\'s skull shape.', category: 'Anatomy' },
  { id: '12', term: 'Oxidation', definition: 'The chemical reaction of hair pigment with oxygen and UV light, causing color to fade or turn brassy/red over time.', category: 'Maintenance' },
  { id: '13', term: 'Ventilation', definition: 'The manual process of tying or injecting individual hair strands into the base material.', category: 'Anatomy' },
  { id: '14', term: 'C-22 Solvent', definition: 'A citrus-based adhesive remover effective for cleaning lace and skin but requires washing off to prevent oily residue.', category: 'Maintenance' },
  { id: '15', term: 'Cuticle', definition: 'The outermost layer of the hair shaft. Intact cuticles provide shine and protection but require alignment (Remy) to prevent matting.', category: 'Anatomy' },
  { id: '16', term: 'Iso-Propyl Alcohol', definition: 'Often used as a scalp cleanser or positioning spray. Must be 99% pure for cleaning, 70% for positioning.', category: 'Chemistry' },
  { id: '17', term: 'Knot Sealer', definition: 'A spray applied to the underside of a lace system to secure knots and reduce shedding.', category: 'Maintenance' },
];
