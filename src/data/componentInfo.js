export const COMPONENT_INFO = {
  Indoor_PowerButton: { 
    name: 'Tombol Power', 
    func: 'Mengaktifkan dan menonaktifkan sistem AC Split secara keseluruhan.', 
    role: 'Memulai atau menghentikan seluruh siklus refrigerasi.' 
  },
  Indoor_Casing_Front: { 
    name: 'Casing Indoor', 
    func: 'Pelindung komponen internal unit indoor dari debu dan benturan fisik.', 
    role: 'Tidak langsung terlibat dalam siklus, namun penting untuk keamanan komponen.' 
  },
  Indoor_Filter_L: { 
    name: 'Filter Udara', 
    func: 'Menyaring debu dan partikel dari udara ruangan sebelum melewati evaporator.', 
    role: 'Menjaga kebersihan aliran udara menuju evaporator untuk efisiensi pertukaran panas.' 
  },
  Indoor_Filter_R: { 
    name: 'Filter Udara', 
    func: 'Menyaring debu dan partikel dari udara ruangan sebelum melewati evaporator.', 
    role: 'Menjaga kebersihan aliran udara menuju evaporator untuk efisiensi pertukaran panas.' 
  },
  Indoor_Evaporator_Fins: { 
    name: 'Evaporator Fins', 
    func: 'Menyerap panas dari udara ruangan melalui proses evaporasi refrigeran di dalamnya.', 
    role: 'Tahap 4 — Evaporasi: refrigeran berubah dari cair menjadi gas dengan menyerap panas ruangan.' 
  },
  Saringan_Blower: { 
    name: 'Blower (Indoor)', 
    func: 'Menghembuskan udara dingin (yang telah melewati evaporator) ke dalam ruangan.', 
    role: 'Mendistribusikan udara yang telah didinginkan oleh evaporator ke seluruh ruangan.' 
  },
  Indoor_PCB: { 
    name: 'PCB (Indoor)', 
    func: 'Komponen penggerak blower dan komponen yang membuat AC split bekerja.', 
    role: 'Mendistribusikan aliran listrik ke semua komponen AC indoor.' 
  },
  Outdoor_Casing_Front: { 
    name: 'Casing Outdoor', 
    func: 'Melindungi komponen outdoor dari cuaca dan benturan eksternal.', 
    role: 'Tidak langsung terlibat dalam siklus, namun melindungi komponen vital sistem.' 
  },
  Outdoor_Condenser_Fins: { 
    name: 'Condenser Fins', 
    func: 'Melepaskan panas dari refrigeran ke udara luar melalui proses kondensasi.', 
    role: 'Tahap 2 — Kondensasi: refrigeran berubah dari gas menjadi cair dengan melepas panas ke udara luar.' 
  },
  Outdoor_Fan_Blade: { 
    name: 'Fan Blade (Outdoor)', 
    func: 'Mengalirkan udara luar melewati kondensor untuk mempercepat proses pelepasan panas.', 
    role: 'Mendukung tahap kondensasi dengan meningkatkan laju perpindahan panas ke lingkungan.' 
  },
  Outdoor_Compressor: { 
    name: 'Kompresor', 
    func: 'Memompa dan memampatkan refrigeran dari tekanan rendah menjadi tekanan tinggi.', 
    role: 'Tahap 1 — Kompresi: jantung siklus refrigerasi yang menggerakkan seluruh aliran refrigeran.' 
  },
  Outdoor_Expansion_Valve: { 
    name: 'Expansion Valve', 
    func: 'Menurunkan tekanan refrigeran cair secara tiba-tiba sehingga berubah menjadi kabut bertekanan rendah.', 
    role: 'Tahap 3 — Ekspansi: mengontrol laju aliran refrigeran dan menurunkan tekanan sebelum evaporasi.' 
  }
};