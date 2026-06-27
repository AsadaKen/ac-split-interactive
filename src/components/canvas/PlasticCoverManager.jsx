import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import useACILMStore from '../../store/useACILMStore';

export default function PlasticCoverManager() {
  const { scene } = useThree();
  const { activeModule, selectedUnit, activeSceneModifiers } = useACILMStore();

  useEffect(() => {
    // ℹ️ Cari kedua objek plastik aslimu
    const mainCover = scene.getObjectByName('Visual_Plastik_Cover');
    const pcbCover = scene.getObjectByName('Plastik_Cover_PCD');
    
    // Tampilkan jika modul B, Indoor, dan statusnya sudah diaktifkan di Store
    if (mainCover) {
      mainCover.visible = activeModule === 'B' && selectedUnit === 'indoor' && activeSceneModifiers.includes('plastic_cover');
    }
    
    // ℹ️ Aturan untuk plastik PCB yang baru kamu buat
    if (pcbCover) {
      pcbCover.visible = activeModule === 'B' && selectedUnit === 'indoor' && activeSceneModifiers.includes('plastic_cover_pcb');
    }
  }, [activeModule, selectedUnit, activeSceneModifiers, scene]);

  return null;
}