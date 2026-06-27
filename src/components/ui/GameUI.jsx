import React, { useState } from 'react';
import useACILMStore from '../../store/useACILMStore';
import { Settings, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔄️ Import diganti menggunakan _LIST yang baru kita buat
import { INDOOR_COMPONENTS_LIST, OUTDOOR_COMPONENTS_LIST } from '../../data/washingProcedure';

export default function GameUI() {
  // 🔄️ Mengambil state baru dari Zustand
  const { activeModule, selectedUnit, setSelectedUnit, resetGameState, setComponentProgress } = useACILMStore();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    const compList = unit === 'indoor' ? INDOOR_COMPONENTS_LIST : OUTDOOR_COMPONENTS_LIST;
    
    // ℹ️ Set progress semua komponen menjadi 0 (Kotor) saat mulai
    compList.forEach(compId => setComponentProgress(compId, 0));
  };

  const handleExitGame = () => {
    // 🔄️ Memanggil fungsi sapu jagat untuk mereset seluruh sesi Modul B
    resetGameState();
    setShowExitConfirm(false);
  };

  if (activeModule !== 'B') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {selectedUnit === null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          >
            <div className="bg-surface border border-slate-700 p-8 rounded-2xl shadow-level-2 max-w-2xl w-full text-center">
              <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-50 mb-2 tracking-tight">Simulasi Perawatan AC</h2>
              <p className="text-slate-400 mb-8">Pilih unit yang ingin Anda bersihkan hari ini.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleSelectUnit('indoor')}
                  className="group relative flex flex-col items-center p-6 bg-surface-bright border border-slate-700 rounded-xl hover:border-primary hover:shadow-glow-primary transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-background rounded-full mb-4 flex items-center justify-center border-2 border-slate-700 group-hover:border-primary">
                    <span className="text-4xl font-bold text-slate-400 group-hover:text-primary transition-colors">IN</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-50 mb-1">Indoor Unit</h3>
                  <p className="text-sm text-slate-400">Pembersihan Filter, Evaporator, & Blower</p>
                </button>

                <button 
                  onClick={() => handleSelectUnit('outdoor')}
                  className="group relative flex flex-col items-center p-6 bg-surface-bright border border-slate-700 rounded-xl hover:border-secondary hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-background rounded-full mb-4 flex items-center justify-center border-2 border-slate-700 group-hover:border-secondary">
                    <span className="text-4xl font-bold text-slate-400 group-hover:text-secondary transition-colors">OUT</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-50 mb-1">Outdoor Unit</h3>
                  <p className="text-sm text-slate-400">Pembersihan Kondensor & Fan Blade</p>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODAL KONFIRMASI KELUAR */}
        {showExitConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface border border-slate-700 p-6 rounded-xl shadow-level-2 max-w-sm w-full text-center"
            >
              <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-50 mb-2">Akhiri Perawatan?</h3>
              <p className="text-sm text-slate-400 mb-6">Semua progres pencucian dan pembongkaran unit ini akan di-reset.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2 rounded-lg font-bold text-sm bg-surface-bright border border-slate-700 text-slate-50 hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleExitGame}
                  className="flex-1 py-2 rounded-lg font-bold text-sm bg-error/20 border border-error/50 text-error hover:bg-error/30 transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}