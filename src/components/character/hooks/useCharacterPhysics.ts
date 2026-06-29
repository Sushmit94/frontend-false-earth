import { useEffect, useRef, MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three/webgpu';
import { Group, Object3D, AnimationClip } from 'three';

import { calculateBlendWeights } from '../utils/calculateBlendWeights';
import { CameraMode, useGameStore } from '../../../core/store/gameStore';
import { INITIAL_PHYSICS_STATE, PhysicsState } from '../config';
import { solveTank } from '../utils/solveTank';
import { solveCam } from '../utils/solveCam';
import { input } from '../../../core/input/controls';

export function useCharacterPhysics(
  groupRef: MutableRefObject<Group | null>,
  scene: Object3D | null,
  animations: AnimationClip[]
) {
  const { camera } = useThree();
  const cameraMode = useGameStore((state) => state.cameraMode);
  const isMobile = useGameStore((state) => state.isMobile);
  const isControlEnabled = useGameStore((state) => state.isControlEnabled);

  const sceneRef = useRef<Object3D | null>(null);
  sceneRef.current = scene;
  const { actions } = useAnimations(animations, sceneRef);

  const state = useRef<PhysicsState>({ ...INITIAL_PHYSICS_STATE });

  // Init Animations
  useEffect(() => {
    ['Idle', 'Walk', 'Run', 'Back'].forEach((name) => {
      const action = actions[name];
      if (action) {
        action.reset().play();
        action.setEffectiveWeight(name === 'Idle' ? 1.0 : 0.0);
      }
    });
  }, [actions]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isControlEnabled) return;
    
    const s = state.current;

    if (cameraMode === CameraMode.FPV) {
      solveTank(groupRef.current, s, delta, isMobile);
    } else {
      solveCam(groupRef.current, camera, s, delta);
    }

    // Animation blending
    const rotateLeft = input.isPressed('RotateLeft') || input.getAxis('horizontal') < -0.1;
    const rotateRight = input.isPressed('RotateRight') || input.getAxis('horizontal') > 0.1;
    const isRotating = (cameraMode === CameraMode.FPV) && (rotateLeft || rotateRight);
    const targetWeights = calculateBlendWeights(
      Math.abs(s.speed),
      isRotating,
      s.walkSpeed,
      s.runSpeed,
      s.backSpeed
    );

    s.idleWeight = THREE.MathUtils.lerp(s.idleWeight, targetWeights.idle, s.animBlendLerpFactor);
    s.walkWeight = THREE.MathUtils.lerp(s.walkWeight, targetWeights.walk, s.animBlendLerpFactor);
    s.runWeight = THREE.MathUtils.lerp(s.runWeight, targetWeights.run, s.animBlendLerpFactor);
    s.backWeight = THREE.MathUtils.lerp(s.backWeight, targetWeights.back, s.animBlendLerpFactor);

    actions['Idle']?.setEffectiveWeight(s.idleWeight);
    actions['Walk']?.setEffectiveWeight(s.walkWeight);
    actions['Run']?.setEffectiveWeight(s.runWeight);
    actions['Back']?.setEffectiveWeight(s.backWeight);
  });
}

