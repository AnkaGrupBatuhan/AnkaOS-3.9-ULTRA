/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Check, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { PSGame } from '../../types/desktop';

const PS_GAMES: PSGame[] = [
  {
    id: 'spiderman2',
    title: "Marvel's Spider-Man 2",
    platform: 'PS5',
    genre: 'Action-Adventure',
    rating: 4.9,
    price: 69.99,
    originalPrice: 69.99,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    description: 'Spider-Men Peter Parker and Miles Morales return for an exciting new adventure in the critically acclaimed Marvel’s Spider-Man franchise.',
    features: ['Haptic Feedback', 'Adaptive Triggers', 'Tempest 3D AudioTech', 'Fast Loading with SSD'],
    bgGradient: 'from-red-600 via-blue-900 to-slate-950',
    iconGlyph: '🕷️',
  },
  {
    id: 'gow-ragnarok',
    title: 'God of War Ragnarök',
    platform: 'PS5',
    genre: 'Action / RPG',
    rating: 4.95,
    price: 49.99,
    originalPrice: 69.99,
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80',
    description: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go across the Nine Realms.',
    features: ['Stunning 4K visuals', 'DualSense Haptics', '60 FPS Performance Mode', 'Spatial 3D Audio'],
    bgGradient: 'from-amber-700 via-blue-950 to-slate-950',
    iconGlyph: '🪓',
  },
  {
    id: 'ghost-tsushima',
    title: "Ghost of Tsushima Director's Cut",
    platform: 'PS5',
    genre: 'Open World / Samurai',
    rating: 4.9,
    price: 39.99,
    originalPrice: 59.99,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'In the late 13th century, the Mongol empire has laid waste to entire nations. Tsushima Island is all that stands between mainland Japan and a massive Mongol invasion.',
    features: ['Japanese Lip Sync', 'Dynamic 4K @ 60fps', 'DualSense Controller Haptics', 'Iki Island Expansion'],
    bgGradient: 'from-amber-600 via-red-950 to-slate-950',
    iconGlyph: '⚔️',
  },
  {
    id: 'tlou-part1',
    title: 'The Last of Us Part I',
    platform: 'PS5',
    genre: 'Narrative / Survival',
    rating: 4.85,
    price: 44.99,
    originalPrice: 69.99,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    description: 'Endure and survive. Experience the emotional storytelling and unforgettable characters in Joel and Ellie’s journey rebuilt from the ground up for PS5.',
    features: ['Enhanced Visuals', 'DualSense Integration', 'Modernized Gameplay', 'Accessibility Options'],
    bgGradient: 'from-emerald-800 via-slate-900 to-black',
    iconGlyph: '🌿',
  },
  {
    id: 'demons-souls',
    title: "Demon's Souls",
    platform: 'PS5 Pro',
    genre: 'Action RPG / Souls',
    rating: 4.8,
    price: 29.99,
    originalPrice: 69.99,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    description: 'Entirely rebuilt from the ground up, this remake invites you to experience the unsettling story and ruthless combat of Demon’s Souls.',
    features: ['Ray Tracing Mode', 'Ultra-fast loading', 'Tactile Feedback', 'PS5 Pro Enhanced'],
    bgGradient: 'from-violet-900 via-slate-950 to-black',
    iconGlyph: '🛡️',
  },
  {
    id: 'horizon-fw',
    title: 'Horizon Forbidden West',
    platform: 'PS5',
    genre: 'Sci-Fi / Action RPG',
    rating: 4.88,
    price: 39.99,
    originalPrice: 59.99,
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    description: 'Join Aloy as she braves the Forbidden West – a majestic but dangerous frontier that conceals mysterious new threats.',
    features: ['Underwater Exploration', '4K 60FPS Fidelity', 'DualSense Adaptive Triggers', 'Ultra High Definition'],
    bgGradient: 'from-cyan-700 via-blue-950 to-slate-950',
    iconGlyph: '🏹',
  },
];

