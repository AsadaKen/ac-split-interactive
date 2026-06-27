import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, useProgress, OrbitControls } from '@react-three/drei';

// Import Komponen UI & Canvas
import ACModel from './components/canvas/ACModel';
import Navbar from './components/ui/Navbar';
import InfoPanel from './components/ui/InfoPanel';
import InteractionHandler from './components/canvas/InteractionHandler';
import CameraController from './components/canvas/CameraController';
import SimulationControls from './components/ui/SimulationControls';
import RefrigerantLegend from './components/ui/RefrigerantLegend';
import Annotations from './components/canvas/Annotations';
import ParticleSystem from './components/canvas/ParticleSystem';
import GameUI from './components/ui/GameUI';
import DirtyController from './components/canvas/DirtyController';
import HotbarPanel from './components/ui/HotbarPanel';
import DragController from './components/canvas/DragController';
import GuideWindow from './components/ui/GuideWindow';
import ToolBar from './components/ui/ToolBar';
import CircularProgressHUD from './components/ui/CircularProgressHUD';
import WashingController from './components/canvas/WashingController';
import PlasticCoverManager from './components/canvas/PlasticCoverManager';
import CustomCursor from './components/ui/CustomCursor'; // ℹ️ Kursor kustom baru kita
import SolidHitboxFix from './components/canvas/SolidHitboxFix';
import VictoryScreen from './components/ui/VictoryScreen';
import ACAnimator from './components/canvas/ACAnimator';

// Komponen untuk menampilkan persentase loading (Memenuhi PRD FR-01.2)
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin mb-4 shadow-glow-primary"></div>
        <p className="text-cyan-400 font-bold text-xl drop-shadow-md">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

export default function App() {
  return (
    <div className="w-full h-full bg-background relative overflow-hidden">
      {/* UI 2D / HUD di luar Canvas */}
      <Navbar />
      <InfoPanel />
      <SimulationControls />
      <RefrigerantLegend />
      <GameUI />
      <HotbarPanel />
      <CircularProgressHUD />
      <CustomCursor /> {/* Menggantikan Crosshair */}
      <GuideWindow />
      <ToolBar />
      <VictoryScreen />
      
      {/* Canvas 3D */}
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Pencahayaan Dasar */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Environment preset "forest" */}
        <Environment preset="forest" />

        <Suspense fallback={<Loader />}>
          {/* Objek 3D */}
          <ACModel scale={1} position={[0, -1, 0]} />
          <PlasticCoverManager />
          <SolidHitboxFix /> {/* Perbaikan bug: Hitbox solid untuk interaksi */}
          
          {/* Sistem Fisika & Kontrol Interaksi */}
          <OrbitControls makeDefault minDistance={2} maxDistance={20} />
          <CameraController /> {/* Kamera Orbit standar yang bebas diputar */}
          <InteractionHandler />
          <DirtyController />
          <DragController />
          <WashingController />
          <Annotations />
          <ParticleSystem />
          <ACAnimator />
        </Suspense>
      </Canvas>
    </div>
  );
}