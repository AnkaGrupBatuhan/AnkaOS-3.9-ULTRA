/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>([
    'Windows PowerShell [Version 10.0.26100.2033]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'Type "help" to see available terminal commands.',
    '',
  ]);
  const [input, setInput] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLines = [...lines, `PS C:\\Users\\ronaldoedits809> ${cmd}`];

    const lower = cmd.toLowerCase();
    if (lower === 'help') {
      newLines.push(
        'Available commands:',
        '  dir            - List current directory files',
        '  systeminfo     - Display OS and hardware specifications',
        '  ver            - Show Windows 11 Build version',
        '  whoami         - Print current user and privileges',
        '  cls / clear    - Clear terminal screen',
        '  matrix         - Stream matrix green code animation',
        '  echo <text>    - Print text to screen',
        '  date           - Show current local time and date',
        '  standalone     - Show C++ .exe standalone build info'
      );
    } else if (lower === 'dir' || lower === 'ls') {
      newLines.push(
        ' Directory of C:\\Users\\ronaldoedits809',
        '',
        '10/24/2026  12:00 PM    <DIR>          Steam',
        '10/24/2026  12:00 PM    <DIR>          PlayStation_Store',
        '11/09/2026  07:15 AM        14,842,100 Windows11_Desktop.exe',
        '11/09/2026  07:15 AM             3,248 main.cpp',
        '11/09/2026  07:15 AM             1,102 build_exe.bat',
        '               3 File(s)     14,846,450 bytes'
      );
    } else if (lower === 'systeminfo') {
      newLines.push(
        'OS Name:                   Microsoft Windows 11 Pro',
        'OS Version:                10.0.26100 N/A Build 26100.2033 (24H2)',
        'System Manufacturer:       Google AI Studio Virtual Engine',
        'Processor(s):              AMD Ryzen 9 7950X3D 16-Core Processor ~4.2GHz',
        'Total Physical Memory:     65,536 MB RAM',
        'Graphics:                  NVIDIA GeForce RTX 4090 24GB VRAM'
      );
    } else if (lower === 'ver') {
      newLines.push('Microsoft Windows [Version 10.0.26100.2033]');
    } else if (lower === 'whoami') {
      newLines.push('desktop-ai\\ronaldoedits809 (Administrator)');
    } else if (lower === 'cls' || lower === 'clear') {
      setLines([]);
      setInput('');
      return;
    } else if (lower === 'matrix') {
      newLines.push(
        '01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100',
        'Wake up, Neo... The Matrix has you.',
        'Follow the white rabbit.'
      );
    } else if (lower === 'date') {
      newLines.push(new Date().toString());
    } else if (lower === 'standalone') {
      newLines.push(
        'STANDALONE .EXE STATUS: READY',
        '  Compiler: C++ WebView2 Native Loader',
        '  Dependency: Python INDEPENDENT (Zero Python required)',
        '  Build Target: Windows11_Desktop.exe'
      );
    } else if (lower.startsWith('echo ')) {
      newLines.push(cmd.slice(5));
    } else {
      newLines.push(`'${cmd}' is not recognized as an internal or external command. Type 'help' for commands.`);
    }

    setLines(newLines);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-[#cccccc] font-mono text-xs select-text overflow-hidden">
      {/* Terminal Titlebar */}
      <div className="bg-[#1f1f1f] px-3 py-1.5 flex items-center justify-between border-b border-[#2d2d2d] select-none text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>Windows PowerShell</span>
        </div>
        <span className="text-[10px] text-slate-500">Administrator: Windows Terminal</span>
      </div>

      {/* Output Console */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap">
            {l}
          </div>
        ))}

        {/* Input prompt line */}
        <form onSubmit={handleCommand} className="flex items-center gap-1.5 pt-1">
          <span className="text-blue-400 select-none">PS C:\Users\ronaldoedits809&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-[#cccccc] focus:outline-none font-mono text-xs"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
