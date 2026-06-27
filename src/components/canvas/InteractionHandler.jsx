// ℹ️ InteractionHandler sekarang hanya mengurus hover (opsional) atau dikosongkan 
// karena klik komponen secara langsung telah dinonaktifkan sesuai permintaan.
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import useACILMStore from '../../store/useACILMStore';

export default function InteractionHandler() {
  const { gl } = useThree();
  const { activeModule } = useACILMStore();

  useEffect(() => {
    // Memastikan kursor normal saat berada di Modul A (tidak ada efek hover tangan)
    if (activeModule === 'A') {
      document.body.style.cursor = 'auto';
    }
  }, [activeModule]);

  return null; // Tidak lagi menjalankan Raycaster untuk klik 3D
}