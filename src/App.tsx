import dlssNative from './assets/dlss_native.png';
import dlssEnhanced from './assets/dlss_enhanced.png';
import hardwareStack from './assets/hardware_stack.png';
import edsrLogic from './assets/edsr_logic.png';
import psnrCurve from './assets/psnr_curve.png';
import lossCurve from './assets/loss_curve.png';
import sliderBefore from './assets/slider_before.png';
import sliderAfter from './assets/slider_after.png';
import sampleOutput from './assets/sample_output.png';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize, Cpu, Network, Layers, BarChart3, Binary } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CNNVisualization } from './components/CNNVisualization';
import { LatencyChart, HardwareStack, DataPipeline, ThesisFigure } from './components/Visuals';
import { ComparisonSlider } from './components/ComparisonSlider';


// --- Sub-components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="fixed top-0 left-0 w-full h-[2px] bg-slate-100 z-[100]">
    <motion.div
      className="h-full bg-academic"
      initial={false}
      animate={{ width: `${((current + 1) / total) * 100}%` }}
    />
  </div>
);

const Navigation = ({ onPrev, onNext, current, total }: { onPrev: () => void; onNext: () => void; current: number; total: number }) => (
  <div className="fixed bottom-10 right-12 z-50 flex items-center gap-4">
    <div className="flex bg-white border border-slate-200 shadow-sm rounded-lg p-1">
      <button 
        onClick={onPrev}
        className="p-1.5 hover:bg-slate-50 rounded transition-colors disabled:opacity-20"
        disabled={current === 0}
      >
        <ChevronLeft size={16} className="text-slate-600" />
      </button>
      <div className="w-px h-3 bg-slate-200 self-center mx-1" />
      <button 
        onClick={onNext}
        className="p-1.5 hover:bg-slate-50 rounded transition-colors disabled:opacity-20"
        disabled={current === total - 1}
      >
        <ChevronRight size={16} className="text-slate-600" />
      </button>
    </div>
  </div>
);

const MathAnnotation = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("absolute text-sm font-mono text-minxin-dark/60 select-none pointer-events-none italic bg-white/40 backdrop-blur-[2px] px-3 py-1.5 rounded-md border border-minxin-tan/20 shadow-sm transition-all duration-500", className)}>
    {children}
  </div>
);

// --- Data & Types ---

type SlideType = 'title' | 'split' | 'content' | 'visual' | 'comparison';

interface Slide {
  id: number;
  type: SlideType;
  chapter?: string;
  title: string;
  subtitle?: string;
  content?: string[];
  visual?: React.ReactNode;
  technicalNotes?: { label: string; value: string }[];
}

