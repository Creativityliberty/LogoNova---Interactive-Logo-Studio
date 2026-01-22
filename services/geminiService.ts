
import { GoogleGenAI, Type } from "@google/genai";
import { LogoConfig, GeneratedLogo } from "../types";

export const generateLogoProposals = async (config: LogoConfig, count: number = 4): Promise<GeneratedLogo[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const generateSingle = async (index: number): Promise<GeneratedLogo> => {
    const materialPromptMap: Record<string, string> = {
      liquid_chrome: "Highly reflective liquid silver chrome finish with anisotropic highlights.",
      matte_ink: "Flat matte hand-pulled screen print (Sérigraphie) ink on textured high-quality paper, organic edges.",
      pulsing_neon: "Vibrant self-illuminated neon gas tubes with soft volumetric glow and light spill.",
      frosted_glass: "Semi-transparent frosted glassmorphism effect with blurred background refraction.",
      gold_foil: "Metallic gold leaf foil stamp texture with subtle embossing and grain."
    };

    const imagePrompt = `Masterpiece professional logo brand mark for "${config.businessName}". 
    Niche: ${config.niche}. 
    Style: ${config.style}.
    Finish/Material: ${materialPromptMap[config.material] || config.material}.
    Requirement: ISOLATED SYMBOL on a PURE JET BLACK BACKGROUND (#000000). 
    Constraint: NO TEXT, NO LETTERS, NO TYPOGRAPHY INSIDE THE IMAGE. High contrast, clean silhouette.
    Aspect Ratio: ${config.aspectRatio}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio
        }
      }
    });

    let b64 = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) b64 = `data:image/png;base64,${part.inlineData.data}`;
    }

    const strategyResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a brand DNA for "${config.businessName}" (${config.niche}). 
      Provide: 
      1. A catchy 3-word slogan.
      2. 3 Hex colors (starting with ${config.primaryColor}).
      3. Brand Tone (1 word).
      4. Target Audience (1 short sentence).
      5. Brand Archetype (e.g., The Hero, The Magician).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            palette: { type: Type.ARRAY, items: { type: Type.STRING } },
            tone: { type: Type.STRING },
            target: { type: Type.STRING },
            archetype: { type: Type.STRING }
          }
        }
      }
    });

    const strategy = JSON.parse(strategyResponse.text);

    return {
      id: Math.random().toString(36).substr(2, 9),
      imageUrl: b64,
      businessName: config.businessName,
      slogan: strategy.slogan,
      description: config.niche,
      palette: strategy.palette,
      brandStrategy: {
        tone: strategy.tone,
        target: strategy.target,
        archetype: strategy.archetype
      },
      createdAt: Date.now(),
      fontFamily: config.fontFamily,
      material: config.material,
      aspectRatio: config.aspectRatio
    };
  };

  return Promise.all(Array.from({ length: count }, (_, i) => generateSingle(i)));
};

export const animateLogo = async (logo: GeneratedLogo): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Dynamic motion identity for "${logo.businessName}". The icon rendered in ${logo.material} comes to life with cinematic camera pans, macro light reflections, and atmospheric dust. 1080p, ultra-realistic.`,
    image: {
      imageBytes: logo.imageUrl.split(',')[1],
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: logo.aspectRatio === '1:1' ? '16:9' : logo.aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
