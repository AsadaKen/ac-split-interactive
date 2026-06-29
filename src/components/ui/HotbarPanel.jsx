import React from 'react';
import useACILMStore from '../../store/useACILMStore';

export default function Hotbar() {
  // ℹ️ PERBAIKAN: Panggil removeFromHotbar dan selectedTool dari store
  const { activeModule, selectedUnit, hotbar, removeFromHotbar, selectedTool } = useACILMStore();

  if (activeModule !== 'B' || !selectedUnit) return null;

  const TOTAL_SLOTS = 9;
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => hotbar[i] || null);

  // ℹ️ PERBAIKAN: Fungsi untuk mengembalikan komponen ke AC
  const handleSlotClick = (index, item) => {
    // Pastikan slot tidak kosong dan pemain sedang menggunakan alat Tangan
    if (item && selectedTool === 'tool_hand') {
      removeFromHotbar(index);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="bg-surface/80 backdrop-blur-md border border-slate-700 rounded-2xl p-1.5 flex gap-1.5 shadow-level-2">
        {slots.map((item, index) => (
          <div 
            key={index}
            // ℹ️ PERBAIKAN: Pasang event onClick dan ubah kursor menjadi pointer jika ada item
            onClick={() => handleSlotClick(index, item)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
              item 
                ? 'bg-slate-700 border-primary shadow-[inset_0_0_10px_rgba(52,211,153,0.2)] scale-100 cursor-pointer hover:bg-slate-600' 
                : 'bg-slate-800/50 border-slate-700/50 scale-95'
            }`}
            title={item ? `Pasang kembali: ${item.replace(/_/g, ' ')}` : `Slot Kosong ${index + 1}`}
          >
            <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-slate-500">
              {index + 1}
            </span>
            
            {item && (
              // ℹ️ PERBAIKAN: Tambahkan pointer-events-none agar klik tidak terhalang oleh teks
              <div className="text-[8px] font-bold text-center leading-tight text-primary px-1 break-words w-full pointer-events-none">
                {item.replace(/Indoor_|Outdoor_/g, '').replace(/_/g, ' ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}