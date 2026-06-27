import React from 'react';
import useACILMStore from '../../store/useACILMStore';
import { List, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RefrigerantLegend() {
  const { activeModule, showLegend, toggleLegend } = useACILMStore();

  if (activeModule !== 'A') return null;

  const legendData = [
    { name: 'Tahap 1: Kompresi', color: '#FF3333', desc: 'Gas (Tekanan & Suhu Tinggi)' },
    { name: 'Tahap 2: Kondensasi', color: '#FF8800', desc: 'Gas → Cair (Melepas Panas)' },
    { name: 'Tahap 3: Ekspansi', color: '#003399', desc: 'Cair Tekanan Rendah (Kabut)' },
    { name: 'Tahap 4: Evaporasi', color: '#66AAFF', desc: 'Cair → Gas (Menyerap Panas)' },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-40 pointer-events-auto">
      <AnimatePresence>
        {showLegend && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 bg-surface/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-level-2 w-64 overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b border-slate-700 bg-surface-bright/50">
              <h3 className="text-xs font-bold text-slate-50 uppercase tracking-widest">Siklus Refrigerasi</h3>
              <button onClick={toggleLegend} className="text-slate-400 hover:text-error">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 flex flex-col gap-3">
              {legendData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-glow-primary" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-50">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showLegend && (
        <button 
          onClick={toggleLegend}
          className="flex items-center gap-2 px-3 py-2 bg-surface/80 backdrop-blur-md border border-slate-700 text-slate-400 hover:text-primary rounded-lg text-sm font-bold transition-all shadow-level-2"
        >
          <List className="w-4 h-4" /> Legenda
        </button>
      )}
    </div>
  );
}