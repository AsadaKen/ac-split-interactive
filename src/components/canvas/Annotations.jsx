import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_COMPONENTS_LIST, OUTDOOR_COMPONENTS_LIST } from '../../data/washingProcedure';

export default function Annotations() {
  const { scene } = useThree();
  const { activeModule, isXRayActive, setFocusedComponent, setSelectedComponent } = useACILMStore();
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (activeModule !== 'A' || !isXRayActive) {
      setDots([]);
      return;
    }

    const timer = setTimeout(() => {
      const allComponents = [...INDOOR_COMPONENTS_LIST, ...OUTDOOR_COMPONENTS_LIST];
      
      // ℹ️ PERBAIKAN 1: Daftar komponen yang TIDAK boleh ada dot anotasinya (Casing dll)
      const EXCLUDED_DOTS = [
        'Indoor_Casing_Front', 
        'Indoor_Casing',
        'Outdoor_Casing',
        'Outdoor_Casing_Body', 
        'Outdoor_Casing_Top', 
        'Outdoor_Casing_Front', 
        'Outdoor_Casing_Side', 
        'Outdoor_Cover_ACC',
        'Visual_Plastik_Cover', 
        'Plastik_Cover_PCB',
        'Indoor_Filter_T'
      ];

      const newDots = [];

      scene.traverse((child) => {
        // ℹ️ PERBAIKAN 2: Hapus syarat "child.isMesh" agar Empty Object buatanmu kembali terbaca!
        if (allComponents.includes(child.name) && !EXCLUDED_DOTS.includes(child.name)) {
          
          // Ambil titik koordinat ASLI dan presisi dari Empty Object Blender-mu
          const targetPos = new THREE.Vector3();
          child.getWorldPosition(targetPos);
          
          newDots.push({ name: child.name, position: targetPos });
        }
      });

      setDots(newDots);
    }, 150); 

    return () => clearTimeout(timer);
  }, [scene, activeModule, isXRayActive]);

  if (activeModule !== 'A' || !isXRayActive) return null;

  return (
    <group>
      {dots.map((dot, idx) => (
        <Html key={idx} position={dot.position} center zIndexRange={[10, 0]}>
          <div 
            className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.8)] cursor-pointer hover:scale-150 transition-transform relative flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setFocusedComponent(dot.name);
              setSelectedComponent(dot.name);
            }}
          >
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
          </div>
        </Html>
      ))}
    </group>
  );
}