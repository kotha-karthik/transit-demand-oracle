
import React, { useState, useEffect } from 'react';
import { cityMetroNetworks, londonUndergroundLines } from '@/data/cityData';
import { Badge } from '@/components/ui/badge';
import LineBadge from '@/components/LineBadge';
import { transportApi } from '@/services/transportApi';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface UndergroundMap3DProps {
  selectedStation: string | null;
  onStationSelect: (stationId: string) => void;
}

const UndergroundMap3D: React.FC<UndergroundMap3DProps> = ({ selectedStation, onStationSelect }) => {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [lineStatuses, setLineStatuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const stations = cityMetroNetworks.london.stations;
  const lines = cityMetroNetworks.london.lines;
  
  const mapWidth = 800;
  const mapHeight = 600;
  
  const scaleX = (x: number) => (x / 100) * mapWidth;
  const scaleY = (y: number) => (y / 100) * mapHeight;

  useEffect(() => {
    const fetchLineStatuses = async () => {
      setIsLoading(true);
      try {
        const response = await transportApi.getLineStatuses();
        if (response.data) {
          setLineStatuses(response.data);
        }
      } catch (error) {
        console.error("Error fetching line statuses:", error);
        toast({
          title: "Error",
          description: "Failed to fetch line statuses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLineStatuses();
    
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchLineStatuses, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to get line status
  const getLineStatus = (lineId: string) => {
    return lineStatuses.find(status => status.id === lineId)?.status || "Unknown";
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Good Service": return "bg-green-500";
      case "Minor Delays": return "bg-amber-500";
      case "Severe Delays": return "bg-red-500";
      case "Part Closure": return "bg-red-300";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden bg-secondary/5 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
        className="bg-card"
      >
        <defs>
          <marker id="stationMarker" viewBox="0 0 10 10" refX="5" refY="5" 
                  markerWidth="5" markerHeight="5">
            <circle cx="5" cy="5" r="3" fill="#FFFFFF" />
          </marker>
          
          {/* Line patterns for different status */}
          <pattern id="pattern-disruption" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#FF0000" strokeWidth="4" />
          </pattern>
        </defs>

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
          
          const lineStatus = line.line ? getLineStatus(line.line) : "Unknown";
          const isDisrupted = lineStatus === "Severe Delays" || lineStatus === "Part Closure";
          
          return (
            <line
              key={`line-${index}`}
              x1={scaleX(sourceStation.x)}
              y1={scaleY(sourceStation.y)}
              x2={scaleX(targetStation.x)}
              y2={scaleY(targetStation.y)}
              stroke={lineColor}
              strokeWidth={3}
              strokeOpacity={isDisrupted ? 0.4 : 0.7}
              strokeDasharray={isDisrupted ? "5,5" : "none"}
              className="transition-all duration-300 hover:stroke-opacity-100"
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
          let primaryLineId = "";
          if (stationLines.length > 0 && stationLines[0].line) {
            primaryLineId = stationLines[0].line;
            const londonLine = londonUndergroundLines.find(l => l.id === primaryLineId);
            if (londonLine) {
              stationColor = londonLine.color;
            }
          }
          
          // Check if any of the station's lines have disruptions
          const hasDisruption = stationLines.some(l => {
            if (!l.line) return false;
            const status = getLineStatus(l.line);
            return status === "Severe Delays" || status === "Part Closure";
          });
          
          const stationSize = isSelected ? 10 : isHovered ? 8 : 6;
          
          return (
            <g 
              key={station.id}
              onClick={() => onStationSelect(station.id.toString())}
              onMouseEnter={() => setHoveredStation(station.id.toString())}
              onMouseLeave={() => setHoveredStation(null)}
              className="station-node"
            >
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={stationSize}
                fill={isSelected ? "#3B82F6" : stationColor}
                stroke="#FFFFFF"
                strokeWidth={2}
                className="transition-all duration-300 cursor-pointer"
              />
              
              {hasDisruption && (
                <circle
                  cx={scaleX(station.x)}
                  cy={scaleY(station.y)}
                  r={stationSize + 4}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  strokeDasharray="2,2"
                  className="animate-pulse"
                />
              )}
              
              <text
                x={scaleX(station.x)}
                y={scaleY(station.y) - stationSize - 5}
                textAnchor="middle"
                fontSize={isSelected || isHovered ? "12" : "10"}
                fontWeight={isSelected ? "bold" : "normal"}
                fill="currentColor"
                className="pointer-events-none transition-all duration-300"
                style={{ opacity: isSelected || isHovered ? 1 : 0.7 }}
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between text-xs text-muted-foreground bg-background/90 p-2 rounded-lg">
        <div className="mb-1 w-full sm:w-auto">London Underground • {stations.length} stations • {lines.length} connections</div>
        <div className="flex flex-wrap items-center gap-2">
          {londonUndergroundLines.slice(0, 5).map(line => (
            <LineBadge key={line.id} lineId={line.id} size="sm" />
          ))}
          <span className="text-muted-foreground">+{londonUndergroundLines.length - 5} more</span>
        </div>
      </div>
      
      {lineStatuses.some(status => status.status === "Severe Delays" || status.status === "Part Closure") && (
        <div className="absolute top-4 left-4 right-4 flex items-center gap-2 bg-destructive/90 text-white p-2 rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Service disruptions reported on some lines</span>
        </div>
      )}
    </div>
  );
};

export default UndergroundMap3D;
