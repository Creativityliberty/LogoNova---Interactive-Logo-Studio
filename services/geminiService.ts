
import { GoogleGenAI, Type } from "@google/genai";
import { LogoConfig, GeneratedLogo } from "../types";

const extractJSON = (text: string) => {
  try {
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
    
    let imageModel = config.quality === '1K' ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image-preview';
    const isPro = imageModel === 'gemini-3-pro-image-preview';

    const materialPromptMap: Record<string, string> = {
      liquid_chrome: "Liquid mercury silver chrome, extreme reflections, 8k raytracing.",
      matte_ink: "Deep matte pigment ink, porous paper texture, high-end serigraphy.",
      pulsing_neon: "Glowing cyberpunk neon tubes, lens flare, volumetric fog.",
      frosted_glass: "Translucent sandblasted glass, soft refraction, elegant blur.",
      gold_foil: "24k gold leaf, micro-scratches, luxurious metallic sheen.",
      iridescent_pearl: "Holographic pearl finish, rainbow diffraction, organic luster."
    };

    const imagePrompt = `Iconic brand logo symbol for "${config.businessName}". Sector: ${config.niche}. Style: ${config.style}. Visual Finish: ${materialPromptMap[config.material] || config.material}. REQUIREMENT: SYMBOL ONLY. NO TEXT. PURE BLACK BACKGROUND (#000000). CENTRAL COMPOSITION.`;

    let logoB64 = '';
    const imageConfig: any = { aspectRatio: config.aspectRatio };
    if (isPro) {
      imageConfig.imageSize = config.quality === '4K' ? '4K' : (config.quality === '2K' ? '2K' : '1K');
    }

    try {
      const logoResponse = await ai.models.generateContent({
        model: imageModel,
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig }
      });
      for (const part of logoResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) logoB64 = `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (err) {
      console.warn("Generation failed, forcing fallback...", err);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: config.aspectRatio } }
      });
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) logoB64 = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    if (!logoB64) throw new Error("Neural synthesis returned empty buffer.");

    const strategyResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Design detailed Brand DNA for "${config.businessName}" (${config.niche}).
      Return ONLY valid JSON with these EXACT keys:
      {
        "slogan": "string",
        "palette": ["string"],
        "tone": "string",
        "target": "string",
        "archetype": "string",
        "socialBio": "string",
        "mission": "string",
        "elevatorPitch": "string",
        "values": ["string"],
        "positioning": { "pricePoint": "Budget|Mid|Premium|Luxury", "vibe": "string", "competitors": ["string"] },
        "personalityTraits": [ { "trait": "Classic vs Modern", "value": 80 }, { "trait": "Playful vs Serious", "value": 20 } ],
        "visualKeywords": ["string"],
        "moodboardPrompts": ["string"]
      }`,
      config: { responseMimeType: "application/json" }
    });

    const strategy = extractJSON(strategyResponse.text || '{}');

    const moodboardResults = await Promise.all((strategy.moodboardPrompts || []).slice(0, 2).map(async (prompt: string) => {
      try {
        const aiMood = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await aiMood.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `High-end cinematic photography: ${prompt}` }] },
          config: { imageConfig: { aspectRatio: '16:9' } }
        });
        for (const part of res.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
      } catch (e) { return ''; }
      return '';
    }));

    return {
      id: Math.random().toString(36).substring(2, 11),
      imageUrl: logoB64,
      businessName: config.businessName,
      slogan: strategy.slogan || 'Future Protocol',
      description: config.niche,
      palette: strategy.palette || ['#000000', '#ffffff'],
      brandStrategy: {
        tone: strategy.tone || 'Professional',
        target: strategy.target || 'Niche Market',
        archetype: strategy.archetype || 'Creator',
        socialBio: strategy.socialBio || 'Innovation driven.',
        mission: strategy.mission || 'To define the future.',
        elevatorPitch: strategy.elevatorPitch || 'Synthesizing greatness.',
        values: strategy.values || ['Quality', 'Innovation'],
        positioning: strategy.positioning || { pricePoint: 'Premium', vibe: 'Elite', competitors: [] },
        personalityTraits: strategy.personalityTraits || [],
        visualKeywords: strategy.visualKeywords || []
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
    prompt: `Logo reveal for ${logo.businessName}. ${logo.material} finish.`,
    image: { imageBytes: logo.imageUrl.split(',')[1], mimeType: 'image/png' },
    config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  return `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
};
