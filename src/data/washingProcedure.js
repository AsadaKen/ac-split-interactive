// 🔄️ Tambahkan ikon Hand
import { Droplets, Brush, SprayCan, PackageOpen, Wind, Hand } from 'lucide-react';

export const TOOLS = [
  { toolId: 'tool_hand',           label: 'Tangan (Bongkar Pasang)', icon: Hand },
  { toolId: 'tool_water_spray',    label: 'Mesin Steam / Jet Pump',  icon: Droplets },
  { toolId: 'tool_cloth_brush',    label: 'Kain Lap & Sikat',        icon: Brush },
  { toolId: 'tool_ac_cleaner',     label: 'Cairan Pembersih AC',     icon: SprayCan },
  { toolId: 'tool_plastic_cover',  label: 'Plastik Penutup',         icon: PackageOpen },
  { toolId: 'tool_air_compressor', label: 'Kompresor Angin',         icon: Wind },
];

export const INDOOR_COMPONENTS_LIST = [
  'Indoor_Casing_Front', 'Indoor_Casing_Filter', 'Indoor_Casing_Body', 
  'Indoor_Evaporator_Fins', 'Saringan_Blower', 
  'Indoor_Filter_L', 'Indoor_Filter_R', 'Indoor_Filter_T',
  'Plastik_Cover_PCB' // ℹ️ Komponen Baru Ditambahkan
];

export const OUTDOOR_COMPONENTS_LIST = [
  'Outdoor_Casing_Top', 'Outdoor_Casing_Left', 'Outdoor_Casing_Front', 
  'Outdoor_Fan_Blade', 'Outdoor_Condenser_Fins', 'Outdoor_Compressor', 'Outdoor_Expansion_Valve'
];

