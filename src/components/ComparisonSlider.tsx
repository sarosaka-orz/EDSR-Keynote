/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeImage?: string;
  afterImage?: string;
}

export function ComparisonSlider({ 
  beforeLabel = "SOURCE", 
  afterLabel = "EDSR (Proposed)",
  beforeImage,
  afterImage 
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPos = ((x - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, newPos)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video md:aspect-[21/9] bg-white border border-slate-200 rounded-lg overflow-hidden cursor-ew-resize select-none shadow-sm"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Target (After) */}
      <div className="absolute inset-0">
        {afterImage ? (
          <img src={afterImage} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
             <span className="text-sm font-bold uppercase tracking-widest mb-2 italic">{"$\\mathcal{I}_{HR}$ (Reconstructed)"}</span>
             <p className="text-[10px] opacity-60 text-center px-12 lowercase font-bold tracking-tight">Optimized Residual Mapping</p>
          </div>
        )}
        <div className="absolute bottom-10 right-10 bg-white border border-slate-200 px-5 py-1.5 shadow-sm text-[9px] font-mono font-bold uppercase tracking-widest text-slate-800">
          {afterLabel}
        </div>
      </div>

      {/* Source (Before) */}
      <div 
        className="absolute inset-0 z-10"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeImage ? (
          <img src={beforeImage} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
             <span className="text-sm font-bold uppercase tracking-widest mb-2 italic">{"$\\mathcal{I}_{LR}$ (Interpolated)"}</span>
             <p className="text-[10px] opacity-60 text-center px-12 lowercase font-bold tracking-tight">Baseline Bicubic Scaling</p>
          </div>
        )}
        <div className="absolute bottom-10 left-10 bg-slate-800 px-5 py-1.5 shadow-sm text-[9px] font-mono font-bold uppercase tracking-widest text-white">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 z-20 group"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 -left-[0.5px] w-px bg-academic/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
          <div className="flex gap-1 opacity-20">
            <div className="w-px h-3 bg-slate-400" />
            <div className="w-px h-3 bg-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
