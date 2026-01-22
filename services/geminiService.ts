
import { GoogleGenAI, Type } from "@google/genai";
import { LogoConfig, GeneratedLogo } from "../types";

// Helper to clean and parse JSON from AI response
const extractJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse AI JSON:", text);
    throw new Error("Neural JSON parsing failed");
  }
};

export const generateLogoProposals = async (config: LogoConfig, count: number = 4): Promise<GeneratedLogo[]> => {
  const generateSingle = async (index: number): Promise<GeneratedLogo> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fallback logic for high-res models
    let imageModel = config.quality === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';

    const materialPromptMap: Record<string, string> = {
      liquid_chrome: "Liquid mercury silver chrome, extreme reflections, 8k raytracing.",
      matte_ink: "Deep matte pigment ink, porous paper texture, high-end serigraphy.",
      pulsing_neon: "Glowing cyberpunk neon tubes, lens flare, volumetric fog.",
      frosted_glass: "Translucent sandblasted glass, soft refraction, elegant blur.",
      gold_foil: "24k gold leaf, micro-scratches, luxurious metallic sheen.",
      iridescent_pearl: "Holographic pearl finish, rainbow diffraction, organic luster."
    };

    const imagePrompt = `Iconic brand logo symbol for "${config.businessName}". 
    Sector: ${config.niche}. Style: ${config.style}.
    Visual Finish: ${materialPromptMap[config.material] || config.material}.
    REQUIREMENT: SYMBOL ONLY. NO TEXT. PURE BLACK BACKGROUND (#000000). 
    CENTRAL COMPOSITION. High-end design.`;

    console.log(`[Step 1/3] Generating Image with ${imageModel}...`);
    let logoB64 = '';
    try {
      const logoResponse = await ai.models.generateContent({
        model: imageModel,
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          imageConfig: {
            aspectRatio: config.aspectRatio,
            imageSize: config.quality === '4K' ? '4K' : (config.quality === '2K' ? '2K' : '1K')
          }
        }
      });
      for (const part of logoResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) logoB64 = `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (err) {
      console.warn("High-res model failed, falling back to Flash Image...", err);
      imageModel = 'gemini-2.5-flash-image';
      const logoResponse = await ai.models.generateContent({
        model: imageModel,
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: config.aspectRatio } }
      });
      for (const part of logoResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) logoB64 = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    if (!logoB64) throw new Error("Image generation returned empty data");

    console.log(`[Step 2/3] Synthesizing Brand DNA...`);
    const strategyResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Design Brand DNA for "${config.businessName}" (${config.niche}). 
      Return ONLY valid JSON:
      {
        "slogan": "4 words max",
        "palette": ["4 hex codes"],
        "tone": "1 word",
        "target": "2 words",
        "archetype": "1 word",
        "socialBio": "Short bio",
        "mission": "1 sentence",
        "elevatorPitch": "30 words",
        "values": ["3 values"],
        "moodboardPrompts": ["2 photo prompts"]
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const strategy = extractJSON(strategyResponse.text || '{}');

    console.log(`[Step 3/3] Fetching Moodboard Textures...`);
    const moodboardResults = await Promise.all((strategy.moodboardPrompts || []).map(async (prompt: string) => {
      try {
        const aiMood = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await aiMood.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `High-end photography: ${prompt}. Cinematic lighting.` }] },
          config: { imageConfig: { aspectRatio: '16:9' } }
        });
        for (const part of res.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
      } catch (e) {
        console.error("Moodboard part failed:", e);
      }
      return '';
    }));

    return {
      id: Math.random().toString(36).substring(2, 11),
      imageUrl: logoB64,
      businessName: config.businessName,
      slogan: strategy.slogan || 'Identity Evolved',
      description: config.niche,
      palette: strategy.palette || [config.primaryColor, '#ffffff', '#000000', '#333333'],
      brandStrategy: {
        tone: strategy.tone || 'Professional',
        target: strategy.target || 'Global Market',
        archetype: strategy.archetype || 'Visionary',
        socialBio: strategy.socialBio || 'The future of brand identity.',
        mission: strategy.mission || 'To lead with innovation.',
        elevatorPitch: strategy.elevatorPitch || 'Synthesizing the next generation of brand presence.',
        values: strategy.values || ['Innovation', 'Quality', 'Vision']
      },
      moodboard: moodboardResults.filter(Boolean),
      createdAt: Date.now(),
      fontFamily: config.fontFamily,
      material: config.material,
      aspectRatio: config.aspectRatio,
      quality: config.quality
    };
  };

  return Promise.all(Array.from({ length: count }, (_, i) => generateSingle(i)));
};

export const animateLogo = async (logo: GeneratedLogo): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic logo reveal for "${logo.businessName}". The ${logo.material} brand mark floats in a void with volumetric light sweeps.`,
    image: {
      imageBytes: logo.imageUrl.split(',')[1],
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};
