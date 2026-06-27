import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useACILMStore from '../../store/useACILMStore';
import { INDOOR_COMPONENTS_LIST, OUTDOOR_COMPONENTS_LIST } from '../../data/washingProcedure';

export default function DragController() {
  const { camera, gl, scene, controls } = useThree();
  const { activeModule, selectedUnit, hotbar, addToHotbar } = useACILMStore();

  const draggedMesh = useRef(null);
  const dragPlane = useRef(new THREE.Plane());
  const returningMeshes = useRef([]); 

  useEffect(() => {
    if (activeModule !== 'B' || !selectedUnit) return;
    const activeList = selectedUnit === 'indoor' ? INDOOR_COMPONENTS_LIST : OUTDOOR_COMPONENTS_LIST;
    
    scene.traverse((child) => {
      if (activeList.includes(child.name)) {
        child.visible = !hotbar.includes(child.name);
      }
    });
  }, [hotbar, activeModule, selectedUnit, scene]);

  useEffect(() => {
    if (activeModule !== 'B' || !selectedUnit) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onPointerDown = (event) => {
      // ℹ️ PERBAIKAN BUG 1: Izinkan drag HANYA jika sedang memakai 'tool_hand'
      if (useACILMStore.getState().selectedTool !== 'tool_hand') return;

      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const activeList = selectedUnit === 'indoor' ? INDOOR_COMPONENTS_LIST : OUTDOOR_COMPONENTS_LIST;
      const interactables = [];
      
      scene.traverse((child) => {
        if (child.isMesh && child.visible) {
          interactables.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(interactables);
      if (intersects.length > 0) {
        let targetObj = intersects[0].object;
        while (targetObj && targetObj.parent && !activeList.includes(targetObj.name)) {
          targetObj = targetObj.parent;
        }

        if (targetObj && activeList.includes(targetObj.name) && !hotbar.includes(targetObj.name)) {
          draggedMesh.current = targetObj;
          if (controls) controls.enabled = false; 
          
          if (!draggedMesh.current.userData.originalPos) {
            draggedMesh.current.userData.originalPos = draggedMesh.current.position.clone();
          }

          dragPlane.current.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(new THREE.Vector3()), 
            intersects[0].point
          );
          document.body.style.cursor = 'grabbing';
          returningMeshes.current = returningMeshes.current.filter(m => m !== targetObj);
        }
      }
    };

    const onPointerMove = (event) => {
      if (!draggedMesh.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane.current, intersectPoint);
      
      if (intersectPoint) {
        draggedMesh.current.parent.worldToLocal(intersectPoint);
        draggedMesh.current.position.copy(intersectPoint);
      }
    };

    const onPointerUp = (event) => {
      if (!draggedMesh.current) return;

      const dropZoneY = window.innerHeight * 0.75; 
      
      if (event.clientY > dropZoneY) {
        const emptySlotIndex = useACILMStore.getState().hotbar.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
          addToHotbar(draggedMesh.current.name, emptySlotIndex);
          draggedMesh.current.position.copy(draggedMesh.current.userData.originalPos);
        } else {
          returningMeshes.current.push(draggedMesh.current);
        }
      } else {
        returningMeshes.current.push(draggedMesh.current);
      }

      draggedMesh.current = null;
      if (controls) controls.enabled = true;
      document.body.style.cursor = 'auto';
    };

    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [activeModule, selectedUnit, hotbar, camera, gl, scene, controls, addToHotbar]);

  useFrame((_, delta) => {
    if (returningMeshes.current.length === 0) return;

    const speed = 15 * delta; 
    returningMeshes.current = returningMeshes.current.filter((mesh) => {
      mesh.position.lerp(mesh.userData.originalPos, speed);
      if (mesh.position.distanceTo(mesh.userData.originalPos) < 0.01) {
        mesh.position.copy(mesh.userData.originalPos);
        return false; 
      }
      return true; 
    });
  });

  return null;
}