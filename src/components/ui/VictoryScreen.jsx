import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_STEPS, OUTDOOR_STEPS } from '../../data/washingProcedure';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function VictoryScreen() {
  const { activeModule, selectedUnit, currentStepIndex, resetGameState, setActiveModule } = useACILMStore();

  const activeSteps = selectedUnit === 'indoor' ? INDOOR_STEPS : OUTDOOR_STEPS;
  // Game dianggap tamat jika index langkah saat ini melebihi total langkah
  const isFinished = activeModule === 'B' && selectedUnit && currentStepIndex >= activeSteps.length;

  if (!isFinished) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-surface border-2 border-primary rounded-3xl p-8 flex flex-col items-center max-w-md w-full shadow-[0_0_40px_rgba(52,211,153,0.3)] text-center"
        >
          <motion.div 
            animate={{ rotateY: 360 }} 
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            <Trophy className="w-24 h-24 text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Perawatan Selesai!</h1>
          <p className="text-slate-300 mb-8 text-sm leading-relaxed">
            Unit {selectedUnit === 'indoor' ? 'Indoor' : 'Outdoor'} AC telah dibersihkan dan dirakit kembali dengan sempurna. Mesin kini beroperasi pada performa maksimal!
          </p>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => resetGameState()}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-600"
            >
              <RotateCcw className="w-5 h-5" /> Main Ulang
            </button>
            <button 
              onClick={() => { resetGameState(); setActiveModule('A'); }}
              className="flex-1 py-3 px-4 bg-primary hover:bg-emerald-400 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-primary"
            >
              Menu Utama <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}