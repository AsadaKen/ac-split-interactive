import React, { useMemo, useRef } from 'react';
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
    
    // Kecepatan gerak panah (Perbesar angka untuk mempercepat jalannya)
    const time = clock.elapsedTime * 0.15; 
    
    // t adalah posisi panah di kurva (0.0 = Awal, 1.0 = Akhir). % 1 membuatnya looping terus menerus.
    const t = (time + offset) % 1; 

    // 1. Pindahkan posisi panah ke titik pada kurva
    const position = curve.getPointAt(t);
    groupRef.current.position.copy(position);

    // 2. Arahkan moncong panah menghadap ke depan lintasan (Tangent)
    const tangent = curve.getTangentAt(t);
    const lookAtPos = position.clone().add(tangent);
    groupRef.current.lookAt(lookAtPos);
  });

  return (
    <group ref={groupRef}>
      {/* Objek Kerucut (Diputar 90 derajat ke sumbu X agar ujungnya menghadap depan/Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* Ukuran Panah: [Radius Bawah, Tinggi, Jumlah Sisi] */}
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

  // 1. Membaca dan Membangun Jalur (CatmullRomCurve3) dari Empty Object
  const { curves, tempNodes } = useMemo(() => {
    const paths = {
      Kompresi: [],
      Kondensasi: [],
      Ekspansi: [],
      Evaporasi: []
    };
    const nodes = {};
    const tempNames = ['Suhu_Indoor_In', 'Suhu_Indoor_Out', 'Suhu_Outdoor_In', 'Suhu_Outdoor_Out'];

    scene.traverse((child) => {
      // Mengumpulkan titik-titik jalur (Empty Object berawalan Path_)
      if (child.name.startsWith('Path_')) {
        const parts = child.name.split('_'); // Contoh: ['Path', 'Kompresi', '01']
        if (parts.length >= 3) {
          const type = parts[1];
          const index = parseInt(parts[2], 10);
          if (paths[type]) {
            const pos = new THREE.Vector3();
            child.getWorldPosition(pos);
            paths[type].push({ index, pos });
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

    // Menyatukan titik-titik menjadi garis kurva yang mulus
    const builtCurves = {};
    for (const [key, arr] of Object.entries(paths)) {
      if (arr.length > 1) {
        arr.sort((a, b) => a.index - b.index); // Urutkan dari 01, 02, 03...
        const points = arr.map(item => item.pos);
        // type 'catmullrom' membuat garis melengkung otomatis mengikuti titik
        builtCurves[key] = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5); 
      }
    }

    return { curves: builtCurves, tempNodes: nodes };
  }, [scene]);

  // Modul ini hanya berjalan saat Simulasi Aktif
  if (activeModule !== 'A' || !isSimulationRunning) return null;

  // 2. Konfigurasi Visual
  const pipeColors = {
    Kompresi: 0xef4444,   // Merah (Gas Panas Tekanan Tinggi)
    Kondensasi: 0xf97316, // Oranye (Cair Panas)
    Ekspansi: 0x1d4ed8,   // Biru Tua (Cair Dingin Tekanan Rendah)
    Evaporasi: 0x38bdf8   // Biru Muda (Gas Dingin)
  };

  const temperatures = {
    'Suhu_Indoor_In': '12°C',
    'Suhu_Indoor_Out': '18°C',
    'Suhu_Outdoor_In': '80°C',
    'Suhu_Outdoor_Out': '40°C',
  };

  // Jumlah panah 3D yang muncul pada setiap jalur (Pipa)
  const ARROWS_PER_PIPE = 6;

  return (
    <group>
      {/* RENDER ANIMASI PANAH 3D */}
      {Object.entries(curves).map(([pipeName, curve]) => (
        <group key={`flow-${pipeName}`}>
          {Array.from({ length: ARROWS_PER_PIPE }).map((_, i) => (
            <FlowArrow 
              key={`${pipeName}-${i}`} 
              curve={curve} 
              color={pipeColors[pipeName]} 
              offset={i / ARROWS_PER_PIPE} // Jarak antar panah (menyebar merata 0.0 hingga 1.0)
            />
          ))}
        </group>
      ))}

      {/* RENDER HOLOGRAM SUHU */}
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