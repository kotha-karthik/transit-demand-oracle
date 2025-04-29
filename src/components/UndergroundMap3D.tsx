
import React, { useState, useEffect } from 'react';
import { cityMetroNetworks, londonUndergroundLines } from '@/data/cityData';
import { Badge } from '@/components/ui/badge';
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
  
  const mapWidth = 600;
  const mapHeight = 400;
  
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
    <div className="h-[500px] w-full rounded-lg overflow-hidden bg-secondary/20 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
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
              strokeWidth={2}
              strokeOpacity={isDisrupted ? 0.4 : 0.7}
              strokeDasharray={isDisrupted ? "5,5" : "none"}
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
              
              {hasDisruption && (
                <circle
                  cx={scaleX(station.x)}
                  cy={scaleY(station.y)}
                  r={10}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth={1.5}
                  opacity={0.7}
                />
              )}
              
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
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-muted-foreground bg-background/80 p-1 rounded">
        <div>Click stations to select • {stations.length} stations • {lines.length} connections</div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Good Service</span>
          <span className="h-2 w-2 rounded-full bg-amber-500 ml-2"></span>
          <span>Minor Delays</span>
          <span className="h-2 w-2 rounded-full bg-red-500 ml-2"></span>
          <span>Disruption</span>
        </div>
      </div>
      
      {lineStatuses.some(status => status.status === "Severe Delays" || status.status === "Part Closure") && (
        <div className="absolute top-2 left-2 right-2 flex items-center gap-2 bg-destructive/80 text-white p-2 rounded text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Service disruptions reported on some lines</span>
        </div>
      )}
    </div>
  );
};

export default UndergroundMap3D;
