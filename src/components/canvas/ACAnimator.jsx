import { useFrame, useThree } from '@react-three/fiber';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_STEPS, OUTDOOR_STEPS } from '../../data/washingProcedure';

export default function ACAnimator() {
  const { scene } = useThree();
  // ℹ️ Ambil status isSimulationRunning dari store
  const { activeModule, selectedUnit, currentStepIndex, isSimulationRunning } = useACILMStore();

  const activeSteps = selectedUnit === 'indoor' ? INDOOR_STEPS : OUTDOOR_STEPS;
  const isFinished = activeModule === 'B' && selectedUnit && currentStepIndex >= activeSteps.length;

  useFrame(({ clock }, delta) => {
    
    // ==========================================
    // 1. ANIMASI MODUL B (KEMENANGAN PENCUCIAN)
    // ==========================================
    if (isFinished) {
      const blower = scene.getObjectByName('Saringan_Blower');
      const outdoorFan = scene.getObjectByName('Outdoor_Fan_Blade');
      const speed = 10; 

      if (blower && selectedUnit === 'indoor') blower.rotation.x -= speed * delta; 
      if (outdoorFan && selectedUnit === 'outdoor') outdoorFan.rotation.z -= speed * delta; 
    }

    // ==========================================
    // 2. ANIMASI MODUL A (SIMULASI MENYALA)
    // ==========================================
    if (activeModule === 'A' && isSimulationRunning) {
      
      // A. Putar juga blower dan kipas outdoor agar makin realistis
      const blower = scene.getObjectByName('Saringan_Blower');
      const outdoorFan = scene.getObjectByName('Outdoor_Fan_Blade');
      const fanSpeed = 10;
      if (blower) blower.rotation.x -= fanSpeed * delta;
      if (outdoorFan) outdoorFan.rotation.z -= fanSpeed * delta;

      // B. Animasi Swing (Naik-Turun) pada Sirip Indoor
      // ⚠️ GANTI 'Nama_Objek_Siripmu' DENGAN NAMA ASLI OBJEKNYA DI BLENDER!
      const louver = scene.getObjectByName('Indoor_Casing_Swing'); 
      
      if (louver) {
        const time = clock.elapsedTime;
        
        // PENGATURAN AYUNAN:
        const swingSpeed = 2;   // Kecepatan ayunan (makin besar makin cepat)
        const swingRange = 0.6; // Lebar bukaan ayunan (dalam radian)
        const offset = 0.2;     // Sudut dasar agar tidak tertutup terlalu rapat
        
        // Rumus ayunan bolak-balik menggunakan Math.sin()
        const swingAngle = Math.sin(time * swingSpeed) * swingRange + offset;

        // ⚠️ CATATAN SUMBU: 
        // Jika putarannya salah arah (malah berputar ke samping), 
        // ganti huruf 'x' di bawah ini menjadi 'y' atau 'z' sesuai sumbu Blender-mu.
        louver.rotation.x = swingAngle; 
      }
    }

  });

  return null;
}