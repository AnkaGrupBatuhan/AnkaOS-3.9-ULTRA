/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HardDrive, Folder, FileText, Image, ChevronRight, Search, Plus, Trash2 } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
}

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Games', type: 'folder', modified: 'Today, 14:20' },
  { id: '2', name: 'PlayStation_Saves', type: 'folder', modified: 'Yesterday' },
  { id: '3', name: 'Cyberpunk_2077_Screenshots', type: 'folder', modified: 'Oct 24, 2026' },
  { id: '4', name: 'Windows11_Desktop.exe', type: 'file', size: '14.8 MB', modified: 'Just now' },
  { id: '5', name: 'main.cpp', type: 'file', size: '3.2 KB', modified: 'Just now' },
  { id: '6', name: 'build_exe.bat', type: 'file', size: '1.1 KB', modified: 'Just now' },
  { id: '7', name: 'Lyria_Audio_Track.wav', type: 'file', size: '2.4 MB', modified: 'Today, 10:15' },
];

export default function FileExplorer() {
  const [currentFolder, setCurrentFolder] = useState<string>('Local Disk (C:) > Projects');
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [search, setSearch] = useState('');

  const handleCreateFolder = () => {
    const name = `New Folder (${files.length + 1})`;
    setFiles([
      ...files,
      {
        id: 'folder-' + Date.now(),
        name,
        type: 'folder',
        modified: 'Just now',
      },
    ]);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111319] text-slate-800 dark:text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Address & Navigation Bar */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-1.5 flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-slate-700 dark:text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-mono text-[11px] truncate">{currentFolder}</span>
        </div>

        <div className="relative w-48">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pl-7 pr-2 py-1 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleCreateFolder}
          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Folder</span>
        </button>
      </div>

      {/* Main Files View */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="group p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-blue-200 dark:hover:border-slate-700 flex flex-col items-center text-center cursor-pointer relative transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1">
                {file.type === 'folder' ? (
                  <Folder className="w-10 h-10 text-amber-500 fill-amber-400" />
                ) : (
                  <FileText className="w-9 h-9 text-blue-500" />
                )}
              </div>
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1 w-full">
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {file.size || file.modified}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-1 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-600 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
