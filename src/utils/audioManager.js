// Mengontrol semua SFX di dalam game
class AudioManager {
  constructor() {
    // Inisialisasi objek Audio bawaan HTML5
    this.sounds = {
      water: new Audio('/sounds/water_spray.mp3'),
      foam: new Audio('/sounds/foam_spray.mp3'),
      air: new Audio('/sounds/air_compressor.mp3'),
      ding: new Audio('/sounds/success_ding.mp3'),
      pop: new Audio('/sounds/pop_click.mp3'),
    };

    // Atur suara alat agar berulang terus (Looping) saat tombol ditahan
    this.sounds.water.loop = true;
    this.sounds.foam.loop = true;
    this.sounds.air.loop = true;

    // Turunkan sedikit volume agar tidak memekakkan telinga
    Object.values(this.sounds).forEach(audio => {
      audio.volume = 0.5;
    });
  }

  // Fungsi untuk memutar suara
  play(name) {
    if (this.sounds[name]) {
      // Reset waktu ke 0 agar suara tidak bertumpuk jika diputar berulang kali
      if (!this.sounds[name].loop) {
        this.sounds[name].currentTime = 0; 
      }
      // Memutar audio (ditangkap catch agar tidak error jika browser memblokir autoplay)
      this.sounds[name].play().catch(e => console.warn(`Audio ${name} belum siap atau diblokir browser.`));
    }
  }

  // Fungsi khusus untuk menghentikan suara alat (saat klik dilepas)
  stopWashingSounds() {
    ['water', 'foam', 'air'].forEach(name => {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
    });
  }
}

// Ekspor sebagai objek tunggal (Singleton)
export const audioManager = new AudioManager();