/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function LatencyChart() {
  const data = [
    { label: 'Baseline: Cloud Cluster (p3.2xlarge)', value: 92.90, color: 'bg-slate-200' },
    { label: 'Proposed: Edge-Accelerated Inference', value: 28.56, color: 'bg-academic' },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full max-w-4xl mt-6 px-10 py-10 bg-white border border-slate-200 rounded-lg shadow-sm">
      <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] mb-12 text-center underline decoration-slate-100 underline-offset-8">Comparative Performance Analysis (Latency in ms)</h3>
      <div className="space-y-12">
        {data.map((item, i) => (
          <div key={i} className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[11px] text-slate-600 font-bold uppercase tracking-tight">{item.label}</span>
              <span className="text-4xl font-mono font-bold text-slate-900 tracking-tighter">
                 {item.value} <span className="text-[11px] text-slate-300 ml-1 font-normal">ms</span>
              </span>
            </div>
            <div className="h-1.5 bg-slate-50 rounded-none overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={cn("h-full", item.color)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-between items-center text-[9px] font-sans text-slate-400 italic">
        <span>Source: Lab Experiments 2026-Q1</span>
        <span>Table 1. Inference latency metrics across disparate hardware environments. Lower is better.</span>
        <span>DOI: 10.1145/resnet.sr.2026.42</span>
      </div>
    </div>
  );
}

export function HardwareStack() {
    const layers = [
        { name: 'Application', detail: 'Neural Post-Processing', color: 'text-academic' },
        { name: 'Optimization', detail: 'TensorRT Core v8.x', color: 'text-slate-600' },
        { name: 'Runtime', detail: 'CUDA Toolkit 12.x', color: 'text-slate-500' },
        { name: 'OS Layer', detail: 'Linux x86_64 Stable', color: 'text-slate-400' },
        { name: 'Silicon Layer', detail: 'RTX Ampere Platform', color: 'text-slate-300' },
    ];

    return (
        <div className="w-full max-w-4xl space-y-1 mt-8">
            {layers.map((layer, i) => (
                <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="p-5 border border-slate-100 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <div className="flex items-center gap-8">
                        <span className="font-mono text-[10px] text-slate-300 font-bold">L.{String(5-i).padStart(2, '0')}</span>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm uppercase tracking-tight text-slate-800">{layer.name}</span>
                        </div>
                    </div>
                    <div className="text-right">
                       <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            {layer.detail}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export function DataPipeline() {
  const steps = [
    { name: 'Ground Truth', icon: '2K', desc: 'DIV2K dataset source' },
    { name: 'Downscaling', icon: '4x', desc: 'Bicubic subsampling (x4)' },
    { name: 'LR Patches', icon: '96x', desc: 'High-speed data cropping' },
    { name: 'Normalizing', icon: 'μ', desc: 'Zero-mean tensor scaling' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-8 mt-12 max-w-5xl mx-auto">
      {steps.map((step, i) => (
        <React.Fragment key={step.name}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center gap-6 hover:bg-white transition-all shadow-sm group"
          >
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-mono text-xl font-bold italic border border-gray-200 group-hover:text-academic group-hover:border-academic/30 transition-all">
              {step.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold uppercase tracking-tight text-gray-800">{step.name}</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-widest">{step.desc}</p>
            </div>
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex items-center text-gray-200 text-xl font-light italic"
            >
              /
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ThesisFigure({ id, title, children, className }: { id: string; title: string; children?: React.ReactNode, className?: string }) {
  return (
    <div className={cn("group relative bg-white border border-slate-200 rounded-none overflow-hidden p-12 flex flex-col items-center justify-center min-h-[400px] shadow-[0_0_40px_rgba(0,0,0,0.02)]", className)}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-200" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-200" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-200" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-200" />

      {children ? children : (
        <div className="flex flex-col items-center gap-8 opacity-10">
          <div className="w-20 h-20 border border-dashed border-slate-300 rounded-sm flex items-center justify-center">
             <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Reference<br/>Asset</span>
          </div>
        </div>
      )}
      <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center border-t border-slate-100 pt-8">
         <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] leading-tight mb-2">
           {id}: <span className="font-normal italic lowercase">{title}</span>
         </span>
         <div className="flex gap-4 items-center opacity-30">
            <div className="w-12 h-[1px] bg-slate-300" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-slate-400 font-bold">Standard Simulation Output</span>
            <div className="w-12 h-[1px] bg-slate-300" />
         </div>
      </div>
    </div>
  );
}