const SLIDES: Slide[] = [
  // --- Chapter 0: Title ---
  {
    id: 0,
    type: 'title',
    title: 'Neural-Scale ISR',
    subtitle: 'Design and Implementation of an Image Super-Resolution System Based on Enhanced Deep Residual Networks',
    visual: (
      <div className="absolute inset-0 pointer-events-none -z-10 bg-white/5 overflow-hidden">
      </div>
    ),
    technicalNotes: [
      { label: "Project_ID", value: "NRU-AIV-2026-X" },
      { label: "Document_Ver", value: "v2.1 Final" }
    ]
  },
  // --- Chapter 1: Introduction ---
  {
    id: 1,
    type: 'content',
    chapter: 'Chapter 1: Introduction',
    title: 'Background',
    subtitle: 'The era of 4K/8K displays and low-resolution legacy media',
    content: [
      'Rapid adoption of 4K/8K hardware standard.',
      'Significant gap between display capability and content resolution.',
      'ISR as a core research direction in modern computer vision.',
    ],
    technicalNotes: [
      { label: "Display_Standard", value: "UHD-2 / 8K" },
      { label: "Input_Res", value: "1080p Target" }
    ]
  },
  {
    id: 2,
    type: 'content',
    chapter: 'Chapter 1: Introduction',
    title: 'Motivation',
    subtitle: 'Local GPU Acceleration vs. Cloud Pipelines',
    content: [
      'Cloud latency: Network RTT adds 20-100ms of unpredictable delay.',
      'Bandwidth: Sending uncompressed HD data over network is infeasible.',
      'Local PCIe Gen 4.0: 32GB/s transfers with near-zero latency.',
      'Privacy: Local processing avoids data leakage to cloud providers.',
    ],
    technicalNotes: [
      { label: "PCIe_Throughput", value: "31.5 GB/s" },
      { label: "RTT_Saving", value: "~45 ms" }
    ]
  },
  {
    id: 3,
    type: 'content',
    chapter: 'Chapter 1: Introduction',
    title: 'Problem Statement',
    subtitle: 'Hadamard\'s Ill-posed Inverse Problem',
    content: [
      'Uniqueness: Multiple HR images can reconstruct to the same LR source.',
      'Information Loss: Downsampling removes high-frequency textures.',
      'Instability: small input changes can cause large output variance.',
    ],
    technicalNotes: [
      { label: "Error_Margin", value: "±0.041" },
      { label: "Complexity", value: "O(N log N)" }
    ]
  },
  {
    id: 4,
    type: 'visual',
    chapter: 'Chapter 1: Introduction',
    title: 'The Latency Wall',
    subtitle: 'Quantitative comparison between Local Edge and Cloud Architectures',
    visual: <LatencyChart />,
    technicalNotes: [
      { label: "Cloud_RTT", value: "92.9 ms" },
      { label: "Local_Proc", value: "28.5 ms" }
    ]
  },
  // --- Chapter 2: Literature Review ---
  {
    id: 5,
    type: 'visual',
    chapter: 'Chapter 2: Literature Review',
    title: 'Modern CV Evolution',
    subtitle: 'Simulating neural upscaling: Input vs. Reconstructed Output',
    visual: (
      <div className="flex flex-col items-center gap-8 w-full py-4">
        <MathAnnotation className="relative top-0 right-0 text-lg font-black text-minxin-dark border-2 border-minxin-tan bg-white/90 px-6 py-2 shadow-sm">
          σ(z) = max(0, z)
        </MathAnnotation>
        <div className="w-full flex justify-center items-center">
          <CNNVisualization />
        </div>
      </div>
    ),
    technicalNotes: [
      { label: "Kernels", value: "3x3 / 5x5 Conv" },
      { label: "Activation", value: "ReLU / LeakyReLU" }
    ]
  },
  {
    id: 6,
    type: 'visual',
    chapter: 'Chapter 2: Literature Review',
    title: 'NVIDIA DLSS Case Study',
    subtitle: 'Leveraging Tensor Cores for AI image reconstruction',
    visual: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/50 p-2 rounded border border-minxin-tan/10 overflow-hidden group">
          <div className="relative aspect-video overflow-hidden rounded">
            <img 
              src={dlssNative} 
              alt="Native Rendering" 
              className="absolute inset-0 w-full h-full object-cover scale-[3] transition-transform duration-700 group-hover:scale-[3.2]" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <p className="text-[10px] italic text-minxin-gray mt-2 text-center">Figure 2.1: Native Low-Resolution Input Reference</p>
        </div>
        <div className="bg-white/50 p-2 rounded border border-minxin-tan/10 overflow-hidden group">
          <div className="relative aspect-video overflow-hidden rounded">
            <img 
              src={dlssEnhanced} 
              alt="DLSS Enhanced" 
              className="absolute inset-0 w-full h-full object-cover scale-[3] transition-transform duration-700 group-hover:scale-[3.2]" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <p className="text-[10px] italic text-minxin-gray mt-2 text-center">Figure 2.2: Neural Super-Sampling Approximation</p>
        </div>
      </div>
    ),
    technicalNotes: [
      { label: "Sampling", value: "Jittered MS" },
      { label: "Feedback", value: "Temporal Buffer" }
    ]
  },
  // --- Chapter 3: System Architecture ---
  {
    id: 7,
    type: 'visual',
    chapter: 'Chapter 3: System Architecture',
    title: 'The Local Stack',
    subtitle: 'Hardware configuration for edge-based ISR inference',
    visual: (
      <div className="flex flex-col md:flex-row gap-12 items-center w-full">
        <div className="flex-1 space-y-6">
          <div className="p-5 bg-white/40 border-l-4 border-minxin-tan shadow-sm">
            <h4 className="text-base font-bold uppercase mb-3 tracking-wide">Host Specifications</h4>
            <ul className="text-sm space-y-2.5 opacity-90">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-minxin-tan rounded-full" /> <b>OS:</b> Arch Linux (Rolling Release)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-minxin-tan rounded-full" /> <b>Kernel:</b> Linux 6.19</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-minxin-tan rounded-full" /> <b>VRAM:</b> 6GB GDDR6 192bits</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-minxin-tan rounded-full" /> <b>Driver:</b> nvidia-dkms</li>
            </ul>
          </div>
          <p className="text-base text-minxin-gray leading-relaxed font-serif italic">
            Utilizing data-center grade hardware with NVIDIA Container Toolkit for containerized GPU passthrough, ensuring stable inference latency below 30ms.
          </p>
        </div>
        <div className="flex-[1.5] bg-white/50 p-6 rounded-xl border border-minxin-tan/20 shadow-xl overflow-hidden flex flex-col items-center">
          <img src={hardwareStack} alt="Hardware Infrastructure" className="w-full h-auto object-contain max-h-[400px] hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          <p className="font-serif italic text-xs text-minxin-gray mt-4">Figure 3.1: Hardware Stack and Edge Inference Configuration</p>
        </div>
      </div>
    ),
    technicalNotes: [
      { label: "Compute_Unit", value: "RTX 3060M" },
      { label: "Driver", value: "nvidia-dkms" }
    ]
  },
  {
    id: 8,
    type: 'content',
    chapter: 'Chapter 3: System Architecture',
    title: 'The Software Ecosystem',
    subtitle: 'Performance advantages of Containerization vs. Virtualization',
    content: [
      'Lightweight execution sharing the host OS kernel.',
      'Isolated ML environments prevent dependency pollution.',
      'Direct GPU passthrough via NVIDIA Container Toolkit.',
      'Ensuring exact reproducibility for experimental deep learning.',
    ],
    technicalNotes: [
      { label: "Overhead", value: "< 0.5% CPU" },
      { label: "Isolation", value: "LXC / Rootless" }
    ]
  },
  {
    id: 9,
    type: 'visual',
    chapter: 'Chapter 3: System Architecture',
    title: 'Data Pipeline',
    subtitle: 'DIV2K dataset processing & memory-safe patch-based strategy',
    visual: <DataPipeline />,
    technicalNotes: [
      { label: "Sample_Size", value: "800 Images" },
      { label: "Augmentation", value: "Rotation / Flip" }
    ]
  },
  // --- Chapter 4: Methodology ---
  {
    id: 10,
    type: 'visual',
    chapter: 'Chapter 4: Methodology',
    title: 'EDSR Backbone',
    subtitle: 'Core modification: Removal of Batch Normalization layers',
    visual: (
      <div className="w-full flex flex-col gap-6 items-center">
        <div className="flex flex-wrap justify-center gap-6">
          <MathAnnotation className="relative top-0 right-0 text-lg font-black text-minxin-dark border-2 border-minxin-tan bg-white/90 px-6 py-3 shadow-md">
            H(x) = F(x) + x
          </MathAnnotation>
          <MathAnnotation className="relative top-0 right-0 text-base font-bold text-academic border-2 border-academic/20 bg-white/90 px-6 py-3 shadow-md">
            W ← W - η · ∇_W L
          </MathAnnotation>
        </div>
        <div className="w-full bg-white/50 p-6 rounded-lg border border-minxin-tan/20 shadow-sm overflow-hidden flex flex-col items-center">
          <img src={edsrLogic} alt="EDSR Model Logic" className="h-auto max-h-[350px] object-contain mb-4" referrerPolicy="no-referrer" />
          <p className="font-serif italic text-xs text-minxin-gray">Figure 4.1: Schematic of the Enhanced Deep Residual Network Architecture</p>
        </div>
      </div>
    ),
    technicalNotes: [
      { label: "Layer_Count", value: "32 ResBlocks" },
      { label: "Channel_Width", value: "256 dim" }
    ]
  },
  {
    id: 11,
    type: 'content',
    chapter: 'Chapter 4: Methodology',
    title: 'Network Optimization',
    subtitle: 'Strategic designs for consumer-grade GPU constraints',
    content: [
      'Sub-Pixel Convolution: mathematically superior late-upsampling.',
      'L1 Loss selection for sharper edge restoration over L2 loss.',
      'Mixed Precision (AMP): Accelerating training on Tensor Cores.',
    ],
    technicalNotes: [
      { label: "Loss_Fn", value: "Charbonnier" },
      { label: "Opt_Algo", value: "Radam_v8" }
    ]
  },
  {
    id: 12,
    type: 'visual',
    chapter: 'Chapter 5: Experiment Results',
    title: 'Performance Analysis',
    subtitle: 'Training loss convergence and validation metrics',
    visual: (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-center">
          <MathAnnotation className="relative top-0 left-0 text-base font-bold text-academic border-2 border-academic/20 bg-white/90 px-6 py-2 shadow-sm">
            PSNR = 20·log₁₀(MAX_I) - 10·log₁₀(MSE)
          </MathAnnotation>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-serif italic text-xs text-minxin-gray text-center">Figure 5.1: Peak Signal-to-Noise Ratio (PSNR) Evolution</p>
            <img src={psnrCurve} alt="PSNR Curve" className="w-full h-auto rounded border border-minxin-tan/10 shadow-sm" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-4">
            <p className="font-serif italic text-xs text-minxin-gray text-center">Figure 5.2: Mean Absolute Error (L1) Loss Convergence</p>
            <img src={lossCurve} alt="Loss Curve" className="w-full h-auto rounded border border-minxin-tan/10 shadow-sm" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    ),
    technicalNotes: [
      { label: "Final_PSNR", value: "32.14 dB" },
      { label: "Convergence", value: "850 Epochs" }
    ]
  },
  // --- Chapter 5: Results ---
  {
    id: 13,
    type: 'visual',
    chapter: 'Chapter 5: Experiment Results',
    title: 'Neural Reconstruction',
    subtitle: 'Qualitative Comparison: SOURCE vs. Proposed Local EDSR',
    visual: (
      <ComparisonSlider 
        beforeImage={sliderBefore} 
        afterImage={sliderAfter} 
      />
    ),
    technicalNotes: [
      { label: "PSNR_Delta", value: "+4.18 dB" },
      { label: "SSIM_Gain", value: "+12.4%" }
    ]
  },
  {
    id: 14,
    type: 'visual',
    chapter: 'Chapter 5: Experiment Results',
    title: 'Final Reconstruction',
    subtitle: 'End-to-end inference output on target device',
    visual: (
      <div className="w-full bg-minxin-dark/5 p-4 rounded-lg border border-minxin-tan/20">
        <img src={sampleOutput} alt="Sample Output Result" className="w-full h-auto max-h-[400px] object-contain rounded shadow-lg" referrerPolicy="no-referrer" />
      </div>
    ),
    technicalNotes: [
      { label: "Epoch_Count", value: "1000 Total" },
      { label: "Learning_Rate", value: "1e-4 Decay" }
    ]
  },
  {
    id: 16,
    type: 'visual',
    chapter: 'References',
    title: 'References',
    subtitle: 'Core academic literature and theoretical foundations',
    visual: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-[9px] md:text-[10px] leading-tight text-minxin-dark font-serif font-medium px-4">
        <p>[1] NVIDIA Corporation. (2024). NVIDIA DLSS Technology Overview. Retrieved from https://developer.nvidia.com/rtx/dlss (Accessed: 04/09/2026).</p>
        <p>[2] Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). Edge computing: Vision and challenges. IEEE internet of things journal, 3(5), 637-646.</p>
        <p>[3] AMD. (2024). AMD FidelityFX Super Resolution (FSR). Retrieved from GPUOpen website.</p>
        <p>[4] Keys, R. (1981). Cubic convolution interpolation for digital image processing. IEEE transactions on acoustics, speech, and signal processing, 29(6), 1153-1160.</p>
        <p>[5] Dong, C., Loy, C. C., He, K., & Tang, X. (2014). Learning a deep convolutional network for image super-resolution. ECCV. (SRCNN)</p>
        <p>[6] Kim, J., Lee, J. K., & Lee, K. M. (2016). Accurate image super-resolution using very deep convolutional networks. CVPR. (VDSR)</p>
        <p>[7] Liang, J., Cao, J., Sun, G., Zhang, K., Van Gool, L., & Timofte, R. (2021). SwinIR: Image restoration using swin transformer. ICCV.</p>
        <p>[8] Lim, B., Son, S., Kim, H., Nah, S., & Mu Lee, K. (2017). Enhanced deep residual networks for single image super-resolution. CVPR.</p>
        <p>[9] Shi, W., Caballero, J., Huszár, F., Totz, J., Aitken, A. P., Bishop, R., ... & Wang, Z. (2016). Real-time single image and video super-resolution using an efficient sub-pixel convolutional neural network. CVPR.</p>
        <p>[10] Zhao, H., Gallo, O., Frojio, I., & Kautz, J. (2016). Loss functions for image restoration with neural networks. IEEE Transactions on computational imaging, 3(1), 47-57.</p>
        <p>[11] ArchWiki Contributors. (2024). NVIDIA - ArchWiki. Retrieved from https://wiki.archlinux.org/title/NVIDIA. (Accessed: 04/09/2026).</p>
        <p>[12] Merkel, D. (2014). Docker: lightweight linux containers for consistent development and deployment. Linux journal.</p>
        <p>[13] NVIDIA. (2024). NVIDIA Container Toolkit Documentation. Retrieved from https://github.com/NVIDIA/nvidia-container-toolkit. (Accessed: 04/06/2026).</p>
        <p>[14] Paszke, A., Gross, S., Massa, F., Lerer, A., Bradbury, J., ... & Chintala, S. (2019). PyTorch: An imperative style, high-performance deep learning library. NeurIPS.</p>
        <p>[15] Micikevicius, P., Narang, S., Alben, J., Diamos, G., Elsen, E., ... & Wu, H. (2017). Mixed precision training. ICLR.</p>
        <p>[16] Agustsson, E., & Timofte, R. (2017). NTIRE 2017 challenge on single image super-resolution: Dataset and study. CVPR Workshops.</p>
        <p>[17] Bevilacqua, M., Roumy, A., Guillemot, C., & Alberi-Morel, M. L. (2012). Low-complexity single-image super-resolution based on nonnegative neighbor embedding. BMVC.</p>
        <p>[18] Zeyde, R., Elad, M., & Protter, M. (2010). On single image scale-up using sparse-representations. International conference on curves and surfaces.</p>
        <p>[19] Martin, D., Fowlkes, C., Tal, D., & Malik, J. (2001). A database of human segmented natural images and its application to evaluating segmentation algorithms and measuring ecological statistics. ICCV.</p>
        <p>[20] Wang, Z., Bovik, A. C., Sheikh, H. R., & Simoncelli, E. P. (2004). Image quality assessment: from error visibility to structural similarity. IEEE transactions on image processing.</p>
      </div>
    ),
    technicalNotes: [
      { label: "Cit_Count", value: "20 Items" },
      { label: "Style", value: "APA / CVPR" }
    ]
  },
  {
    id: 17,
    type: 'title',
    title: 'Acknowledgements',
    subtitle: 'Special thanks to my thesis supervisors and the global computer vision research community for their support.',
    visual: (
      <div className="absolute inset-0 pointer-events-none -z-10 bg-academic/10 border-t border-academic/20 transition-colors" />
    ),
    technicalNotes: [
      { label: "Final_Ver", value: "PRESENTATION-2026-B" },
      { label: "Auth_Ref", value: "JY-KW-MSHK" }
    ]
  }
];