export default function PlayStationStore() {
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'ps5' | 'plus'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<PSGame | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [purchased, setPurchased] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleWishlist = (id: string, title: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((g) => g !== id));
      showNotification(`Removed "${title}" from Wishlist`);
    } else {
      setWishlist([...wishlist, id]);
      showNotification(`Added "${title}" to Wishlist!`);
    }
  };

  const toggleCart = (id: string, title: string) => {
    if (cart.includes(id)) {
      setCart(cart.filter((g) => g !== id));
      showNotification(`Removed "${title}" from Cart`);
    } else {
      setCart([...cart, id]);
      showNotification(`Added "${title}" to Cart!`);
    }
  };

  const handleBuy = (id: string, title: string) => {
    setPurchased([...purchased, id]);
    setCart(cart.filter((g) => g !== id));
    showNotification(`Success! "${title}" is now in your PlayStation Library!`);
  };

  const filteredGames = PS_GAMES.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'deals') return (game.originalPrice ?? 0) > game.price;
    if (activeTab === 'ps5') return game.platform.includes('PS5');
    if (activeTab === 'plus') return game.price <= 39.99;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0d18] text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <div className="bg-[#050812] border-b border-blue-900/40 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">
            PS
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              PlayStation Store
              <span className="text-[10px] bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">PS5</span>
            </div>
            <div className="text-[11px] text-slate-400">Official Digital Game Store</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64 max-w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, editions..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Wishlist & Cart buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showNotification(`Wishlist has ${wishlist.length} item(s)`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'text-red-400 fill-red-400' : ''}`} />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button
            onClick={() => showNotification(`Cart has ${cart.length} item(s)`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart ({cart.length})</span>
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="bg-[#0b1022] border-b border-blue-900/30 px-5 py-2 flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Featured
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'deals' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Special Deals & Discounts
        </button>
        <button
          onClick={() => setActiveTab('ps5')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'ps5' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          PS5 Blockbusters
        </button>
        <button
          onClick={() => setActiveTab('plus')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'plus' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          PlayStation Plus Monthly
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-blue-600 text-white text-xs px-4 py-2 text-center animate-fade-in shadow-md">
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Hero Spotlight Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-[#070b16] border border-blue-700/40 p-6 mb-6 shadow-xl">
          <div className="max-w-md relative z-10">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              PlayStation 5 Spotlight
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Marvel's Spider-Man 2</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Be greater together. Explore Marvel’s New York with Peter and Miles. Switch between both Spider-Men in an action-packed cinematic masterpiece.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBuy('spiderman2', "Marvel's Spider-Man 2")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
              >
                {purchased.includes('spiderman2') ? 'In Library ✓' : 'Buy Now - $69.99'}
              </button>
              <button
                onClick={() => setSelectedGame(PS_GAMES[0])}
                className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700/60 transition-colors"
              >
                View Details & DualSense Features
              </button>
            </div>
          </div>
          <div className="absolute right-4 bottom-2 text-slate-700/20 text-8xl font-black select-none pointer-events-none">
            PS5
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => {
            const isPurchased = purchased.includes(game.id);
            const inCart = cart.includes(game.id);
            const inWishlist = wishlist.includes(game.id);

            return (
              <div
                key={game.id}
                className="group bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/50 rounded-xl p-3 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-950/30"
              >
                <div>
                  <div className={`relative aspect-video rounded-lg overflow-hidden bg-gradient-to-tr ${game.bgGradient || 'from-blue-900 to-slate-900'} mb-3 flex items-center justify-center`}>
                    <span className="text-4xl select-none filter drop-shadow opacity-90">{game.iconGlyph || '🎮'}</span>
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 mix-blend-overlay"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 backdrop-blur-sm text-blue-400 border border-blue-400/30">
                      {game.platform}
                    </div>
                    <button
                      onClick={() => toggleWishlist(game.id, game.title)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors"
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'text-red-500 fill-red-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] text-blue-400 font-medium">{game.genre}</span>
                    <span className="text-[11px] text-amber-400 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {game.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    {game.originalPrice && game.originalPrice > game.price && (
                      <span className="text-[10px] text-slate-500 line-through">
                        ${game.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-sm font-black text-white">
                      ${game.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedGame(game)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
                    >
                      Info
                    </button>

                    {isPurchased ? (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <button
                        onClick={() => toggleCart(game.id, game.title)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          inCart
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                        }`}
                      >
                        {inCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1322] border border-blue-800/60 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="relative aspect-video bg-slate-900">
              <img
                src={selectedGame.coverImage}
                alt={selectedGame.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 text-sm font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">
                {selectedGame.platform}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-400 font-semibold">{selectedGame.genre}</span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {selectedGame.rating} / 5.0 Rating
                </span>
              </div>

              <h2 className="text-xl font-black text-white mb-2">{selectedGame.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedGame.description}</p>

              <div className="mb-4">
                <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  PS5 Hardware & DualSense Features:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedGame.features.map((feat, i) => (
                    <div key={i} className="text-xs bg-slate-800/70 border border-slate-700/60 rounded px-2.5 py-1 text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="text-lg font-black text-white">${selectedGame.price.toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(selectedGame.id, selectedGame.title)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                  >
                    {wishlist.includes(selectedGame.id) ? 'Saved' : 'Wishlist'}
                  </button>
                  <button
                    onClick={() => {
                      handleBuy(selectedGame.id, selectedGame.title);
                      setSelectedGame(null);
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md transition-colors"
                  >
                    {purchased.includes(selectedGame.id) ? 'Installed in Library ✓' : 'Instant Purchase'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
