
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
  };
  createdAt: number;
  fontFamily: string;
  material: string;
  aspectRatio: "1:1" | "4:3" | "16:9";
}

export enum LogoStyle {
  MINIMAL = 'minimalist',
  MODERN = 'modern',
  PLAYFUL = 'playful',
  LUXURY = 'luxury',
  TECH = 'tech',
  AVANT_GARDE = 'avant-garde',
  CYBERPUNK = 'cyberpunk'
}

export interface LogoConfig {
  businessName: string;
  niche: string;
  style: LogoStyle;
  primaryColor: string;
  fontFamily: string;
  material: string;
  aspectRatio: "1:1" | "4:3" | "16:9";
}
