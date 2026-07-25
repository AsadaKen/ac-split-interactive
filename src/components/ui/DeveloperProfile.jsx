import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, GraduationCap, Building, Users } from 'lucide-react';
import useACILMStore from '../../store/useACILMStore';

export default function DeveloperProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeModule } = useACILMStore();

  return (
    <>
      {/* Tombol Pemicu di Navbar */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-surface/80 backdrop-blur-md border border-slate-700 text-cyan-400 rounded-xl hover:bg-slate-700 hover:text-primary transition-all duration-300 shadow-level-2 flex items-center justify-center mr-2"
        title="Informasi Proposal"
      >
        <User className="w-5 h-5" />
      </button>

      {/* Menggunakan createPortal agar Pop-up selalu ke tengah layar */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-surface border-2 border-slate-700 rounded-3xl p-6 flex flex-col max-w-md w-full shadow-[0_0_40px_rgba(0,0,0,0.8)] relative"
              >
                {/* Tombol Tutup */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  
                  {/* ℹ️ BAGIAN FOTO PROFIL */}
                  <div className="relative w-24 h-24 mb-4">
                    {/* Efek Glow di belakang foto */}
                    <div className="absolute inset-0 bg-primary rounded-2xl animate-pulse opacity-20"></div>
                    
                    {/* Gambar Profil Utama */}
                    <img 
                      src="/media/profile.jpg" 
                      alt="Foto Profil" 
                      className="w-full h-full object-cover rounded-2xl border-2 border-primary shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10"
                      onError={(e) => {
                        // Sistem Fallback: Jika gambar profile.jpg tidak ditemukan, sembunyikan img dan munculkan ikon User
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    
                    {/* Ikon Cadangan (Hanya terlihat jika gambar gagal dimuat) */}
                    <div className="hidden absolute inset-0 bg-slate-800 border-2 border-primary rounded-2xl items-center justify-center shadow-glow-primary z-0">
                       <User className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  
                  {/* Judul & Penulis */}
                  <h2 className="text-base font-bold text-slate-50 mb-2 leading-snug uppercase px-4">
                    DESAIN SIMULASI AIR CONDITIONING SYSTEM DI POLITEKNIK PENERBANGAN MAKASSAR
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary mb-6 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    <User className="w-4 h-4" />
                    <span>Rania Wira Inshirah (NIT. C1022312493)</span>
                  </div>

                  {/* Detail Informasi */}
                  <div className="w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 text-left space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3"/> Pembimbing I
                        </p>
                        <p className="text-xs font-semibold text-slate-200">Dr. Ir. Fatmawati Sabur, S.Si.T., M.T.</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3"/> Pembimbing II
                        </p>
                        <p className="text-xs font-semibold text-slate-200">Andi Fadilah Nugrah S.T., M.M</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-slate-700/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3"/> Program Studi
                      </p>
                      <p className="text-sm text-slate-200">D-III Teknologi Bandar Udara</p>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3"/> Institusi
                      </p>
                      <p className="text-sm text-slate-200">Politeknik Penerbangan Makassar</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}