
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { cityMetroNetworks } from '@/data/cityData';
import * as THREE from 'three';

interface Station3DProps {
  position: [number, number, number];
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const Station3D: React.FC<Station3DProps> = ({ position, name, isSelected, onClick }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current && isSelected) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={isSelected ? "#3B82F6" : "#94A3B8"} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#1E293B"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

interface UndergroundMap3DProps {
  selectedStation: string | null;
  onStationSelect: (stationId: string) => void;
}

const UndergroundMap3D: React.FC<UndergroundMap3DProps> = ({ selectedStation, onStationSelect }) => {
  const stations = cityMetroNetworks.london.stations;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden bg-secondary/20">
      <Canvas
        camera={{ position: [0, 15, 25], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>

        {/* Station nodes */}
        {stations.map((station, index) => {
          // Convert 2D coordinates to 3D space
          const x = (station.x - 50) / 5;
          const z = (station.y - 50) / 5;
          
          return (
            <Station3D
              key={station.id}
              position={[x, 0, z]}
              name={station.name}
              isSelected={selectedStation === station.id.toString()}
              onClick={() => onStationSelect(station.id.toString())}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default UndergroundMap3D;