// --- Main Application ---

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide(c => Math.min(c + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(c => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-minxin-bg text-minxin-dark selection:bg-minxin-tan/30 overflow-hidden relative transition-all duration-700">
      <div className="paper-grain" />
      
      <ProgressBar current={currentSlide} total={SLIDES.length} />
      
      {/* Minxin Sidebar */}
      <div className="fixed left-0 top-0 h-full w-12 md:w-20 bg-minxin-sidebar z-30 pointer-events-none" />
      
      {/* Top Header Section */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between px-16 md:px-24 py-8 z-40 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-minxin-dark rounded-md flex items-center justify-center p-1.5 shadow-sm transform -rotate-3 hover:rotate-0 transition-transform">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight border-b-2 border-red-500/20 leading-none pb-0.5">Minxin HK School</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="hidden md:flex gap-2">
            <div className="w-4 h-4 bg-[#2C3E50] rounded-sm" />
            <div className="w-4 h-4 bg-[#BBA58E] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Vertical Date Decoration */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-40 pointer-events-none transform rotate-90 origin-center hidden md:block">
        <span className="font-serif text-sm text-minxin-dark tracking-widest opacity-80">March 2026</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative h-screen w-full flex flex-col justify-center px-24 md:px-64 py-20 z-10"
        >
          {slide.type === 'title' ? (
            <header className="relative z-10 max-w-5xl">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] text-black mb-6"
              >
                {slide.title}
              </motion.h1>

              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-sans text-lg md:text-2xl text-slate-700 max-w-3xl mb-12 italic leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              <div className="flex w-full max-w-xl h-6 mb-16 overflow-hidden rounded-sm minxin-shadow">
                <div className="flex-1 bg-[#2C3E50]" />
                <div className="w-8 bg-[#BBA58E]" />
                <div className="flex-1 bg-[#89989B]" />
              </div>

              <div className="flex flex-col gap-12">
                <div className="flex justify-between items-end max-w-4xl">
                   <div className="flex gap-16">
                    <div className="flex flex-col">
                      <span className="font-serif italic text-xs text-minxin-gray mb-2">Primary Authors</span>
                      <span className="text-sm font-bold text-minxin-dark">Jimmy Yang & Konsun Wang</span>
                    </div>
                  </div>
                </div>
                
                <div className="max-w-md">
                   <p className="text-sm md:text-base text-minxin-gray leading-relaxed italic">
                    Towards a deterministic, low-latency framework for neural-based image super-resolution on edge-accelerated hardware architectures.
                   </p>
                </div>
              </div>
            </header>
          ) : (
            <>
              <header className="relative z-10 max-w-5xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8"
                >
                  <span className="font-serif italic text-minxin-gray border-b border-minxin-tan/30 pb-1">
                    Section {String(currentSlide + 1).padStart(2, '0')} // {slide.chapter || "Research Paper"}
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-3xl md:text-6xl font-bold tracking-tight text-[#1A2B3C] mb-6"
                >
                  {slide.title}
                </motion.h1>

                {slide.subtitle && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-minxin-gray max-w-3xl italic"
                  >
                    {slide.subtitle}
                  </motion.p>
                )}
              </header>

              <div className="mt-12 w-full relative z-10 flex flex-col gap-12">
                <div className="max-w-5xl">
                  {slide.content && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-12">
                      {slide.content.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.05 }}
                          className="flex items-start gap-4 py-3 group"
                        >
                          <div className="mt-2.5 w-1.5 h-1.5 bg-minxin-tan group-hover:scale-125 transition-transform" />
                          <p className="text-base text-minxin-dark leading-relaxed tracking-tight">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {slide.visual && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="w-full mb-12"
                    >
                      {slide.visual}
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="absolute bottom-10 left-0 w-full z-10 flex items-center justify-center">
            <span className="font-serif text-sm font-bold text-[#1A2B3C] tracking-widest">
              {String(currentSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </motion.main>
      </AnimatePresence>

      <Navigation 
        current={currentSlide} 
        total={SLIDES.length} 
        onNext={nextSlide} 
        onPrev={prevSlide} 
      />
    </div>
  );
}
