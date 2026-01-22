
export interface GeneratedLogo {
  id: string;
  imageUrl: string;
  motionUrl?: string;
  businessName: string;
  slogan: string;
  description: string;
  palette: string[];
  brandStrategy: {
    tone: string;
    target: string;
    archetype: string;
    socialBio: string;
    mission: string;
    elevatorPitch: string;
    values: string[];
  };
  moodboard: string[];
  createdAt: number;
  fontFamily: string;
  material: string;
  aspectRatio: "1:1" | "4:3" | "16:9";
  quality: "1K" | "2K" | "4K";
}

export enum LogoStyle {
  MINIMAL = 'minimalist',
  MODERN = 'modern',
  PLAYFUL = 'playful',
  LUXURY = 'luxury',
  TECH = 'tech',
  AVANT_GARDE = 'avant-garde',
  CYBERPUNK = 'cyberpunk',
  BRUTALIST = 'brutalist'
}

export interface LogoConfig {
  businessName: string;
  niche: string;
  style: LogoStyle;
  primaryColor: string;
  fontFamily: string;
  material: string;
  aspectRatio: "1:1" | "4:3" | "16:9";
  quality: "1K" | "2K" | "4K";
}
