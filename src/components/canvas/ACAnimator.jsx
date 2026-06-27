import { useFrame, useThree } from '@react-three/fiber';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_STEPS, OUTDOOR_STEPS } from '../../data/washingProcedure';

export default function ACAnimator() {
  const { scene } = useThree();
  const { activeModule, selectedUnit, currentStepIndex } = useACILMStore();

  const activeSteps = selectedUnit === 'indoor' ? INDOOR_STEPS : OUTDOOR_STEPS;
  const isFinished = activeModule === 'B' && selectedUnit && currentStepIndex >= activeSteps.length;

  useFrame((_, delta) => {
    // ℹ️ Jika game sudah tamat, putar komponen mesin!
    if (isFinished) {
      const blower = scene.getObjectByName('Saringan_Blower');
      const outdoorFan = scene.getObjectByName('Outdoor_Fan_Blade');
      
      // Kecepatan putaran (Rotasi per detik)
      const speed = 10; 

      // (Catatan: Sumbu rotasi X, Y, Z mungkin berbeda tergantung dari ekspor Blender-mu,
      // Jika arah putarannya salah, ubah .x menjadi .y atau .z)
      if (blower && selectedUnit === 'indoor') {
        blower.rotation.x -= speed * delta; 
      }
      
      if (outdoorFan && selectedUnit === 'outdoor') {
        outdoorFan.rotation.z -= speed * delta; 
      }
    }
  });

  return null;
}