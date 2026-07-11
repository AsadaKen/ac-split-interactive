import React, { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';

// ==========================================
// KOMPONEN SUB: Menggerakkan 1 Panah (Cone) 
// ==========================================
const FlowArrow = ({ curve, color, offset }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current || !curve) return;
    
    // Kecepatan gerak panah
    const time = clock.elapsedTime * 0.15; 
    const t = (time + offset) % 1; 

    // Pindahkan posisi panah ke titik pada kurva
    const position = curve.getPointAt(t);
    groupRef.current.position.copy(position);

    // Arahkan moncong panah menghadap ke depan lintasan (Tangent)
    const tangent = curve.getTangentAt(t);
    const lookAtPos = position.clone().add(tangent);
    groupRef.current.lookAt(lookAtPos);
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

// ==========================================
// KOMPONEN UTAMA
// ==========================================
export default function RefrigerantFlow() {
  const { scene } = useThree();
  const { activeModule, isSimulationRunning } = useACILMStore();

  // ℹ️ PERBAIKAN: Menggunakan State alih-alih useMemo
  const [curves, setCurves] = useState({});
  const [tempNodes, setTempNodes] = useState({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timer;

    const buildPaths = () => {
      const paths = { Kompresi: [], Kondensasi: [], Ekspansi: [], Evaporasi: [] };
      const nodes = {};
      const tempNames = ['Suhu_Indoor_In', 'Suhu_Indoor_Out', 'Suhu_Outdoor_In', 'Suhu_Outdoor_Out'];
      let foundPathsCount = 0;

      scene.traverse((child) => {
        // Mengumpulkan titik-titik jalur
        if (child.name.startsWith('Path_')) {
          const parts = child.name.split('_');
          if (parts.length >= 3) {
            const type = parts[1];
            const index = parseInt(parts[2], 10);
            if (paths[type]) {
              const pos = new THREE.Vector3();
              child.getWorldPosition(pos);
              paths[type].push({ index, pos });
              foundPathsCount++;
            }
          }
        }
        
        // Mengumpulkan titik posisi Suhu
        if (tempNames.includes(child.name)) {
          const pos = new THREE.Vector3();
          child.getWorldPosition(pos);
          nodes[child.name] = pos;
        }
      });

      // ℹ️ PERBAIKAN: Jika model 3D belum siap (0 titik ditemukan), ulangi lagi dalam 200ms!
      if (foundPathsCount === 0) {
        timer = setTimeout(buildPaths, 200);
        return;
      }

      // Jika sudah ditemukan, satukan titik-titik menjadi garis kurva
      const builtCurves = {};
      for (const [key, arr] of Object.entries(paths)) {
        if (arr.length > 1) {
          arr.sort((a, b) => a.index - b.index); 
          const points = arr.map(item => item.pos);
          builtCurves[key] = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5); 
        }
      }

      setCurves(builtCurves);
      setTempNodes(nodes);
      setIsReady(true);
    };

    buildPaths();

    // Bersihkan timer saat komponen dihancurkan
    return () => clearTimeout(timer);
  }, [scene]);

  // Hanya memunculkan animasi jika Modul A aktif, AC Menyala, dan Kurva sudah Siap
  if (activeModule !== 'A' || !isSimulationRunning || !isReady) return null;

  const pipeColors = {
    Kompresi: 0xef4444,   
    Kondensasi: 0xf97316, 
    Ekspansi: 0x1d4ed8,   
    Evaporasi: 0x38bdf8   
  };

  const temperatures = {
    'Suhu_Indoor_In': 'Tahap Ekspansi: 12°C',
    'Suhu_Indoor_Out': 'Tahap Kondensasi: 18°C',
    'Suhu_Outdoor_In': 'Tahap Kompresi: 80°C',
    'Suhu_Outdoor_Out': 'Tahap Evaporasi: 40°C',
  };

  const ARROWS_PER_PIPE = 6;

  return (
    <group>
      {Object.entries(curves).map(([pipeName, curve]) => (
        <group key={`flow-${pipeName}`}>
          {Array.from({ length: ARROWS_PER_PIPE }).map((_, i) => (
            <FlowArrow 
              key={`${pipeName}-${i}`} 
              curve={curve} 
              color={pipeColors[pipeName]} 
              offset={i / ARROWS_PER_PIPE} 
            />
          ))}
        </group>
      ))}

      {Object.keys(tempNodes).map((key) => (
        <Html key={key} position={tempNodes[key]} center zIndexRange={[20, 0]}>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/50 text-cyan-300 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            {temperatures[key]}
          </div>
        </Html>
      ))}
    </group>
  );
}