import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function SolidHitboxFix() {
  const { scene } = useThree();

  useEffect(() => {
    // Daftar komponen yang akan dibungkus Hitbox padat
    const targetNames = ['Indoor_Filter_L', 'Indoor_Filter_R', 'Indoor_Saringan_Blower'];

    scene.traverse((child) => {
      if (child.isMesh) {
        let current = child;
        let isTarget = false;
        while (current) {
          if (targetNames.includes(current.name)) {
            isTarget = true;
            break;
          }
          current = current.parent;
        }

        if (isTarget) {
          child.geometry.computeBoundingBox();

          child.raycast = function (raycaster, intersects) {
            if (!this.geometry.boundingBox) return;
            
            const box = this.geometry.boundingBox.clone();
            
            // ==========================================
            // ℹ️ PENGATURAN UKURAN HITBOX 
            // ==========================================
            const center = new THREE.Vector3();
            box.getCenter(center);
            
            const size = new THREE.Vector3();
            box.getSize(size);
            
            // Atur skala pengali (1.0 = 100% ukuran asli)
            // Kamu bisa mengubah angka-angka di bawah ini jika masih kurang pas
            size.x *= 0.30; // Lebar (X) dikecilkan jadi 85%
            size.y *= 0.30; // Tinggi (Y) dikecilkan jadi 85%
            
            // ℹ️ Ketebalan (Z) sangat dikecilkan jadi 10% agar tidak menabrak Casing Depan
            size.z *= 0.10; 
            
            box.setFromCenterAndSize(center, size);
            // ==========================================

            box.applyMatrix4(this.matrixWorld);

            const targetPoint = new THREE.Vector3();
            if (raycaster.ray.intersectBox(box, targetPoint)) {
              const distance = raycaster.ray.origin.distanceTo(targetPoint);
              
              if (distance < raycaster.near || distance > raycaster.far) return;

              intersects.push({
                distance: distance,
                point: targetPoint,
                object: this,
                uv: new THREE.Vector2(0.5, 0.5) 
              });
            }
          };
        }
      }
    });
  }, [scene]);

  return null;
}