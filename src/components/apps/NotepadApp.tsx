/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Save, Download, FilePlus } from 'lucide-react';

export default function NotepadApp() {
  const [content, setContent] = useState(
    `Windows 11 WebOS Desktop Note
================================
- PlayStation Store & PS5 games catalog added
- Steam client library with game launcher active
- Google Maps Platform integrated
- Lyria AI audio synthesizer live
- Standalone C++ .exe package generator ready

Python'dan bağımsız .exe oluşturma:
'Standalone Exporter' uygulamasından .zip paketini indirip build_exe.bat dosyasını çalıştırabilirsiniz.`
  );
  const [fileName, setFileName] = useState('Untitled.txt');

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    setContent('');
    setFileName('New_Document.txt');
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#181a20] text-slate-800 dark:text-slate-100 font-sans select-none overflow-hidden">
      {/* Menu Bar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <button onClick={handleNew} className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            <FilePlus className="w-3 h-3" /> New
          </button>
          <button onClick={handleDownload} className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            <Save className="w-3 h-3" /> Save / Download .txt
          </button>
        </div>

        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-transparent border-b border-slate-300 dark:border-slate-700 text-center text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 w-36"
        />
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full bg-transparent p-4 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-100 resize-none focus:outline-none select-text"
        placeholder="Type notes here..."
      />

      {/* Status Bar */}
      <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
        <span>Ln {lineCount}, Col {content.length}</span>
        <span>{wordCount} words · UTF-8 · Windows (CRLF)</span>
      </div>
    </div>
  );
}
