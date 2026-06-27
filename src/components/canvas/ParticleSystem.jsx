import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';

// ℹ️ Konfigurasi Fisika & Visual untuk Masing-masing Alat
const PARTICLE_CONFIG = {
  tool_water_spray: {
    color: new THREE.Color("#4facfe"), // Biru Air
    size: 60.0,
    speed: 25,          // Sangat Cepat
    spread: 0.1,        // Agak Menyebar
    lifeTime: 0.4,      // Cepat Hilang (Menguap)
    gravity: 12.0,      // Melengkung jatuh ke bawah
    count: 60           // Jumlah partikel yang keluar per frame
  },
  tool_ac_cleaner: {
    color: new THREE.Color("#f8fafc"), // Putih Busa Sabun
    size: 150.0,        // Bulatan Busa Besar
    speed: 12,          // Lebih Lambat
    spread: 0.35,       // Sangat Menyebar lebar
    lifeTime: 0.7,      // Tahan lama melayang
    gravity: 1.5,       // Melayang ringan
    count: 20
  },
  tool_air_compressor: {
    color: new THREE.Color("#cbd5e1"), // Abu-abu transparan (Debu/Angin)
    size: 30.0,
    speed: 40,          // Kecepatan Kilat
    spread: 0.05,       // Lurus dan Fokus
    lifeTime: 0.15,
    gravity: 0,         // Tidak terpengaruh gravitasi
    count: 80
  }
};

export default function ParticleSystem() {
  const { camera } = useThree();
  // ℹ️ Mengambil washContactPoint dari Zustand untuk target bidikan
  const { activeModule, isWashing, selectedTool, washContactPoint } = useACILMStore();
  
  const pointsRef = useRef();
  const materialRef = useRef();
  
  // Batas maksimal partikel yang ada di layar sekaligus
  const MAX_PARTICLES = 1500;

  // 1. Array Data Fisika (Diolah di CPU)
  const physicsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < MAX_PARTICLES; i++) {
      data.push({ velocity: new THREE.Vector3(), life: 0, maxLife: 1, active: false });
    }
    return data;
  }, []);

  // 2. Array Data Grafis (Akan dikirim ke GPU)
  const [positions, opacities] = useMemo(() => {
    return [
      new Float32Array(MAX_PARTICLES * 3), // [x,y,z, x,y,z, ...]
      new Float32Array(MAX_PARTICLES)      // [opacity, opacity, ...]
    ];
  }, []);

  // 3. Mesin Animasi Berulang per Frame
  useFrame((_, delta) => {
    if (activeModule !== 'B' || !pointsRef.current || !materialRef.current) return;

    const config = PARTICLE_CONFIG[selectedTool];
    
    // Jika alat tidak mengeluarkan partikel (Tangan / Sikat / Plastik), sembunyikan seluruh mesh partikel
    if (!config) {
      pointsRef.current.visible = false;
      return;
    }

    pointsRef.current.visible = true;
    
    // Update warna & ukuran di GPU sesuai alat yang aktif
    materialRef.current.uniforms.uColor.value = config.color;
    materialRef.current.uniforms.uSize.value = config.size;

    const posAttr = pointsRef.current.geometry.attributes.position.array;
    const opAttr = pointsRef.current.geometry.attributes.opacity.array;

    // Posisikan "Mulut Nozzle Senjata" imajiner di sudut kanan bawah layar (relatif terhadap kamera)
    const offset = new THREE.Vector3(0.5, -0.4, -0.5);
    offset.applyQuaternion(camera.quaternion);
    const spawnPos = camera.position.clone().add(offset);

    // ℹ️ Kalkulasi Arah Tembakan (Dari ujung nozzle imajiner MENUJU titik yang sedang diklik di AC)
    const targetDir = new THREE.Vector3();
    if (washContactPoint) {
      targetDir.subVectors(washContactPoint, spawnPos).normalize();
    } else {
      camera.getWorldDirection(targetDir); // Fallback menembak lurus ke depan
    }

    let spawnedThisFrame = 0;
    // Hanya tembakkan partikel baru saat klik ditahan (isWashing) dan kursor mengenai objek AC
    const maxSpawn = (isWashing && washContactPoint) ? Math.floor(config.count * delta * 60) : 0; 

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = physicsData[i];

      // A. SPRAYING: Aktifkan partikel yang sudah mati
      if (!p.active && spawnedThisFrame < maxSpawn) {
        p.active = true;
        p.life = config.lifeTime;
        p.maxLife = config.lifeTime;
        
        // Posisikan partikel baru di mulut nozzle
        posAttr[i * 3] = spawnPos.x;
        posAttr[i * 3 + 1] = spawnPos.y;
        posAttr[i * 3 + 2] = spawnPos.z;

        // ℹ️ Beri tenaga dorongan TEPAT ke arah target klik + sebaran acak (spread)
        p.velocity.copy(targetDir).multiplyScalar(config.speed);
        p.velocity.x += (Math.random() - 0.5) * config.speed * config.spread;
        p.velocity.y += (Math.random() - 0.5) * config.speed * config.spread;
        p.velocity.z += (Math.random() - 0.5) * config.speed * config.spread;
        
        spawnedThisFrame++;
      }

      // B. UPDATING: Gerakkan partikel yang masih hidup
      if (p.active) {
        p.life -= delta;
        
        if (p.life <= 0) {
          // Partikel mati, sembunyikan dengan opacity 0
          p.active = false;
          opAttr[i] = 0; 
        } else {
          // Fisika Gravitasi menjatuhkan partikel ke bawah (Sumbu Y)
          p.velocity.y -= config.gravity * delta;

          // Fisika Kecepatan (Pindah koordinat)
          posAttr[i * 3] += p.velocity.x * delta;
          posAttr[i * 3 + 1] += p.velocity.y * delta;
          posAttr[i * 3 + 2] += p.velocity.z * delta;
          
          // Efek visual memudar perlahan saat umur mau habis
          opAttr[i] = Math.max(0, p.life / p.maxLife);
        }
      }
    }

    // Beritahu Three.js & GPU bahwa ada perubahan koordinat partikel
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.opacity.needsUpdate = true;
  });

  // 4. Custom Shader untuk merender kotak menjadi lingkaran berpendar
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uColor: { value: new THREE.Color("#ffffff") },
      uSize: { value: 50.0 }
    },
    vertexShader: `
      attribute float opacity;
      varying float vOpacity;
      uniform float uSize;
      void main() {
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Semakin jauh partikel dari kamera, ukurannya semakin mengecil (Efek Kedalaman)
        gl_PointSize = uSize * (2.0 / -mvPosition.z); 
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vOpacity;
      void main() {
        // Memangkas bentuk partikel dari Kotak (default) menjadi Lingkaran
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard; 
        gl_FragColor = vec4(uColor, vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    // AdditiveBlending membuat partikel menyala terang (glow) jika saling menumpuk
    blending: THREE.AdditiveBlending 
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={MAX_PARTICLES}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} args={[shaderArgs]} />
    </points>
  );
}