
import { GoogleGenAI } from "@google/genai";
import { LogoConfig } from "../types";

export const generateLogoProposals = async (config: LogoConfig, count: number = 4): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const variations = [
    "High-end 3D matte extrusion with soft ambient occlusion shadows",
    "Traditional hand-pulled screen print (Sérigraphie) with organic ink textures and slight bleeding edge, tactile feel",
    "Cybernetic holographic symbol with iridescent color shifts and digital noise",
    "Luxury minimalist gold foil stamp aesthetic on premium textured black paper"
  ];

  const generateSingle = async (index: number) => {
    const styleDetail = variations[index % variations.length];
    const prompt = `Create a professional logo brand mark for "${config.businessName}".
    Niche: ${config.niche}.
    Style: ${config.style}.
    Specific Treatment: ${styleDetail}.
    Color: Strictly using ${config.primaryColor} as base.
    Constraints: Standalone symbol/icon, pure white background, balanced weight, high contrast, artistic and innovative.
    STRICTLY NO TEXT, NO CHARACTERS, NO LETTERS inside the image. Just the visual mark.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error('Neural node failure during rendering.');
  };

  const tasks = Array.from({ length: count }, (_, i) => generateSingle(i));
  return Promise.all(tasks);
};
