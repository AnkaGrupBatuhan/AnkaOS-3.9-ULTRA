/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Download, Trophy, Users, Shield, Clock, ExternalLink } from 'lucide-react';
import { SteamGame } from '../../types/desktop';

const STEAM_GAMES: SteamGame[] = [
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    genre: 'Tactical Shooter / Esports',
    developer: 'Valve',
    price: 0,
    installed: true,
    playTimeHours: 412.5,
    achievements: { completed: 1, total: 1 },
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'Open World RPG / Sci-Fi',
    developer: 'CD PROJEKT RED',
    price: 59.99,
    installed: true,
    playTimeHours: 86.4,
    achievements: { completed: 34, total: 45 },
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'elden-ring',
    title: 'ELDEN RING: Shadow of the Erdtree',
    genre: 'Action RPG / Souls',
    developer: 'FromSoftware',
    price: 59.99,
    installed: true,
    playTimeHours: 142.1,
    achievements: { completed: 38, total: 42 },
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'bg3',
    title: "Baldur's Gate 3",
    genre: 'Story-rich Party RPG',
    developer: 'Larian Studios',
    price: 59.99,
    installed: false,
    playTimeHours: 19.8,
    achievements: { completed: 12, total: 54 },
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'wukong',
    title: 'Black Myth: Wukong',
    genre: 'Action RPG / Mythology',
    developer: 'Game Science',
    price: 59.99,
    installed: false,
    playTimeHours: 0,
    achievements: { completed: 0, total: 36 },
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  },
];

