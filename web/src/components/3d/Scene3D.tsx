// ─────────────────────────────────────────────
// 3D Living Background - Vibrant NVIDIA Build Style
// Uses React Three Fiber for 3D particles and geometry
// ─────────────────────────────────────────────
'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  radius?: number;
}

// ─────────────────────────────────────────────
// Floating Particles
// ─────────────────────────────────────────────
function Particles({ count = 2000, radius = 35 }: ParticlesProps) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color(0x6366f1); // indigo
    const color2 = new THREE.Color(0x8b5cf6); // purple
    const color3 = new THREE.Color(0xf59e0b); // amber
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      const c = new THREE.Color().lerpColors(color1, color2, mix);
      c.lerp(color3, Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, [count]);

  const sizes = useMemo(() => {
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sz[i] = 0.02 + Math.random() * 0.08;
    }
    return sz;
  }, [count]);

  const offsets = useMemo(() => {
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      off[i] = Math.random() * Math.PI * 2;
    }
    return off;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('offset', new THREE.BufferAttribute(offsets, 1));
    return geo;
  }, [positions, colors, sizes, offsets]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute float offset;
      varying float vAlpha;
      uniform float uTime;
      void main() {
        vec3 pos = position;
        float time = sin(uTime + offset) * 0.1;
        pos.x += time;
        pos.y += cos(uTime + offset) * 0.1;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 1.0 - length(mvPosition.xyz) / 50.0;
      }
    `,
    fragmentShader: `
      attribute vec3 color;
      varying float vAlpha;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
    uniforms: {
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  }), []);

  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current && material) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={points} geometry={geometry} material={material}>
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3} />
    </points>
  );
}

// ─────────────────────────────────────────────
// Floating Geometric Shapes
// ─────────────────────────────────────────────
interface FloatingGeometryProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: number;
  wireframe?: boolean;
}

function FloatingGeometry({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1, 
  color = 0x6366f1, 
  wireframe = true 
}: FloatingGeometryProps) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.1;
      ref.current.rotation.y += delta * 0.15;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshPhysicalMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={0.15}
        metalness={0.3}
        roughness={0.7}
        transmission={0.1}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// Animated Torus Ring
// ─────────────────────────────────────────────
function TorusRing() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05;
      ref.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -10]} scale={2}>
      <torusGeometry args={[3, 0.08, 16, 100]} />
      <meshPhysicalMaterial
        color={0xf59e0b}
        wireframe
        transparent
        opacity={0.2}
        metalness={0.5}
        roughness={0.3}
        emissive={0xf59e0b}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// 3D Scene Component
// ─────────────────────────────────────────────
export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 50 }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
    >
      <color attach="background" args={[0x0a0a0a]} />
      <fog attach="fog" args={[0x0a0a0a, 10, 50]} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#6366f1" />
      <directionalLight position={[-10, -5, -5]} intensity={0.3} color="#f59e0b" />
      <pointLight position={[0, 15, 10]} intensity={0.5} color="#8b5cf6" decay={2} />
      
      {/* Stars background */}
      <Stars radius={100} depth={100} count={3000} factor={4} saturation={0.5} fade />
      
      {/* Floating particles */}
      <Particles count={2000} radius={35} />
      
      {/* Floating geometric shapes */}
      <FloatingGeometry position={[-12, 8, -5]} color={0x6366f1} scale={1.2} />
      <FloatingGeometry position={[10, -6, -8]} color={0x8b5cf6} scale={0.8} />
      <FloatingGeometry position={[-8, -10, -12]} color={0xf59e0b} scale={1} />
      <FloatingGeometry position={[15, 5, -15]} color={0x6366f1} scale={0.6} wireframe={true} />
      
      {/* Torus rings */}
      <TorusRing />
      <mesh position={[8, -8, -20]} scale={1.5}>
        <torusGeometry args={[2, 0.05, 12, 80]} />
        <meshPhysicalMaterial
          color={0x8b5cf6}
          wireframe
          transparent
          opacity={0.15}
          emissive={0x8b5cf6}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Orbit controls for subtle interaction */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
}

// ─────────────────────────────────────────────
// Hero 3D Element - Featured Service Card
// ─────────────────────────────────────────────
interface Hero3DProps {
  serviceId: string;
}

export function Hero3D({ serviceId }: Hero3DProps) {
  const logos: Record<string, THREE.Color> = {
    'n8n-workflow': new THREE.Color(0xea4b71),
    'hermes-ai-agent': new THREE.Color(0x6366f1),
    'postgresql': new THREE.Color(0x336791),
    'redis': new THREE.Color(0xdc382d),
    'grafana-prometheus': new THREE.Color(0xf46800),
    'minio': new THREE.Color(0xffd86e),
  };

  const color = logos[serviceId] || new THREE.Color(0x6366f1);
  
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      style={{ width: '100%', height: '100%', borderRadius: '16px' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={[0x0a0a0a]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 3]} intensity={1} color="#ffffff" />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color={color} />
      
      <mesh rotation={[-0.2, 0.3, 0]}>
        <boxGeometry args={[2, 2, 0.1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.9}
          transmission={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}