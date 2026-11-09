/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Power, ArrowRight, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { APPS_LIST } from '../data/appsList';
import { AppDefinition } from '../types/desktop';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
}

export default function StartMenu({ isOpen, onClose, onLaunchApp }: StartMenuProps) {
  const [search, setSearch] = useState('');
  const [showAllApps, setShowAllApps] = useState(false);
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [powerNotification, setPowerNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredApps = APPS_LIST.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
  );

  const handlePowerAction = (action: string) => {
    setPowerMenuOpen(false);
    setPowerNotification(`System simulation: ${action}`);
    setTimeout(() => {
      setPowerNotification(null);
      onClose();
    }, 1500);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[580px] max-w-[95vw] h-[640px] max-h-[85vh] bg-white/85 dark:bg-[#1f222e]/85 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col justify-between overflow-hidden text-slate-800 dark:text-slate-100 select-none animate-scale-up"
    >
      {/* Top Search Bar */}
      <div className="p-6 pb-3 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type here to search apps, settings, and files..."
            autoFocus
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-full pl-11 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
        {powerNotification && (
          <div className="p-3 bg-blue-600 text-white rounded-xl text-center text-xs font-semibold animate-pulse">
            {powerNotification}
          </div>
        )}

        {/* Pinned Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {showAllApps ? 'All Applications' : 'Pinned'}
          </span>
          <button
            onClick={() => setShowAllApps(!showAllApps)}
            className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
          >
            <span>{showAllApps ? 'Back to Pinned' : 'All apps'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onLaunchApp(app.id);
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-center group cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md group-hover:scale-105 transition-transform ${
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
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-tight truncate w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Recommended Files & Activity */}
        {!showAllApps && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Recommended</span>
              <span className="text-[10px] text-slate-400">Recent</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => {
                  onLaunchApp('standalone');
                  onClose();
                }}
                className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                  ZIP
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Windows11_Desktop.zip
                  </div>
                  <div className="text-[10px] text-slate-400">Standalone C++ .exe package</div>
                </div>
              </div>

              <div
                onClick={() => {
                  onLaunchApp('steam');
                  onClose();
                }}
                className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                  🎮
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Cyberpunk 2077
                  </div>
                  <div className="text-[10px] text-slate-400">Steam installed library</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Footer & Power Bar */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            R
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">ronaldoedits809</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Local Administrator</div>
          </div>
        </div>

        {/* Power Menu Button */}
        <div className="relative">
          <button
            onClick={() => setPowerMenuOpen(!powerMenuOpen)}
            className="w-9 h-9 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
            title="Power options"
          >
            <Power className="w-4 h-4" />
          </button>

          {/* Power Popup */}
          {powerMenuOpen && (
            <div className="absolute right-0 bottom-12 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1 text-xs space-y-0.5 z-50">
              <button
                onClick={() => handlePowerAction('Sleep')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                Sleep
              </button>
              <button
                onClick={() => handlePowerAction('Shut Down')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                Shut down
              </button>
              <button
                onClick={() => handlePowerAction('Restart')}
                className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                Restart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
