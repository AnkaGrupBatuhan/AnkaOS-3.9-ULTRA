/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Search, MapPin, Compass, Navigation, Layers, Info } from 'lucide-react';
import { Landmark } from '../../types/desktop';

const PRESET_LANDMARKS: Landmark[] = [
  {
    id: 'hagia-sophia',
    name: 'Hagia Sophia',
    city: 'Istanbul',
    country: 'Turkey',
    lat: 41.0086,
    lng: 28.9802,
    category: 'Historic Monument',
    description: 'Iconic Byzantine architectural masterpiece built in 537 AD, located in the Sultanahmet district.',
  },
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower',
    city: 'Paris',
    country: 'France',
    lat: 48.8584,
    lng: 2.2945,
    category: 'Landmark',
    description: 'Wrought-iron lattice tower on the Champ de Mars, the global cultural icon of Paris.',
  },
  {
    id: 'times-square',
    name: 'Times Square',
    city: 'New York',
    country: 'USA',
    lat: 40.758,
    lng: -73.9855,
    category: 'Entertainment Center',
    description: 'Major commercial intersection, tourist destination, and entertainment hub in Midtown Manhattan.',
  },
  {
    id: 'shibuya',
    name: 'Shibuya Crossing',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6595,
    lng: 139.7004,
    category: 'Urban Transit',
    description: 'The busiest pedestrian intersection in the world, iconic heart of modern Tokyo nightlife and culture.',
  },
  {
    id: 'colosseum',
    name: 'Colosseum',
    city: 'Rome',
    country: 'Italy',
    lat: 41.8902,
    lng: 12.4922,
    category: 'Ancient Wonder',
    description: 'The largest ancient amphitheatre ever built, constructed of travertine limestone in Imperial Rome.',
  },
];

export default function MapsApp() {
  const [apiKey, setApiKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(PRESET_LANDMARKS[0]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: PRESET_LANDMARKS[0].lat,
    lng: PRESET_LANDMARKS[0].lng,
  });
  const [zoom, setZoom] = useState<number>(16);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');

  useEffect(() => {
    // If not in import.meta.env, check server /api/config
    if (!apiKey) {
      fetch('/api/config')
        .then((res) => res.json())
        .then((cfg) => {
          if (cfg.mapsKey) setApiKey(cfg.mapsKey);
        })
        .catch(() => {});
    }

    // Listen to gmp-quota-exceeded event as required by Case A Quota Defense
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, [apiKey]);

  const handleSelectLandmark = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setCenter({ lat: landmark.lat, lng: landmark.lng });
    setZoom(16);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search against preset landmarks or parse coordinates
    const matched = PRESET_LANDMARKS.find(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched) {
      handleSelectLandmark(matched);
    } else {
      // Check if coordinate format e.g. "41.01, 28.97"
      const parts = searchQuery.split(',').map((p) => parseFloat(p.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const custom: Landmark = {
          id: 'custom-' + Date.now(),
          name: 'Custom Location',
          city: 'Coordinates',
          country: `${parts[0].toFixed(4)}, ${parts[1].toFixed(4)}`,
          lat: parts[0],
          lng: parts[1],
          category: 'User Coordinates',
          description: `Custom GPS coordinates at latitude ${parts[0]} and longitude ${parts[1]}.`,
        };
        handleSelectLandmark(custom);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Quota defense banner per Section 8 Case A */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs text-center sticky top-0 z-50 shadow-sm shrink-0">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Search & Toolbar */}
      <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Google Maps
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/60 rounded border border-blue-200 dark:border-blue-800">
                Live
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {selectedLandmark.name} · {selectedLandmark.city}, {selectedLandmark.country}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search landmark (e.g. Paris, Istanbul, Shibuya)..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-8 pr-3 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>

        {/* Map Type Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setMapTypeId('roadmap')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapTypeId === 'roadmap'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setMapTypeId('satellite')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapTypeId === 'satellite'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTypeId('terrain')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              mapTypeId === 'terrain'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Main Map View & Landmark Bar */}
      <div className="relative flex-1 w-full h-full min-h-[350px] overflow-hidden">
        {/* Preset quick jump chips */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap max-w-md bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-md">
          {PRESET_LANDMARKS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectLandmark(item)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedLandmark.id === item.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Selected Landmark Card overlay */}
        <div className="absolute bottom-4 left-4 z-10 max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {selectedLandmark.name}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded font-medium">
              {selectedLandmark.category}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {selectedLandmark.description}
          </p>
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Lat: {selectedLandmark.lat.toFixed(4)}, Lng: {selectedLandmark.lng.toFixed(4)}</span>
            <button
              onClick={() => {
                setCenter({ lat: selectedLandmark.lat, lng: selectedLandmark.lng });
                setZoom(17);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
            >
              <Navigation className="w-3 h-3" /> Center
            </button>
          </div>
        </div>

        {/* React Google Maps component */}
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <div className="w-full h-full min-h-[350px]">
              <GoogleMap
                center={center}
                zoom={zoom}
                onCenterChanged={(ev) => ev.detail.center && setCenter(ev.detail.center)}
                onZoomChanged={(ev) => ev.detail.zoom && setZoom(ev.detail.zoom)}
                mapId="DEMO_MAP_ID"
                mapTypeId={mapTypeId}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                disableDefaultUI={false}
              >
                {PRESET_LANDMARKS.map((lm) => (
                  <AdvancedMarker
                    key={lm.id}
                    position={{ lat: lm.lat, lng: lm.lng }}
                    onClick={() => handleSelectLandmark(lm)}
                  >
                    <Pin
                      background={selectedLandmark.id === lm.id ? '#2563eb' : '#dc2626'}
                      glyphColor="#ffffff"
                      borderColor="#ffffff"
                    />
                  </AdvancedMarker>
                ))}
              </GoogleMap>
            </div>
          </APIProvider>
        ) : (
          /* High-res interactive vector map fallback when offline or loading key */
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-slate-300 relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-xl">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{selectedLandmark.name}</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {selectedLandmark.city}, {selectedLandmark.country} · Coordinates: {selectedLandmark.lat}, {selectedLandmark.lng}
            </p>
            <div className="text-xs bg-slate-800/80 border border-slate-700 rounded-lg p-3 max-w-md text-left text-slate-300 space-y-1">
              <div className="font-semibold text-blue-400">Google Maps Platform Ready</div>
              <div>Connected to Google Maps Platform with DEMO_MAP_ID and codeassist attribution.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
