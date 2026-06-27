import React, { useEffect, useState } from 'react';
import useACILMStore from '../../store/useACILMStore';
import { Droplets, Brush, SprayCan, PackageOpen, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const { activeModule, selectedUnit, selectedTool } = useACILMStore();
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringUI, setIsHoveringUI] = useState(false);

  const isActive = activeModule === 'B' && selectedUnit && selectedTool && selectedTool !== 'tool_hand';

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // ℹ️ Deteksi Pintar: Jika yang disentuh BUKAN Canvas 3D, berarti itu menu/UI!
      const targetIsCanvas = e.target.tagName === 'CANVAS';
      setIsHoveringUI(!targetIsCanvas);
    };

    if (isActive) window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto'; // Pastikan kembali normal saat komponen hilang
    };
  }, [isActive]);

  // ℹ️ Atur kursor OS Windows
  useEffect(() => {
    if (isActive && !isHoveringUI) {
      document.body.style.cursor = 'none'; // Sembunyikan kursor bawaan saat di atas AC
    } else {
      document.body.style.cursor = 'auto'; // Munculkan kursor panah biasa saat di UI
    }
  }, [isActive, isHoveringUI]);

  // Jangan render kursor SVG jika sedang menyentuh UI
  if (!isActive || isHoveringUI) return null;

  const renderIcon = () => {
    const props = { className: "w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" };
    switch (selectedTool) {
      case 'tool_water_spray': return <Droplets {...props} />;
      case 'tool_cloth_brush': return <Brush {...props} className="w-8 h-8 text-slate-300 drop-shadow-md" />;
      case 'tool_ac_cleaner': return <SprayCan {...props} className="w-8 h-8 text-white drop-shadow-md" />;
      case 'tool_air_compressor': return <Wind {...props} className="w-8 h-8 text-slate-400 drop-shadow-md" />;
      case 'tool_plastic_cover': return <PackageOpen {...props} className="w-8 h-8 text-blue-400 drop-shadow-md" />;
      default: return null;
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[100]"
      style={{ transform: `translate(${mousePos.x + 10}px, ${mousePos.y + 10}px)` }} 
    >
      <AnimatePresence>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
          {renderIcon()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}