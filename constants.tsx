
import { LogoStyle } from './types';

export const LOGO_STYLES = [
  { value: LogoStyle.MINIMAL, label: 'Minimalist' },
  { value: LogoStyle.MODERN, label: 'Modern' },
  { value: LogoStyle.PLAYFUL, label: 'Playful' },
  { value: LogoStyle.LUXURY, label: 'Luxury' },
  { value: LogoStyle.TECH, label: 'Tech' },
  { value: LogoStyle.AVANT_GARDE, label: 'Avant-Garde' },
  { value: LogoStyle.CYBERPUNK, label: 'Cyberpunk' },
  { value: LogoStyle.BRUTALIST, label: 'Brutalist' },
];

export const MATERIALS = [
  { value: 'liquid_chrome', label: 'Liquid Chrome' },
  { value: 'matte_ink', label: 'Matte Ink' },
  { value: 'pulsing_neon', label: 'Pulsing Neon' },
  { value: 'frosted_glass', label: 'Frosted Glass' },
  { value: 'gold_foil', label: 'Gold Foil' },
  { value: 'iridescent_pearl', label: 'Iridescent Pearl' },
];

export const DIMENSIONS = [
  { value: '1:1', label: 'Square' },
  { value: '4:3', label: 'Standard' },
  { value: '16:9', label: 'Cinematic' },
];

export const QUALITY_PRESETS = [
  { value: '1K', label: 'Draft (Fast)' },
  { value: '2K', label: 'Studio (Pro)' },
  { value: '4K', label: 'Masterpiece (Ultra)' },
];

export const FONTS = [
  { value: 'font-display', label: 'Space Grotesk (Bold)' },
  { value: 'font-sans', label: 'Inter (Clean)' },
  { value: 'font-serif', label: 'Playfair (Elegant)' },
  { value: 'font-mono', label: 'JetBrains (Tech)' },
  { value: 'font-wide', label: 'Monument (Wide)' },
];

export const COLOR_PRESETS = [
  { name: 'Midnight', value: '#1e293b' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Ultraviolet', value: '#8b5cf6' },
];
