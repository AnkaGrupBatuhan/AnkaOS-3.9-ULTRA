/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent as required by skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Provide maps API key safely to client if provisioned
app.get('/api/config', (_req, res) => {
  res.json({
    mapsKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
    appName: 'Windows 11 WebOS Desktop',
  });
});

// Music & Sound generation API endpoint
app.post('/api/music/generate', async (req, res) => {
  try {
    const { prompt, duration = 30, genre = 'synthwave' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    // Generate musical composition structure & synthesized sound parameters using Gemini
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an expert audio synthesizer composer. Generate an audio composition specification for this request:
Genre: ${genre}
Duration: ${duration}s
Prompt: ${prompt}

Return a valid JSON object matching this schema:
{
  "title": string,
  "tempo": number (60-160 bpm),
  "scale": "major" | "minor" | "pentatonic" | "cyberpunk" | "lofi",
  "baseFreq": number (e.g. 220, 440),
  "instruments": string[],
  "melodyNotes": number[] (midi notes between 48 and 84),
  "chords": string[],
  "vibeDescription": string
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(result.text || '{}');
    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Music generation error:', error?.message || error);
    // Return friendly fallback parameters so Web Audio synth continues uninterrupted
    res.json({
      success: false,
      fallback: true,
      data: {
        title: 'Windows 11 Ambient Suite',
        tempo: 96,
        scale: 'lofi',
        baseFreq: 261.63,
        instruments: ['electric-piano', 'analog-bass', 'vinyl-sub'],
        melodyNotes: [60, 62, 64, 67, 69, 72, 69, 67, 64],
        chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'],
        vibeDescription: 'Relaxed ambient Lo-Fi groove with smooth electric keys',
      },
    });
  }
});

// Vite middleware for development or static files for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
