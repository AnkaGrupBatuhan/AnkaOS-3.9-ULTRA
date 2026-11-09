/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'system' | 'gaming' | 'media' | 'utility';
  description: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface Wallpaper {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  url: string;
  thumbnail: string;
  isDarkTheme?: boolean;
}

export interface PSGame {
  id: string;
  title: string;
  platform: 'PS5' | 'PS4' | 'PS5 Pro';
  genre: string;
  rating: number;
  price: number;
  originalPrice?: number;
  coverImage: string;
  description: string;
  features: string[];
  bgGradient?: string;
  iconGlyph?: string;
}

export interface SteamGame {
  id: string;
  title: string;
  genre: string;
  developer: string;
  price: number;
  installed: boolean;
  playTimeHours: number;
  achievements: { completed: number; total: number };
  coverImage: string;
  bannerImage: string;
}

export interface Landmark {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
}
