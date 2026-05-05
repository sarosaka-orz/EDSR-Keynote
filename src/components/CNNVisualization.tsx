/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Square, Search, ArrowRight } from 'lucide-react';

export function CNNVisualization() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-10 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* LR Image Representation */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-none overflow-hidden grid grid-cols-4 grid-rows-4">
             {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-slate-200" />
             ))}
             
             {/* Sliding Kernel */}
             <motion.div 
               animate={{ 
                 x: [0, 60, 60, 0, 0],
                 y: [0, 0, 60, 60, 0]
               }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute w-6 h-6 bg-academic/10 border border-academic/30 z-10"
             />
          </div>
          <p className="font-mono text-[9px] text-slate-400 mt-4 uppercase tracking-widest font-bold">{"Input $\\mathcal{I}_{LR}$"}</p>
        </div>

        {/* Neural Operation */}
        <div className="flex flex-col items-center flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                {step === 0 && <Layers className="text-academic" size={20} />}
                {step === 1 && <Search className="text-academic" size={20} />}
                {step === 2 && <Square className="text-academic" size={20} />}
                {step === 3 && <span className="font-mono text-academic font-bold text-[10px]">RES</span>}
              </div>
              
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                {step === 0 && "Feature Extraction"}
                {step === 1 && "Pattern Discovery"}
                {step === 2 && "Up-sampling"}
                {step === 3 && "Residual Mapping"}
              </span>
            </motion.div>
          </AnimatePresence>
          <div className="h-px w-20 bg-slate-100 my-4" />
        </div>

        {/* HR Output Representation */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white border border-slate-200 rounded-none relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
               {Array.from({ length: 144 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ 
                      backgroundColor: ['rgba(30,58,138,0)', 'rgba(30,58,138,0.1)', 'rgba(30,58,138,0)'] 
                    }}
                    transition={{ delay: (i % 12) * 0.05, duration: 3, repeat: Infinity }}
                    className="border-[0.2px] border-slate-50" 
                  />
                ))}
            </div>
          </div>
          <p className="font-mono text-[9px] text-slate-400 mt-4 uppercase tracking-widest font-bold">{"Output $\\mathcal{I}_{HR}$"}</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
         <p className="text-[10px] font-sans text-slate-400 leading-relaxed italic text-center">
            Figure 1: Schematic of the ResNet-based Super-Resolution (SR) Inference Pipeline.
         </p>
      </div>
    </div>
  );
}
