export function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -8]} receiveShadow>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-8, 5, 7]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[8, 5, 7]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0f1419" />
      </mesh>

      {/* Accent lights on ceiling */}
      <pointLight position={[0, 9, 0]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, 9, -5]} intensity={0.3} color="#8B5CF6" />
      <pointLight position={[5, 9, -5]} intensity={0.3} color="#3B82F6" />
    </group>
  );
}
