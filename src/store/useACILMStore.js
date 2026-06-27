import { create } from 'zustand';

// create() akan membuat wadah (store) yang bisa diakses dari file mana saja
const useACILMStore = create((set) => ({
  
  // ==========================================
  // STATE GLOBAL (Navigasi Modul)
  // ==========================================
  activeModule: 'A', // 'A' = Modul Komponen & Simulasi, 'B' = Modul Game
  setActiveModule: (module) => set({ activeModule: module }),

  // ==========================================
  // STATE MODUL A (Eksplorasi & Simulasi)
  // ==========================================
  
  isXRayActive: false, 
  toggleXRay: () => set((state) => ({ isXRayActive: !state.isXRayActive })),

  isSimulationRunning: false, 
  toggleSimulation: () => set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),

  simulationSpeed: 1, 
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  isPaused: false,
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  showLegend: true, 
  toggleLegend: () => set((state) => ({ showLegend: !state.showLegend })),

  selectedComponent: null, 
  setSelectedComponent: (componentName) => set({ selectedComponent: componentName }),
  
  focusedComponent: null, 
  setFocusedComponent: (componentName) => set({ focusedComponent: componentName }),

  // ==========================================
  // STATE MODUL B (Game Perawatan)
  // ==========================================
  selectedUnit: null, 
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),

  selectedTool: 'tool_hand', 
  setSelectedTool: (tool) => set({ selectedTool: tool || 'tool_hand' }),

  currentStepIndex: 0,
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  // ℹ️ STATE PANDUAN (Ini yang sebelumnya tidak sengaja terhapus)
  activeHint: "Pilih alat dan ikuti instruksi perawatan.",
  setActiveHint: (hint) => set({ activeHint: hint }),

  componentProgress: {},
  setComponentProgress: (componentId, value) => set((state) => ({
    componentProgress: {
      ...state.componentProgress,
      [componentId]: Math.min(Math.max(value, 0), 100) 
    }
  })),

  actionProgress: {},
  setActionProgress: (actionId, value) => set((state) => ({
    actionProgress: {
      ...state.actionProgress,
      [actionId]: Math.min(Math.max(value, 0), 100)
    }
  })),

  activeSceneModifiers: [],
  toggleSceneModifier: (modifierId) => set((state) => ({
    activeSceneModifiers: state.activeSceneModifiers.includes(modifierId)
      ? state.activeSceneModifiers.filter(id => id !== modifierId)
      : [...state.activeSceneModifiers, modifierId]
  })),

  // ==========================================
  // STATE PROSES PENCUCIAN (Untuk UI Progress Bar)
  // ==========================================
  isWashing: false,
  setIsWashing: (status) => set({ isWashing: status }),
  
  washingTarget: null,
  setWashingTarget: (target) => set({ washingTarget: target }),

  washContactPoint: null,
  setWashContactPoint: (point) => set({ washContactPoint: point }),

  washingLabel: null,
  washingProgress: 0,
  startWashing: ({ target, label, progress = 0 }) => set({
    isWashing: true,
    washingTarget: target,
    washingLabel: label,
    washingProgress: Math.min(Math.max(progress, 0), 100)
  }),
  setWashingProgress: (progress) => set({
    washingProgress: Math.min(Math.max(progress, 0), 100)
  }),
  stopWashing: () => set({
    isWashing: false,
    washingTarget: null,
    washingLabel: null,
    washingProgress: 0
  }),

  // ==========================================
  // STATE LOKASI & HOTBAR (Drag & Drop Baru)
  // ==========================================
  hotbar: Array(9).fill(null), 
  
  addToHotbar: (componentId, slotIndex) => set((state) => {
    const newHotbar = [...state.hotbar];
    if (!newHotbar[slotIndex]) {
      newHotbar[slotIndex] = componentId;
    }
    return { hotbar: newHotbar };
  }),

  removeFromHotbar: (slotIndex) => set((state) => {
    const newHotbar = [...state.hotbar];
    newHotbar[slotIndex] = null; 
    return { hotbar: newHotbar };
  }),

  resetGameState: () => set({
    washContactPoint: null,
    selectedUnit: null,
    selectedTool: 'tool_hand',
    currentStepIndex: 0,
    componentProgress: {},
    actionProgress: {},
    activeSceneModifiers: [],
    hotbar: Array(9).fill(null),
    isWashing: false,
    washingTarget: null,
    washingLabel: null,
    washingProgress: 0,
    activeHint: "Pilih alat dan ikuti instruksi perawatan."
  })

}));

export default useACILMStore;
