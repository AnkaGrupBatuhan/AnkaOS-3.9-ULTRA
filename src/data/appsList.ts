/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppDefinition } from '../types/desktop';

export const APPS_LIST: AppDefinition[] = [
  {
    id: 'steam',
    name: 'Steam',
    icon: 'gamepad-2',
    category: 'gaming',
    description: 'Valve game launcher, library, community & digital store',
    defaultWidth: 920,
    defaultHeight: 580,
  },
  {
    id: 'playstation',
    name: 'PlayStation Store',
    icon: 'disc',
    category: 'gaming',
    description: 'Sony PlayStation Store, PS5 & PS4 digital catalog & deals',
    defaultWidth: 940,
    defaultHeight: 600,
  },
  {
    id: 'maps',
    name: 'Google Maps',
    icon: 'map-pin',
    category: 'utility',
    description: 'Explore the world, landmarks, navigation & satellite imagery',
    defaultWidth: 900,
    defaultHeight: 560,
  },
  {
    id: 'media',
    name: 'Music & Audio Studio',
    icon: 'music',
    category: 'media',
    description: 'AI Music Generator & real-time audio synthesizer',
    defaultWidth: 840,
    defaultHeight: 540,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    category: 'system',
    description: 'Personalization, desktop wallpapers, themes & system info',
    defaultWidth: 860,
    defaultHeight: 560,
  },
  {
    id: 'standalone',
    name: 'Standalone Exporter',
    icon: 'package-check',
    category: 'system',
    description: 'Download offline .zip package & standalone C++ .exe compiler',
    defaultWidth: 820,
    defaultHeight: 540,
  },
  {
    id: 'explorer',
    name: 'File Explorer',
    icon: 'folder',
    category: 'system',
    description: 'Browse local files, documents, downloads & storage drives',
    defaultWidth: 880,
    defaultHeight: 520,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    category: 'utility',
    description: 'Windows command prompt & PowerShell interface',
    defaultWidth: 760,
    defaultHeight: 460,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: 'calculator',
    category: 'utility',
    description: 'Standard and scientific mathematical calculator',
    defaultWidth: 360,
    defaultHeight: 510,
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: 'file-text',
    category: 'utility',
    description: 'Lightweight text editor and scratchpad with save & export',
    defaultWidth: 700,
    defaultHeight: 480,
  },
];
