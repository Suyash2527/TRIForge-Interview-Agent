'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface AiCoreProps {
  isGenerating?: boolean;
}

function CoreShape({ isGenerating = false }: AiCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      const speed = isGenerating ? 2.5 : 0.5;
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 0.8;

      // Pulse effect
      const scale = isGenerating 
        ? 1 + Math.sin(state.clock.elapsedTime * 6) * 0.1 
        : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Icosahedron ref={meshRef as any} args={[1.2, 4]}>
      <MeshDistortMaterial
        color={isGenerating ? "#7C5CFC" : "#4F8CFF"}
        wireframe={true}
        distort={isGenerating ? 0.4 : 0.15}
        speed={isGenerating ? 4 : 1.5}
      />
    </Icosahedron>
  );
}

export default function AiCore({ isGenerating = false }: AiCoreProps) {
  return (
    <div className="w-full h-full min-w-[20px] min-h-[20px] flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} className="w-full h-full pointer-events-none">
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <CoreShape isGenerating={isGenerating} />
      </Canvas>
    </div>
  );
}
