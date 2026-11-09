/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { WindowState } from '../utils/windowManager';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}

export default function WindowFrame({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  children,
}: WindowFrameProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (windowState.isMaximized) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialX: windowState.x,
      initialY: windowState.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;
      onMove(dragStartRef.current.initialX + dx, dragStartRef.current.initialY + dy);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const style: React.CSSProperties = windowState.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 48px)', // above taskbar
        zIndex: windowState.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        top: `${windowState.y}px`,
        left: `${windowState.x}px`,
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        zIndex: windowState.zIndex,
      };

  return (
    <div
      style={style}
      onMouseDown={onFocus}
      className={`flex flex-col bg-white/95 dark:bg-[#181a20]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl transition-shadow overflow-hidden select-none ${
        windowState.isMaximized ? 'rounded-none' : 'rounded-xl'
      } ${isDragging ? 'opacity-95' : ''}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
        className="h-10 bg-slate-100/80 dark:bg-slate-900/80 border-b border-black/5 dark:border-white/5 px-3 flex items-center justify-between cursor-move shrink-0"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span className="w-4 h-4 flex items-center justify-center font-bold text-blue-500">
            {windowState.title.slice(0, 1)}
          </span>
          <span className="truncate max-w-xs">{windowState.title}</span>
        </div>

        {/* Windows 11 Window Control Buttons */}
        <div className="flex items-center h-full -mr-3" onMouseDown={(e) => e.stopPropagation()}>
          {/* Minimize */}
          <button
            onClick={onMinimize}
            className="w-11 h-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={onMaximize}
            className="w-11 h-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={windowState.isMaximized ? 'Restore' : 'Maximize'}
          >
            {windowState.isMaximized ? (
              <Copy className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-11 h-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
