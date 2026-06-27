import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';

export default function CameraController() {
  const { camera, scene, controls } = useThree();
  const { selectedComponent, selectedUnit, activeModule } = useACILMStore();

  // ✅ Gunakan useRef agar Vector3 tidak dibuat ulang tiap render
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt   = useRef(new THREE.Vector3());
  const isAnimating    = useRef(false);
  const debugLogged    = useRef(false);

  // ✅ Log semua nama objek di scene — aktifkan saat debugging
  useEffect(() => {
    if (debugLogged.current) return;
    debugLogged.current = true;
    console.group('[CameraController] Scene objects:');
    scene.traverse((obj) => {
      if (obj.name) console.log(`  name="${obj.name}" type="${obj.type}"`);
    });
    console.groupEnd();
  }, [scene]);

  useEffect(() => {
    let posName = null;
    let targetName = null;

    // Logika Modul A: Klik komponen individual dari Dot Anotasi
    if (activeModule === 'A' && selectedComponent) {
      // ℹ️ Tambahkan Saringan_Blower agar dikenali sebagai grup Indoor
      const isIndoor = selectedComponent.includes('Indoor') || selectedComponent === 'Saringan_Blower';
      posName = isIndoor ? 'cam_indoor_pos' : 'cam_outdoor_pos';
      
      // ℹ️ FIX: Di Modul A, kita arahkan pandangan LANGSUNG menatap ke objek yang diklik!
      // (Bukan ke 'cam_indoor_target' agar pandangan tidak terpaku di tengah AC)
      targetName = selectedComponent; 
    } 
    // Logika Modul B: Memilih unit di awal game (Mode Cuci)
    else if (activeModule === 'B' && selectedUnit) {
      posName = selectedUnit === 'indoor' ? 'cam_indoor_pos' : 'cam_outdoor_pos';
      targetName = selectedUnit === 'indoor' ? 'cam_indoor_target' : 'cam_outdoor_target';
    }

    // Jika nama objek / empty ditemukan, jalankan animasi kamera
    if (posName && targetName) {
      const camPosObj = scene.getObjectByName(posName);
      const camTargetObj = scene.getObjectByName(targetName);
      
      if (camPosObj && camTargetObj) {
        // ✅ FIX ERROR 1 & 2: Tambahkan .current untuk useRef Vector3
        camPosObj.getWorldPosition(targetPosition.current);
        camTargetObj.getWorldPosition(targetLookAt.current);
        
        // ✅ FIX ERROR 3: Gunakan .current, bukan setIsAnimating(true)
        isAnimating.current = true; 
      }
    }
  }, [selectedComponent, selectedUnit, activeModule, scene]);

  // ✅ Batalkan animasi jika user drag (memutar kamera secara manual)
  useEffect(() => {
    if (!controls) return;
    const stop = () => { isAnimating.current = false; };
    controls.addEventListener('start', stop);
    return () => controls.removeEventListener('start', stop);
  }, [controls]);

  useFrame((_, delta) => {
    if (!isAnimating.current || !controls) return;

    const speed = 1 - Math.pow(0.001, delta); // ✅ framerate-independent lerp
    camera.position.lerp(targetPosition.current, speed);
    controls.target.lerp(targetLookAt.current, speed);
    controls.update();

    if (
      camera.position.distanceTo(targetPosition.current) < 0.01 &&
      controls.target.distanceTo(targetLookAt.current)   < 0.01
    ) {
      // ✅ Snap ke posisi tepat lalu stop
      camera.position.copy(targetPosition.current);
      controls.target.copy(targetLookAt.current);
      controls.update();
      isAnimating.current = false;
    }
  });

  return null;
}