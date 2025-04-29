
import React, { useState } from 'react';
import { cityMetroNetworks, londonUndergroundLines } from '@/data/cityData';
import { Badge } from '@/components/ui/badge';

interface UndergroundMap3DProps {
  selectedStation: string | null;
  onStationSelect: (stationId: string) => void;
}

const UndergroundMap3D: React.FC<UndergroundMap3DProps> = ({ selectedStation, onStationSelect }) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const stations = cityMetroNetworks.london.stations;
  const lines = cityMetroNetworks.london.lines;
  
  const mapWidth = 600;
  const mapHeight = 400;
  
  const scaleX = (x: number) => (x / 100) * mapWidth;
  const scaleY = (y: number) => (y / 100) * mapHeight;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden bg-secondary/20 relative">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
        className="bg-secondary/10"
      >
        {/* Render lines */}
        {lines.map((line, index) => {
          const sourceStation = stations.find(s => s.id === line.source);
          const targetStation = stations.find(s => s.id === line.target);
          
          if (!sourceStation || !targetStation) return null;
          
          let lineColor = "#9E76FF";
          if (line.line) {
            const londonLine = londonUndergroundLines.find(l => l.id === line.line);
            if (londonLine) {
              lineColor = londonLine.color;
            }
          }
          
          return (
            <line
              key={`line-${index}`}
              x1={scaleX(sourceStation.x)}
              y1={scaleY(sourceStation.y)}
              x2={scaleX(targetStation.x)}
              y2={scaleY(targetStation.y)}
              stroke={lineColor}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
          );
        })}
        
        {/* Render stations */}
        {stations.map((station) => {
          const isSelected = selectedStation === station.id.toString();
          const isHovered = hoveredStation === station.id.toString();
          
          // Find station's lines to determine color
          const stationLines = lines.filter(
            l => l.source === station.id || l.target === station.id
          );
          
          let stationColor = "#94A3B8";
          if (stationLines.length > 0 && stationLines[0].line) {
            const londonLine = londonUndergroundLines.find(l => l.id === stationLines[0].line);
            if (londonLine) {
              stationColor = londonLine.color;
            }
          }
          
          return (
            <g 
              key={station.id}
              onClick={() => onStationSelect(station.id.toString())}
              onMouseEnter={() => setHoveredStation(station.id.toString())}
              onMouseLeave={() => setHoveredStation(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={isSelected ? 8 : isHovered ? 7 : 6}
                fill={isSelected ? "#3B82F6" : stationColor}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
              <text
                x={scaleX(station.x)}
                y={scaleY(station.y) - 10}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                className="font-medium"
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 p-1 rounded">
        Click stations to select • {stations.length} stations • {lines.length} connections
      </div>
    </div>
  );
};

export default UndergroundMap3D;
