import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import { Agent } from '../types';
import { useStore } from '../store/useStore';

interface AgentAvatarProps {
  agent: Agent;
}

export default function AgentAvatar({ agent }: AgentAvatarProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setActiveAgent = useStore((state) => state.setActiveAgent);
  const activeAgentId = useStore((state) => state.activeAgentId);

  const isActive = activeAgentId === agent.id;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        agent.position[1] + Math.sin(state.clock.elapsedTime + agent.position[0]) * 0.1;
    }
  });

  return (
    <group position={agent.position}>
      {/* Avatar Sphere */}
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onClick={() => setActiveAgent(agent.id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial
          color={agent.color}
          emissive={agent.color}
          emissiveIntensity={hovered || isActive ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {/* Glow Ring */}
      {(hovered || isActive) && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Name Label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {agent.name}
      </Text>

      {/* Role Label */}
      <Text
        position={[0, -1.6, 0]}
        fontSize={0.2}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        {agent.role}
      </Text>

      {/* Active Indicator */}
      {isActive && (
        <mesh position={[0, 1.5, 0]}>
          <coneGeometry args={[0.2, 0.3, 3]} />
          <meshBasicMaterial color={agent.color} />
        </mesh>
      )}
    </group>
  );
}
