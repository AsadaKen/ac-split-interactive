import React from 'react';
import useACILMStore from '../../store/useACILMStore';
import { Play, Square, Pause, FastForward } from 'lucide-react';

export default function SimulationControls() {
  const { 
    activeModule, 
    isSimulationRunning, toggleSimulation, 
    isPaused, togglePause, 
    simulationSpeed, setSimulationSpeed 
  } = useACILMStore();

  // Toolbox ini hanya muncul di Modul A
  if (activeModule !== 'A') return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-level-2 p-3 flex items-center gap-4 z-40 pointer-events-auto">
      
      {/* Tombol ON/OFF Mesin */}
      <button 
        onClick={toggleSimulation}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${
          isSimulationRunning 
            ? 'bg-error/20 text-error border border-error/50 hover:bg-error/30' 
            : 'bg-primary text-background hover:bg-primary/90 shadow-glow-primary'
        }`}
      >
        {isSimulationRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        {isSimulationRunning ? 'HENTIKAN SIMULASI' : 'MULAI SIMULASI'}
      </button>

      {/* Tombol Pause & Speed (Hanya muncul jika mesin ON) */}
      {isSimulationRunning && (
        <>
          <div className="w-px h-8 bg-slate-700"></div>
          
          <button 
            onClick={togglePause}
            className={`p-2 rounded-lg transition-all ${
              isPaused ? 'bg-secondary/20 text-secondary border border-secondary/50' : 'text-slate-400 hover:text-slate-50 hover:bg-slate-700'
            }`}
          >
            {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          </button>

          <div className="flex items-center gap-2 text-slate-400 px-2">
            <FastForward className="w-4 h-4" />
            <input 
              type="range" 
              min="0.5" max="3" step="0.5" 
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-24 accent-primary cursor-pointer"
            />
            <span className="text-xs font-mono w-6 text-slate-50">{simulationSpeed}x</span>
          </div>
        </>
      )}
    </div>
  );
}