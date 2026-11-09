/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { RefreshCw, Palette, FolderPlus, Terminal, Monitor, LayoutGrid } from 'lucide-react';
import { APPS_LIST } from '../data/appsList';
import { Wallpaper, AppDefinition } from '../types/desktop';

interface DesktopProps {
  wallpaper: Wallpaper;
  onLaunchApp: (appId: string) => void;
  selectedAppId: string | null;
  onSelectApp: (appId: string | null) => void;
  iconSize: 'small' | 'medium' | 'large';
  onChangeIconSize: (size: 'small' | 'medium' | 'large') => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

export default function Desktop({
  wallpaper,
  onLaunchApp,
  selectedAppId,
  onSelectApp,
  iconSize,
  onChangeIconSize,
}: DesktopProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const isMouseDownRef = useRef(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 260),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click on desktop background triggers selection marquee
    if (e.button !== 0) return;
    setContextMenu({ visible: false, x: 0, y: 0 });
    onSelectApp(null);
    isMouseDownRef.current = true;
    setMarquee({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !marquee) return;
    setMarquee((prev) => (prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null));
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setMarquee(null);
  };

  const iconSizes = {
    small: 'w-16 h-18 text-[10px]',
    medium: 'w-20 h-22 text-xs',
    large: 'w-24 h-26 text-sm',
  };

  const iconImgSizes = {
    small: 'w-9 h-9 text-xs',
    medium: 'w-11 h-11 text-sm',
    large: 'w-14 h-14 text-base',
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 pb-12 overflow-hidden select-none"
      style={{
        backgroundImage: wallpaper.url,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Desktop Icons Grid */}
      <div className="p-4 grid grid-flow-col grid-rows-6 auto-cols-max gap-3 content-start justify-start z-10 relative">
        {APPS_LIST.map((app) => {
          const isSelected = selectedAppId === app.id;

          return (
            <div
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectApp(app.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onLaunchApp(app.id);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer group text-center ${
                iconSizes[iconSize]
              } ${
                isSelected
                  ? 'bg-blue-600/35 border border-blue-400/50 shadow-md backdrop-blur-xs'
                  : 'hover:bg-white/10 dark:hover:bg-black/20 border border-transparent'
              }`}
            >
              <div
                className={`rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:scale-105 mb-1 ${
                  iconImgSizes[iconSize]
                } ${
                  app.id === 'steam'
                    ? 'bg-[#1b2838] border border-[#2a475e]'
                    : app.id === 'playstation'
                    ? 'bg-blue-600'
                    : app.id === 'maps'
                    ? 'bg-emerald-600'
                    : app.id === 'media'
                    ? 'bg-purple-600'
                    : app.id === 'settings'
                    ? 'bg-slate-700'
                    : app.id === 'standalone'
                    ? 'bg-emerald-500'
                    : 'bg-blue-500'
                }`}
              >
                {app.id === 'steam' ? '♨' : app.id === 'playstation' ? 'PS' : app.name.slice(0, 1)}
              </div>

              <span className="text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate w-full px-0.5">
                {app.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Marquee Selection Rectangle */}
      {marquee && (
        <div
          className="absolute border border-blue-500 bg-blue-500/20 pointer-events-none z-20"
          style={{
            left: Math.min(marquee.startX, marquee.currentX),
            top: Math.min(marquee.startY, marquee.currentY),
            width: Math.abs(marquee.currentX - marquee.startX),
            height: Math.abs(marquee.currentY - marquee.startY),
          }}
        />
      )}

      {/* Desktop Right-Click Context Menu */}
      {contextMenu.visible && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 w-52 bg-white/85 dark:bg-[#1a1c24]/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-1 text-xs text-slate-800 dark:text-slate-200 space-y-0.5 animate-scale-up select-none"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {/* View size toggle */}
          <div className="px-3 py-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
            Icon Size
          </div>
          <div className="grid grid-cols-3 gap-1 px-2 pb-1">
            <button
              onClick={() => {
                onChangeIconSize('small');
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}
              className={`py-1 text-[11px] rounded ${iconSize === 'small' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              Small
            </button>
            <button
              onClick={() => {
                onChangeIconSize('medium');
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}
              className={`py-1 text-[11px] rounded ${iconSize === 'medium' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              Medium
            </button>
            <button
              onClick={() => {
                onChangeIconSize('large');
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}
              className={`py-1 text-[11px] rounded ${iconSize === 'large' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
            >
              Large
            </button>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

          <button
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              onLaunchApp('settings');
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">Change Wallpaper</span>
          </button>

          <button
            onClick={() => {
              onLaunchApp('terminal');
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open in Terminal</span>
          </button>

          <button
            onClick={() => {
              onLaunchApp('standalone');
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export Standalone (.exe / .zip)</span>
          </button>
        </div>
      )}
    </div>
  );
}
