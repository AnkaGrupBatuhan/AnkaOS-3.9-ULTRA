/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Volume2,
  Battery,
  Sliders,
  Moon,
  Sun,
  Bluetooth,
  Bell,
  Calendar as CalendarIcon,
  Search,
} from 'lucide-react';
import { APPS_LIST } from '../data/appsList';
import { WindowState } from '../utils/windowManager';

interface TaskbarProps {
  windows: Record<string, WindowState>;
  onToggleWindow: (appId: string) => void;
  startMenuOpen: boolean;
  onToggleStartMenu: () => void;
  taskbarAlignment: 'center' | 'left';
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onMinimizeAll: () => void;
}

export default function Taskbar({
  windows,
  onToggleWindow,
  startMenuOpen,
  onToggleStartMenu,
  taskbarAlignment,
  isDarkMode,
  onToggleDarkMode,
  onMinimizeAll,
}: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 left-0 right-0 h-12 acrylic-taskbar border-t border-black/10 dark:border-white/10 z-40 flex items-center justify-between px-3 select-none text-slate-800 dark:text-slate-100"
    >
      {/* Left side when taskbar is center-aligned (empty or widget space) */}
      <div className={`flex items-center gap-2 ${taskbarAlignment === 'center' ? 'w-48' : ''}`}>
        {taskbarAlignment === 'center' && (
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-xs">
            <span className="text-amber-500 font-bold">☀️ 22°C</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Clear · Istanbul</span>
          </div>
        )}
      </div>

      {/* Main Apps Bar (Centered or Left-aligned) */}
      <div
        className={`flex items-center gap-1.5 ${
          taskbarAlignment === 'center'
            ? 'absolute left-1/2 -translate-x-1/2'
            : 'flex-1 ml-1'
        }`}
      >
        {/* Windows 11 Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative group ${
            startMenuOpen
              ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Start"
        >
          <div className="grid grid-cols-2 gap-0.5 p-1 w-5 h-5">
            <div className="bg-[#0078d4] rounded-xs" />
            <div className="bg-[#0078d4] rounded-xs" />
            <div className="bg-[#0078d4] rounded-xs" />
            <div className="bg-[#0078d4] rounded-xs" />
          </div>
        </button>

        {/* Search Button */}
        <button
          onClick={onToggleStartMenu}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Pinned & Open Apps */}
        {APPS_LIST.map((app) => {
          const win = windows[app.id];
          const isOpen = win?.isOpen;
          const isMinimized = win?.isMinimized;
          const isActive = isOpen && !isMinimized;

          return (
            <button
              key={app.id}
              onClick={() => onToggleWindow(app.id)}
              className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center relative transition-all group ${
                isActive
                  ? 'bg-black/10 dark:bg-white/15'
                  : isOpen
                  ? 'bg-black/5 dark:bg-white/5'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title={app.name}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white shadow-sm transition-transform group-hover:scale-105 ${
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

              {/* Windows 11 Running/Active Indicator Bar */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'w-4 h-0.5 bg-blue-600 dark:bg-blue-400'
                      : 'w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* System Tray (Right Side) */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Language */}
        <div className="hidden sm:block px-2 py-1 rounded text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
          ENG
        </div>

        {/* Quick Settings Group (Wi-Fi, Volume, Battery) */}
        <div
          onClick={() => {
            setQuickSettingsOpen(!quickSettingsOpen);
            setCalendarOpen(false);
          }}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
            quickSettingsOpen
              ? 'bg-black/10 dark:bg-white/15'
              : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Network, Sound and Battery settings"
        >
          <Wifi className={`w-3.5 h-3.5 ${wifiOn ? 'text-blue-500' : 'text-slate-400'}`} />
          <Volume2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          <Battery className="w-4 h-4 text-emerald-500" />
        </div>

        {/* Clock & Calendar Button */}
        <div
          onClick={() => {
            setCalendarOpen(!calendarOpen);
            setQuickSettingsOpen(false);
          }}
          className={`px-2.5 py-1 rounded-lg text-right cursor-pointer transition-colors flex flex-col justify-center ${
            calendarOpen ? 'bg-black/10 dark:bg-white/15' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Date and Time"
        >
          <div className="text-xs font-semibold font-mono tracking-tight leading-none text-slate-900 dark:text-white">
            {currentTime || '12:00'}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
            {currentDate || 'Nov 9, 2026'}
          </div>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={() => setQuickSettingsOpen(!quickSettingsOpen)}
          className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* "Show Desktop" vertical line on extreme right */}
        <div
          onClick={onMinimizeAll}
          className="w-1.5 h-7 border-l border-slate-300 dark:border-slate-700 hover:bg-white/30 cursor-pointer ml-1"
          title="Show desktop"
        />
      </div>

      {/* Quick Settings Flyout Popup */}
      {quickSettingsOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-3 w-80 bg-white/85 dark:bg-[#1c1f2b]/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 space-y-4 z-50 text-slate-800 dark:text-slate-100 animate-scale-up select-none"
        >
          {/* Quick Toggle Tiles */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Wi-Fi */}
            <button
              onClick={() => setWifiOn(!wifiOn)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                wifiOn
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span className="text-[11px] font-medium">Wi-Fi</span>
            </button>

            {/* Bluetooth */}
            <button
              onClick={() => setBluetoothOn(!bluetoothOn)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                bluetoothOn
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              <span className="text-[11px] font-medium">Bluetooth</span>
            </button>

            {/* Dark Mode */}
            <button
              onClick={onToggleDarkMode}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                isDarkMode
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-[11px] font-medium">{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          {/* Sliders: Brightness & Volume */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-xs font-mono text-slate-400 w-8 text-right">{brightness}%</span>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-xs font-mono text-slate-400 w-8 text-right">{volume}%</span>
            </div>
          </div>

          {/* Battery Status */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-emerald-500" />
              <span>100% Fully Charged</span>
            </div>
            <span className="text-[10px]">High Performance</span>
          </div>
        </div>
      )}

      {/* Calendar Flyout Popup */}
      {calendarOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-14 right-3 w-72 bg-white/85 dark:bg-[#1c1f2b]/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50 text-slate-800 dark:text-slate-100 animate-scale-up select-none"
        >
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{currentDate}</span>
            <span className="text-xs text-blue-500 font-mono">{currentTime}</span>
          </div>

          {/* Mini Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <span key={d} className="text-[10px] text-slate-400 font-bold">
                {d}
              </span>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isToday = day === 9;
              return (
                <div
                  key={day}
                  className={`py-1 rounded-md text-xs font-medium ${
                    isToday
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
