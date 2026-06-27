// 🔄️ Penambahan Import React
import React from 'react';
import useACILMStore from '../../store/useACILMStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CircularProgressHUD() {
  const { activeModule, selectedUnit, isWashing, washingTarget, washingLabel, washingProgress } = useACILMStore();

  if (activeModule !== 'B' || !selectedUnit) return null;

  const progress = washingTarget ? washingProgress : 0;
  
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isWashing && washingTarget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center justify-center"
        >
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" className="drop-shadow-lg transform -rotate-90">
              <circle
                cx="50" cy="50" r={radius}
                stroke="rgba(15, 23, 42, 0.6)" 
                strokeWidth="8" fill="transparent"
              />
              <circle
                cx="50" cy="50" r={radius}
                stroke="#34d399" 
                strokeWidth="8" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear"
              />
            </svg>
            
            <div className="absolute text-white font-mono text-sm font-bold drop-shadow-md">
              {Math.floor(progress)}%
            </div>
          </div>

          <div className="mt-2 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700 shadow-level-2">
            <span className="text-[10px] font-bold text-slate-100 uppercase tracking-widest whitespace-nowrap">
              {/* ℹ️ PERBAIKAN: Menggunakan perlindungan (washingTarget ?) agar tidak crash saat animasi exit */}
              {washingLabel || (washingTarget ? washingTarget.split('_').pop() : '')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}