// ==========================================
// ALUR PERAWATAN AC INDOOR
// ==========================================
export const INDOOR_STEPS = [
  {
    stepId: 'in_step_01_cover',
    label: 'Pasang Plastik Penutup',
    description: 'Pasang cover plastik di bagian bawah unit indoor untuk menampung air kotor.',
    requiredTool: 'tool_plastic_cover',
    targetComponents: ['Indoor_Casing_Body'], 
    actionType: 'install',
    completionModifier: 'plastic_cover',
    isMandatory: true,
  },
  {
    stepId: 'in_step_02_clean',
    label: 'Bersihkan Casing Depan',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan casing depan.',
    requiredTool: 'tool_cloth_brush',
    targetComponents: ['Indoor_Casing_Front'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_02_detach',
    label: 'Lepas Casing Depan',
    description: 'Drag dan taruh Casing Depan yang sudah bersih ke Hotbar.',
    requiredTool: 'tool_hand', // ℹ️ Tangan kosong (Klik & Drag)
    targetComponents: ['Indoor_Casing_Front'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_03_clean',
    label: 'Bersihkan Filter Kiri & Kanan',
    description: 'Gunakan Mesin Steam untuk menyemprot debu di kedua filter.',
    requiredTool: 'tool_water_spray',
    targetComponents: ['Indoor_Filter_L', 'Indoor_Filter_R'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_03_detach',
    label: 'Lepas Filter Kiri & Kanan',
    description: 'Drag dan taruh kedua filter ke Hotbar.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Filter_L', 'Indoor_Filter_R'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_04_clean',
    label: 'Bersihkan Penyangga Filter',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan casing penyangga.',
    requiredTool: 'tool_cloth_brush',
    targetComponents: ['Indoor_Casing_Filter'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_04_detach',
    label: 'Lepas Penyangga Filter',
    description: 'Drag dan taruh Casing Penyangga ke Hotbar.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Casing_Filter'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_05_clean',
    label: 'Bersihkan Filter Atas',
    description: 'Gunakan Mesin Steam untuk mencuci filter atas.',
    requiredTool: 'tool_water_spray',
    targetComponents: ['Indoor_Filter_T'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_05_detach',
    label: 'Lepas Filter Atas',
    description: 'Drag dan taruh Filter Atas ke Hotbar.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Filter_T'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_06_clean',
    label: 'Bersihkan Casing Body',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan body utama AC.',
    requiredTool: 'tool_cloth_brush',
    targetComponents: ['Indoor_Casing_Body'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_06_detach',
    label: 'Lepas Casing Body',
    description: 'Drag dan taruh Casing Body ke Hotbar.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Casing_Body'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_07_pcb',
    label: 'Lindungi Modul PCB',
    description: 'Gunakan Plastik Penutup untuk mengamankan komponen kelistrikan PCB dari air.',
    requiredTool: 'tool_plastic_cover',
    targetComponents: ['Indoor_Evaporator_Fins'], // Sebagai target klik
    actionType: 'install',
    completionModifier: 'plastic_cover_pcb', // ℹ️ Modifier baru untuk dummy PCB
    isMandatory: true,
  },
  {
    stepId: 'in_step_08_evap',
    label: 'Bersihkan Evaporator',
    description: 'Gunakan Mesin Steam untuk menyemprot kisi-kisi evaporator hingga bersih.',
    requiredTool: 'tool_water_spray',
    targetComponents: ['Indoor_Evaporator_Fins'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_09_blower',
    label: 'Bersihkan Blower',
    description: 'Gunakan Mesin Steam untuk merontokkan kerak pada kipas blower.',
    requiredTool: 'tool_water_spray',
    targetComponents: ['Saringan_Blower'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'in_step_10_removepcb',
    label: 'Lepas Cover PCB',
    description: 'Klik untuk melepaskan plastik pelindung dari modul PCB.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Evaporator_Fins'],
    actionType: 'remove_modifier',
    completionModifier: 'plastic_cover_pcb',
    isMandatory: true,
  },
  {
    stepId: 'in_step_11_attach',
    label: 'Pasang Casing & Penyangga',
    description: 'Klik komponen Casing Body dan Casing Filter di Hotbar untuk memasangnya kembali.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Casing_Body', 'Indoor_Casing_Filter'],
    actionType: 'attach', // ℹ️ Action baru untuk merakit
    isMandatory: true,
  },
  {
    stepId: 'in_step_12_attach',
    label: 'Pasang Semua Filter',
    description: 'Klik ketiga Filter (Kiri, Kanan, Atas) di Hotbar untuk memasangnya.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Filter_L', 'Indoor_Filter_R', 'Indoor_Filter_T'],
    actionType: 'attach',
    isMandatory: true,
  },
  {
    stepId: 'in_step_13_attach',
    label: 'Pasang Casing Depan',
    description: 'Klik Casing Depan di Hotbar untuk menyelesaikan perakitan.',
    requiredTool: 'tool_hand',
    targetComponents: ['Indoor_Casing_Front'],
    actionType: 'attach',
    isMandatory: true,
  },
];

// ==========================================
// ALUR PERAWATAN AC OUTDOOR
// ==========================================
export const OUTDOOR_STEPS = [
  {
    stepId: 'out_step_01_clean',
    label: 'Bersihkan Casing Depan',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan casing depan outdoor.',
    requiredTool: 'tool_cloth_brush', 
    targetComponents: ['Outdoor_Casing_Front'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'out_step_01_detach',
    label: 'Lepas Casing Depan',
    description: 'Drag dan taruh Casing Depan ke Hotbar.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Casing_Front'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_02_clean',
    label: 'Bersihkan Casing Atas',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan penutup atas.',
    requiredTool: 'tool_cloth_brush', 
    targetComponents: ['Outdoor_Casing_Top'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'out_step_02_detach',
    label: 'Lepas Casing Atas',
    description: 'Drag dan taruh Casing Atas ke Hotbar.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Casing_Top'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_03_clean',
    label: 'Bersihkan Kipas (Fan)',
    description: 'Gunakan Mesin Steam untuk mencuci baling-baling kipas dari debu.',
    requiredTool: 'tool_water_spray', 
    targetComponents: ['Outdoor_Fan_Blade'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'out_step_03_detach',
    label: 'Lepas Kipas (Fan)',
    description: 'Drag dan taruh baling-baling Kipas ke Hotbar.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Fan_Blade'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_04_clean',
    label: 'Bersihkan Casing Samping',
    description: 'Gunakan Lap Kain & Sikat untuk membersihkan casing pelindung samping.',
    requiredTool: 'tool_cloth_brush', 
    targetComponents: ['Outdoor_Casing_Left'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'out_step_04_detach',
    label: 'Lepas Casing Samping',
    description: 'Drag dan taruh Casing Samping ke Hotbar.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Casing_Left'],
    actionType: 'detach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_05_compressor',
    label: 'Bersihkan Kondensor',
    description: 'Gunakan Kompresor Angin untuk meniup kotoran kering dan debu membandel di kondensor.',
    requiredTool: 'tool_air_compressor', // ℹ️ Kompresor Angin akhirnya digunakan!
    targetComponents: ['Outdoor_Condenser_Fins'],
    actionType: 'clean',
    isMandatory: true,
  },
  {
    stepId: 'out_step_06_attach',
    label: 'Pasang Casing Samping & Atas',
    description: 'Klik Casing Samping dan Casing Atas di Hotbar untuk merakitnya kembali.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Casing_Left', 'Outdoor_Casing_Top'],
    actionType: 'attach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_07_attach',
    label: 'Pasang Kipas (Fan)',
    description: 'Klik Baling-baling Kipas di Hotbar untuk memasangnya kembali.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Fan_Blade'],
    actionType: 'attach',
    isMandatory: true,
  },
  {
    stepId: 'out_step_08_attach',
    label: 'Pasang Casing Depan',
    description: 'Klik Casing Depan di Hotbar untuk menutup unit outdoor.',
    requiredTool: 'tool_hand', 
    targetComponents: ['Outdoor_Casing_Front'],
    actionType: 'attach',
    isMandatory: true,
  }
];