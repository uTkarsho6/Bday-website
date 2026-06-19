"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ExperiencePhase } from "@/components/SceneCanvas";

export default function ParticleBloom({ phase }: { phase: ExperiencePhase }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const count = 950;

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 0.6 + Math.random() * 4.8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4.8;
      data[i * 3] = Math.cos(angle) * radius;
      data[i * 3 + 1] = height;
      data[i * 3 + 2] = Math.sin(angle) * radius - Math.random() * 1.5;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const active = phase === "explosion" || phase === "finale";
    if (points.current) {
      points.current.rotation.y += delta * (active ? 0.18 : 0.045);
      points.current.rotation.x = Math.sin(t * 0.13) * 0.08;
      const scale = active ? 1.55 + Math.sin(t * 0.7) * 0.05 : 0.82;
      points.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.03);
    }
    if (material.current) {
      material.current.opacity = THREE.MathUtils.lerp(material.current.opacity, active ? 0.72 : 0.22, 0.04);
      material.current.size = THREE.MathUtils.lerp(material.current.size, active ? 0.038 : 0.022, 0.04);
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={material}
        transparent
        color={phase === "finale" ? "#f6eee2" : "#ffbd74"}
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
