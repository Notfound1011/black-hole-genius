import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Trail, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Phase, MASS_THRESHOLD_BLACK_HOLE } from '../types';

// Fix for missing R3F types in the current environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      planeGeometry: any;
      shaderMaterial: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      torusGeometry: any;
      meshBasicMaterial: any;
      pointLight: any;
      ambientLight: any;
    }
  }
}

// --- Sub-components for the Scene ---

// 1. Spacetime Grid (Warps based on mass/gravity)
const SpaceTimeGrid = ({ mass, phase }: { mass: number; phase: Phase }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate "gravity well" depth based on phase and mass
  const gravityFactor = useMemo(() => {
    if (phase === Phase.MainSequence) return 1.0;
    if (phase === Phase.RedSupergiant) return 2.0;
    if (phase === Phase.Supernova) return 0.5; // Disrupted
    if (phase === Phase.Remnant) return mass >= MASS_THRESHOLD_BLACK_HOLE ? 8.0 : 4.0;
    return 1.0;
  }, [phase, mass]);

  // Custom shader for grid distortion
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uGravity: { value: 0 },
    uColor: { value: new THREE.Color('#06b6d4') } // Cyan-500
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Smoothly interpolate gravity visual
      uniforms.uGravity.value = THREE.MathUtils.lerp(uniforms.uGravity.value, gravityFactor, 0.05);
      uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float uGravity;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Calculate distance from center (0,0)
      float dist = distance(pos.xy, vec2(0.0));
      
      // Inverse square-ish law for visual dip
      float zDrop = -uGravity / (dist * 0.5 + 1.0);
      
      // Apply drop
      pos.z += zDrop;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 uColor;
    
    void main() {
      // Create grid lines
      float gridX = step(0.95, fract(vUv.x * 20.0));
      float gridY = step(0.95, fract(vUv.y * 20.0));
      
      float strength = max(gridX, gridY);
      
      // Fade out at edges
      float dist = distance(vUv, vec2(0.5));
      float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * strength;
      
      if (alpha < 0.01) discard;
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30, 60, 60]} />
      <shaderMaterial 
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 2. The Star / Remnant Object
const CelestialBody = ({ phase, mass }: { phase: Phase; mass: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [explosionProgress, setExplosionProgress] = useState(0);

  const isBlackHole = phase === Phase.Remnant && mass >= MASS_THRESHOLD_BLACK_HOLE;
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      
      // Pulsating effect for Red Supergiant
      if (phase === Phase.RedSupergiant) {
        const scale = 3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        meshRef.current.scale.setScalar(scale);
      }
      // Collapse animation for Black Hole
      else if (phase === Phase.Remnant) {
         meshRef.current.rotation.y += 0.05; // Spin faster
      }
    }

    if (phase === Phase.Supernova) {
      if (explosionProgress < 10) {
        setExplosionProgress(p => p + delta * 5);
      }
    } else {
      setExplosionProgress(0);
    }
  });

  // Determine appearance based on phase
  let color = "#FDB813"; // Main Sequence
  let scale = 1.2;
  let emissiveIntensity = 1;

  if (phase === Phase.MainSequence) {
    // Mass slightly affects size/color
    scale = 1 + (mass / 40) * 0.5; 
    color = mass > 25 ? "#AEC1FF" : "#FDB813"; // Blue giant vs Yellow
  } else if (phase === Phase.RedSupergiant) {
    color = "#FF4500";
    scale = 3;
  } else if (phase === Phase.Supernova) {
    scale = 0.5; // Core collapses
    color = "#FFFFFF";
  } else if (phase === Phase.Remnant) {
    if (isBlackHole) {
      scale = 0.8;
      color = "#000000";
    } else {
      scale = 0.3; // Neutron star
      color = "#00FFFF";
    }
  }

  return (
    <group>
      {/* The Core Body */}
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={color} 
          emissive={isBlackHole ? "#000000" : color}
          emissiveIntensity={isBlackHole ? 0 : 2}
          roughness={0.2}
        />
      </mesh>

      {/* Accretion Disk for Black Hole */}
      {isBlackHole && (
        <group rotation={[Math.PI / 3, 0, 0]}>
             <mesh rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[2.5, 0.4, 16, 100]} />
                <meshBasicMaterial color="#FF6600" transparent opacity={0.8} />
             </mesh>
             <Sparkles count={200} scale={6} size={4} speed={0.4} opacity={0.5} color="#FFD700" />
        </group>
      )}

      {/* Supernova Explosion Particles */}
      {phase === Phase.Supernova && (
        <group>
          <Sparkles 
            count={500} 
            scale={explosionProgress * 5 + 2} 
            size={10} 
            speed={2} 
            opacity={Math.max(0, 1 - explosionProgress/8)} 
            color="#FFF" 
          />
          <pointLight intensity={10 - explosionProgress} distance={50} color="white" />
        </group>
      )}

      {/* Lighting */}
      {!isBlackHole && <pointLight distance={20} intensity={5} color={color} />}
      <ambientLight intensity={0.2} />
    </group>
  );
};

export const Visualizer: React.FC<{ phase: Phase; mass: number }> = ({ phase, mass }) => {
  return (
    <div className="w-full h-full bg-black relative">
      <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={30} 
          autoRotate={phase === Phase.MainSequence || phase === Phase.Remnant}
          autoRotateSpeed={0.5}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <CelestialBody phase={phase} mass={mass} />
        </Float>
        
        <SpaceTimeGrid mass={mass} phase={phase} />
        
      </Canvas>
      
      {/* Visual Overlay Labels */}
      <div className="absolute top-4 left-4 pointer-events-none">
        {phase === Phase.Remnant && mass >= MASS_THRESHOLD_BLACK_HOLE && (
           <div className="text-red-500 font-mono animate-pulse">
             WARNING: EVENT HORIZON DETECTED<br/>
             SINGULARITY IMMINENT
           </div>
        )}
      </div>
    </div>
  );
};