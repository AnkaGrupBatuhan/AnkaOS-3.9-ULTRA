/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallpaper } from '../types/desktop';

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'bloom-light',
    name: 'Windows 11 Bloom Light',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 50% 40%, rgba(90, 160, 255, 0.45) 0%, rgba(20, 90, 240, 0.25) 30%, rgba(240, 244, 252, 1) 70%), linear-gradient(135deg, #eef4ff 0%, #dce8fc 50%, #e9f0fc 100%)',
    thumbnail: 'linear-gradient(135deg, #eef4ff 0%, #3b82f6 50%, #1e3a8a 100%)',
    isDarkTheme: false,
  },
  {
    id: 'bloom-dark',
    name: 'Windows 11 Bloom Dark',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 50% 40%, rgba(30, 90, 220, 0.4) 0%, rgba(15, 30, 80, 0.5) 45%, rgba(10, 12, 18, 0.95) 75%), linear-gradient(180deg, #090c14 0%, #0d1322 50%, #080a10 100%)',
    thumbnail: 'linear-gradient(135deg, #0d1322 0%, #1e40af 50%, #030712 100%)',
    isDarkTheme: true,
  },
  {
    id: 'sunrise',
    name: 'Sunrise Flow',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 60% 30%, rgba(255, 140, 70, 0.35) 0%, rgba(230, 60, 110, 0.25) 35%, rgba(15, 18, 30, 0.95) 70%), linear-gradient(135deg, #10121d 0%, #1a162b 50%, #0a0b12 100%)',
    thumbnail: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #1e1b4b 100%)',
    isDarkTheme: true,
  },
  {
    id: 'glow',
    name: 'Neon Glow',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.35) 0%, rgba(59, 130, 246, 0.25) 40%, rgba(8, 10, 18, 0.95) 75%), linear-gradient(180deg, #080912 0%, #120e24 50%, #05060b 100%)',
    thumbnail: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #090d16 100%)',
    isDarkTheme: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Skyline',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 30% 70%, rgba(236, 72, 153, 0.3) 0%, rgba(6, 182, 212, 0.25) 45%, rgba(6, 8, 16, 0.95) 75%), linear-gradient(135deg, #070913 0%, #0d1626 50%, #11091a 100%)',
    thumbnail: 'linear-gradient(135deg, #ec4899 0%, #06b6d4 50%, #05070f 100%)',
    isDarkTheme: true,
  },
  {
    id: 'obsidian',
    name: 'Minimalist Obsidian',
    type: 'gradient',
    url: 'radial-gradient(ellipse at 50% 30%, rgba(45, 55, 72, 0.4) 0%, rgba(20, 24, 33, 0.8) 50%, #090a0f 90%), linear-gradient(180deg, #0c0e14 0%, #06070a 100%)',
    thumbnail: 'linear-gradient(135deg, #334155 0%, #1e293b 50%, #020617 100%)',
    isDarkTheme: true,
  },
];
