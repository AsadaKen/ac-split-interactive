import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Move, RotateCcw, AlertCircle } from 'lucide-react';
import useACILMStore from '../../store/useACILMStore';

// =====================================================================
// 📍 PUSAT PENGATURAN MEDIA (MANUAL MAPPING)
// =====================================================================
const MEDIA_MAP = {
  'Saringan_Blower': { video: '/media/videos/Saringan_Blower.mp4', audio: '/media/audios/Saringan_Blower.mp3' },
  'Indoor_Evaporator_Fins': { video: '/media/videos/Indoor_Evaporator_Fins.mp4', audio: '/media/audios/Indoor_Evaporator_Fins.mp3' },
  'Indoor_Filter_L': { video: '/media/videos/Indoor_Filter_L.mp4', audio: '/media/audios/Indoor_Filter_L.mp3' },
  'Indoor_Filter_R': { video: '/media/videos/Indoor_Filter_R.mp4', audio: '/media/audios/Indoor_Filter_R.mp3' },
  'Indoor_PCB': { video: '/media/videos/Indoor_PCB.mp4', audio: '/media/audios/Indoor_PCB.mp3' },
  'Outdoor_Condenser_Fins': { video: '/media/videos/Outdoor_Condenser_Fins.mp4', audio: '/media/audios/Outdoor_Condenser_Fins.mp3' },
  'Outdoor_Fan_Blade': { video: '/media/videos/Outdoor_Fan_Blade.mp4', audio: '/media/audios/Outdoor_Fan_Blade.mp3' },
  'Outdoor_Compressor': { video: '/media/videos/Outdoor_Compressor.mp4', audio: '/media/audios/Outdoor_Compressor.mp3' },
  'Outdoor_Expansion_Valve': { video: '/media/videos/Outdoor_Expansion_Valve.mp4', audio: '/media/audios/Outdoor_Expansion_Valve.mp3' }
};

// =====================================================================
// 🚀 PERBAIKAN ABSOLUT: SINGLETON AUDIO ENGINE
// Dibuat DI LUAR komponen React. Ini memastikan HANYA ADA 1 AUDIO 
// di seluruh aplikasi, mencegah gema 100% secara fisik.
// =====================================================================
const globalAudio = new Audio();

export default function MediaWindow() {
  const { activeMedia, setActiveMedia } = useACILMStore();
  const videoRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (activeMedia && MEDIA_MAP[activeMedia]) {
      setIsFinished(false);

      // 1. Hentikan paksa global audio yang mungkin sedang berjalan
      globalAudio.pause();
      // 2. Timpa dengan jalur audio yang baru
      globalAudio.src = MEDIA_MAP[activeMedia].audio;
      globalAudio.load();

      // Reset video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      // Sensor jika audio selesai
      globalAudio.onended = () => {
        if (videoRef.current) videoRef.current.pause();
        setIsFinished(true);
      };

      // CLEANUP SAAT JENDELA DITUTUP / TRANSISI
      return () => {
        
        // Kosongkan dan matikan Global Audio agar bungkam 100%
        globalAudio.pause();
        globalAudio.removeAttribute('src'); 
        
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        }
      };
    }
  }, [activeMedia]);

  if (!activeMedia) return null;

  const mediaSource = MEDIA_MAP[activeMedia];

  const handleReplay = () => {
    setIsFinished(false);
    
    // Putar ulang Video
    if (videoRef.current) {
      videoRef.current.currentTime = 0; 
      videoRef.current.play();
    }
    
    // Putar ulang Global Audio
    globalAudio.currentTime = 0; 
    globalAudio.play();
  };

  return (
    <AnimatePresence>
      {activeMedia && (
        <motion.div
          key="media-modal-window" 
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, right: window.innerWidth - 350, top: 0, bottom: window.innerHeight - 250 }}
          initial={{ opacity: 0, scale: 0.8, x: window.innerWidth / 2 - 200, y: 100 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed z-[999] flex flex-col bg-surface/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto resize overflow-hidden min-w-[300px] min-h-[200px] w-[400px] h-[300px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700 cursor-move">
            <div className="flex items-center gap-2 text-slate-200">
              <Move className="w-4 h-4 text-slate-400" />
              <PlayCircle className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {activeMedia.replace(/_/g, ' ')}
              </span>
            </div>
            <button
              onClick={() => setActiveMedia(null)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-red-500/20 hover:text-red-400 pointer-events-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Area Konten Media */}
          <div className="relative flex-1 bg-black flex items-center justify-center p-0"> 
            
            {!mediaSource ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-900 w-full h-full">
                <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
                <h3 className="text-amber-500 font-bold text-sm mb-1">Media Belum Didaftarkan</h3>
                <p className="text-slate-400 text-[10px]">
                  Silakan buka <code className="bg-slate-800 px-1 py-0.5 rounded text-primary">MediaWindow.jsx</code><br/> 
                  dan tambahkan komponen ke dalam daftar MEDIA_MAP.
                </p>
              </div>
            ) : (
              <>
                <video
                  key={`video-${activeMedia}`} 
                  ref={videoRef}
                  src={mediaSource.video}
                  loop 
                  muted
                  playsInline
                  onLoadedData={() => {
                    if (videoRef.current) videoRef.current.play().catch(e => console.log("Video Play Error:", e));
                    globalAudio.play().catch(e => console.log("Audio Play Error:", e));
                  }}
                  className={`w-full h-full object-cover relative z-10 transition-opacity duration-300 ${isFinished ? 'opacity-30' : 'opacity-100'}`}
                />

                <AnimatePresence>
                  {isFinished && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleReplay}
                      className="absolute z-20 flex flex-col items-center gap-2 text-white bg-slate-900/80 p-4 rounded-xl backdrop-blur-sm border border-slate-700 hover:bg-slate-700 hover:border-primary transition-all shadow-level-2 pointer-events-auto"
                    >
                      <RotateCcw className="w-8 h-8 text-primary" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">Putar Ulang</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}