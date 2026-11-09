/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export function createInitialWindowState(
  id: string,
  title: string,
  icon: string,
  width = 850,
  height = 550,
  defaultX = 80,
  defaultY = 40
): WindowState {
  return {
    id,
    title,
    icon,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    width,
    height,
    x: defaultX,
    y: defaultY,
  };
}

export function openWindow(
  windows: Record<string, WindowState>,
  id: string
): Record<string, WindowState> {
  const current = windows[id];
  if (!current) return windows;

  const maxZ = Math.max(0, ...Object.values(windows).map((w) => w.zIndex));

  return {
    ...windows,
    [id]: {
      ...current,
      isOpen: true,
      isMinimized: false,
      zIndex: maxZ + 1,
    },
  };
}

export function closeWindow(
  windows: Record<string, WindowState>,
  id: string
): Record<string, WindowState> {
  const current = windows[id];
  if (!current) return windows;

  return {
    ...windows,
    [id]: {
      ...current,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
    },
  };
}

export function toggleMinimize(
  windows: Record<string, WindowState>,
  id: string
): Record<string, WindowState> {
  const current = windows[id];
  if (!current) return windows;

  return {
    ...windows,
    [id]: {
      ...current,
      isMinimized: !current.isMinimized,
    },
  };
}

export function toggleMaximize(
  windows: Record<string, WindowState>,
  id: string
): Record<string, WindowState> {
  const current = windows[id];
  if (!current) return windows;

  return {
    ...windows,
    [id]: {
      ...current,
      isMaximized: !current.isMaximized,
    },
  };
}

export function bringToFront(
  windows: Record<string, WindowState>,
  id: string
): Record<string, WindowState> {
  const current = windows[id];
  if (!current || !current.isOpen) return windows;

  const maxZ = Math.max(0, ...Object.values(windows).map((w) => w.zIndex));
  if (current.zIndex === maxZ) return windows;

  return {
    ...windows,
    [id]: {
      ...current,
      isMinimized: false,
      zIndex: maxZ + 1,
    },
  };
}

export function updateWindowPosition(
  windows: Record<string, WindowState>,
  id: string,
  x: number,
  y: number
): Record<string, WindowState> {
  const current = windows[id];
  if (!current) return windows;

  return {
    ...windows,
    [id]: {
      ...current,
      x: Math.max(0, x),
      y: Math.max(0, y),
    },
  };
}
