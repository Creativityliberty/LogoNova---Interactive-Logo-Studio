
import { LogoStyle } from './types';

export const LOGO_STYLES = [
  { value: LogoStyle.MINIMAL, label: 'Minimalist' },
  { value: LogoStyle.MODERN, label: 'Modern' },
  { value: LogoStyle.PLAYFUL, label: 'Playful' },
  { value: LogoStyle.LUXURY, label: 'Luxury' },
  { value: LogoStyle.TECH, label: 'Tech' },
  { value: LogoStyle.AVANT_GARDE, label: 'Avant-Garde' },
  { value: LogoStyle.CYBERPUNK, label: 'Cyberpunk' },
];

export const MATERIALS = [
  { value: 'liquid_chrome', label: 'Liquid Chrome' },
  { value: 'matte_ink', label: 'Matte Ink (Sérigraphie)' },
  { value: 'pulsing_neon', label: 'Pulsing Neon' },
  { value: 'frosted_glass', label: 'Frosted Glass' },
  { value: 'gold_foil', label: 'Gold Foil' },
];

export const DIMENSIONS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '4:3', label: 'Banner (4:3)' },
  { value: '16:9', label: 'Cinematic (16:9)' },
];

export const FONTS = [
  { value: 'font-display', label: 'Bold Display' },
  { value: 'font-sans', label: 'Modern Sans' },
  { value: 'font-serif', label: 'Classic Serif' },
  { value: 'font-mono', label: 'Geometric Mono' },
];

export const COLOR_PRESETS = [
  { name: 'Midnight', value: '#1e293b' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Ultraviolet', value: '#8b5cf6' },
];
