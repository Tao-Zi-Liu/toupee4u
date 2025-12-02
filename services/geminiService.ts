import { GoogleGenAI } from "@google/genai";
import { KB_CATEGORIES } from '../constants';

// Initialize Gemini
// NOTE: Process.env.API_KEY is handled by the build environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Toupee4U Truth Engine", an expert AI consultant for men's hair replacement systems.
Your goal is to provide unbiased, scientific, and actionable advice to "Aspiring DIYers".
You follow the "Physics of Hair" philosophy: treating hair replacement as a technical engineering problem (adhesion, geometry, entropy).

Key Guidelines:
1. **Unbiased:** Do not push specific brands unless comparing them scientifically (e.g., "Ghost Bond is water-based, Ultra Hold is acrylic").
2. **Scientific Tone:** Use terms like "tensile strength", "oxidation", "hydrophobic", "refraction".
3. **Empathetic but Firm:** Acknowledge the anxiety of hair loss, but solve it with data.
4. **Context:** You have access to a knowledge base about Foundations, Material Science, Bonding Physics, Entropy Control (Maintenance), and Applied Dynamics (Lifestyle).

If a user asks about something dangerous (like using superglue), warn them immediately with a "Safety Hazard" alert.
Keep responses concise (under 200 words) unless asked for a detailed guide.
`;

export const askTheTruthEngine = async (query: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context string from our local KB constants to ground the AI
    // In a real app, this would use RAG (Retrieval Augmented Generation)
    const contextSummary = KB_CATEGORIES.map(cat => 
      `${cat.name} (${cat.physicsTheme}): ${cat.description}`
    ).join('\n');

    const fullPrompt = `
      Context from Knowledge Base:
      ${contextSummary}

      User Question: ${query}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I apologize, but I couldn't process that query physically. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The Truth Engine is currently experiencing high entropy (technical difficulty). Please try again later.";
  }
};
