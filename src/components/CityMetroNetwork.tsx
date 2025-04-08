import React, { useState, useEffect } from 'react';
import { cityMetroNetworks, topMetroCities, londonUndergroundLines } from '@/data/cityData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Train, Map, Info } from 'lucide-react';

interface CityMetroNetworkProps {
  cityId: string;
  selectedRoute?: {
    origin: string;
    destination: string;
    line: string;
  };
}

const CityMetroNetwork: React.FC<CityMetroNetworkProps> = ({ cityId, selectedRoute }) => {
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'lines'>('network');
  
  const city = topMetroCities.find(city => city.id === cityId);
  const network = cityMetroNetworks[cityId as keyof typeof cityMetroNetworks];
  
  useEffect(() => {
    setSelectedStation(null);
  }, [cityId]);
  
  useEffect(() => {
    if (selectedRoute) {
      const originStation = network?.stations.find(s => s.name === selectedRoute.origin);
      if (originStation) {
        setSelectedStation(originStation.id);
      }
    }
  }, [selectedRoute, network]);
  
  const mapWidth = 600;
  const mapHeight = 400;
  const stationRadius = 8;
  
  const scaleX = (x: number) => (x / 100) * mapWidth;
  const scaleY = (y: number) => (y / 100) * mapHeight;
  
  if (!network?.stations?.length) {
    return (
      <Card className="shadow-md h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            {city?.name} Metro Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-10">
            <p className="mb-4">Network data is currently being processed for this city.</p>
            <p>Please select another city or check back later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getFlowLines = () => {
    if (!selectedStation && !selectedRoute) return [];
    
    let filteredLines = network.lines;
    
    if (selectedRoute) {
      filteredLines = filteredLines.filter(line => 
        line.line === selectedRoute.line
      );
    } 
    else if (selectedStation) {
      filteredLines = filteredLines.filter(line => 
        line.source === selectedStation || line.target === selectedStation
      );
    }
    
    return filteredLines.map(flow => {
      const origin = network.stations.find(s => s.id === flow.source);
      const destination = network.stations.find(s => s.id === flow.target);
      
      if (!origin || !destination) return null;
      
      const maxVolume = Math.max(...network.lines.map(f => f.volume));
      const strokeWidth = 1 + (flow.volume / maxVolume) * 5;
      
      const lineColor = flow.line && cityId === 'london' 
        ? londonUndergroundLines.find(l => l.id === flow.line)?.color || "#94A3B8" 
        : flow.predictedVolume > flow.volume ? "#3B82F6" : "#10B981";
      
      return {
        x1: scaleX(origin.x),
        y1: scaleY(origin.y),
        x2: scaleX(destination.x),
        y2: scaleY(destination.y),
        strokeWidth,
        volume: flow.volume,
        predictedVolume: flow.predictedVolume,
        color: lineColor,
        line: flow.line
      };
    }).filter(Boolean);
  };
  
  const flowLines = getFlowLines();
  
  const stationsByLine = cityId === 'london' 
    ? londonUndergroundLines.map(line => {
        const stationsOnLine = network.lines
          .filter(l => l.line === line.id)
          .flatMap(l => [l.source, l.target])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(id => network.stations.find(s => s.id === id))
          .filter(Boolean);
          
        return {
          ...line,
          stations: stationsOnLine
        };
      })
    : [];
  
  const networkView = (
    <div className="relative">
      <svg width="100%" height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="border border-border rounded-md bg-secondary/20">
        {flowLines.map((line, index) => (
          <line
            key={index}
            x1={line?.x1}
            y1={line?.y1}
            x2={line?.x2}
            y2={line?.y2}
            stroke={line?.color}
            strokeWidth={line?.strokeWidth}
            strokeOpacity={0.6}
            className="flow-path"
          />
        ))}
        
        {network.stations.map(station => {
          const isOnSelectedRoute = selectedRoute && 
            (station.name === selectedRoute.origin || station.name === selectedRoute.destination);
          
          return (
            <g key={station.id}>
              <circle
                cx={scaleX(station.x)}
                cy={scaleY(station.y)}
                r={stationRadius}
                fill={isOnSelectedRoute ? "#F43F5E" : 
                      station.id === selectedStation 
                        ? "#3B82F6" 
                        : station.id === hoveredStation 
                          ? "#60A5FA" 
                          : "#94A3B8"}
                stroke="#1E293B"
                strokeWidth={1}
                className="station-node"
                onClick={() => setSelectedStation(station.id)}
                onMouseEnter={() => setHoveredStation(station.id)}
                onMouseLeave={() => setHoveredStation(null)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={scaleX(station.x)}
                y={scaleY(station.y) - stationRadius - 3}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
              >
                {station.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-md text-xs">
        {cityId === 'london' && viewMode === 'network' ? (
          <div className="space-y-1">
            {londonUndergroundLines.slice(0, 6).map(line => (
              <div key={line.id} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: line.color }}></div>
                <span>{line.name}</span>
              </div>
            ))}
            <div className="text-muted-foreground italic">+ 5 more lines</div>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#10B981] mr-1"></div>
              <span>Actual Flow</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-1"></div>
              <span>Predicted Flow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const linesView = cityId === 'london' ? (
    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
      {stationsByLine.map(line => (
        <div key={line.id} className="border rounded-md overflow-hidden">
          <div 
            className="p-2 text-white font-medium flex justify-between items-center" 
            style={{ backgroundColor: line.color }}
          >
            <span>{line.name}</span>
            <Badge variant="outline" className="text-white border-white/50">
              {line.stations?.length || 0} stations
            </Badge>
          </div>
          <div className="p-2 text-sm">
            {line.stations?.map((station: any, i: number) => (
              <div key={station.id} className="flex items-center py-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mr-2"></div>
                <span>{station.name}</span>
              </div>
            ))}
            {(!line.stations || line.stations.length === 0) && (
              <div className="text-muted-foreground italic py-1">No station data available</div>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-10 text-muted-foreground">
      <p>Line data is only available for London Metro.</p>
      <p>Please select London to view detailed line information.</p>
    </div>
  );
  
  const infoPanel = (
    <div className="mt-4">
      {selectedStation ? (
        <div className="text-sm">
          <p>Selected: {network.stations.find(s => s.id === selectedStation)?.name}</p>
          <p className="text-muted-foreground">Click another station to view flows</p>
        </div>
      ) : selectedRoute ? (
        <Alert className="bg-primary/5 border-primary/20">
          <div className="flex gap-2 items-center">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Showing route: <span className="font-medium">{selectedRoute.origin} → {selectedRoute.destination}</span>
            </AlertDescription>
          </div>
        </Alert>
      ) : (
        <p className="text-sm text-muted-foreground">
          Click on a station to view its connections or select a route for analysis
        </p>
      )}
    </div>
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="h-5 w-5" />
          {city?.name} Metro Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cityId === 'london' ? (
          <Tabs defaultValue="network" value={viewMode} onValueChange={(v) => setViewMode(v as 'network' | 'lines')}>
            <TabsList className="mb-4">
              <TabsTrigger value="network">Network Map</TabsTrigger>
              <TabsTrigger value="lines">Metro Lines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              {networkView}
              {infoPanel}
            </TabsContent>
            
            <TabsContent value="lines">
              {linesView}
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {networkView}
            {infoPanel}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CityMetroNetwork;
