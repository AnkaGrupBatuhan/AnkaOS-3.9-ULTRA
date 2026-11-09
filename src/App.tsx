/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import WindowFrame from './components/WindowFrame';

// Apps
import PlayStationStore from './components/apps/PlayStationStore';
import SteamApp from './components/apps/SteamApp';
import MapsApp from './components/apps/MapsApp';
import MediaStudio from './components/apps/MediaStudio';
import SettingsApp from './components/apps/SettingsApp';
import StandaloneExporter from './components/apps/StandaloneExporter';
import FileExplorer from './components/apps/FileExplorer';
import TerminalApp from './components/apps/TerminalApp';
import CalculatorApp from './components/apps/CalculatorApp';
import NotepadApp from './components/apps/NotepadApp';

import { WALLPAPERS } from './data/wallpapers';
import { APPS_LIST } from './data/appsList';
import {
  WindowState,
  createInitialWindowState,
  openWindow,
  closeWindow,
  toggleMinimize,
  toggleMaximize,
  bringToFront,
  updateWindowPosition,
} from './utils/windowManager';
import { Wallpaper } from './types/desktop';

export default function App() {
  // Wallpaper state (defaults to Bloom Dark)
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(WALLPAPERS[1]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [taskbarAlignment, setTaskbarAlignment] = useState<'center' | 'left'>('center');
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Initialize Window states for all applications
  const [windows, setWindows] = useState<Record<string, WindowState>>(() => {
    const map: Record<string, WindowState> = {};
    APPS_LIST.forEach((app, idx) => {
      // stagger initial positions
      const defaultX = 80 + (idx % 4) * 40;
      const defaultY = 40 + (idx % 3) * 35;
      map[app.id] = createInitialWindowState(
        app.id,
        app.name,
        app.icon,
        app.defaultWidth || 860,
        app.defaultHeight || 560,
        defaultX,
        defaultY
      );
    });
    return map;
  });

  // Sync dark class on documentElement for Tailwind v4
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Launch or toggle an application window
  const handleLaunchApp = (appId: string) => {
    setWindows((prev) => openWindow(prev, appId));
  };

  const handleToggleWindow = (appId: string) => {
    setWindows((prev) => {
      const win = prev[appId];
      if (!win) return prev;
      if (!win.isOpen) {
        return openWindow(prev, appId);
      }
      if (win.isMinimized) {
        return bringToFront(prev, appId);
      }
      return toggleMinimize(prev, appId);
    });
  };

  const handleMinimizeAll = () => {
    setWindows((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        if (next[id].isOpen) {
          next[id] = { ...next[id], isMinimized: true };
        }
      });
      return next;
    });
    setStartMenuOpen(false);
  };

  return (
    <div
      onClick={() => setStartMenuOpen(false)}
      className="w-screen h-screen relative overflow-hidden bg-black select-none font-sans"
    >
      {/* Desktop Background & Icon Grid */}
      <Desktop
        wallpaper={currentWallpaper}
        onLaunchApp={handleLaunchApp}
        selectedAppId={selectedAppId}
        onSelectApp={setSelectedAppId}
        iconSize={iconSize}
        onChangeIconSize={setIconSize}
      />

      {/* Render Active Application Windows */}
      {APPS_LIST.map((app) => {
        const win = windows[app.id];
        if (!win || !win.isOpen) return null;

        return (
          <WindowFrame
            key={app.id}
            windowState={win}
            onClose={() => setWindows((prev) => closeWindow(prev, app.id))}
            onMinimize={() => setWindows((prev) => toggleMinimize(prev, app.id))}
            onMaximize={() => setWindows((prev) => toggleMaximize(prev, app.id))}
            onFocus={() => setWindows((prev) => bringToFront(prev, app.id))}
            onMove={(x, y) => setWindows((prev) => updateWindowPosition(prev, app.id, x, y))}
          >
            {app.id === 'playstation' && <PlayStationStore />}
            {app.id === 'steam' && <SteamApp />}
            {app.id === 'maps' && <MapsApp />}
            {app.id === 'media' && <MediaStudio />}
            {app.id === 'settings' && (
              <SettingsApp
                currentWallpaper={currentWallpaper}
                onSelectWallpaper={(wp) => {
                  setCurrentWallpaper(wp);
                  if (wp.isDarkTheme !== undefined) {
                    setIsDarkMode(wp.isDarkTheme);
                  }
                }}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                taskbarAlignment={taskbarAlignment}
                onToggleTaskbarAlignment={setTaskbarAlignment}
              />
            )}
            {app.id === 'standalone' && <StandaloneExporter />}
            {app.id === 'explorer' && <FileExplorer />}
            {app.id === 'terminal' && <TerminalApp />}
            {app.id === 'calculator' && <CalculatorApp />}
            {app.id === 'notepad' && <NotepadApp />}
          </WindowFrame>
        );
      })}

      {/* Windows 11 Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onLaunchApp={handleLaunchApp}
      />

      {/* Windows 11 Taskbar */}
      <Taskbar
        windows={windows}
        onToggleWindow={handleToggleWindow}
        startMenuOpen={startMenuOpen}
        onToggleStartMenu={() => setStartMenuOpen(!startMenuOpen)}
        taskbarAlignment={taskbarAlignment}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onMinimizeAll={handleMinimizeAll}
      />
    </div>
  );
}
