import React from 'react';
import useACILMStore from '../../store/useACILMStore';
import { Hand, Droplets, Brush, SprayCan, Wind, PackageOpen } from 'lucide-react';

const TOOLS = [
  { id: 'tool_hand', icon: Hand, name: 'Tangan (Bongkar/Pasang)', color: 'text-white' },
  { id: 'tool_water_spray', icon: Droplets, name: 'Mesin Air (Steam)', color: 'text-cyan-400' },
  { id: 'tool_ac_cleaner', icon: SprayCan, name: 'Cairan Pembersih AC', color: 'text-emerald-400' },
  { id: 'tool_cloth_brush', icon: Brush, name: 'Kuas / Kain Lap', color: 'text-yellow-400' },
  { id: 'tool_air_compressor', icon: Wind, name: 'Kompresor Angin', color: 'text-slate-300' },
  { id: 'tool_plastic_cover', icon: PackageOpen, name: 'Plastik Cover PCB', color: 'text-blue-400' },
];

export default function ToolBar() {
  const { activeModule, selectedUnit, selectedTool, setSelectedTool } = useACILMStore();

  if (activeModule !== 'B' || !selectedUnit) return null;

  return (
    // ℹ️ PERBAIKAN: "top-1/2 -translate-y-1/2" akan memposisikannya tepat di tengah (vertikal).
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-surface/90 backdrop-blur-md border border-slate-700 rounded-2xl p-2 flex flex-col gap-1.5 shadow-level-2 pointer-events-auto">
      <div className="text-center mb-1 border-b border-slate-700 pb-1">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tools</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              title={tool.name}
              // ℹ️ PERBAIKAN UKURAN: Lebar & Tinggi diturunkan menjadi w-10 h-10
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary shadow-[0_0_15px_rgba(52,211,153,0.4)]' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-slate-900' : tool.color} ${!isActive && 'group-hover:scale-110'}`} />
              
              {/* Tooltip (Muncul saat diarahkan kursor) */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-slate-200 text-[10px] whitespace-nowrap rounded-md border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {tool.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}