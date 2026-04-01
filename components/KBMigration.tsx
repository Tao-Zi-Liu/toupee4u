import React, { useState } from 'react';
import { db } from '../firebase.config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const STATIC_CATEGORIES = [
  // ─────────────────────────────────────────────────────────────────
  // 1. FUNDAMENTALS
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'foundations',
    name: 'Fundamentals',
    description: 'Core concepts of non-surgical hair replacement. Start here.',
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
        description: '<h3>The Physics of Immersion vs. Cost</h3><p>Understanding the architecture of a hair system is crucial for balancing realism with budget. This module covers the three primary base materials and their trade-offs.</p>',
        articles: [
          {
            id: 'lace-mechanics',
            title: 'Lace Mechanics: Swiss vs. French',
            tier: 'NEBULA',
            readTime: '6 min',
            order: 1,
            content: `<h3>What is Lace?</h3>
<p>Lace base hair systems use a fine mesh fabric as the foundation into which hair is individually hand-ventilated (knotted). The result is an extremely natural-looking hairline and scalp appearance because you can see through the base to the skin below.</p>

<h3>Swiss Lace</h3>
<p>Swiss lace is the finer, more delicate of the two. It is nearly invisible against the scalp and produces the most undetectable hairline possible. However, its gossamer structure means it tears easily — typical lifespan is 4–8 weeks with daily wear.</p>
<ul>
<li><strong>Denier:</strong> Very fine (low denier)</li>
<li><strong>Detectability:</strong> Almost zero at the hairline</li>
<li><strong>Durability:</strong> Low — requires careful handling</li>
<li><strong>Best for:</strong> Special occasions, photo shoots, or experienced wearers</li>
</ul>

<h3>French Lace</h3>
<p>French lace uses a slightly thicker, more durable mesh. It sacrifices a small degree of invisibility in exchange for significantly greater strength. Most everyday wearers prefer French lace for its balance of realism and practicality.</p>
<ul>
<li><strong>Denier:</strong> Medium</li>
<li><strong>Detectability:</strong> Very low — undetectable at normal conversation distance</li>
<li><strong>Durability:</strong> Medium — 2–4 months typical lifespan</li>
<li><strong>Best for:</strong> Daily wearers who value longevity</li>
</ul>

<h3>Key Takeaway</h3>
<p>Think of Swiss lace as tissue paper and French lace as a cotton shirt. Both are fine fabrics, but one is clearly more robust. Choose based on your lifestyle, not just aesthetics.</p>`
          },
          {
            id: 'poly-skin-guide',
            title: 'Poly Skin Thickness Guide',
            tier: 'NOVA',
            readTime: '7 min',
            order: 2,
            content: `<h3>What is Poly Skin?</h3>
<p>Poly skin (also called PU skin) bases are made from a thin polyurethane membrane. Hair is injected directly into the material, creating a seamless, scalp-like appearance. The edge can be trimmed to create a custom hairline shape.</p>

<h3>Thickness Ratings and Their Effects</h3>
<p>Poly skin thickness is measured in millimeters. This single variable has a massive impact on both realism and durability:</p>

<ul>
<li><strong>0.03mm – 0.06mm (Ultra Thin):</strong> The skin appearance is the most realistic — nearly translucent. However, it tears easily and typically lasts only 2–6 weeks. Requires careful application and removal.</li>
<li><strong>0.08mm – 0.10mm (Thin):</strong> The sweet spot for most wearers. Good realism with significantly improved durability (2–4 months). The go-to choice for first-time buyers.</li>
<li><strong>0.12mm – 0.16mm (Medium):</strong> A robust base that can handle vigorous activity. The skin appearance becomes slightly more visible at very close range but is still natural-looking in everyday situations.</li>
</ul>

<h3>The Edge Question</h3>
<p>Poly skin edges can be finished in two ways: <strong>hard bond</strong> (the raw edge is glued down flat) and <strong>contour/beveled edge</strong> (the edge is trimmed at an angle to blend). Always request a beveled edge for a softer, more natural blend.</p>

<h3>Pro Tip</h3>
<p>If you're new to hair systems and prioritize low-maintenance, start with a 0.08–0.10mm thin skin. It forgives application errors far better than ultra-thin variants.</p>`
          },
          {
            id: 'mono-base',
            title: 'Monofilament: The Middle Ground',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 3,
            content: `<h3>What is Monofilament?</h3>
<p>Monofilament (mono) bases use a fine, transparent nylon or polyester mesh. Each hair strand is individually hand-knotted into the mesh, allowing the hair to move naturally in multiple directions — mimicking the way bio-hair grows from the scalp.</p>

<h3>Why Mono Wins on Comfort</h3>
<p>The breathable mesh allows air circulation, making mono bases significantly more comfortable in warm weather or during physical activity compared to poly skin. This is why mono tops are a popular choice for the crown area.</p>

<h3>Hybrid Systems</h3>
<p>Many premium hair systems combine base types for optimal results. A common configuration is:</p>
<ul>
<li><strong>Front:</strong> French lace (for a natural hairline)</li>
<li><strong>Top/Crown:</strong> Monofilament (for realistic parting and comfort)</li>
<li><strong>Perimeter:</strong> Thin poly skin (for secure, invisible bond)</li>
</ul>
<p>These hybrid designs offer the best of all worlds and are the preferred choice of experienced wearers.</p>`
          }
        ]
      },
      {
        id: 'sizing-fit',
        title: 'Sizing, Fit & Custom Templates',
        category: 'Fundamentals',
        readTime: '12 min',
        tier: 'NEBULA',
        order: 2,
        description: '<h3>The Geometry of Cranial Surface Area</h3><p>A precise template is the single most important factor in achieving a natural, secure fit. A 2mm error can cascade into adhesive failure.</p>',
        articles: [
          {
            id: 'measurement-guide',
            title: 'Standard Measurement Protocol',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: `<h3>The Four Critical Measurements</h3>
<p>Ordering a stock system requires accurate measurements. Use a flexible measuring tape and take all measurements while sitting with your head level.</p>

<ol>
<li><strong>Front to Back:</strong> From your desired hairline position straight back to where you want the system to end. Typical range: 5–8 inches.</li>
<li><strong>Ear to Ear (across top):</strong> From the top of one ear, across the crown, to the top of the other ear.</li>
<li><strong>Temple to Temple (across front):</strong> From one temple, following the natural hairline curve, to the other temple.</li>
<li><strong>Width at widest point:</strong> The widest left-to-right measurement of your bald area.</li>
</ol>

<h3>The "Bigger is Better" Rule</h3>
<p>When in doubt, order slightly larger. A system that's too large can be trimmed; a system that's too small cannot be extended. Most vendors recommend ordering 1/4 inch larger than your measurements in each dimension.</p>`
          },
          {
            id: 'template-creation',
            title: 'Creating a Custom Template (Saran Wrap Method)',
            tier: 'NOVA',
            readTime: '8 min',
            order: 2,
            content: `<h3>Why Custom Templates Matter</h3>
<p>The human scalp is not flat. It has a unique topography — curves, contours, and asymmetries — that makes a custom template far more accurate than measurements alone. A template captures the exact 3D shape of your balding area.</p>

<h3>Materials Required</h3>
<ul>
<li>Plastic cling wrap (Saran wrap)</li>
<li>Clear adhesive tape (Scotch tape)</li>
<li>A fine-tip permanent marker</li>
<li>Scissors</li>
</ul>

<h3>Step-by-Step Process</h3>
<ol>
<li>Clean and dry your scalp thoroughly.</li>
<li>Define your desired hairline with the marker — draw directly on your scalp.</li>
<li>Layer multiple pieces of cling wrap over the bald area, pressing firmly to conform to your scalp's shape.</li>
<li>Apply overlapping strips of clear tape over the cling wrap to create a rigid shell.</li>
<li>Carefully peel the template off. It should retain your scalp's exact shape.</li>
<li>Trim any excess with scissors, following the hairline you drew.</li>
<li>Flatten the template on white paper and trace the outline for a 2D reference.</li>
</ol>

<h3>Sending Your Template</h3>
<p>Most custom hair system vendors accept physical templates by mail. Some accept high-resolution photos of the template laid flat against a ruler for scale. Always include your hair specifications (color, density, wave pattern) along with the template.</p>`
          }
        ]
      },
      {
        id: 'ordering-first-system',
        title: 'Ordering Your First System',
        category: 'Fundamentals',
        readTime: '10 min',
        tier: 'NEBULA',
        order: 3,
        description: '<h3>Navigating the Vendor Landscape</h3><p>The global hair system market is vast and confusing. This guide helps you ask the right questions and avoid the most common first-order mistakes.</p>',
        articles: [
          {
            id: 'spec-sheet',
            title: 'Building Your Spec Sheet',
            tier: 'NEBULA',
            readTime: '6 min',
            order: 1,
            content: `<h3>What is a Spec Sheet?</h3>
<p>A spec sheet is a standardized document that communicates exactly what hair system you want to a vendor. Having a complete spec sheet eliminates ambiguity and protects you if the delivered system doesn't match your order.</p>

<h3>Core Specifications</h3>
<ul>
<li><strong>Base Type:</strong> French lace / Swiss lace / thin skin (0.08mm) / mono / hybrid</li>
<li><strong>Base Size:</strong> Dimensions from your template or measurements</li>
<li><strong>Hair Type:</strong> Human (Indian / Chinese / European) or synthetic</li>
<li><strong>Hair Color:</strong> Industry color code (e.g., #1B, #2, #4) — always request a color ring sample first</li>
<li><strong>Hair Length:</strong> In inches, measured from root to tip</li>
<li><strong>Hair Density:</strong> Light (80%) / Medium (120%) / Heavy (150%)</li>
<li><strong>Wave/Curl Pattern:</strong> Straight / slight wave / body wave / deep wave</li>
<li><strong>Hairline Type:</strong> Natural (graduated density) / slight graduation / straight across</li>
<li><strong>Knot Type:</strong> Single split / double split — single knots are less detectable</li>
</ul>

<h3>The Most Common Mistake</h3>
<p>Ordering density that is too heavy. Most first-time buyers choose "medium" density, which often looks unrealistically thick. For a natural appearance matching thinning bio-hair, request "light to medium" or specify 100–110%.</p>`
          },
          {
            id: 'vendor-guide',
            title: 'Evaluating Vendors',
            tier: 'NOVA',
            readTime: '7 min',
            order: 2,
            content: `<h3>The Major Vendor Categories</h3>
<p>The hair system supply chain has three tiers, each with different trade-offs:</p>

<h3>1. Direct-from-Factory (China-based)</h3>
<p>Vendors like Lordhair, New Times Hair, and LaVivid manufacture and sell directly. Prices are lowest ($80–$300 for custom), but communication can be challenging and quality control varies between orders.</p>
<p><strong>Best for:</strong> Experienced buyers who know their specs and want maximum value.</p>

<h3>2. Western Distributors</h3>
<p>Companies that source from factories but add quality control, English-speaking support, and faster shipping. Prices are higher ($200–$600) but the experience is smoother.</p>
<p><strong>Best for:</strong> First-time buyers who want hand-holding through the process.</p>

<h3>3. Salon Suppliers</h3>
<p>Professional-grade vendors who sell to hair replacement salons. Typically require a business license to purchase. Highest quality control, highest price.</p>
<p><strong>Best for:</strong> Professionals or those with very high standards.</p>

<h3>Red Flags to Avoid</h3>
<ul>
<li>No physical address or phone number</li>
<li>No return policy or quality guarantee</li>
<li>Stock photos only (no real customer photos)</li>
<li>Prices that seem impossibly low (under $50 for "custom")</li>
</ul>`
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. MATERIALS
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'base-fiber',
    name: 'Materials',
    description: 'The material science of hair fibers, colors, and base fabrics.',
    physicsTheme: 'Material Science',
    iconName: 'Microscope',
    order: 2,
    topics: [
      {
        id: 'human-vs-synthetic',
        title: 'Human Hair vs. Synthetic Fiber',
        category: 'Materials',
        readTime: '15 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>Organic vs. Engineered Polymers</h3><p>A side-by-side analysis of the look, feel, styling behavior, cost, and longevity of human hair versus synthetic fiber systems.</p>',
        articles: [
          {
            id: 'human-hair-biology',
            title: 'The Structure of Human Hair',
            tier: 'NEBULA',
            readTime: '6 min',
            order: 1,
            content: `<h3>Anatomy of a Hair Strand</h3>
<p>Human hair has three layers: the <strong>cuticle</strong> (the protective outer scale layer), the <strong>cortex</strong> (the structural core that determines strength and color), and the <strong>medulla</strong> (the central channel, often absent in fine hair).</p>

<h3>Why Cuticle Direction Matters</h3>
<p>In naturally growing hair, all cuticle scales point in the same direction — from root to tip. This is called <strong>Remy hair</strong>. In non-Remy processing, hairs are collected randomly and mixed, causing cuticles to point in opposite directions and tangle severely after washing.</p>

<h3>Hair Origin and Quality</h3>
<ul>
<li><strong>Indian Hair:</strong> The most common. Fine to medium texture, slight natural wave. Takes color well. Good value.</li>
<li><strong>Chinese Hair:</strong> Thicker, straighter, and coarser. More durable but less naturally "fine." Best for Asian hair types.</li>
<li><strong>European Hair:</strong> The finest and most expensive. Rare, extremely soft texture. Very difficult to source authentically.</li>
</ul>

<h3>The Oxidation Reality</h3>
<p>All human hair in systems has been chemically processed. This means it will oxidize (turn reddish-orange) with UV exposure over time — typically within 3–6 months. This is not a defect; it is chemistry. See the Color Theory module for correction protocols.</p>`
          },
          {
            id: 'synthetic-fiber',
            title: 'Synthetic Fiber Technology',
            tier: 'NOVA',
            readTime: '7 min',
            order: 2,
            content: `<h3>Modern Synthetic Fibers</h3>
<p>Synthetic hair is engineered from polymers, primarily modacrylic (Kanekalon) or proprietary blends (Cyberhair, Futura). Modern high-grade synthetics have improved dramatically and can be difficult to distinguish from human hair at a distance.</p>

<h3>Advantages of Synthetic</h3>
<ul>
<li><strong>Color stability:</strong> Synthetic fibers do not oxidize. The color you order is the color you keep.</li>
<li><strong>Cost:</strong> Significantly cheaper than human hair systems.</li>
<li><strong>Low maintenance:</strong> Does not require conditioning or protein treatments.</li>
<li><strong>Weather resistance:</strong> Humidity does not cause frizz the same way it does with human hair.</li>
</ul>

<h3>Disadvantages of Synthetic</h3>
<ul>
<li><strong>Cannot be heat styled:</strong> Standard synthetics melt under heat tools. Only "heat-resistant" synthetics can be styled with low heat.</li>
<li><strong>Shorter lifespan:</strong> Fiber degrades and loses sheen faster than human hair.</li>
<li><strong>Less versatile:</strong> Cannot be colored or chemically processed.</li>
<li><strong>Texture tell:</strong> Under very close examination, the uniform sheen of synthetic fiber can look unnatural.</li>
</ul>

<h3>The Verdict</h3>
<p>For a daily-wear, fully styled system, human hair is superior. For low-maintenance casual wear or budget-conscious wearers, quality synthetic is a viable option.</p>`
          }
        ]
      },
      {
        id: 'color-theory',
        title: 'Color Science: Matching & Oxidation',
        category: 'Materials',
        readTime: '15 min',
        tier: 'NEBULA',
        order: 2,
        description: '<h3>The Physics of Color Perception</h3><p>Matching hair color is one of the most technically challenging aspects of hair replacement. Learn the industry color system and how to combat oxidation.</p>',
        articles: [
          {
            id: 'color-codes',
            title: 'Decoding Industry Color Codes',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: `<h3>The Industry Color Number System</h3>
<p>The hair industry uses a standardized number system for color. Understanding it prevents ordering the wrong shade.</p>

<h3>Core Color Numbers</h3>
<ul>
<li><strong>#1:</strong> Jet black (pure black with a blue tint)</li>
<li><strong>#1B:</strong> Off-black (the most natural-looking "black" — has slight warmth)</li>
<li><strong>#2:</strong> Darkest brown</li>
<li><strong>#3:</strong> Dark brown</li>
<li><strong>#4:</strong> Medium brown</li>
<li><strong>#6:</strong> Light brown / chestnut</li>
<li><strong>#8:</strong> Medium blonde (light brown)</li>
<li><strong>#10:</strong> Light golden blonde</li>
<li><strong>#22:</strong> Platinum blonde</li>
<li><strong>#60:</strong> White blonde</li>
<li><strong>#Grey shades:</strong> 1B/65 (salt & pepper), 44/65 (mostly grey), etc.</li>
</ul>

<h3>Ordering a Color Ring</h3>
<p>Never order a hair system based on online photos alone. Monitor color rendering varies wildly. Always request a physical color ring (swatch card) from your vendor before your first order. Most vendors sell them for $5–15.</p>

<h3>Pro Tip: Order Slightly Darker</h3>
<p>Due to oxidation, hair systems tend to get lighter and warmer over time. Ordering one shade darker than your target color compensates for this drift and extends the color lifecycle of your system.</p>`
          },
          {
            id: 'oxidation-correction',
            title: 'Correcting Oxidation (Brassiness)',
            tier: 'GALAXY',
            readTime: '10 min',
            order: 2,
            content: `<h3>Why Hair Systems Turn Red/Orange</h3>
<p>Human hair contains melanin pigments. During chemical processing (bleaching, coloring), the protective cuticle is opened, making the hair porous and highly susceptible to UV-induced oxidation. The result: warm, brassy, orange-red tones that appear within months.</p>

<h3>The Color Wheel Solution</h3>
<p>Correcting brassiness uses basic color wheel theory. Opposite colors neutralize each other:</p>
<ul>
<li><strong>Orange/Brassy:</strong> Neutralize with blue-toned toners or shampoos</li>
<li><strong>Red/Copper:</strong> Neutralize with green-toned toners</li>
<li><strong>Yellow/Pale:</strong> Neutralize with purple/violet toners</li>
</ul>

<h3>Blue/Silver Shampoo Protocol</h3>
<p>For mild brassiness (Stage 1–2 oxidation), purple or blue shampoo is the first line of defense:</p>
<ol>
<li>Wet the system with cool water.</li>
<li>Apply blue/silver shampoo and work into a lather.</li>
<li>Leave on for 3–5 minutes (longer = more toning effect).</li>
<li>Rinse thoroughly with cool water.</li>
<li>Follow with a deep conditioner.</li>
</ol>

<h3>Professional Toning</h3>
<p>For severe oxidation, a professional semi-permanent toner (e.g., Wella T18 or T11 mixed with developer) can dramatically restore the color. This should be done off the head with the system soaked in the toner solution for 15–20 minutes. Monitor closely to avoid over-toning.</p>

<h3>Prevention Protocol</h3>
<p>Store unused systems away from UV light. Apply a UV-protectant leave-in spray before sun exposure. Rotate between two systems to reduce total UV exposure per unit.</p>`
          }
        ]
      },
      {
        id: 'density-guide',
        title: 'Hair Density: The Science of Natural Look',
        category: 'Materials',
        readTime: '10 min',
        tier: 'NEBULA',
        order: 3,
        description: '<h3>Why Density is the #1 Ordering Mistake</h3><p>More hair does not mean more natural. Understanding density percentages and how they interact with your existing bio-hair is critical.</p>',
        articles: [
          {
            id: 'density-percentages',
            title: 'Understanding Density Percentages',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: `<h3>What Does "Density" Mean?</h3>
<p>Density refers to how many hair strands are ventilated per square inch of base material. It is expressed as a percentage of "full natural hair" density:</p>
<ul>
<li><strong>70–80%:</strong> Very light / thin — for advanced thinning or an aged look</li>
<li><strong>90–100%:</strong> Light to medium — the most natural-looking for most adults over 30</li>
<li><strong>110–120%:</strong> Medium — appropriate for younger wearers with naturally thick bio-hair</li>
<li><strong>130–150%:</strong> Heavy — rarely looks natural for men; appears wig-like to trained eyes</li>
</ul>

<h3>The Most Common Mistake</h3>
<p>First-time buyers almost universally order too much density. The instinct is "more hair = better," but natural adult male hair density is considerably lighter than a full "medium" system. The result looks obviously artificial.</p>

<h3>The Blending Rule</h3>
<p>Your system's density at the perimeter (hairline and sides) should match or be slightly lighter than your existing bio-hair. Transition zones where system hair meets bio-hair must be seamless. Ask your vendor for a "graduated density" hairline — lighter at the front edge, gradually increasing toward the crown.</p>`
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. SECUREMENT (BONDING PHYSICS)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'securement',
    name: 'Securement',
    description: 'The physics of adhesion, tape, glue, and achieving a bond that lasts.',
    physicsTheme: 'Bonding Physics',
    iconName: 'ShieldCheck',
    order: 3,
    topics: [
      {
        id: 'adhesive-types',
        title: 'Adhesive Types: Tape vs. Glue',
        category: 'Securement',
        readTime: '15 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>The Chemistry of Surface Adhesion</h3><p>Every bonding method involves a chemical or mechanical bond between your scalp and the system base. Understanding the chemistry helps you choose the right product for your lifestyle.</p>',
        articles: [
          {
            id: 'tape-guide',
            title: 'The Complete Guide to Tape',
            tier: 'NEBULA',
            readTime: '8 min',
            order: 1,
            content: `<h3>How Hair System Tape Works</h3>
<p>Hair system tapes use pressure-sensitive adhesive (PSA) — the same fundamental chemistry as surgical tape, but formulated for extended skin contact and perspiration resistance. The adhesive is coated on one or both sides of a carrier film (usually polyethylene).</p>

<h3>Tape Types and Hold Duration</h3>
<ul>
<li><strong>Walker Tape "Sensi-Tak" / "Extenda-Bond":</strong> Industry standard. Medium hold, 1–3 weeks. Good for most wearers.</li>
<li><strong>Supertape:</strong> Strong hold, 2–4 weeks. More water resistant. Requires more effort to remove cleanly.</li>
<li><strong>3M 1522 Medical Tape:</strong> Ultra-strong, ultra-thin. Popular with swimmers and athletes. 4–6 weeks hold. More difficult to remove without residue.</li>
<li><strong>No-Shine / Scalp Protector strips:</strong> Ultra-thin, designed for lace fronts. Short hold (1–2 weeks) but virtually invisible at the hairline.</li>
</ul>

<h3>Application Protocol</h3>
<ol>
<li>Clean scalp thoroughly with isopropyl alcohol (IPA) to remove all oil and residue.</li>
<li>Allow to dry completely (2 minutes minimum).</li>
<li>Apply scalp protector/primer to sensitive areas.</li>
<li>Place tape strips on the perimeter of the system base (or directly on scalp for scalp-first method).</li>
<li>Peel protective backing, align system carefully, and press firmly for 30 seconds.</li>
</ol>

<h3>Removal Without Damage</h3>
<p>Never pull the system off dry. Always use an adhesive solvent (Ghost Bond Remover, C-22, or isopropyl alcohol) to break down the adhesive bond before removal. Apply around the perimeter, wait 30 seconds, then gently lift the edge.</p>`
          },
          {
            id: 'glue-guide',
            title: 'Liquid Adhesives: A Practical Guide',
            tier: 'NOVA',
            readTime: '8 min',
            order: 2,
            content: `<h3>Liquid Adhesive Chemistry</h3>
<p>Liquid hair system adhesives fall into two major chemical categories, each with very different behavior:</p>

<h3>Water-Based Adhesives</h3>
<p>Examples: Ghost Bond, Ghost Bond XL, Lace Front Glue</p>
<ul>
<li>White when wet, clear when dry</li>
<li>Gentler on the scalp and base material</li>
<li>Easier to remove (breaks down with water and IPA)</li>
<li>Hold duration: 1–3 weeks depending on sweat/activity level</li>
<li><strong>Best for:</strong> Sensitive skin, lace bases, beginners</li>
</ul>

<h3>Acrylic / Solvent-Based Adhesives</h3>
<p>Examples: Ultra Hold, Salon Pro 30 Sec, Bold Hold</p>
<ul>
<li>Typically clear</li>
<li>Extremely strong bond — resistant to water, sweat, and heat</li>
<li>Requires dedicated solvent for removal (C-22 Solvent, Lace Release)</li>
<li>Hold duration: 3–6 weeks</li>
<li><strong>Best for:</strong> Active lifestyles, swimmers, poly skin bases</li>
</ul>

<h3>Application Technique ("Tack Method")</h3>
<ol>
<li>Apply a thin, even layer of adhesive to the scalp perimeter (or system base).</li>
<li>Allow to become "tacky" — typically 2–5 minutes depending on the product.</li>
<li>For maximum hold: apply a second coat, allow to tack again.</li>
<li>Press system firmly into place and hold for 60 seconds.</li>
</ol>

<h3>Critical Warning</h3>
<p>Never use superglue (cyanoacrylate) on hair systems. It bonds instantly and irreversibly to lace and poly skin, destroying the base. It is also a severe skin sensitizer.</p>`
          }
        ]
      },
      {
        id: 'scalp-prep',
        title: 'Scalp Preparation: The Foundation of Bond',
        category: 'Securement',
        readTime: '10 min',
        tier: 'NEBULA',
        order: 2,
        description: '<h3>Why 80% of Bond Failures Start Before Application</h3><p>The quality of your bond is determined primarily by scalp preparation, not adhesive strength. A contaminated surface defeats even the strongest adhesive.</p>',
        articles: [
          {
            id: 'scalp-prep-protocol',
            title: 'The Complete Scalp Prep Protocol',
            tier: 'NEBULA',
            readTime: '8 min',
            order: 1,
            content: `<h3>The Three Enemies of Bond</h3>
<p>Adhesive bond fails for three primary reasons, all preventable:</p>
<ol>
<li><strong>Oil:</strong> Natural scalp sebum is a release agent. Even trace amounts prevent adhesion.</li>
<li><strong>Moisture:</strong> Sweat and water break down adhesive chemistry at the interface.</li>
<li><strong>Old adhesive residue:</strong> Layers of old adhesive create an uneven, contaminated surface.</li>
</ol>

<h3>The Standard Prep Protocol</h3>
<ol>
<li><strong>Remove old system</strong> using appropriate solvent — never force removal.</li>
<li><strong>Remove all adhesive residue</strong> from scalp using C-22 or similar solvent on a cotton pad. Work in circular motions until all residue is gone.</li>
<li><strong>Wash scalp</strong> with scalp-specific shampoo (clarifying formula). No conditioner.</li>
<li><strong>Dry thoroughly</strong> — towel dry, then allow 5–10 minutes of air drying. A hairdryer on cool setting can accelerate this.</li>
<li><strong>Degrease with IPA:</strong> Wipe entire bond area with 91%+ isopropyl alcohol on a lint-free cloth. This removes the final layer of sebum that washing misses. Allow to fully evaporate (2 minutes).</li>
<li><strong>Apply scalp protector</strong> (optional but recommended): Products like Skin Protector or Scalp Shield create a barrier that protects skin from prolonged adhesive contact and can improve bond consistency.</li>
</ol>

<h3>Bond Duration Benchmark</h3>
<p>Wearers who follow this protocol consistently report hold times 40–60% longer than those who skip steps. The IPA degreasing step alone accounts for the majority of this improvement.</p>`
          }
        ]
      },
      {
        id: 'active-lifestyle-bond',
        title: 'Bonding for Active Lifestyles',
        category: 'Securement',
        readTime: '12 min',
        tier: 'NOVA',
        order: 3,
        description: '<h3>Sweat, Water, and Physical Stress</h3><p>Standard bonding protocols fail under athletic conditions. Learn the modifications required for gym workouts, swimming, and contact sports.</p>',
        articles: [
          {
            id: 'gym-protocol',
            title: 'Gym & Workout Protocol',
            tier: 'NOVA',
            readTime: '6 min',
            order: 1,
            content: `<h3>The Sweat Challenge</h3>
<p>Sweat is primarily water with dissolved salts and proteins. It penetrates under the bond perimeter and acts as a hydraulic wedge, progressively weakening adhesion. The scalp also generates heat during exercise, which softens most adhesives.</p>

<h3>Optimizing for Gym Use</h3>
<ul>
<li><strong>Adhesive selection:</strong> Use acrylic-based adhesives (Ultra Hold, Bold Hold) for maximum sweat resistance. Avoid water-based formulas on gym days.</li>
<li><strong>Extend the bond perimeter:</strong> Rather than just the hairline, bond the entire base perimeter including the back and sides.</li>
<li><strong>Wear a headband:</strong> A moisture-wicking headband absorbs sweat at the hairline before it can reach the bond edge.</li>
<li><strong>Post-workout:</strong> Rinse sweat from the hair as soon as possible after training to prevent residue buildup.</li>
</ul>

<h3>Recommended Products</h3>
<ul>
<li>Ghost Bond XL (water-based but enhanced formula)</li>
<li>Bold Hold Active (specifically formulated for athletic use)</li>
<li>Walker Tape "Extenda-Bond Plus" (tape with enhanced sweat resistance)</li>
</ul>`
          },
          {
            id: 'swimming-protocol',
            title: 'Swimming with a Hair System',
            tier: 'GALAXY',
            readTime: '8 min',
            order: 2,
            content: `<h3>Can You Swim with a Hair System?</h3>
<p>Yes — with the correct adhesive, base type, and protocol. Many wearers swim regularly, including in chlorinated pools and saltwater. However, it requires preparation.</p>

<h3>Base Selection for Swimming</h3>
<p>Avoid lace for swimming. The mesh structure allows water to penetrate directly under the bond. Thin poly skin provides the most water-resistant surface because the solid membrane limits water ingress to the perimeter edges only.</p>

<h3>Adhesive for Swimmers</h3>
<p>Use 3M 1522 tape or a strong acrylic adhesive (Ultra Hold) with the "double tack" application method. Apply adhesive, allow to tack fully, apply second coat, tack again, then bond.</p>

<h3>Before Swimming</h3>
<ol>
<li>Check the perimeter for any lifting edges — address them before entering water.</li>
<li>Pre-wet hair with fresh water before entering a chlorinated pool. This reduces chlorine absorption.</li>
<li>Apply a leave-in conditioner or oil to the hair to create a barrier.</li>
</ol>

<h3>After Swimming</h3>
<ol>
<li>Rinse hair immediately and thoroughly with fresh, cool water.</li>
<li>Apply a clarifying or chelating shampoo to remove chlorine/salt deposits.</li>
<li>Deep condition — chlorine is extremely drying.</li>
<li>Check and reinforce any weakened perimeter edges before they lift further.</li>
</ol>`
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. MAINTENANCE (ENTROPY CONTROL)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Cleaning, conditioning, and storage protocols to maximize the lifespan of your system.',
    physicsTheme: 'Entropy Control',
    iconName: 'Droplet',
    order: 4,
    topics: [
      {
        id: 'cleaning-protocol',
        title: 'Cleaning Your System: The Full Protocol',
        category: 'Maintenance',
        readTime: '15 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>Entropy Management</h3><p>A hair system is in constant entropy — breaking down from sweat, product buildup, UV, and mechanical stress. A disciplined cleaning protocol is the primary tool for slowing this decay.</p>',
        articles: [
          {
            id: 'on-head-cleaning',
            title: 'On-Head Cleaning (Between Removals)',
            tier: 'NEBULA',
            readTime: '7 min',
            order: 1,
            content: `<h3>When to Clean On-Head</h3>
<p>Between full removal and deep cleaning cycles (typically every 3–4 weeks for bonded wearers), you can wash the system while still attached. This is simpler than removal but less thorough.</p>

<h3>On-Head Washing Protocol</h3>
<ol>
<li><strong>Detangle first:</strong> Use a wide-tooth comb or detangling spray, working from ends to roots. Never brush from the roots down — this creates knot shedding.</li>
<li><strong>Wet with cool to lukewarm water:</strong> Hot water accelerates adhesive degradation and cuticle damage. Keep water temperature below 38°C (100°F).</li>
<li><strong>Apply sulfate-free shampoo:</strong> Work into a gentle lather, massaging in the direction of hair growth. Avoid circular motions that tangle hair.</li>
<li><strong>Rinse thoroughly:</strong> Product residue left in the system causes buildup that dulls appearance and weighs hair down.</li>
<li><strong>Apply conditioner:</strong> Focus on mid-lengths and ends, not the root/bond area. Allow to sit for 2–3 minutes.</li>
<li><strong>Rinse with cool water:</strong> Cool water helps seal the cuticle.</li>
<li><strong>Pat (never rub) dry</strong> with a microfiber towel.</li>
<li><strong>Detangle while damp</strong> and allow to air dry or use a diffuser on low heat.</li>
</ol>

<h3>Product Recommendations</h3>
<ul>
<li><strong>Shampoo:</strong> Sulfate-free, moisturizing formula (e.g., OGX Argan Oil, Pureology Hydrate)</li>
<li><strong>Conditioner:</strong> Protein-enriched formula to reinforce processed hair structure</li>
<li><strong>Leave-in:</strong> UV-protectant spray (essential to slow oxidation)</li>
</ul>`
          },
          {
            id: 'off-head-deep-clean',
            title: 'Off-Head Deep Cleaning Protocol',
            tier: 'NOVA',
            readTime: '8 min',
            order: 2,
            content: `<h3>Why Deep Cleaning Matters</h3>
<p>On-head washing cannot fully remove adhesive residue from the base, product buildup at the root, or the accumulated oils that degrade base material over time. Deep cleaning every 4–6 weeks dramatically extends system lifespan.</p>

<h3>Materials Required</h3>
<ul>
<li>A shallow bowl or sink</li>
<li>Adhesive remover/solvent</li>
<li>Clarifying shampoo</li>
<li>Deep conditioning treatment or hair mask</li>
<li>Wide-tooth comb</li>
<li>Microfiber towel</li>
<li>Wig stand or foam head</li>
</ul>

<h3>Deep Clean Protocol</h3>
<ol>
<li><strong>Remove system</strong> using solvent. Never pull dry.</li>
<li><strong>Remove all adhesive residue from base:</strong> Lay system on a flat surface and apply adhesive remover to the base. Gently rub with fingertips until all residue dissolves. Rinse.</li>
<li><strong>Clarifying shampoo soak:</strong> Fill a bowl with cool water and a small amount of clarifying shampoo. Submerge system and gently agitate for 2–3 minutes. Do not scrub.</li>
<li><strong>Rinse thoroughly.</strong></li>
<li><strong>Deep condition:</strong> Apply a generous amount of hair mask or deep conditioner. Place system in a plastic bag or wrap in cling wrap. Leave for 15–30 minutes.</li>
<li><strong>Rinse with cool water.</strong></li>
<li><strong>Mount on wig stand</strong> and gently comb through while damp.</li>
<li><strong>Air dry completely</strong> before re-applying or storing.</li>
</ol>`
          }
        ]
      },
      {
        id: 'storage',
        title: 'Storage & System Rotation',
        category: 'Maintenance',
        readTime: '8 min',
        tier: 'NEBULA',
        order: 2,
        description: '<h3>The Two-System Strategy</h3><p>Owning and rotating two systems is the single highest-leverage maintenance decision you can make. Learn how to store systems correctly to preserve base integrity and hair quality.</p>',
        articles: [
          {
            id: 'storage-protocol',
            title: 'How to Store Your System Correctly',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: `<h3>The Enemies of Stored Systems</h3>
<p>When not in use, hair systems are damaged by three environmental factors:</p>
<ul>
<li><strong>UV Light:</strong> Causes oxidation (color shift) and fiber degradation</li>
<li><strong>Humidity:</strong> Can cause mold growth in the base material</li>
<li><strong>Compression:</strong> Flattens hair, deforms the base</li>
</ul>

<h3>Proper Storage Protocol</h3>
<ol>
<li>Ensure the system is completely clean and dry before storage — never store a damp system.</li>
<li>Mount on a wig stand or foam head to maintain shape and allow airflow.</li>
<li>Store in a cool, dry place away from direct sunlight or artificial UV sources.</li>
<li>Cover loosely with a breathable cloth (not an airtight bag).</li>
<li>Apply a light leave-in conditioner before storage to prevent fiber drying.</li>
</ol>

<h3>The Two-System Rotation</h3>
<p>The most effective maintenance strategy is owning two systems and alternating on a 4-week cycle. System A is worn for 4 weeks, then deep cleaned and rested while System B is worn. This gives each system a full recovery period, dramatically extending the life of both units. The total cost is offset by the extended lifespan of each system.</p>`
          }
        ]
      },
      {
        id: 'lifespan-extension',
        title: 'Extending System Lifespan',
        category: 'Maintenance',
        readTime: '12 min',
        tier: 'NOVA',
        order: 3,
        description: '<h3>Practical Repairs and Preventive Measures</h3><p>Small tears and lifted edges are inevitable. Learn when to repair and when to replace, and how to execute emergency fixes.</p>',
        articles: [
          {
            id: 'lace-repair',
            title: 'Repairing Lace Tears',
            tier: 'NOVA',
            readTime: '7 min',
            order: 1,
            content: `<h3>Assessing the Damage</h3>
<p>Lace tears fall into two categories:</p>
<ul>
<li><strong>Edge tears:</strong> Tears at the perimeter bond area. Can usually be repaired and the damaged section re-bonded.</li>
<li><strong>Field tears:</strong> Tears in the middle of the base. More complex to repair and may compromise the system's structural integrity.</li>
</ul>

<h3>Emergency Repair Protocol (Field Tears)</h3>
<ol>
<li>Clean the torn area thoroughly with IPA — any oil or residue will prevent repair adhesive from bonding.</li>
<li>Cut a small piece of replacement lace (same type as your base) slightly larger than the tear.</li>
<li>Apply a thin layer of clear lace glue or Ghost Bond to the patch piece.</li>
<li>Carefully position over the tear from underneath the base, pressing firmly.</li>
<li>Allow to cure for 10–15 minutes before handling.</li>
</ol>

<h3>Knot Sealing</h3>
<p>Knot sealers (such as Got2b Glued Spiking Glue or dedicated knot sealers) are applied to the underside of the base to prevent hair shedding. Apply after every deep clean when the base is completely dry. Use sparingly — excess product creates a shiny, visible coating on the base.</p>`
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. LIFESTYLE (APPLIED DYNAMICS)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Navigating relationships, social situations, disclosure, and mental wellness as a wearer.',
    physicsTheme: 'Applied Dynamics',
    iconName: 'Zap',
    order: 5,
    topics: [
      {
        id: 'disclosure',
        title: 'Disclosure: Who to Tell and When',
        category: 'Lifestyle',
        readTime: '12 min',
        tier: 'NEBULA',
        order: 1,
        description: '<h3>The Social Physics of Disclosure</h3><p>There is no universally correct answer. This module provides a framework for making disclosure decisions based on relationship type, personal values, and risk tolerance.</p>',
        articles: [
          {
            id: 'disclosure-framework',
            title: 'A Framework for Disclosure Decisions',
            tier: 'NEBULA',
            readTime: '8 min',
            order: 1,
            content: `<h3>The Core Question</h3>
<p>Disclosure is a personal decision with no objectively correct answer. The framework below helps you think through the decision systematically rather than reactively.</p>

<h3>The Relationship Spectrum</h3>
<p>Consider the relationship type before deciding:</p>
<ul>
<li><strong>Acquaintances & Coworkers:</strong> You have no obligation to disclose. Hair is a personal grooming choice. You would not announce a dental implant or colored contact lenses.</li>
<li><strong>Close Friends:</strong> Disclosure is optional but often reduces anxiety. Most close friends respond with support and curiosity, not judgment.</li>
<li><strong>Romantic Partners (new):</strong> The timing question. Most experienced wearers recommend early disclosure — within the first few dates — to build a foundation of trust before emotional investment deepens on both sides.</li>
<li><strong>Long-term Partners:</strong> This is the context where non-disclosure creates the most stress. Partners who share physical intimacy will likely discover the system regardless, making proactive disclosure the path of least anxiety.</li>
</ul>

<h3>The Confidence Variable</h3>
<p>Research on disclosure consistently shows that the delivery matters more than the content. A matter-of-fact disclosure delivered with confidence ("I wear a hair system — it's a non-surgical hair replacement") generates far less negative reaction than an anxious, apologetic one that signals the wearer believes something is wrong.</p>

<h3>The Practical Reality</h3>
<p>Modern hair systems, properly applied and maintained, are not detectable in normal social interactions. The anxiety most wearers feel about "being discovered" is disproportionate to the actual risk. Focus on quality installation over disclosure anxiety.</p>`
          },
          {
            id: 'partner-disclosure',
            title: 'Telling a Partner or Date',
            tier: 'NOVA',
            readTime: '7 min',
            order: 2,
            content: `<h3>The "Touch Test" Anxiety</h3>
<p>The most common fear is physical intimacy — a partner running their fingers through the hair and detecting the system. This is a legitimate concern for poorly fitted or low-quality systems, but becomes largely irrelevant with a properly bonded, well-maintained unit.</p>

<h3>What Partners Actually Notice</h3>
<p>Most partners, when surveyed, report that they were not able to detect a properly fitted system. The more common discovery pathway is seeing the system off the head — reinforcing why storage discretion matters in shared living spaces.</p>

<h3>A Script for Disclosure</h3>
<p>Keep it brief and neutral: <em>"I want to be upfront with you — I wear a hair system. It's a non-surgical hair replacement that I've been using for [X time]. I feel good about it and wanted you to know."</em></p>
<p>Then stop talking. Resist the urge to over-explain, apologize, or pre-emptively defend. Give the other person space to respond.</p>

<h3>After Disclosure</h3>
<p>Most responses are positive or neutral. If a person responds with rejection or ridicule, they have revealed something about their character, not yours. Wearing a hair system is a pragmatic solution to a biological reality shared by millions of men.</p>`
          }
        ]
      },
      {
        id: 'confidence-mindset',
        title: 'Confidence & Mental Wellness',
        category: 'Lifestyle',
        readTime: '10 min',
        tier: 'NEBULA',
        order: 2,
        description: '<h3>The Psychology of Hair Loss and Restoration</h3><p>Hair loss has measurable psychological effects. This module addresses the mental side of the journey — from the initial decision through integration into daily life.</p>',
        articles: [
          {
            id: 'hair-loss-psychology',
            title: 'Understanding the Psychology of Hair Loss',
            tier: 'NEBULA',
            readTime: '5 min',
            order: 1,
            content: `<h3>The Research is Clear</h3>
<p>Hair loss affects self-esteem, body image, and social confidence in measurable ways. Studies show men with significant hair loss report lower self-rated attractiveness and higher social anxiety — not because baldness is objectively negative, but because it represents a loss of control over one's appearance.</p>

<h3>The Decision to Wear</h3>
<p>The decision to wear a hair system is a decision to exercise control over your appearance. Research on hair replacement consistently shows significant improvements in self-esteem, social confidence, and reported quality of life post-adoption. This is not vanity — it is a practical response to a documented psychological stressor.</p>

<h3>The Learning Curve</h3>
<p>Most new wearers experience significant anxiety in the first 1–3 months. The fear of detection, the complexity of maintenance, and the psychological adjustment to a new self-image all contribute. This anxiety is normal and temporary. The community consensus is that full psychological comfort typically arrives between months 3 and 6.</p>

<h3>Perspective</h3>
<p>Millions of men worldwide wear hair systems. Celebrities, athletes, executives, and everyday men use non-surgical hair replacement as a routine aspect of self-care. The stigma associated with "toupees" is a cultural artifact from decades past — modern systems bear no resemblance to the punchline they replaced.</p>`
          },
          {
            id: 'confidence-building',
            title: 'Building Confidence as a Wearer',
            tier: 'NOVA',
            readTime: '6 min',
            order: 2,
            content: `<h3>The Confidence Feedback Loop</h3>
<p>Confidence in wearing a hair system is self-reinforcing. The more confident you appear, the less attention others pay to your hair. The less scrutiny you experience, the more confident you become. The goal is to enter this loop.</p>

<h3>Practical Confidence Builders</h3>
<ul>
<li><strong>Invest in professional installation for your first few applications.</strong> Seeing a properly installed system in a professional mirror calibrates your standard and demonstrates what's achievable.</li>
<li><strong>Get a professional cut and blend.</strong> A skilled barber who understands hair systems can dramatically improve the final result by blending your bio-hair into the system seamlessly.</li>
<li><strong>Focus on quality over cost initially.</strong> A $300 well-fitted system installs more confidence than a $100 system that requires constant adjustment.</li>
<li><strong>Engage with the community.</strong> Forums and communities of experienced wearers provide practical advice and normalize the experience.</li>
</ul>

<h3>The "It's Just Hair" Reframe</h3>
<p>At some point in every wearer's journey, they reach what veterans call "the reframe" — the moment where wearing a system becomes as routine and unremarkable as wearing glasses or contact lenses. The goal is not to hide something shameful, but to maintain an appearance that reflects how you feel on the inside.</p>`
          }
        ]
      },
      {
        id: 'travel-special-situations',
        title: 'Travel, Sports & Special Situations',
        category: 'Lifestyle',
        readTime: '10 min',
        tier: 'NOVA',
        order: 3,
        description: '<h3>Logistics for Edge Cases</h3><p>Airport security, beach vacations, contact sports, and medical situations all present unique challenges. Practical solutions for each.</p>',
        articles: [
          {
            id: 'airport-security',
            title: 'Navigating Airport Security',
            tier: 'NOVA',
            readTime: '5 min',
            order: 1,
            content: `<h3>The TSA Question</h3>
<p>Modern metal detectors and body scanners do not trigger on hair systems. The bases are non-metallic and the adhesives are below the threshold for detection. You will not be flagged by standard airport security equipment.</p>

<h3>If Asked</h3>
<p>In rare cases, TSA or customs officers may ask about a head covering or unusual scalp appearance during a pat-down. You are under no obligation to disclose the nature of a hair system, but stating simply "I wear a hair prosthetic" typically resolves the situation immediately. Hair systems are classified as prosthetic devices in most medical contexts.</p>

<h3>Travel Maintenance Kit</h3>
<p>Pack a compact maintenance kit for trips of 3+ days:</p>
<ul>
<li>Adhesive solvent (check carry-on liquid rules — bottle under 100ml)</li>
<li>Backup tape strips (no liquid rules apply)</li>
<li>Mini clarifying shampoo and conditioner</li>
<li>Detangling spray</li>
<li>Wide-tooth comb</li>
</ul>
<p>Consider packing a backup system for trips over 1 week, especially in humid or high-activity environments.</p>`
          }
        ]
      }
    ]
  }
];

export const KBMigration: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ categories: 0, topics: 0, articles: 0 });

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const runMigration = async () => {
    setStatus('running');
    setLog([]);

    let catCount = 0, topicCount = 0, articleCount = 0;

    try {
      for (const category of STATIC_CATEGORIES) {
        const { topics, ...categoryData } = category;
        await setDoc(doc(db, 'kb_categories', category.id), {
          ...categoryData,
          createdAt: serverTimestamp()
        });
        addLog(`✅ Category: ${category.name}`);
        catCount++;

        for (const topic of topics) {
          const { articles, ...topicData } = topic;
          await setDoc(
            doc(db, 'kb_categories', category.id, 'kb_topics', topic.id),
            { ...topicData, createdAt: serverTimestamp() }
          );
          addLog(`  ✅ Topic: ${topic.title}`);
          topicCount++;

          for (const article of articles) {
            await setDoc(
              doc(db, 'kb_categories', category.id, 'kb_topics', topic.id, 'kb_articles', article.id),
              { ...article, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
            );
            addLog(`    ✅ Article: ${article.title}`);
            articleCount++;
          }
        }
        setProgress({ categories: catCount, topics: topicCount, articles: articleCount });
      }

      addLog('');
      addLog(`🎉 Migration complete! ${catCount} categories, ${topicCount} topics, ${articleCount} articles.`);
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
        <p className="text-slate-400 text-sm mb-2">
          Migrates all 5 KB categories with full article content to Firestore.
        </p>
        <p className="text-amber-400 text-xs mb-6">⚠️ This will overwrite existing KB data. Run once only.</p>

        {status === 'running' && (
          <div className="flex gap-4 mb-4 text-xs text-slate-400">
            <span>📁 {progress.categories} categories</span>
            <span>📄 {progress.topics} topics</span>
            <span>📝 {progress.articles} articles</span>
          </div>
        )}

        <button
          onClick={runMigration}
          disabled={status === 'running' || status === 'done'}
          className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'idle' && 'Run Migration'}
          {status === 'running' && '⏳ Migrating...'}
          {status === 'done' && '✅ Migration Complete!'}
          {status === 'error' && '🔄 Retry'}
        </button>

        {log.length > 0 && (
          <div className="mt-6 bg-dark-900 rounded-xl p-4 font-mono text-xs space-y-1 max-h-80 overflow-y-auto">
            {log.map((line, i) => (
              <div key={i} className={
                line.includes('❌') ? 'text-red-400' :
                line.includes('🎉') ? 'text-green-400 font-bold' :
                line.includes('Category') ? 'text-brand-blue' :
                line.includes('Topic') ? 'text-purple-400' :
                'text-slate-300'
              }>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
