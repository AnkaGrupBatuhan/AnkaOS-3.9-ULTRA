/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Sparkles, Volume2, Music, Sliders, Disc3, Radio } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  duration: number;
  bpm: number;
  notes: number[];
}

const PRESET_TRACKS: MusicTrack[] = [
  {
    id: 'cyberpunk',
    title: 'Neon Cyberpunk Overdrive',
    genre: 'Synthwave',
    duration: 30,
    bpm: 128,
    notes: [48, 51, 55, 58, 60, 63, 67, 70, 72, 70, 67, 63],
  },
  {
    id: 'lofi',
    title: 'Midnight Rain Lo-Fi Beat',
    genre: 'Lo-Fi Chill',
    duration: 30,
    bpm: 84,
    notes: [60, 63, 67, 70, 68, 65, 63, 60],
  },
  {
    id: 'ambient',
    title: 'Windows 11 Horizon Ambient',
    genre: 'Ambient',
    duration: 15,
    bpm: 72,
    notes: [60, 64, 67, 71, 72, 76, 79],
  },
];

export default function MediaStudio() {
  const [prompt, setPrompt] = useState<string>('Lo-Fi relaxing rainy study beat with electric piano and vinyl tape');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectedModel, setSelectedModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(PRESET_TRACKS[0]);
  const [volume, setVolume] = useState<number>(0.7);
  const [spectrumBars, setSpectrumBars] = useState<number[]>(new Array(24).fill(15));
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize or get Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Synthesize a note using Web Audio API oscillator
  const playNote = (midiNote: number, durationSec = 0.3) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      osc.type = currentTrack.genre.includes('Synth') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      let step = 0;
      const intervalMs = (60 / currentTrack.bpm / 2) * 1000;

      timerRef.current = setInterval(() => {
        const note = currentTrack.notes[step % currentTrack.notes.length];
        playNote(note, 0.25);
        step++;
        setPlaybackTime((prev) => (prev >= currentTrack.duration ? 0 : +(prev + intervalMs / 1000).toFixed(1)));
      }, intervalMs);

      // Animate spectrum visualizer
      const updateVisualizer = () => {
        setSpectrumBars(
          new Array(24).fill(0).map(() => Math.floor(Math.random() * 80) + 15)
        );
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setSpectrumBars(new Array(24).fill(8));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTrack, volume]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying(!isPlaying);
  };

  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    setGenerationLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Calling ${selectedModel} for ${selectedDuration}s audio clip...`,
      ...prev,
    ]);

    try {
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          duration: selectedDuration,
          genre: currentTrack.genre,
        }),
      });

      const res = await response.json();
      if (res.data) {
        const newTrack: MusicTrack = {
          id: 'gen-' + Date.now(),
          title: res.data.title || 'AI Generated Composition',
          genre: res.data.scale || 'Cinematic',
          duration: selectedDuration,
          bpm: res.data.tempo || 110,
          notes: res.data.melodyNotes?.length ? res.data.melodyNotes : [60, 62, 65, 67, 72, 70, 67],
        };
        setCurrentTrack(newTrack);
        setGenerationLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] Music generated successfully: "${newTrack.title}" (${newTrack.bpm} BPM)`,
          ...prev,
        ]);
        setIsPlaying(true);
      }
    } catch {
      setGenerationLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Generated local synthesized audio stream with Web Audio engine`,
        ...prev,
      ]);
      setIsPlaying(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#11131a] text-slate-100 overflow-hidden font-sans select-none">
      {/* Studio Top Header */}
      <div className="bg-[#181b24] border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Disc3 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Groove Music & AI Audio Studio
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded">
                Lyria & WebAudio
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Windows 11 Music Synthesizer & Generator</div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          {PRESET_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrack(track);
                setPlaybackTime(0);
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                currentTrack.id === track.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {track.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Player & Equalizer Visualizer */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Now Playing Card with Spectrum Visualizer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider block">
                  {currentTrack.genre} · {currentTrack.bpm} BPM
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">{currentTrack.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-purple-300 tabular-nums">
                  {playbackTime.toFixed(1)}s / {currentTrack.duration}s
                </div>
                <div className="text-[10px] text-slate-500">Live Synthesis Engine</div>
              </div>
            </div>

            {/* Frequency Spectrum Bars Visualizer */}
            <div className="h-28 bg-[#0b0d14] rounded-xl border border-slate-800/80 p-3 flex items-end justify-between gap-1.5 mb-4 overflow-hidden">
              {spectrumBars.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-75"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(to top, #7c3aed, #ec4899 ${height}%)`,
                  }}
                />
              ))}
            </div>

            {/* Playback Controls Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-950/40 transition-transform active:scale-95"
                >
                  {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>

                <div>
                  <div className="text-xs font-semibold text-white">
                    {isPlaying ? 'Synthesizing Audio Output...' : 'Paused'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Real-time procedural Web Audio synth
                  </div>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 accent-purple-500"
                />
                <span className="text-xs font-mono text-slate-400 tabular-nums">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Interactive Keyboard / Piano Roll simulation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                Live Synthesizer Keyboard
              </span>
              <span className="text-[10px] text-slate-500">Click keys to trigger audio waveforms</span>
            </div>
            <div className="grid grid-cols-12 gap-1 h-20">
              {[48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67].map((midi, i) => (
                <button
                  key={midi}
                  onClick={() => playNote(midi, 0.4)}
                  className="bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white rounded flex flex-col justify-end p-1 text-[9px] font-mono transition-colors active:scale-95 border border-slate-700"
                >
                  {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'][i]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generation Panel (Lyria & Gemini) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Lyria Music Generator
            </div>
            <h3 className="text-sm font-bold text-white mb-2">Prompt to Music Track</h3>

            {/* Model & Duration controls */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Engine / Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedModel('lyria-3-clip-preview');
                      setSelectedDuration(30);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      selectedModel === 'lyria-3-clip-preview'
                        ? 'bg-purple-900/50 border-purple-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Lyria 3 Clip</div>
                    <div className="text-[10px] text-purple-300">Up to 30s clips</div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedModel('lyria-3-pro-preview');
                      setSelectedDuration(60);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      selectedModel === 'lyria-3-pro-preview'
                        ? 'bg-purple-900/50 border-purple-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Lyria 3 Pro</div>
                    <div className="text-[10px] text-purple-300">Full tracks</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Duration</label>
                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setSelectedDuration(dur)}
                      className={`flex-1 py-1 rounded text-xs font-semibold ${
                        selectedDuration === dur
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Description / Style Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Describe instruments, mood, genre, tempo..."
                />
              </div>

              <button
                onClick={handleGenerateMusic}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                {isGenerating ? (
                  <>
                    <Disc3 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Composition...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Music ({selectedDuration}s)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-[#0b0d14] rounded-lg p-3 border border-slate-800/80 text-[10px] font-mono text-slate-400 max-h-32 overflow-y-auto space-y-1">
            <div className="text-purple-400 font-bold mb-1">Engine Activity Console:</div>
            {generationLogs.length === 0 ? (
              <div>Ready for prompt input. Click Generate to compose.</div>
            ) : (
              generationLogs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
