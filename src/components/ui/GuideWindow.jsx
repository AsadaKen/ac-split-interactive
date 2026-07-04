import React, { useState, useEffect } from 'react';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_STEPS, OUTDOOR_STEPS } from '../../data/washingProcedure';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Info, BookOpen, X, Power, AlertTriangle } from 'lucide-react';

export default function GuideWindow() {
  // ℹ️ PERBAIKAN: Ambil status isSimulationRunning dari store
  const { activeModule, selectedUnit, currentStepIndex, setCurrentStepIndex, activeHint, isSimulationRunning } = useACILMStore();
  
  const [isOpen, setIsOpen] = useState(true);

  const activeSteps = selectedUnit === 'indoor' ? INDOOR_STEPS : OUTDOOR_STEPS;
  const currentStep = activeSteps?.[currentStepIndex];
  const isFinished = currentStepIndex >= activeSteps?.length;

  useEffect(() => { setIsOpen(true); }, [currentStepIndex]);

  useEffect(() => {
    let timer;
    if (isOpen && !isFinished && !isSimulationRunning) {
      timer = setTimeout(() => { setIsOpen(false); }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, isFinished, isSimulationRunning]);

  if (activeModule !== 'B' || !selectedUnit) return null;

  // ==========================================
  // ℹ️ LOGIKA K3: Jika AC Menyala, Tampilkan Peringatan & Sembunyikan Panduan!
  // ==========================================
  if (isSimulationRunning) {
    return (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 24, opacity: 1 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600/90 backdrop-blur-md border-2 border-red-400 rounded-2xl p-4 flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.8)] z-[100] pointer-events-auto"
      >
        <div className="bg-white/20 p-2 rounded-full animate-pulse">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm uppercase tracking-wider">Peringatan Keselamatan!</span>
          <span className="text-red-100 text-xs mt-0.5">AC masih menyala. Matikan AC melalui tombol Power sebelum memulai perawatan.</span>
        </div>
      </motion.div>
    );
  }

  const handleSkip = () => {
    if (!isFinished) setCurrentStepIndex(currentStepIndex + 1);
  };

  return (
    <div className="absolute top-24 right-6 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div 
            key="guide-window"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-72 bg-surface/95 backdrop-blur-md border border-slate-700 rounded-2xl p-3 flex flex-col gap-2 shadow-level-2 pointer-events-auto relative overflow-hidden"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 pr-6">
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" /> Panduan
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                Step {isFinished ? activeSteps.length : currentStepIndex + 1}/{activeSteps.length}
              </span>
            </div>

            {!isFinished ? (
              <div className="flex flex-col gap-1.5">
                <h3 className="text-primary font-bold text-sm leading-tight">{currentStep?.label}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">{currentStep?.description}</p>
                
                <div className="mt-1 bg-slate-800/50 rounded-md p-1.5 border border-slate-700 relative overflow-hidden">
                  <p className="text-[9px] text-slate-400 font-mono flex items-start gap-1.5 relative z-10">
                    <ChevronRight className="w-2.5 h-2.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{activeHint}</span>
                  </p>
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-400/40"
                  />
                </div>

                <button 
                  onClick={handleSkip}
                  className="mt-1.5 w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold rounded-lg transition-colors border border-slate-600"
                >
                  Lewati Langkah Ini (Skip)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-3 gap-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <h3 className="text-primary font-bold text-sm">Perawatan Selesai!</h3>
                <p className="text-[10px] text-slate-300">Semua komponen telah dirakit dan dibersihkan.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="guide-icon"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 p-2.5 pr-4 bg-surface/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-level-2 pointer-events-auto text-cyan-400 hover:text-primary hover:border-primary transition-colors group"
          >
            <div className="bg-slate-800 p-1.5 rounded-xl group-hover:bg-primary/10 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-mono text-slate-400 leading-tight">Step Saat Ini</span>
              <span className="text-xs font-bold uppercase tracking-wider leading-tight">Langkah {currentStepIndex + 1}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}