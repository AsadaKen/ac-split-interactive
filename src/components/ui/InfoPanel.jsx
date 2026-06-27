import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Activity } from 'lucide-react';
import useACILMStore from '../../store/useACILMStore';
import { COMPONENT_INFO } from '../../data/componentInfo';

export default function InfoPanel() {
  const { selectedComponent, setSelectedComponent, activeModule } = useACILMStore();
  
  // Panel Info ini hanya muncul di Modul A dan jika ada komponen yang dipilih
  const isVisible = activeModule === 'A' && selectedComponent && COMPONENT_INFO[selectedComponent];
  const info = isVisible ? COMPONENT_INFO[selectedComponent] : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-24 right-6 w-80 bg-surface/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-level-2 pointer-events-auto z-40 overflow-hidden"
        >
          {/* Header Panel */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-surface-bright/50">
            <h2 className="font-bold text-lg text-slate-50 uppercase tracking-widest text-sm flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              {info.name}
            </h2>
            <button 
              onClick={() => setSelectedComponent(null)}
              className="text-slate-400 hover:text-error transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Konten Edukasi */}
          <div className="p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Fungsi Utama</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{info.func}</p>
            </div>
            
            <div className="h-px w-full bg-slate-700/50"></div>

            <div>
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-1 flex items-center gap-1">
                <Activity className="w-4 h-4" /> Peran Siklus
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{info.role}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}