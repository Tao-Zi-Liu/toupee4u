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

export const generateArticleFromVideo = async (videoData: { title: string; channel: string; description: string; comments: string[] }): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      I need you to act as the Senior Technical Editor for Toupee4U. 
      I have scraped a YouTube video and its top comments. 
      
      Your task: Transform this raw video data into a structured, scientific Knowledge Base article formatted in HTML.
      
      Video Title: ${videoData.title}
      Channel: ${videoData.channel}
      Context/Description: ${videoData.description}
      Top User Comments/Questions: ${videoData.comments.join('; ')}

      Article Requirements:
      1. **Title:** Create a more scientific/academic title based on the video topic.
      2. **Structure:** Use <h3> for headers. Use <ul> or <ol> for steps.
      3. **Tone:** "Physics of Hair". Use terms like "adhesion", "refraction", "tensile strength". Remove any "Hey guys, welcome back to my channel" fluff.
      4. **Community Insight:** Incorporate the user comments as "Common Observations" or "Field Data".
      5. **Format:** Return ONLY the HTML body content (no <html> or <body> tags).

      Generate the HTML content now.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "<p>Failed to synthesize data.</p>";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return "<p>Error: High entropy in the generation matrix.</p>";
  }
};

export const findNearbyShops = async (lat: number, lng: number): Promise<{ text: string, chunks: any[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: "Find shops offering men's haircuts and wigs/hair systems within a 5-mile radius of my current location. STRICTLY filter results to only include shops with a Google Shop Review rating of 4.5 or higher. List them.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    // Check for grounding chunks (Google Maps results)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "No highly-rated styling protocols found in your immediate sector.";

    return { text, chunks };
  } catch (error) {
    console.error("Gemini Location Error:", error);
    return { text: "Signal interference detected. Unable to retrieve geospatial data.", chunks: [] };
  }
};