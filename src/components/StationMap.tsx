
import React, { useState } from 'react';
import { stations, flowData } from '../data/mockData';

interface StationMapProps {
  onStationSelect: (stationId: number) => void;
  selectedStation: number | null;
}

const StationMap: React.FC<StationMapProps> = ({ onStationSelect, selectedStation }) => {
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  
  const mapWidth = 400;
  const mapHeight = 400;
  const stationRadius = 10;
  
  // Scale station coordinates to fit the SVG
  const scaleX = (x: number) => (x / 100) * mapWidth;
  const scaleY = (y: number) => (y / 100) * mapHeight;
  
  // Calculate flow lines
  const getFlowLines = () => {
    if (!selectedStation) return [];
    
    return flowData
      .filter(flow => flow.origin === selectedStation || flow.destination === selectedStation)
      .map(flow => {
        const origin = stations.find(s => s.id === flow.origin);
        const destination = stations.find(s => s.id === flow.destination);
        
        if (!origin || !destination) return null;
        
        // Scale the stroke width based on volume
        const maxVolume = Math.max(...flowData.map(f => f.volume));
        const strokeWidth = 1 + (flow.volume / maxVolume) * 5;
        
        return {
          x1: scaleX(origin.x),
          y1: scaleY(origin.y),
          x2: scaleX(destination.x),
          y2: scaleY(destination.y),
          strokeWidth,
          volume: flow.volume,
          predictedVolume: flow.predictedVolume
        };
      })
      .filter(Boolean);
  };
  
  const flowLines = getFlowLines();
  
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Station Network</h2>
      <div className="relative">
        <svg width={mapWidth} height={mapHeight} className="border border-border rounded-md bg-secondary/20">
          {/* Flow lines */}
          {flowLines.map((line, index) => (
            <line
              key={index}
              x1={line?.x1}
              y1={line?.y1}
              x2={line?.x2}
              y2={line?.y2}
              stroke={line?.predictedVolume > line?.volume ? "#3B82F6" : "#10B981"}
              strokeWidth={line?.strokeWidth}
              strokeOpacity={0.6}
              className="flow-path"
            />
          ))}
          
          {/* Station nodes */}
          {stations.map(station => (
            <g key={station.id}>
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={stationRadius}
                fill={station.id === selectedStation 
                  ? "#3B82F6" 
                  : station.id === hoveredStation 
                    ? "#60A5FA" 
                    : "#94A3B8"}
                stroke="#1E293B"
                strokeWidth={1}
                className="station-node"
                onClick={() => onStationSelect(station.id)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={scaleX(station.x)}
                y={scaleY(station.y) - stationRadius - 5}
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
              >
                {station.name}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-md text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#10B981] mr-1"></div>
            <span>Actual Flow</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-1"></div>
            <span>Predicted Flow</span>
          </div>
        </div>
      </div>
      
      {selectedStation && (
        <div className="mt-4 text-sm">
          <p>Selected: {stations.find(s => s.id === selectedStation)?.name}</p>
          <p className="text-muted-foreground">Click another station to view flows</p>
        </div>
      )}
    </div>
  );
};

export default StationMap;
