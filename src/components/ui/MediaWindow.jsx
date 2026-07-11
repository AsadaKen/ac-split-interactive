import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Move } from 'lucide-react';
import useACILMStore from '../../store/useACILMStore';

export default function MediaWindow() {
  const { activeMedia, setActiveMedia } = useACILMStore();
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  if (!activeMedia) return null;

  const videoUrl = `/media/videos/${activeMedia}.mp4`;
  const audioUrl = `/media/audios/${activeMedia}.mp3`;

  return (
    <AnimatePresence>
      {activeMedia && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, right: window.innerWidth - 350, top: 0, bottom: window.innerHeight - 250 }}
          initial={{ opacity: 0, scale: 0.8, x: window.innerWidth / 2 - 200, y: 100 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          // Ukuran default jendela
          className="fixed z-[999] flex flex-col bg-surface/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] pointer-events-auto resize overflow-hidden min-w-[300px] min-h-[200px] w-[400px] h-[300px]"
        >
          {/* Header (Gagang Jendela) */}
          <div
            className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700 cursor-move"
            title="Tahan dan geser jendela"
          >
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
            
            {/* ℹ️ PERBAIKAN: object-cover, preload="auto", dan playsInline */}
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              // Padding dihilangkan, object-contain diganti menjadi object-cover
              className="w-full h-full object-cover relative z-10"
              onError={(e) => e.target.style.display = 'none'}
            />
            
            <audio
              ref={audioRef}
              src={audioUrl}
              autoPlay
              loop
              className="hidden"
            />

            {/* Pesan Bantuan jika file media tidak ditemukan */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-slate-600 text-[10px] text-center px-4">
              <PlayCircle className="w-8 h-8 mb-2 opacity-20" />
              Menunggu Media...<br/>
              Simpan video di: <code className="text-slate-500">public/media/videos/{activeMedia}.mp4</code><br/>
              Simpan audio di: <code className="text-slate-500">public/media/audios/{activeMedia}.mp3</code>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}