
import React, { useState, useEffect } from 'react';
import { cityMetroNetworks, londonUndergroundLines } from '@/data/cityData';
import { Badge } from '@/components/ui/badge';
import LineBadge from '@/components/LineBadge';
import { transportApi } from '@/services/transportApi';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Zap, Users, Activity } from 'lucide-react';

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
  
  const mapWidth = 900;
  const mapHeight = 700;
  
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
    const intervalId = setInterval(fetchLineStatuses, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const getLineStatus = (lineId: string) => {
    return lineStatuses.find(status => status.id === lineId)?.status || "Good Service";
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Good Service": return "#10B981";
      case "Minor Delays": return "#F59E0B";
      case "Severe Delays": return "#EF4444";
      case "Part Closure": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getPassengerDensity = (stationId: number) => {
    // Simulate real-time passenger density based on time and station importance
    const baseLoad = Math.random() * 0.6 + 0.2;
    const timeOfDay = new Date().getHours();
    const rushHourMultiplier = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19) ? 1.5 : 1;
    return Math.min(1, baseLoad * rushHourMultiplier);
  };

  return (
    <div className="h-[700px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative border shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
        className="bg-white dark:bg-slate-800"
      >
        <defs>
          {/* Grid pattern for background */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f1f5f9" strokeWidth="1" opacity="0.3"/>
          </pattern>
          
          {/* Glow effects for stations */}
          <filter id="stationGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Line gradient */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#3B82F6", stopOpacity:0.8}} />
            <stop offset="100%" style={{stopColor:"#1E40AF", stopOpacity:0.6}} />
          </linearGradient>
        </defs>

        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Thames River representation */}
        <path
          d="M100,400 Q300,380 500,420 Q700,460 800,440"
          stroke="#3B82F6"
          strokeWidth="8"
          fill="none"
          opacity="0.2"
          strokeLinecap="round"
        />
        
        {/* Zone indicators */}
        {[1, 2, 3, 4].map(zone => (
          <circle
            key={zone}
            cx={mapWidth / 2}
            cy={mapHeight / 2}
            r={zone * 80}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        ))}

        {/* Render metro lines with improved styling */}
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
          
          const lineStatus = line.line ? getLineStatus(line.line) : "Good Service";
          const isDisrupted = lineStatus === "Severe Delays" || lineStatus === "Part Closure";
          
          return (
            <g key={`line-${index}`}>
              {/* Line shadow for depth */}
              <line
                x1={scaleX(sourceStation.x)}
                y1={scaleY(sourceStation.y) + 2}
                x2={scaleX(targetStation.x)}
                y2={scaleY(targetStation.y) + 2}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={4}
                strokeLinecap="round"
              />
              {/* Main line */}
              <line
                x1={scaleX(sourceStation.x)}
                y1={scaleY(sourceStation.y)}
                x2={scaleX(targetStation.x)}
                y2={scaleY(targetStation.y)}
                stroke={lineColor}
                strokeWidth={isDisrupted ? 3 : 4}
                strokeOpacity={isDisrupted ? 0.5 : 0.8}
                strokeDasharray={isDisrupted ? "8,4" : "none"}
                strokeLinecap="round"
                className="transition-all duration-300 hover:stroke-opacity-100"
              />
            </g>
          );
        })}
        
        {/* Render stations with enhanced styling */}
        {stations.map((station) => {
          const isSelected = selectedStation === station.id.toString();
          const isHovered = hoveredStation === station.id.toString();
          const passengerDensity = getPassengerDensity(station.id);
          
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
          
          // Check for disruptions
          const hasDisruption = stationLines.some(l => {
            if (!l.line) return false;
            const status = getLineStatus(l.line);
            return status === "Severe Delays" || status === "Part Closure";
          });
          
          const stationSize = isSelected ? 12 : isHovered ? 10 : 8;
          const densitySize = 4 + (passengerDensity * 6);
          
          return (
            <g 
              key={station.id}
              onClick={() => onStationSelect(station.id.toString())}
              onMouseEnter={() => setHoveredStation(station.id.toString())}
              onMouseLeave={() => setHoveredStation(null)}
              className="station-group cursor-pointer"
            >
              {/* Station shadow */}
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y) + 1}
                r={stationSize}
                fill="rgba(0,0,0,0.15)"
              />
              
              {/* Passenger density indicator */}
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={densitySize}
                fill={stationColor}
                opacity={0.3}
                className="animate-pulse"
              />
              
              {/* Main station circle */}
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={stationSize}
                fill={isSelected ? "#3B82F6" : stationColor}
                stroke="#FFFFFF"
                strokeWidth={3}
                filter={isSelected || isHovered ? "url(#stationGlow)" : "none"}
                className="transition-all duration-300"
              />
              
              {/* Disruption indicator */}
              {hasDisruption && (
                <circle
                  cx={scaleX(station.x)}
                  cy={scaleY(station.y)}
                  r={stationSize + 4}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="3,3"
                  className="animate-pulse"
                />
              )}
              
              {/* Station name with improved positioning */}
              <text
                x={scaleX(station.x)}
                y={scaleY(station.y) - stationSize - 8}
                textAnchor="middle"
                fontSize={isSelected || isHovered ? "13" : "11"}
                fontWeight={isSelected ? "600" : "500"}
                fill="currentColor"
                className="pointer-events-none transition-all duration-300 drop-shadow-sm"
                style={{ 
                  opacity: isSelected || isHovered ? 1 : 0.8,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {station.name}
              </text>
              
              {/* Passenger count indicator */}
              {(isSelected || isHovered) && (
                <text
                  x={scaleX(station.x)}
                  y={scaleY(station.y) + stationSize + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6B7280"
                  className="pointer-events-none"
                >
                  <tspan className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {Math.round(passengerDensity * 500)} passengers
                  </tspan>
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Enhanced status bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
        <div className="flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              London Underground • {stations.length} stations • Live Data
            </span>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Operational
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {londonUndergroundLines.slice(0, 6).map(line => (
              <div key={line.id} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: line.color }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-300">{line.name}</span>
              </div>
            ))}
            <span className="text-xs text-slate-500">+{londonUndergroundLines.length - 6} more</span>
          </div>
        </div>
      </div>
      
      {/* Service alerts */}
      {lineStatuses.some(status => status.status === "Severe Delays" || status.status === "Part Closure") && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Service Disruptions Active</span>
          </div>
          <p className="text-sm mt-1">Check individual lines for current service status</p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Selected Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 opacity-30" />
            <span>Passenger Density</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-red-500 border-dashed" />
            <span>Service Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndergroundMap3D;
