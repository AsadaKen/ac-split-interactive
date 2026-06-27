import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useACILMStore from '../../store/useACILMStore';
import { MESH_CASING } from '../../constants/meshNames';

export default function ACModel(props) {
  const { scene } = useGLTF('/models/ac_split.glb');
  
  // Mengambil state dari Zustand
  const { isXRayActive, isSimulationRunning, isPaused, simulationSpeed } = useACILMStore();

  // Menyimpan referensi mesh kipas agar bisa kita putar nanti
  const outdoorFanRef = useRef();
  const indoorBlowerRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      // Logika X-Ray (sama seperti sebelumnya)
      if (child.isMesh && MESH_CASING.includes(child.name)) {
        child.material.transparent = true;
        child.material.opacity = isXRayActive ? 0.2 : 1.0; 
        child.material.depthWrite = !isXRayActive;
        child.material.needsUpdate = true;
      }
      
      // Menangkap referensi kipas berdasarkan namanya
      if (child.name === 'Outdoor_Fan_Blade') outdoorFanRef.current = child;
      if (child.name === 'Saringan_Blower') indoorBlowerRef.current = child;
    });
  }, [scene, isXRayActive]);

  // Hook ini dijalankan berulang-ulang sekitar 60 kali per detik (animation loop)
  useFrame((state, delta) => {
    if (isSimulationRunning && !isPaused) {
      // Kecepatan putaran dikalikan dengan posisi slider speed di UI
      const rotationSpeed = 10 * simulationSpeed * delta;
      
      // Catatan: Jika kipas berputar miring, kita bisa ganti sumbu .x menjadi .y atau .z nanti!
      if (outdoorFanRef.current) outdoorFanRef.current.rotation.x -= rotationSpeed;
      if (indoorBlowerRef.current) indoorBlowerRef.current.rotation.x -= rotationSpeed;
    }
  });

  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/ac_split.glb');