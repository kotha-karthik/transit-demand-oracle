
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, useTexture, Stats } from '@react-three/drei';
import { cityMetroNetworks, londonUndergroundLines } from '@/data/cityData';
import * as THREE from 'three';

// Memoized station component for better performance
interface Station3DProps {
  position: [number, number, number];
  name: string;
  isSelected: boolean;
  onClick: () => void;
  lineColor?: string;
}

const Station3D: React.FC<Station3DProps> = ({ position, name, isSelected, onClick, lineColor = "#94A3B8" }) => {
  const ref = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const [hover, setHover] = useState(false);

  useFrame((state, delta) => {
    if (ref.current) {
      if (isSelected) {
        ref.current.rotation.y += 0.01;
        ref.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      } else if (hover) {
        ref.current.scale.setScalar(1.1);
      } else {
        ref.current.scale.setScalar(1.0);
      }
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <mesh 
        ref={ref}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#3B82F6" : lineColor} 
          roughness={0.5} 
          metalness={0.8}
        />
      </mesh>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.3}
        color="#1E293B"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#ffffff"
      >
        {name}
      </Text>
    </group>
  );
};

// Memoized line component for better performance
interface TransitLineProp {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  thickness?: number;
}

const TransitLine: React.FC<TransitLineProp> = ({ start, end, color, thickness = 0.05 }) => {
  const points = useMemo(() => [
    new THREE.Vector3(start[0], start[1], start[2]),
    new THREE.Vector3(end[0], end[1], end[2])
  ], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={thickness}
      dashed={false}
    />
  );
};

// Ground plane component
const GroundPlane: React.FC = () => {
  const texture = useTexture({
    map: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/prototype/grid.png'
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 1, 1]} />
      <meshStandardMaterial 
        color="#E2E8F0" 
        map={texture.map}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

interface UndergroundMap3DProps {
  selectedStation: string | null;
  onStationSelect: (stationId: string) => void;
}

const UndergroundMap3D: React.FC<UndergroundMap3DProps> = ({ selectedStation, onStationSelect }) => {
  const stations = cityMetroNetworks.london.stations;
  const lines = cityMetroNetworks.london.lines;

  // Memoize lines to avoid recreating on every render
  const transitLines = useMemo(() => {
    return lines.map((line, index) => {
      const sourceStation = stations.find(s => s.id === line.source);
      const targetStation = stations.find(s => s.id === line.target);
      
      if (!sourceStation || !targetStation) return null;
      
      // Convert 2D coordinates to 3D space
      const sourceX = (sourceStation.x - 50) / 5;
      const sourceZ = (sourceStation.y - 50) / 5;
      const targetX = (targetStation.x - 50) / 5;
      const targetZ = (targetStation.y - 50) / 5;
      
      let lineColor = "#9E76FF";
      if (line.line) {
        const londonLine = londonUndergroundLines.find(l => l.id === line.line);
        if (londonLine) {
          lineColor = londonLine.color;
        }
      }
      
      return (
        <TransitLine 
          key={`line-${index}`}
          start={[sourceX, 0.2, sourceZ]}
          end={[targetX, 0.2, targetZ]}
          color={lineColor}
          thickness={0.08}
        />
      );
    });
  }, [lines, stations]);

  // Performance optimization using useMemo for stations
  const stationElements = useMemo(() => {
    return stations.map((station) => {
      // Convert 2D coordinates to 3D space
      const x = (station.x - 50) / 5;
      const z = (station.y - 50) / 5;
      
      // Find station's lines to determine color
      const stationLines = lines.filter(
        l => l.source === station.id || l.target === station.id
      );
      
      let lineColor = "#94A3B8";
      if (stationLines.length > 0 && stationLines[0].line) {
        const londonLine = londonUndergroundLines.find(l => l.id === stationLines[0].line);
        if (londonLine) {
          lineColor = londonLine.color;
        }
      }
      
      return (
        <Station3D
          key={station.id}
          position={[x, 0, z]}
          name={station.name}
          isSelected={selectedStation === station.id.toString()}
          onClick={() => onStationSelect(station.id.toString())}
          lineColor={lineColor}
        />
      );
    });
  }, [stations, selectedStation, onStationSelect, lines]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden bg-secondary/20 relative">
      <Canvas
        camera={{ position: [0, 15, 25], fov: 45 }}
        shadows
        dpr={[1, 2]} // Optimizes rendering for device pixel ratio
        performance={{ min: 0.5 }} // Performance optimization
      >
        <fog attach="fog" args={['#f0f0f0', 30, 40]} /> 
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
        
        {/* Ground */}
        <GroundPlane />
        
        {/* Transit Lines */}
        {transitLines}
        
        {/* Station nodes */}
        {stationElements}
        
        {/* Performance stats (comment out in production) */}
        {/* <Stats /> */}
      </Canvas>
      
      {/* Optional overlay with instructions */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 p-1 rounded">
        Drag to rotate • Scroll to zoom • Click stations to select
      </div>
    </div>
  );
};

export default UndergroundMap3D;
