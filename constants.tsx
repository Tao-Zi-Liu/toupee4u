import { UserTier, Category, Consultation, Expert } from './types';
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
    articles: [
      {
        id: 'cap-construction',
        title: 'Cap Construction & Base Types',
        category: 'Fundamentals',
        readTime: '8 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>The Physics of Immersion vs. Cost</h3>
          <p>Understanding the architecture of a hair system is crucial for balancing realism with budget.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Lace Fronts:</strong> The gold standard for hairline realism. Individual hairs are hand-tied into a fine mesh that disappears against the skin.</li>
            <li><strong>Monofilament Tops:</strong> Provides the appearance of scalp growth across the entire top, allowing for multi-directional parting. Durable but slightly thicker than lace.</li>
            <li><strong>Hand-Tied vs. Open-Wefted:</strong> Hand-tied caps offer the most natural movement (High Fluidity), while open-wefted caps provide maximum ventilation and are often more affordable.</li>
          </ul>
          <div class="bg-blue-50 p-4 rounded-md my-4 border-l-4 border-blue-500">
             <strong>Analyst Note:</strong> Monofilament is the "Toyota" of bases—reliable and lasts 6+ months. Swiss Lace is the "Ferrari"—high performance, invisible, but fragile (2-3 months).
          </div>
        `
      },
      {
        id: 'sizing-fit',
        title: 'Sizing, Fit, and Security',
        category: 'Fundamentals',
        readTime: '6 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>The Geometry of Cranial Surface Area</h3>
          <p>A secure bond starts with precise topography. A gap of just 2mm can lead to adhesive failure due to sweat accumulation.</p>
          <p class="mt-2"><strong>Measurement Protocol:</strong></p>
          <ol class="list-decimal pl-5 my-4 space-y-2">
            <li><strong>Circumference:</strong> Measure around the hairline, behind the ears, and the nape.</li>
            <li><strong>Front to Back:</strong> From the hairline center to the occipital bone.</li>
            <li><strong>Ear to Ear:</strong> Over the top of the crown.</li>
          </ol>
          <p>Most stock caps are "Standard" size, but cranial asymmetry often requires custom adjustment or specific "Petite/Large" stock orders.</p>
        `
      },
      {
        id: 'terminology-style',
        title: 'Toupee Terminology: Length & Style',
        category: 'Fundamentals',
        readTime: '5 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>Decoding the Industry Lexicon</h3>
          <p>Don't order blind. Know the physics of fiber shape and length.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Texture Geometry:</strong> 
              <ul class="list-circle pl-5 mt-1 text-sm text-slate-400">
                 <li><em>Silky Straight:</em> 0mm wave.</li>
                 <li><em>Body Wave:</em> 25mm wave diameter. Common for "natural" look.</li>
                 <li><em>Yaki:</em> Micro-crimped texture to mimic relaxed Afro-Caribbean hair.</li>
              </ul>
            </li>
            <li><strong>Length Standards:</strong>
               <ul class="list-circle pl-5 mt-1 text-sm text-slate-400">
                 <li><em>Bob:</em> Uniform length around the perimeter.</li>
                 <li><em>Layered:</em> Graduated lengths for volume dynamics.</li>
               </ul>
            </li>
          </ul>
        `
      },
      {
        id: 'density-features',
        title: 'Density and Cap Features',
        category: 'Fundamentals',
        readTime: '7 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Volume Dynamics & Friction Control</h3>
          <p><strong>Density:</strong> Measured in percentage relative to a "full" natural head (assumed 100-120%).</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Light (80-90%):</strong> Best for older men or receding looks.</li>
            <li><strong>Medium (100-110%):</strong> Standard "healthy" head of hair.</li>
            <li><strong>Heavy (130%+):</strong> Often looks unnatural without expert thinning. Denser = Less Breathable.</li>
          </ul>
          <p class="mt-4"><strong>Specialized Features:</strong></p>
          <ul class="list-disc pl-5 space-y-2">
             <li><strong>Anti-Slip Silicone:</strong> Uses friction coefficients to grip the scalp without adhesive. ideal for total hair loss (alopecia totalis).</li>
             <li><strong>Adjustable Straps:</strong> Mechanical tension control for glueless fits.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'base-fiber',
    name: 'Materials',
    description: 'Detailed material science of hair fibers.',
    physicsTheme: 'Material Science',
    icon: Microscope,
    articles: [
      {
        id: 'human-vs-synthetic',
        title: 'Human Hair vs. Synthetic',
        category: 'Materials',
        readTime: '8 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>Organic vs. Engineered Polymers</h3>
          <p>A detailed, side-by-side comparison of the look, feel, cost, and maintenance requirements of the two major fiber types.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Appearance & Texture:</strong> Human hair has natural cuticle irregularities that scatter light realistically. Kanekalon (synthetic) can reflect too much light (shine) unless treated.</li>
            <li><strong>Longevity:</strong> Human hair lasts 3-12 months but requires hydration. Synthetic fibers last 2-4 months and succumb to "friction burn".</li>
            <li><strong>Styling Physics:</strong> Human hair bonds can be reshaped with heat (hydrogen bonds). Synthetic hair has "memory" and returns to its factory curl pattern unless steam-set.</li>
          </ul>
        `
      },
      {
        id: 'specialty-fibers',
        title: 'Specialty Fiber Types',
        category: 'Materials',
        readTime: '6 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Beyond Standard Strands</h3>
          <p>Diving into specific materials like heat-friendly synthetic fibers, blended hair (human/synthetic mix), and other technological advancements in fiber.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Heat-Defiant Synthetic:</strong> Can withstand up to 350°F. Great for active lifestyles but prone to tangling due to fiber surface friction.</li>
             <li><strong>Yak Hair:</strong> Thicker diameter. Often used for grey percentage in human hair systems because it doesn't take dye (remains white).</li>
             <li><strong>Cyberhair:</strong> A proprietary nylon blend with high moisture retention and color fastness.</li>
          </ul>
        `
      },
      {
        id: 'human-grading',
        title: 'Human Hair Quality Grading',
        category: 'Materials',
        readTime: '10 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>The Cuticle Direction Factor</h3>
          <p>Explaining terms like Remy hair, Virgin hair, and non-Remy, and how these classifications impact the hair's cuticle direction and longevity.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Virgin Hair:</strong> Chemically unprocessed. Cuticles intact and aligned. Highest tensile strength.</li>
             <li><strong>Remy Hair:</strong> Processed for color/texture, but roots and tips are aligned. Prevents tangling.</li>
             <li><strong>Non-Remy (Floor Hair):</strong> Collected from diverse sources. Acid-bathed to strip cuticles. Coated in silicone. Short lifespan (matting risk).</li>
          </ul>
        `
      },
      {
        id: 'durability-investment',
        title: 'Material Durability & Investment',
        category: 'Materials',
        readTime: '7 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>The Cost-Per-Wear Equation</h3>
          <p>Discussing the expected lifespan of different hair types (human vs. synthetic) and how the material quality of the base (like HD lace or thin skin) affects the overall durability and cost.</p>
          <div class="bg-blue-50/10 p-4 rounded-md my-4 border-l-4 border-blue-500">
             <strong>Analyst Equation:</strong> Total Cost = (Unit Price / Weeks of Wear) + Maintenance Supplies.
          </div>
          <p>Thin Skin (0.03mm) provides maximum realism (invisibility) but typically lasts only 3-4 weeks. Monofilament offers a balance, often lasting 6+ months.</p>
        `
      },
      {
        id: 'color-theory',
        title: 'Color Theory: Oxidation & Codes',
        category: 'Materials',
        readTime: '10 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>The Red Undertone Phenomenon</h3>
          <p>All human hair systems oxidize (turn red/orange) over time due to UV exposure. This is a chemical reaction breaking down the ash toner.</p>
          <p><strong>Correction:</strong> Use a blue/violet depositing shampoo to neutralize the brassy tones. This is basic color wheel physics.</p>
        `
      }
    ]
  },
  {
    id: 'securement',
    name: 'Application',
    description: 'Adhesives, tapes, and bonding techniques.',
    physicsTheme: 'Bonding Physics',
    icon: Droplet,
    articles: [
      {
        id: 'hair-prep-base',
        title: 'Natural Hair Prep & Base Creation',
        category: 'Application',
        readTime: '10 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>The Foundation of Stability</h3>
          <p>Step-by-step guides on preparing one’s own hair (braids, wraps, caps) to ensure a flat and comfortable base.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Braiding Patterns:</strong> Cornrows or beehive patterns distribute bulk evenly to prevent "lumps" under the system.</li>
             <li><strong>Wrapping:</strong> For short hair, wet wrapping and molding with heavy hold gel creates a smooth surface.</li>
             <li><strong>Wig Caps:</strong> Selecting the right material (nylon vs. mesh) to protect bio-hair and provide friction for the unit.</li>
          </ul>
        `
      },
      {
        id: 'app-methods-cap',
        title: 'Application Methods by Cap Type',
        category: 'Application',
        readTime: '12 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Matching Mechanics to Material</h3>
          <p>Specific instructions for securing and blending different base types.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Glue-less Clips:</strong> Mechanical tension for temporary hold. Best for daily removal but requires existing bio-hair for anchorage.</li>
             <li><strong>Liquid Adhesive (Lace):</strong> Requires thin layers to prevent seepage through the mesh. The "Dot Method" vs "Spread Method".</li>
             <li><strong>Tape (Thin Skin):</strong> Provides immediate high-tack strength but adds slight thickness. Best for perimeter bonding.</li>
          </ul>
        `
      },
      {
        id: 'customization-natural',
        title: 'Customization for Natural Look',
        category: 'Application',
        readTime: '15 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>The Art of Imperfection</h3>
          <p>Advanced techniques to make the wig blend seamlessly with the skin.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Plucking:</strong> Reducing density at the hairline to create a gradual transition rather than a dense "wall" of hair.</li>
             <li><strong>Bleaching Knots:</strong> Chemical processing to remove the black dots at the root of the lace, making hair appear to grow from the scalp.</li>
             <li><strong>Lace Tinting:</strong> Using fabric dyes or tea to match the mesh color to specific skin undertones.</li>
          </ul>
        `
      },
      {
        id: 'styling-safely',
        title: 'Styling Safely: Heat & Cutting',
        category: 'Application',
        readTime: '8 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Thermodynamics of Fiber</h3>
          <p>Guidelines for cutting wigs and safely using heat tools.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Human Hair:</strong> Can withstand up to 450°F, but 350°F is recommended to preserve cuticle moisture.</li>
             <li><strong>Heat-Friendly Synthetic:</strong> Max 280-350°F. Requires tension while cooling to set the shape ("baking" the style).</li>
             <li><strong>Cutting Protocol:</strong> Always cut dry to account for natural bounce and texture. Wet cutting can lead to "shorter than intended" results.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Care',
    description: 'Cleaning, repairs, and longevity.',
    physicsTheme: 'Entropy Control',
    icon: PenTool,
    articles: [
      {
        id: 'washing-guidelines',
        title: 'Washing & Product Guidelines',
        category: 'Care',
        readTime: '10 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>Chemical Interaction with Fiber</h3>
          <p>Step-by-step instructions for washing synthetic hair vs. human hair, and a guide to specialized wig-safe shampoos and conditioners.</p>
          <div class="bg-red-500/10 p-4 rounded-md my-4 border-l-4 border-red-500">
             <strong>Critical Warning:</strong> Using the wrong product can ruin a synthetic fiber. Standard sulfates strip the silicone coating from human hair systems, leading to rapid oxidation.
          </div>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Human Hair:</strong> Requires "Color Safe" and "Sulfate Free" formulas. Hydration is key as there is no natural sebum supply.</li>
            <li><strong>Synthetic:</strong> Requires specific synthetic-safe cleansers that do not disrupt the heat-set curl pattern. Cool water only to prevent fiber deformation.</li>
          </ul>
        `
      },
      {
        id: 'drying-detangling',
        title: 'Drying and Detangling Safely',
        category: 'Care',
        readTime: '8 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Minimizing Mechanical Stress</h3>
          <p>Proper techniques for drying (no harsh towels, air drying only for synthetics) and detangling methods to minimize hair loss and frizz.</p>
          <p class="italic text-slate-400 mb-4">Incorrect detangling causes irreversible damage to the knotting architecture.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Drying Physics:</strong> Never wring or twist. Blot with a microfiber towel to absorb capillary moisture. Heat drying synthetic hair will melt the fibers.</li>
             <li><strong>Detangling Vector:</strong> Always start from the tips and work upwards to the root. This prevents tightening knots at the base. Use a wide-tooth comb or loop brush.</li>
          </ul>
        `
      },
      {
        id: 'storage-travel',
        title: 'Storage and Travel',
        category: 'Care',
        readTime: '5 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>Static & Structural Preservation</h3>
          <p>Best practices for storing wigs (wig heads, plastic bags, hanging) to preserve the style and keep the cap clean when not in use.</p>
          <p><strong>The Golden Rule:</strong> Prevents kinking and tangling.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Long Term:</strong> Canvas block head to maintain cap shape and prevents shrinkage.</li>
             <li><strong>Travel:</strong> Silk bag to reduce static friction. Turn the unit inside out to protect the hair from zipper snags.</li>
          </ul>
        `
      },
      {
        id: 'revival-longevity',
        title: 'Revival and Longevity Tips',
        category: 'Care',
        readTime: '12 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>Reversing Entropy</h3>
          <p>How to handle common issues like frizz, dullness, or tangling (especially in synthetic ends) to refresh the wig and maximize its wear time.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
             <li><strong>Synthetic Steaming:</strong> Using a steamer to reset the "memory" of frizzing synthetic fibers. Requires precise temperature control (180°F-200°F).</li>
             <li><strong>Silicone Refinishing:</strong> Applying silicone-based serums to coat human hair shafts that have lost their cuticle, restoring slip and shine.</li>
             <li><strong>Knot Sealing:</strong> Re-applying sealer to the underside of the lace after every 3rd wash to lock hair in place.</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Living, swimming, and dating with a system.',
    physicsTheme: 'Applied Dynamics',
    icon: Activity,
    articles: [
      {
        id: 'hydrodynamics',
        title: 'Hydrodynamics: Swimming & Sweat',
        category: 'Lifestyle',
        readTime: '8 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>Water Resistance vs. Waterproof</h3>
          <p>No bond is truly waterproof forever. Water softens acrylic bonds over time.</p>
          <p><strong>The Swimmer's Protocol:</strong> Apply a scalp protector (barrier film) before bonding. Use full bond (glue) rather than tape for the hairline to prevent water lift.</p>
        `
      },
      {
        id: 'social-dynamics',
        title: 'Social Dynamics: Dating & Disclosure',
        category: 'Lifestyle',
        readTime: '12 min',
        tier: UserTier.QUANTUM,
        content: `
          <h3>The Touch Test</h3>
          <p>Anxiety about a partner feeling the system (the "bump" at the edge) is the #1 psychological barrier.</p>
          <p><strong>Mitigation:</strong> Thin skin bases have a perceptible edge. Lace bases, when bonded correctly, are nearly imperceptible to touch.</p>
        `
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
