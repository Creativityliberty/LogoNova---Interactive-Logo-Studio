
import React from 'react';
import { LogoStyle } from './types';

export const LOGO_STYLES = [
  { value: LogoStyle.MINIMAL, label: 'Minimalist' },
  { value: LogoStyle.MODERN, label: 'Modern' },
  { value: LogoStyle.PLAYFUL, label: 'Playful' },
  { value: LogoStyle.LUXURY, label: 'Luxury' },
  { value: LogoStyle.TECH, label: 'Tech' },
];

export const FONTS = [
  { value: 'font-sans', label: 'Modern Sans' },
  { value: 'font-serif', label: 'Classic Serif' },
  { value: 'font-display', label: 'Bold Display' },
  { value: 'font-mono', label: 'Geometric Mono' },
];

export const COLOR_PRESETS = [
  { name: 'Midnight', value: '#1e293b' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Amber', value: '#d97706' },
];
