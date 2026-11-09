/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Palette, Monitor, Laptop, Info, Check, Image as ImageIcon, Sliders } from 'lucide-react';
import { WALLPAPERS } from '../../data/wallpapers';
import { Wallpaper } from '../../types/desktop';

interface SettingsAppProps {
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  taskbarAlignment: 'center' | 'left';
  onToggleTaskbarAlignment: (align: 'center' | 'left') => void;
}

export default function SettingsApp({
  currentWallpaper,
  onSelectWallpaper,
  isDarkMode,
  onToggleDarkMode,
  taskbarAlignment,
  onToggleTaskbarAlignment,
}: SettingsAppProps) {
  const [activeNav, setActiveNav] = useState<'personalization' | 'system' | 'about'>('personalization');
  const [customUrl, setCustomUrl] = useState('');
  const [accentColor, setAccentColor] = useState('#2563eb');

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const custom: Wallpaper = {
      id: 'custom-' + Date.now(),
      name: 'Custom Wallpaper',
      type: 'image',
      url: `url('${customUrl}')`,
      thumbnail: customUrl,
      isDarkTheme: isDarkMode,
    };
    onSelectWallpaper(custom);
    setCustomUrl('');
  };

  return (
    <div className="flex h-full bg-[#f3f4f6] dark:bg-[#111319] text-slate-800 dark:text-slate-100 font-sans select-none overflow-hidden">
      {/* Settings Navigation Sidebar */}
      <div className="w-56 bg-white/70 dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5 px-2 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              R
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">ronaldoedits809</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Local Account · Admin</div>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveNav('personalization')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeNav === 'personalization'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Personalization</span>
            </button>

            <button
              onClick={() => setActiveNav('system')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeNav === 'system'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>System & Hardware</span>
            </button>

            <button
              onClick={() => setActiveNav('about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeNav === 'about'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Windows 11 Specs</span>
            </button>
          </div>
        </div>

        <div className="px-2 py-2 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
          Windows 11 Pro 24H2
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeNav === 'personalization' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Personalization</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Change your desktop background wallpaper, taskbar behavior, and system theme.
              </p>
            </div>

            {/* Current Wallpaper Preview Hero */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Active Wallpaper Preview
              </div>
              <div
                className="w-full h-36 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage: currentWallpaper.url,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/20">
                  {currentWallpaper.name}
                </div>
              </div>
            </div>

            {/* Choose Background Wallpaper */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Select Background Wallpaper</span>
                <span className="text-[11px] text-slate-500">6 Windows 11 Presets</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {WALLPAPERS.map((wp) => {
                  const isSelected = currentWallpaper.id === wp.id;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => onSelectWallpaper(wp)}
                      className={`group relative rounded-xl aspect-[16/10] overflow-hidden border-2 transition-all p-1 text-left ${
                        isSelected
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-lg"
                        style={{
                          background: wp.thumbnail.startsWith('http') ? `url('${wp.thumbnail}')` : wp.thumbnail,
                          backgroundSize: 'cover',
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white">
                        {wp.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Image URL form */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  Or Enter Custom Wallpaper Image URL:
                </div>
                <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/wallpaper.jpg"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </div>

            {/* Taskbar & Theme Toggles */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Taskbar & System Appearance
              </div>

              {/* Theme Mode Switch */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white">Dark Mode</div>
                  <div className="text-[11px] text-slate-500">Switch between Windows 11 Dark and Light theme</div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Taskbar Alignment */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white">Taskbar Alignment</div>
                  <div className="text-[11px] text-slate-500">Choose centered or left-aligned Windows taskbar</div>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => onToggleTaskbarAlignment('center')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      taskbarAlignment === 'center'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => onToggleTaskbarAlignment('left')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      taskbarAlignment === 'left'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Left
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'system' && (
          <div className="max-w-2xl space-y-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Hardware & Performance</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-slate-400 block">PROCESSOR (CPU)</span>
                <span className="font-bold text-slate-900 dark:text-white">AMD Ryzen 9 7950X3D (16-Core, 32-Thread)</span>
                <span className="text-[11px] text-emerald-500 block">4.20 GHz · 38°C</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-slate-400 block">INSTALLED RAM</span>
                <span className="font-bold text-slate-900 dark:text-white">64.0 GB DDR5-6000 MHz</span>
                <span className="text-[11px] text-slate-400 block">14.2 GB in use (22%)</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-slate-400 block">GRAPHICS CARD (GPU)</span>
                <span className="font-bold text-slate-900 dark:text-white">NVIDIA GeForce RTX 4090 24GB</span>
                <span className="text-[11px] text-emerald-500 block">DirectX 12 Ultimate · Driver 560.81</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-slate-400 block">PRIMARY STORAGE</span>
                <span className="font-bold text-slate-900 dark:text-white">2TB NVMe Gen4 SSD</span>
                <span className="text-[11px] text-slate-400 block">1.34 TB free of 1.86 TB</span>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'about' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Windows Specifications</h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Edition</span>
                <span className="font-semibold text-slate-900 dark:text-white">Windows 11 Pro 64-bit</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Version</span>
                <span className="font-semibold text-slate-900 dark:text-white">24H2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">OS Build</span>
                <span className="font-semibold text-slate-900 dark:text-white">26100.2033</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Experience</span>
                <span className="font-semibold text-slate-900 dark:text-white">Windows Feature Experience Pack 1000.26100.32.0</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
