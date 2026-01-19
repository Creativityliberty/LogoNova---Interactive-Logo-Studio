
export interface GeneratedLogo {
  id: string;
  imageUrl: string;
  businessName: string;
  description: string;
  createdAt: number;
  fontFamily: string;
}

export enum LogoStyle {
  MINIMAL = 'minimalist',
  MODERN = 'modern',
  PLAYFUL = 'playful',
  LUXURY = 'luxury',
  TECH = 'tech'
}

export interface LogoConfig {
  businessName: string;
  niche: string;
  style: LogoStyle;
  primaryColor: string;
  fontFamily: string;
}
