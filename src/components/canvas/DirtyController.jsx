import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_COMPONENTS_LIST, OUTDOOR_COMPONENTS_LIST } from '../../data/washingProcedure';

// 1. Gabungkan semua komponen yang BOLEH kotor
const ALL_DIRTY_TARGETS = [...INDOOR_COMPONENTS_LIST, ...OUTDOOR_COMPONENTS_LIST];
// 2. Pengecualian: Objek plastik cover tidak boleh ikut menjadi coklat
const EXCLUDED_FROM_DIRT = ['Plastik_Cover_PCB', 'Visual_Plastik_Cover'];

export default function DirtyController() {
  const { scene } = useThree();
  const originalColors = useRef({});
  
  // ℹ️ OPTIMASI: Kita hanya menyimpan komponen AC yang kotor saja di array ini,
  // sehingga sistem tidak perlu memindai dinding/lantai diorama setiap detiknya!
  const targetMeshes = useRef([]); 

  // Simpan warna asli dan kumpulkan mesh target saat model 3D pertama kali dimuat
  useEffect(() => {
    targetMeshes.current = []; // Reset array saat komponen dimuat ulang

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Kloning material agar tidak memengaruhi objek lain yang berbagi material sama
        child.material = child.material.clone(); 
        
        if (!originalColors.current[child.name]) {
          originalColors.current[child.name] = child.material.color.clone();
        }

        // ℹ️ PERBAIKAN BUG 1: Hanya masukkan mesh AC yang terdaftar ke dalam daftar kotor
        if (ALL_DIRTY_TARGETS.includes(child.name) && !EXCLUDED_FROM_DIRT.includes(child.name)) {
          targetMeshes.current.push(child);
        }
      }
    });
  }, [scene]);

  // Loop animasi untuk transisi warna kotor ke bersih secara Real-Time
  useFrame(() => {
    const { activeModule, selectedUnit, componentProgress } = useACILMStore.getState();
    
    // ℹ️ PERBAIKAN BUG 2: Deteksi apakah pemain sedang aktif di Modul B
    const isGameActive = activeModule === 'B' && selectedUnit;

    // Loop HANYA pada komponen AC target (Sangat menghemat kinerja browser!)
    targetMeshes.current.forEach((mesh) => {
      if (originalColors.current[mesh.name]) {
        
        // ℹ️ LOGIKA RESET: Jika Modul B aktif, ambil progress. 
        // Jika pemain kabur ke Modul A, paksa progress menjadi 100% (Bersih Total)
        const progress = isGameActive ? (componentProgress[mesh.name] || 0) : 100;
        
        const dirtyColor = new THREE.Color("#4a3f35"); 
        const cleanColor = originalColors.current[mesh.name];
        
        // Mencampur (Lerp) warna kotor dan bersih berdasarkan persentase
        mesh.material.color.lerpColors(dirtyColor, cleanColor, progress / 100);
      }
    });
  });

  return null;
}