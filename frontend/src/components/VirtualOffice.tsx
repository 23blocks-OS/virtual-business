import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { VRButton, XR } from '@react-three/xr';
import AgentAvatar from './AgentAvatar';
import { useStore } from '../store/useStore';
import { Room } from './Room';

export default function VirtualOffice() {
  const agents = useStore((state) => state.agents);

  return (
    <>
      <VRButton />
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <XR>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="city" />

          {/* Room */}
          <Room />

          {/* Contact Shadows */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={50}
            blur={1}
            far={10}
          />

          {/* Agent Avatars */}
          {agents.map((agent) => (
            <AgentAvatar key={agent.id} agent={agent} />
          ))}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={20}
          />
        </XR>
      </Canvas>
    </>
  );
}
