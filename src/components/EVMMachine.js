"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { useState, useRef } from "react";

function BallotButton({ position, color, onVote, active }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const targetY = active ? -0.1 : hovered ? 0.05 : 0;
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.2;
  });

  return (
    <group position={position}>
      {/* Button Housing */}
      <RoundedBox args={[0.8, 0.4, 0.4]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#f0f0f0" />
      </RoundedBox>
      {/* Interactive Button */}
      <mesh
        ref={mesh}
        position={[0, 0.2, 0]}
        onClick={onVote}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <RoundedBox args={[0.6, 0.2, 0.2]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 2 : 0} />
        </RoundedBox>
      </mesh>
    </group>
  );
}

function EVMModel({ onVote, selectedCandidate }) {
  return (
    <group rotation={[-0.2, 0, 0]}>
      {/* Main Body */}
      <RoundedBox args={[4, 6, 0.5]} radius={0.2} smoothness={4} position={[0, 0, -0.3]}>
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.2} />
      </RoundedBox>

      {/* Control Panel Area */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[3.2, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Buttons */}
      {[
        { id: 1, pos: [1.2, 1, 0], color: "#1e3a8a" },
        { id: 2, pos: [1.2, 0, 0], color: "#1e3a8a" },
        { id: 3, pos: [1.2, -1, 0], color: "#1e3a8a" },
      ].map((btn) => (
        <BallotButton
          key={btn.id}
          position={btn.pos}
          color={btn.color}
          active={selectedCandidate === btn.id}
          onVote={() => onVote(btn.id)}
        />
      ))}

      {/* Labels Area */}
      <mesh position={[-0.5, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      <Environment preset="city" />
      <ContactShadows opacity={0.4} scale={10} blur={2} far={4} />
    </group>
  );
}

export default function EVMMachine({ onVote, selectedCandidate }) {
  return (
    <div className="h-[500px] w-full bg-gradient-to-b from-gray-50 to-gray-200 rounded-3xl overflow-hidden shadow-inner relative">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-xs font-bold text-navy uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          High-Fidelity 3D Simulation
        </h3>
      </div>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <EVMModel onVote={onVote} selectedCandidate={selectedCandidate} />
      </Canvas>
      <div className="absolute bottom-6 right-6 z-10 text-right">
        <p className="text-[10px] font-bold text-text-muted uppercase">Interaction Mode</p>
        <p className="text-xs font-medium text-navy">Click buttons to cast vote</p>
      </div>
    </div>
  );
}
