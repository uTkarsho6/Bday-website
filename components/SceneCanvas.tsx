"use client";

import { Environment, Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import CakeModel from "@/components/three/CakeModel";
import ParticleBloom from "@/components/three/ParticleBloom";
import { designTokens } from "@/lib/design-tokens";

export type ExperiencePhase = "landing" | "ignition" | "countdown" | "explosion" | "finale";

function CameraRig({ phase }: { phase: ExperiencePhase }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const shouldReduceMotion = useReducedMotion();
  const explosionStartTime = useRef<number | null>(null);

  useFrame((state, delta) => {
    const finale = phase === "finale";
    const basePos = finale ? designTokens.camera.reveal : designTokens.camera.landing;

    let shakeX = 0;
    let shakeY = 0;

    if (phase === "explosion" && !shouldReduceMotion) {
      if (explosionStartTime.current === null) {
        explosionStartTime.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - explosionStartTime.current;
      const decay = Math.max(0, 1 - elapsed / 1.2);
      const shakeTime = elapsed * 75.0;
      shakeX = Math.sin(shakeTime) * 0.08 * decay;
      shakeY = Math.cos(shakeTime * 1.3) * 0.08 * decay;
    } else {
      explosionStartTime.current = null;
    }

    target.set(
      basePos[0] + pointer.x * 0.28 + shakeX,
      basePos[1] + (finale ? 0 : pointer.y * 0.12) + shakeY,
      basePos[2]
    );
    camera.position.lerp(target, 1 - Math.pow(0.035, delta));
    camera.lookAt(pointer.x * 0.24 + shakeX * 1.5, (finale ? 0.18 : 0.66) + shakeY * 1.5, 0);
  });

  return null;
}

function VolumetricLights({ phase }: { phase: ExperiencePhase }) {
  const light = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const fillSpotRef = useRef<THREE.SpotLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const active = (phase === "ignition" || phase === "countdown" || phase === "explosion");

    if (light.current) {
      const base = active ? 5.5 : 2.7;
      const flicker = Math.sin(t * 23.3) * 0.12 + Math.cos(t * 37.7) * 0.08 + Math.sin(t * 7.1) * 0.05;
      light.current.intensity = base * (1 + flicker);
    }

    if (ambientRef.current) {
      const targetAmbient = active ? 0.14 : 0.32;
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetAmbient, 1 - Math.pow(0.01, delta));
    }

    if (fillSpotRef.current) {
      const targetFill = active ? 0.35 : 1.1;
      fillSpotRef.current.intensity = THREE.MathUtils.lerp(fillSpotRef.current.intensity, targetFill, 1 - Math.pow(0.01, delta));
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.32} color="#8fa0b8" />
      <spotLight 
        position={[-4, 7, 5]} 
        angle={0.42} 
        penumbra={0.88} 
        intensity={2.4} 
        color="#f4d6a1" 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
      <spotLight ref={fillSpotRef} position={[5, 3.6, 2]} angle={0.35} penumbra={1} intensity={1.1} color="#9ce6e6" />
      <pointLight ref={light} position={[0, 0.863, 0.04]} distance={7} color="#ff9d48" />
    </>
  );
}

function Scene({ phase }: { phase: ExperiencePhase }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.16, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.05, 0.06);
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={designTokens.camera.landing as unknown as [number, number, number]} />
      <CameraRig phase={phase} />
      <VolumetricLights phase={phase} />
      <fog attach="fog" args={["#050507", 7, 18]} />

      <group ref={group}>
        <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.12}>
          <CakeModel phase={phase} />
        </Float>
      </group>

      <ParticleBloom phase={phase} />
      <Sparkles count={120} speed={0.25} size={1.9} scale={[10, 6, 8]} opacity={0.28} color="#f6eee2" position={[0, -0.1, 0]} />
      <Environment preset="night" />
    </>
  );
}

export default function SceneCanvas({ phase }: { phase: ExperiencePhase }) {
  return (
    <div className="r3f-stage absolute inset-0 h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.65]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene phase={phase} />
        </Suspense>
      </Canvas>
    </div>
  );
}
