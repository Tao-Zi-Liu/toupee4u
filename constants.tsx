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
    colorTheme: 'blue'
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
    colorTheme: 'purple'
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
    colorTheme: 'teal'
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
    colorTheme: 'pink'
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
    name: 'Foundations',
    description: 'Core concepts of non-surgical hair replacement.',
    physicsTheme: 'System Mechanics',
    icon: Layers,
    articles: [
      {
        id: 'materials-101',
        title: 'Base Materials: Lace vs. Poly vs. Mono',
        category: 'Foundations',
        readTime: '5 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>The Physics of Invisibility vs. Durability</h3>
          <p>Choosing a base is a trade-off between the physics of light (invisibility) and material strength (durability).</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>French Lace:</strong> The standard for realism. The hexagonal mesh allows light to pass through, mimicking the scalp. Delicate.</li>
            <li><strong>Swiss Lace:</strong> Even finer than French lace. The "Quantum" level of invisibility but tears easily (High Entropy).</li>
            <li><strong>Thin Skin (Poly):</strong> A polyurethane membrane. Air-tight and water-tight. Easy to clean but less breathable. Best for "wet" bonds.</li>
            <li><strong>Monofilament:</strong> The "tank" of bases. stiff, durable, nylon mesh. High longevity, low realism at the hairline.</li>
          </ul>
        `
      },
      {
        id: 'geometry-fit',
        title: 'The Geometry of Fit: Templates & Contours',
        category: 'Foundations',
        readTime: '7 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Mapping the Cranial Topography</h3>
          <p>A system that doesn't match your cranial curvature will ripple. This is simple geometry.</p>
          <p class="mt-2">Most stock systems come in a "CC" (Standard) contour. If you have a flatter head, you need a custom mold.</p>
          <div class="bg-blue-50 p-4 rounded-md my-4 border-l-4 border-blue-500">
             <strong>The Template Protocol:</strong> Always use plastic wrap and tape to create a rigid mold of your balding area. Mark the "Front" clearly.
          </div>
        `
      }
    ]
  },
  {
    id: 'base-fiber',
    name: 'Base & Fiber',
    description: 'Detailed material science of hair fibers.',
    physicsTheme: 'Material Science',
    icon: Microscope,
    articles: [
      {
        id: 'fiber-biology',
        title: 'Fiber Biology: Human vs. Synthetic vs. Yak',
        category: 'Base & Fiber',
        readTime: '6 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Organic vs. Synthetic Structures</h3>
          <p>Not all hair behaves the same under stress or heat.</p>
          <ul class="list-disc pl-5 my-4 space-y-2">
            <li><strong>Human Hair (Remy):</strong> Cuticles intact and aligned. Moves naturally. Reacts to humidity (frizz).</li>
            <li><strong>Synthetic (Kanekalon):</strong> Plastic memory. Holds style permanently but shines unnaturally under flash photography. Degrades with friction (friction burn).</li>
            <li><strong>Yak Hair:</strong> Thicker diameter. Often used for grey percentage in human hair systems because it doesn't take dye (remains white).</li>
          </ul>
        `
      },
      {
        id: 'color-theory',
        title: 'Color Theory: Oxidation & Codes',
        category: 'Base & Fiber',
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
    name: 'Securement',
    description: 'Adhesives, tapes, and bonding techniques.',
    physicsTheme: 'Bonding Physics',
    icon: Droplet,
    articles: [
      {
        id: 'adhesive-chemistry',
        title: 'Adhesive Chemistry: Acrylic vs. Water-based',
        category: 'Securement',
        readTime: '8 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>The Molecular Bond</h3>
          <p><strong>White Glues (Water-based):</strong> Like Ghost Bond. They turn clear when dry. Safe for skin, weaker against sweat (hydrophilic tendencies).</p>
          <p><strong>Clear Glues (Acrylic/Solvent):</strong> Like Walker Ultra Hold. Stronger, messier, potential for skin irritation. Hydrophobic (repels water).</p>
        `
      },
      {
        id: 'tape-mechanics',
        title: 'Tape Mechanics: Rolls vs. Contours',
        category: 'Securement',
        readTime: '5 min',
        tier: UserTier.OBSERVER,
        content: `
          <h3>Friction and Lift</h3>
          <p>Tape is easier to clean but adds thickness (detectability). Use contours (curved strips) to match the hairline geometry, avoiding pleats.</p>
        `
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Cleaning, repairs, and longevity.',
    physicsTheme: 'Entropy Control',
    icon: PenTool,
    articles: [
      {
        id: 'debonding-protocols',
        title: 'De-Bonding Protocols: Solvents & Release',
        category: 'Maintenance',
        readTime: '6 min',
        tier: UserTier.KINETIC,
        content: `
          <h3>Minimizing Tensile Stress</h3>
          <p>Never pull a system off dry. You will rip the lace or your skin. Use a release agent (C-22 or alcohol) to break the chemical bond first.</p>
          <p>Let the solvent sit for 3-5 minutes. The system should slide off, not peel.</p>
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
