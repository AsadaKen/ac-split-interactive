import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';

export default function InteractionHandler() {
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = new THREE.Vector2();

    // ⚠️ GANTI NAMA INI DENGAN NAMA OBJEK TOMBOL POWER DI BLENDER-MU
    const POWER_BUTTON_NAME = 'Indoor_PowerButton'; 

    // 1. Catat titik koordinat saat mouse pertama kali ditekan
    const onPointerDown = (event) => {
      pointerDownPos.set(event.clientX, event.clientY);
    };

    // 2. Eksekusi fungsi saat mouse dilepas
    const onPointerUp = (event) => {
      const state = useACILMStore.getState();
      
      // ℹ️ IZINKAN KLIK DI MODUL A (Eksplorasi) & MODUL B (Game/Peringatan K3)
      if (state.activeModule !== 'A' && state.activeModule !== 'B') return;

      // Cek jarak: Jika mouse bergeser jauh (lebih dari 5 pixel), berarti pemain sedang
      // menyeret layar (rotasi kamera), BUKAN menekan tombol. Jadi kita batalkan kliknya.
      const distance = pointerDownPos.distanceTo(new THREE.Vector2(event.clientX, event.clientY));
      if (distance > 5) return; 

      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const buttonMesh = scene.getObjectByName(POWER_BUTTON_NAME);
      if (buttonMesh) {
        // Cek apakah klik mengenai tombol power
        const intersects = raycaster.intersectObject(buttonMesh, true);
        if (intersects.length > 0) {
          // ℹ️ Nyalakan atau Matikan Animasi Simulasi!
          useACILMStore.getState().toggleSimulation();
        }
      }
    };

    // 3. Efek Kursor: Ubah kursor menjadi ikon "Tunjuk" saat diarahkan ke tombol
    const onPointerMove = (event) => {
      const state = useACILMStore.getState();
      
      // ℹ️ KURSOR BERUBAH DI KEDUA MODUL
      if (state.activeModule !== 'A' && state.activeModule !== 'B') return;
      
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const buttonMesh = scene.getObjectByName(POWER_BUTTON_NAME);
      
      if (buttonMesh) {
        const intersects = raycaster.intersectObject(buttonMesh, true);
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'auto';
        }
      }
    };

    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointerup', onPointerUp);
    gl.domElement.addEventListener('pointermove', onPointerMove);

    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      document.body.style.cursor = 'auto';
    };
  }, [camera, gl, scene]);

  return null;
}