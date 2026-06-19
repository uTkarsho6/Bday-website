"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ExperiencePhase } from "@/components/SceneCanvas";

const flameVertexShader = `
  uniform float uTime;
  varying vec3 vPosition;
  
  void main() {
    vec3 pos = position;
    float h = (pos.y + 0.08) / 0.16; // normalized Y in [0, 1]
    
    // Taper into a teardrop shape
    float taper = sin(h * 3.14159265 * 0.5) * (1.0 - h);
    pos.x *= taper * 1.55;
    pos.z *= taper * 1.55;
    
    // Smooth wiggling behavior, stronger at the tip
    float wiggleFactor = pow(h, 1.6);
    float wiggleX = sin(uTime * 14.0 + pos.y * 22.0) * 0.009 * wiggleFactor;
    float wiggleZ = cos(uTime * 11.0 + pos.y * 22.0) * 0.009 * wiggleFactor;
    pos.x += wiggleX;
    pos.z += wiggleZ;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const flameFragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  
  void main() {
    float distToCenter = length(vPosition.xz);
    float h = (vPosition.y + 0.08) / 0.16;
    
    // White-hot core
    float coreRadius = 0.016 * (1.0 - h * 0.72);
    float coreVal = smoothstep(coreRadius, 0.0, distToCenter);
    
    // Outer flame body
    float outerRadius = 0.042 * (1.0 - h * 0.45);
    float outerVal = smoothstep(outerRadius, 0.0, distToCenter);
    
    // Vertical transition and edge soft-fade
    float verticalFade = smoothstep(0.0, 0.08, h) * smoothstep(1.0, 0.78, h);
    
    vec3 colorCore = vec3(1.0, 0.98, 0.9); // White-hot
    vec3 colorOuter = vec3(1.0, 0.55, 0.1); // Amber / orange
    vec3 colorTip = vec3(0.9, 0.22, 0.01); // Reddish tip
    
    vec3 finalColor = mix(colorOuter, colorCore, coreVal);
    finalColor = mix(finalColor, colorTip, h * 0.4);
    
    float alpha = mix(outerVal * 0.72, 1.0, coreVal) * verticalFade;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const glowVertexShader = `
  uniform float uTime;
  varying vec3 vPosition;
  
  void main() {
    vec3 pos = position;
    float h = (pos.y + 0.09) / 0.18;
    
    float taper = sin(h * 3.14159265 * 0.5) * (1.0 - h);
    pos.x *= taper * 1.8;
    pos.z *= taper * 1.8;
    
    float wiggleFactor = pow(h, 1.6);
    float wiggleX = sin(uTime * 14.0 + pos.y * 22.0) * 0.009 * wiggleFactor;
    float wiggleZ = cos(uTime * 11.0 + pos.y * 22.0) * 0.009 * wiggleFactor;
    pos.x += wiggleX;
    pos.z += wiggleZ;
    
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const glowFragmentShader = `
  varying vec3 vPosition;
  
  void main() {
    float distToCenter = length(vPosition.xz);
    float h = (vPosition.y + 0.09) / 0.18;
    
    float glowVal = smoothstep(0.078 * (1.0 - h * 0.4), 0.0, distToCenter);
    float verticalFade = smoothstep(0.0, 0.12, h) * smoothstep(1.0, 0.65, h);
    
    vec3 glowColor = vec3(1.0, 0.48, 0.08); // warm orange glow
    float alpha = glowVal * 0.25 * verticalFade;
    
    gl_FragColor = vec4(glowColor, alpha);
  }
`;

function Flame({ phase }: { phase: ExperiencePhase }) {
  const flameMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const currentMultiplier = useRef(0);
  
  const active = phase === "ignition" || phase === "countdown";

  const flameUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const glowUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (flameMaterialRef.current) flameMaterialRef.current.uniforms.uTime.value = t;
    if (glowMaterialRef.current) glowMaterialRef.current.uniforms.uTime.value = t;

    const targetMult = active ? 1.0 : 0.0;
    const lerpFactor = 1 - Math.pow(0.01, delta);
    currentMultiplier.current = THREE.MathUtils.lerp(currentMultiplier.current, targetMult, lerpFactor);
  });

  const scale = currentMultiplier.current;

  return (
    <group position={[0, 0.868855, 0]} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <shaderMaterial
          ref={glowMaterialRef}
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={glowUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <shaderMaterial
          ref={flameMaterialRef}
          vertexShader={flameVertexShader}
          fragmentShader={flameFragmentShader}
          uniforms={flameUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function CakeModel({ phase }: { phase: ExperiencePhase }) {
  const cake = useRef<THREE.Group>(null);
  const visible = phase !== "finale";
  const exploding = phase === "explosion";

  // Load official cake asset
  const { scene } = useGLTF("/models/cake.glb");

  // Traverse the GLB scene to enable shadow casting and receiving on all children
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Log the bounding box of the GLB model in the console to inspect size and center coordinates
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    console.log("Cake GLB dimensions:", {
      x: size.x,
      y: size.y,
      z: size.z
    }, "Center:", {
      x: center.x,
      y: center.y,
      z: center.z
    });
  }, [scene]);

  const baseScale = 1.35;
  const targetScale = useMemo(() => new THREE.Vector3(baseScale, baseScale, baseScale), []);

  useFrame((state, delta) => {
    if (!cake.current) return;
    cake.current.rotation.y += delta * (exploding ? 1.9 : 0.18);
    cake.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.035 - (exploding ? state.clock.elapsedTime % 1 * 0.02 : 0);
    
    const scaleFactor = exploding ? 0.01 : baseScale;
    targetScale.set(scaleFactor, scaleFactor, scaleFactor);
    cake.current.scale.lerp(targetScale, 0.055);
  });

  if (!visible) return null;

  return (
    <group ref={cake} position={[0, -0.22, 0]}>
      {/* Render the official cake GLB model with upright orientation */}
      <primitive object={scene} rotation={[0, 0, 0]} />

      {/* Retain the flame component for position calibration in the next tasks */}
      <Flame phase={phase} />
    </group>
  );
}

