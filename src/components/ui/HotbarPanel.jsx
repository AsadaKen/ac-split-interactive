import React from 'react';
import useACILMStore from '../../store/useACILMStore';

export default function Hotbar() {
  const { activeModule, selectedUnit, hotbar } = useACILMStore();

  if (activeModule !== 'B' || !selectedUnit) return null;

  // Render tepat 9 slot inventaris
  const TOTAL_SLOTS = 9;
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => hotbar[i] || null);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      {/* ℹ️ PERBAIKAN UKURAN: Padding container dikecilkan menjadi p-1.5 dan gap-1.5 */}
      <div className="bg-surface/80 backdrop-blur-md border border-slate-700 rounded-2xl p-1.5 flex gap-1.5 shadow-level-2">
        {slots.map((item, index) => (
          <div 
            key={index}
            // ℹ️ PERBAIKAN UKURAN: Ukuran slot diturunkan menjadi w-12 h-12
            className={`w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
              item 
                ? 'bg-slate-700 border-primary shadow-[inset_0_0_10px_rgba(52,211,153,0.2)] scale-100' 
                : 'bg-slate-800/50 border-slate-700/50 scale-95'
            }`}
            title={item ? item.replace(/_/g, ' ') : `Slot Kosong ${index + 1}`}
          >
            {/* Nomor Hotbar di pojok kanan bawah */}
            <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-slate-500">
              {index + 1}
            </span>
            
            {/* Teks Nama Objek yang ditampung */}
            {item && (
              <div className="text-[8px] font-bold text-center leading-tight text-primary px-1 break-words w-full">
                {/* Menghapus awalan 'Indoor_' atau 'Outdoor_' agar muat di kotak kecil */}
                {item.replace(/Indoor_|Outdoor_/g, '').replace(/_/g, ' ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}