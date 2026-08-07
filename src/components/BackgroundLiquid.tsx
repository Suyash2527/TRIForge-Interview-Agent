'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function LiquidShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef as any} args={[2.8, 64, 64]}>
      <MeshDistortMaterial
        color="#0F1117"
        emissive="#4F8CFF"
        emissiveIntensity={0.15}
        distort={0.7}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </Sphere>
  );
}

export default function BackgroundLiquid() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-40 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#7C5CFC" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#4F8CFF" />
        <Sparkles count={800} scale={12} size={1.2} speed={0.2} opacity={0.3} color="#4F8CFF" />
        <LiquidShape />
      </Canvas>
    </div>
  );
}
