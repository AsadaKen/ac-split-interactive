import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_STEPS, OUTDOOR_STEPS, INDOOR_COMPONENTS_LIST, OUTDOOR_COMPONENTS_LIST } from '../../data/washingProcedure';
import { audioManager } from '../../utils/audioManager';

const ACTION_SPEED = 55;
const CLEANING_SPEED = 35;

const getActiveSteps = (unit) => unit === 'indoor' ? INDOOR_STEPS : OUTDOOR_STEPS;
const getActiveList = (unit) => unit === 'indoor' ? INDOOR_COMPONENTS_LIST : OUTDOOR_COMPONENTS_LIST;
const getActionKey = (step, meshName) => `${step.stepId}:${meshName}`;
const usesCleanlinessProgress = (step) => step.actionType === 'clean';

const getTargetProgress = (state, step, meshName) => {
  if (usesCleanlinessProgress(step)) return state.componentProgress[meshName] || 0;
  return state.actionProgress[getActionKey(step, meshName)] || 0;
};

const setTargetProgress = (state, step, meshName, value) => {
  if (usesCleanlinessProgress(step)) {
    state.setComponentProgress(meshName, value);
    return;
  }
  state.setActionProgress(getActionKey(step, meshName), value);
};

export default function WashingController() {
  const { camera, gl, scene, controls } = useThree(); 
  const isPointerDown = useRef(false);
  const currentAction = useRef(null);

  // ℹ️ MENDENGARKAN PERUBAHAN ZUSTAND SECARA REAL-TIME
  const hotbar = useACILMStore((state) => state.hotbar);
  const activeSceneModifiers = useACILMStore((state) => state.activeSceneModifiers);
  const currentStepIndex = useACILMStore((state) => state.currentStepIndex);
  
  // ℹ️ FUNGSI AUTO-VALIDATOR: Cek apakah step selesai berdasarkan kondisi (Hotbar / Modifier)
  const checkStepCompletion = () => {
     const state = useACILMStore.getState();
     const activeSteps = getActiveSteps(state.selectedUnit);
     if (!activeSteps) return;
     
     const step = activeSteps[state.currentStepIndex];
     if (!step) return;

     let allDone = false;

     // Cek Kelulusan berdasarkan Tipe Aksi
     if (step.actionType === 'clean' || step.actionType === 'apply') {
       allDone = step.targetComponents.every(comp => getTargetProgress(state, step, comp) >= 100);
     } else if (step.actionType === 'detach') {
       // Selesai jika komponen berhasil masuk Hotbar
       allDone = step.targetComponents.every(comp => state.hotbar.includes(comp));
     } else if (step.actionType === 'attach') {
       // Selesai jika komponen dikeluarkan dari Hotbar
       allDone = step.targetComponents.every(comp => !state.hotbar.includes(comp));
     } else if (step.actionType === 'install') {
       // Selesai jika Scene Modifier diaktifkan
       allDone = state.activeSceneModifiers.includes(step.completionModifier);
     } else if (step.actionType === 'remove_modifier') {
       // Selesai jika Scene Modifier dimatikan
       allDone = !state.activeSceneModifiers.includes(step.completionModifier);
     }

     if (allDone) {
      audioManager.play('pop');
        if (state.currentStepIndex + 1 < activeSteps.length) {
           state.setActiveHint(`Langkah "${step.label}" selesai.`);
           state.setCurrentStepIndex(state.currentStepIndex + 1);
        } else {
           state.setActiveHint("Selamat! Semua proses perawatan telah selesai.");
        }
     }
  };

  // ℹ️ Jalankan Auto-Validator setiap kali Hotbar / Modifier / Step berubah
  useEffect(() => {
    checkStepCompletion();
  }, [hotbar, activeSceneModifiers, currentStepIndex]);

  const stopCurrentAction = () => {
    isPointerDown.current = false;
    currentAction.current = null;
    useACILMStore.getState().stopWashing();
    audioManager.stopWashingSounds();
  };

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const updateRaycast = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster;
    };

    const onPointerDown = (event) => {
      const state = useACILMStore.getState();
      
      if (state.activeModule !== 'B' || !state.selectedUnit) return;

      const ray = updateRaycast(event);
      const activeList = getActiveList(state.selectedUnit);
      
      const interactables = [];
      scene.traverse((child) => {
        // ℹ️ PERBAIKAN BUG FILTER: Deteksi hingga ke anak/cucu objek (Nested Mesh)
        if (child.isMesh && child.visible) {
          let current = child;
          let isTarget = false;
          while (current) {
            if (activeList.includes(current.name)) {
              isTarget = true;
              break;
            }
            current = current.parent;
          }
          if (isTarget) interactables.push(child);
        }
      });

      const intersects = ray.intersectObjects(interactables);
      if (intersects.length > 0) {
        let targetObj = intersects[0].object;
        while (targetObj && targetObj.parent && !activeList.includes(targetObj.name)) {
          targetObj = targetObj.parent;
        }

        if (targetObj && activeList.includes(targetObj.name)) {
          
          const meshName = targetObj.name;
          const activeSteps = getActiveSteps(state.selectedUnit);
          const currentStep = activeSteps[state.currentStepIndex];

          if (!currentStep) return;

          // ℹ️ AKSI INSTAN: Jika langkahnya memasang atau melepas plastik (Sekali klik langsung terpasang)
          if (currentStep.actionType === 'install' && state.selectedTool === currentStep.requiredTool) {
            if (currentStep.targetComponents.includes(meshName) && !state.activeSceneModifiers.includes(currentStep.completionModifier)) {
              state.toggleSceneModifier(currentStep.completionModifier);
            }
            return; 
          }
          if (currentStep.actionType === 'remove_modifier' && state.selectedTool === currentStep.requiredTool) {
            if (currentStep.targetComponents.includes(meshName) && state.activeSceneModifiers.includes(currentStep.completionModifier)) {
              state.toggleSceneModifier(currentStep.completionModifier);
            }
            return; 
          }

          // ℹ️ ABAIKAN JIKA BONGKAR PASANG: Biarkan DragController yang bekerja
          if (currentStep.actionType === 'detach' || currentStep.actionType === 'attach') {
            return;
          }

          // ℹ️ LOGIKA PENCUCIAN STANDAR (Tahan Klik)
          if (state.selectedTool === 'tool_hand') return; // Tangan tidak bisa mencuci

          if (controls) controls.enabled = false;
          state.setWashContactPoint(intersects[0].point);

          if (state.selectedTool !== currentStep.requiredTool) {
             state.setActiveHint(`Alat salah! Gunakan tool yang sesuai instruksi.`);
             return;
          }

          if (!currentStep.targetComponents.includes(meshName)) {
             state.setActiveHint(`Target salah! Fokus pada area yang diminta.`);
             return;
          }

          const currentProgress = getTargetProgress(state, currentStep, meshName);
          if (currentProgress >= 100) return;

          isPointerDown.current = true;
          currentAction.current = { meshName, stepId: currentStep.stepId };
          state.startWashing({ target: meshName, label: currentStep.actionLabel || currentStep.label, progress: currentProgress });

          if (state.selectedTool === 'tool_water_spray') audioManager.play('water');
          else if (state.selectedTool === 'tool_ac_cleaner') audioManager.play('foam');
          else if (state.selectedTool === 'tool_air_compressor') audioManager.play('air');
        }
      }
    };

    const onPointerMove = (event) => {
      if (isPointerDown.current) {
        const ray = updateRaycast(event);
        const intersects = ray.intersectObjects(scene.children);
        if (intersects.length > 0) {
          useACILMStore.getState().setWashContactPoint(intersects[0].point);
        }
      }
    };

    const onPointerUp = () => {
      if (controls) controls.enabled = true;
      if (isPointerDown.current) stopCurrentAction();
    };

    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [camera, gl, scene, controls]);

  useFrame((_, delta) => {
     if (isPointerDown.current && currentAction.current) {
        const state = useACILMStore.getState();
        const activeSteps = getActiveSteps(state.selectedUnit);
        const step = activeSteps[state.currentStepIndex];
        const action = currentAction.current;

        if (!step || step.stepId !== action.stepId) {
          stopCurrentAction();
          return;
        }

        const currentProg = getTargetProgress(state, step, action.meshName);
        const speed = usesCleanlinessProgress(step) ? CLEANING_SPEED : ACTION_SPEED;
        
        if (currentProg < 100) {
           const newProg = Math.min(currentProg + (speed * delta), 100);
           setTargetProgress(state, step, action.meshName, newProg);
           state.setWashingProgress(newProg);
           if (newProg >= 100) {
              // ℹ️ SFX: Bunyikan suara DING! yang memuaskan saat komponen bersih 100%
              audioManager.play('ding');
              
              completeTargetSideEffects(useACILMStore.getState(), step, action.meshName);
              stopCurrentAction();
              checkStepCompletion();
           }
        } else {
          stopCurrentAction();
          checkStepCompletion();
        }
     }
  });

  return null;
}