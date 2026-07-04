import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import useACILMStore from '../../store/useACILMStore';

export default function Annotations() {
  const { scene } = useThree();
  const { activeModule, isXRayActive, focusedComponent, setFocusedComponent, setSelectedComponent, setActiveMedia } = useACILMStore();
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (activeModule !== 'A' || !isXRayActive) {
      setDots([]);
      return;
    }

    const timer = setTimeout(() => {
      
      // ==========================================
      // ℹ️ PERBAIKAN: Gunakan Sistem WHITELIST (Daftar Izin)
      // Tulis HANYA nama objek/komponen yang BOLEH memiliki Dot Anotasi.
      // Selain dari daftar ini, dot otomatis tidak akan pernah muncul!
      // ==========================================
      const ALLOWED_DOTS = [
        'Saringan_Blower',
        'Indoor_Evaporator_Fins',
        'Indoor_Filter_L',
        'Indoor_Filter_R',
        'Indoor_PCB',
        'Outdoor_Condenser_Fins',
        'Outdoor_Fan_Blade',
        'Outdoor_Compressor',
        'Outdoor_Expansion_Valve',
        // 👇 TAMBAHKAN NAMA KOMPONEN LAIN YANG KAMU INGINKAN DI SINI:
        
      ];

      const newDots = [];

      scene.traverse((child) => {
        // Hanya memproses objek yang namanya terdaftar di ALLOWED_DOTS
        if (ALLOWED_DOTS.includes(child.name)) {
          
          // Cek Anti-Duplikasi: Mencegah 2 dot muncul untuk 1 nama komponen yang sama
          const isAlreadyAdded = newDots.some(dot => dot.name === child.name);
          
          if (!isAlreadyAdded) {
            const targetPos = new THREE.Vector3();
            child.getWorldPosition(targetPos);
            newDots.push({ name: child.name, position: targetPos });
          }
        }
      });

      setDots(newDots);
    }, 150); 

    return () => clearTimeout(timer);
  }, [scene, activeModule, isXRayActive]);

  if (activeModule !== 'A' || !isXRayActive) return null;

  return (
    <group>
      {dots.map((dot, idx) => {
        const isActive = focusedComponent === dot.name;

        return (
          <Html key={idx} position={dot.position} center zIndexRange={[10, 0]}>
            <div className="relative flex items-center justify-center">
              
              {/* Titik Anotasi Utama */}
              <div 
                className={`w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.8)] cursor-pointer transition-transform ${isActive ? 'scale-150' : 'hover:scale-150'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusedComponent(dot.name);
                  setSelectedComponent(dot.name);
                }}
              >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
              </div>

              {/* Tombol Play yang muncul di samping dot saat ditekan */}
              <AnimatePresence>
                {isActive && (
                  <motion.button
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 20, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMedia(dot.name); 
                    }}
                    className="absolute left-full flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-primary text-primary rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:bg-primary hover:text-slate-900 transition-colors whitespace-nowrap z-50 pointer-events-auto"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold tracking-wide">Putar Animasi</span>
                  </motion.button>
                )}
              </AnimatePresence>

            </div>
          </Html>
        );
      })}
    </group>
  );
}