export default function SteamApp() {
  const [activeTab, setActiveTab] = useState<'store' | 'library' | 'community'>('library');
  const [selectedGameId, setSelectedGameId] = useState<string>('cs2');
  const [runningGameId, setRunningGameId] = useState<string | null>(null);
  const [games, setGames] = useState<SteamGame[]>(STEAM_GAMES);
  const [friends] = useState([
    { name: 'Alex_V', game: 'Counter-Strike 2', status: 'in-game' },
    { name: 'GhostRider', game: 'Cyberpunk 2077', status: 'in-game' },
    { name: 'NeonSamurai', status: 'online' },
    { name: 'Kratos99', status: 'away' },
  ]);

  const selectedGame = games.find((g) => g.id === selectedGameId) || games[0];

  const handleTogglePlay = (id: string) => {
    if (runningGameId === id) {
      setRunningGameId(null);
    } else {
      setRunningGameId(id);
      // increment playtime slightly
      setGames(
        games.map((g) => (g.id === id ? { ...g, playTimeHours: +(g.playTimeHours + 0.1).toFixed(1) } : g))
      );
    }
  };

  const handleInstall = (id: string) => {
    setGames(games.map((g) => (g.id === id ? { ...g, installed: true } : g)));
  };

  return (
    <div className="flex flex-col h-full bg-[#171a21] text-[#c5c3c0] overflow-hidden font-sans select-none">
      {/* Steam Top Bar */}
      <div className="bg-[#171d25] border-b border-[#2a475e]/40 px-4 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold tracking-wider text-white">
            <span className="w-5 h-5 rounded-full bg-[#2a475e] border border-[#66c0f4] flex items-center justify-center text-[10px] text-[#66c0f4]">
              ♨
            </span>
            <span>STEAM</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] font-bold tracking-wide">
            <button
              onClick={() => setActiveTab('store')}
              className={`hover:text-white transition-colors ${
                activeTab === 'store' ? 'text-[#66c0f4] border-b-2 border-[#66c0f4] pb-0.5' : 'text-[#8f98a0]'
              }`}
            >
              STORE
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`hover:text-white transition-colors ${
                activeTab === 'library' ? 'text-[#66c0f4] border-b-2 border-[#66c0f4] pb-0.5' : 'text-[#8f98a0]'
              }`}
            >
              LIBRARY
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`hover:text-white transition-colors ${
                activeTab === 'community' ? 'text-[#66c0f4] border-b-2 border-[#66c0f4] pb-0.5' : 'text-[#8f98a0]'
              }`}
            >
              COMMUNITY
            </button>
          </div>
        </div>

        {/* User profile mini */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
              R
            </div>
            <span className="text-white font-medium text-[11px]">ronaldoedits809</span>
          </div>
          <span className="text-[10px] bg-[#212b38] px-2 py-0.5 rounded text-[#66c0f4] border border-[#2a475e]">
            $45.20 USD
          </span>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'library' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Library Sidebar */}
          <div className="w-60 bg-[#1b2838] border-r border-[#2a475e]/40 flex flex-col shrink-0">
            <div className="p-3 border-b border-[#2a475e]/30 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 text-[11px] tracking-wider uppercase">GAMES ({games.length})</span>
              <span className="text-[10px] text-[#66c0f4]">Ready to play</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {games.map((g) => {
                const isSelected = g.id === selectedGameId;
                const isRunning = runningGameId === g.id;

                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameId(g.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#2a475e] text-white font-semibold'
                        : 'text-[#8f98a0] hover:text-white hover:bg-[#212b38]'
                    }`}
                  >
                    <span className="truncate">{g.title}</span>
                    {isRunning && (
                      <span className="text-[9px] px-1 bg-emerald-600 text-white rounded animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Friends list footer */}
            <div className="p-3 bg-[#171d25] border-t border-[#2a475e]/30 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5 text-[#66c0f4]" />
                <span>FRIENDS (2 Playing)</span>
              </div>
              <div className="space-y-1">
                {friends.slice(0, 2).map((f, i) => (
                  <div key={i} className="text-[11px] flex items-center justify-between text-[#8f98a0]">
                    <span className="text-emerald-400 font-medium">{f.name}</span>
                    <span className="text-[10px] truncate max-w-[100px] text-slate-400">{f.game}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Library Game Details Panel */}
          <div className="flex-1 bg-[#12161f] overflow-y-auto flex flex-col">
            {/* Banner Header */}
            <div className="relative h-56 bg-gradient-to-b from-[#1b2838] to-[#12161f] border-b border-[#2a475e]/30 p-6 flex flex-col justify-end overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity bg-gradient-to-tr from-sky-900 to-indigo-950"
                style={{ backgroundImage: `url(${selectedGame.bannerImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent" />

              <div className="relative z-10">
                <span className="text-[11px] text-[#66c0f4] font-bold tracking-wider uppercase mb-1 block">
                  {selectedGame.genre}
                </span>
                <h1 className="text-2xl font-black text-white mb-3 tracking-tight">
                  {selectedGame.title}
                </h1>

                {/* Big Action Bar */}
                <div className="flex items-center gap-4">
                  {selectedGame.installed ? (
                    <button
                      onClick={() => handleTogglePlay(selectedGame.id)}
                      className={`px-8 py-2.5 rounded text-sm font-black flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                        runningGameId === selectedGame.id
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/50'
                          : 'bg-gradient-to-r from-[#4c6b22] to-[#739e31] hover:from-[#587c28] hover:to-[#84b537] text-white shadow-emerald-950/50'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{runningGameId === selectedGame.id ? 'STOP' : 'PLAY'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInstall(selectedGame.id)}
                      className="px-6 py-2.5 rounded text-sm font-bold bg-[#2a475e] hover:bg-[#3d6585] text-white flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>INSTALL (48.2 GB)</span>
                    </button>
                  )}

                  <div className="flex items-center gap-5 text-xs text-[#8f98a0]">
                    <div>
                      <div className="text-[10px] text-slate-400">LAST PLAYED</div>
                      <div className="font-semibold text-white">Today</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">PLAY TIME</div>
                      <div className="font-semibold text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#66c0f4]" />
                        {selectedGame.playTimeHours} hours
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">CLOUD STATUS</div>
                      <div className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Up to date
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements & Activity */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-[#1b2838]/80 border border-[#2a475e]/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>ACHIEVEMENTS ({selectedGame.achievements.completed}/{selectedGame.achievements.total})</span>
                    </div>
                    <span className="text-xs text-[#66c0f4]">View all</span>
                  </div>

                  <div className="w-full bg-[#12161f] rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(selectedGame.achievements.completed / selectedGame.achievements.total) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Unlocked {(selectedGame.achievements.completed / selectedGame.achievements.total * 100).toFixed(0)}% of all Steam game achievements.
                  </div>
                </div>

                <div className="bg-[#1b2838]/80 border border-[#2a475e]/30 rounded-lg p-4 text-xs">
                  <h3 className="font-bold text-white mb-2 text-xs uppercase tracking-wide">Developer & Patch Notes</h3>
                  <p className="text-slate-400 leading-relaxed mb-2">
                    Latest update 2.13 has been deployed. New DLSS 3.7 frame generation, enhanced ray-traced shadows, and general performance stability improvements have been added.
                  </p>
                  <span className="text-[#66c0f4] hover:underline cursor-pointer flex items-center gap-1">
                    Read complete changelog <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Game Info Card */}
              <div className="bg-[#1b2838]/60 border border-[#2a475e]/30 rounded-lg p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">DEVELOPER</span>
                  <span className="text-white font-medium">{selectedGame.developer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">STEAM TRADING CARDS</span>
                  <span className="text-emerald-400 font-medium">Eligible (3 Drops Remaining)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">WORKSHOP MODS</span>
                  <span className="text-white font-medium">1,482 Community Submissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Store View */
        <div className="flex-1 bg-[#101822] overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-slate-900 border border-[#2a475e]">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80"
                alt="Steam Winter Sale"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101822] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black uppercase">
                  WEEKEND DEAL
                </span>
                <h2 className="text-xl font-black text-white mt-1">SPECIAL PUBLISHER DISCOUNTS</h2>
                <p className="text-xs text-slate-300">Up to 80% off on top-rated tactical shooters and RPGs.</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Sellers on Steam</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {games.map((g) => (
                <div
                  key={g.id}
                  className="bg-[#1b2838] hover:bg-[#213247] border border-[#2a475e]/40 rounded-lg p-3 flex items-center justify-between gap-3 transition-colors"
                >
                  <img
                    src={g.coverImage}
                    alt={g.title}
                    className="w-16 h-10 object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{g.title}</div>
                    <div className="text-[10px] text-slate-400">{g.genre}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-white">
                      {g.price === 0 ? 'Free to Play' : `$${g.price.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
