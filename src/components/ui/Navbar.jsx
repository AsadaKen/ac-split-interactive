import React from 'react';
import useACILMStore from '../../store/useACILMStore';
import { Eye, EyeOff, LogOut } from 'lucide-react'; // ℹ️ Tambahkan ikon LogOut
import DeveloperProfile from './DeveloperProfile';

export default function Navbar() {
  const { activeModule, setActiveModule, isXRayActive, toggleXRay, selectedUnit, resetGameState } = useACILMStore();

  // Variabel penanda apakah game sedang berlangsung
  const isGameRunning = activeModule === 'B' && selectedUnit !== null;

  return (
    <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[60] pointer-events-none">
      
      {/* Tab Modul (Area Kiri) */}
      <div className="flex gap-2 pointer-events-auto bg-surface/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-700 shadow-level-2">
        <DeveloperProfile />
        <button
          onClick={() => !isGameRunning && setActiveModule('A')}
          disabled={isGameRunning}
          title={isGameRunning ? "Selesaikan atau keluar dari game terlebih dahulu" : ""}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
            activeModule === 'A' 
              ? 'bg-primary text-background shadow-glow-primary' 
              : isGameRunning 
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-50 hover:bg-slate-700/50'
          }`}
        >
          Modul A: Eksplorasi
        </button>
        <button
          onClick={() => setActiveModule('B')}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
            activeModule === 'B' 
              ? 'bg-primary text-background shadow-glow-primary' 
              : 'text-slate-400 hover:text-slate-50 hover:bg-slate-700/50'
          }`}
        >
          Modul B: Perawatan
        </button>
      </div>

      {/* Area Aksi Utama (Area Kanan) */}
      <div className="pointer-events-auto flex items-center gap-2">
        
        {/* Tombol X-Ray HANYA di Modul A */}
        {activeModule === 'A' && (
          <button
            onClick={() => toggleXRay()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border ${
              isXRayActive
                ? 'bg-primary/10 border-primary text-primary shadow-glow-primary'
                : 'bg-surface/80 backdrop-blur-md border-slate-700 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50'
            }`}
          >
            {isXRayActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            X-Ray Mode
          </button>
        )}

        {/* ℹ️ Tombol Keluar Game HANYA di Modul B saat Unit sudah dipilih */}
        {isGameRunning && (
          <button
            onClick={() => resetGameState()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          >
            <LogOut className="w-4 h-4" />
            Keluar dari Game
          </button>
        )}

      </div>
    </nav>
  );
}