/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleDigit = (d: string) => {
    setDisplay((prev) => (prev === '0' ? d : prev + d));
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op}`);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleCalculate = () => {
    try {
      const full = `${equation} ${display}`;
      // Safe arithmetic evaluator
      const sanitized = full.replace(/×/g, '*').replace(/÷/g, '/');
      const res = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(res));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020] text-slate-900 dark:text-slate-100 font-sans select-none p-3 justify-between">
      {/* Top Display */}
      <div className="text-right px-2 py-4">
        <div className="text-xs text-slate-400 font-mono h-4">{equation}</div>
        <div className="text-3xl font-bold font-mono tracking-tight truncate">{display}</div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-1.5 flex-1">
        <button onClick={handleClear} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold p-2">
          C
        </button>
        <button onClick={handleBackspace} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold p-2 flex items-center justify-center">
          <Delete className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => handleOperator('%')} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold p-2">
          %
        </button>
        <button onClick={() => handleOperator('÷')} className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg text-xs font-bold p-2 text-blue-600 dark:text-blue-400">
          ÷
        </button>

        {['7', '8', '9'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator('×')} className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg text-xs font-bold p-2 text-blue-600 dark:text-blue-400">
          ×
        </button>

        {['4', '5', '6'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator('-')} className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg text-xs font-bold p-2 text-blue-600 dark:text-blue-400">
          -
        </button>

        {['1', '2', '3'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
            {n}
          </button>
        ))}
        <button onClick={() => handleOperator('+')} className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 rounded-lg text-xs font-bold p-2 text-blue-600 dark:text-blue-400">
          +
        </button>

        <button onClick={() => handleDigit('±')} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
          ±
        </button>
        <button onClick={() => handleDigit('0')} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
          0
        </button>
        <button onClick={() => handleDigit('.')} className="bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold p-2.5 shadow-sm">
          .
        </button>
        <button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold p-2.5 text-white shadow-md">
          =
        </button>
      </div>
    </div>
  );
}
