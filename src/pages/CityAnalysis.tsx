import React, { useState } from 'react';
import Header from '@/components/Header';
import UndergroundMap3D from '@/components/UndergroundMap3D';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import LondonMetroRoutes from '@/components/LondonMetroRoutes';
import StationSelector from '@/components/StationSelector';
import StationMetrics from '@/components/StationMetrics';
import DeepLearningArchitecture from '@/components/DeepLearningArchitecture';
import { cityRealTimeData, londonUndergroundLines, cityMetroNetworks } from '@/data/cityData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MapPin, Train } from 'lucide-react';
import LineBadge from '@/components/LineBadge';

interface RouteInfo {
  origin: string;
  destination: string;
  line: string;
  estimatedTime: string;
  passengerLoad: string;
  prediction: string;
}

const LondonUndergroundAnalysis = () => {
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const londonData = cityRealTimeData["london"];
  
  const handleRouteSelect = (route: RouteInfo) => {
    setSelectedRoute(route);
    setSelectedStation(null);
  };

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    setSelectedRoute(null);
  };

  const mockMetrics = {
    currentPassengers: Math.floor(Math.random() * 1000),
    avgWaitTime: Math.floor(Math.random() * 10),
    nextTrain: Math.floor(Math.random() * 5),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">London Underground Analysis</h1>
              <p className="text-muted-foreground">
                Real-time forecasting for London Underground network
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              <span className="font-medium">Transport for London</span>
            </div>
          </div>
          
          {selectedRoute && (
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center gap-2">
                Analyzing route: <span className="font-medium">{selectedRoute.origin} → {selectedRoute.destination}</span>
                <LineBadge lineId={selectedRoute.line} />
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="network" className="mb-6">
            <TabsList>
              <TabsTrigger value="network">Network Map</TabsTrigger>
              <TabsTrigger value="lines">Underground Lines</TabsTrigger>
              <TabsTrigger value="stations">Stations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <UndergroundMap3D 
                    selectedStation={selectedStation}
                    onStationSelect={handleStationSelect}
                  />
                </div>
                <div className="space-y-6">
                  <StationSelector
                    selectedStation={selectedStation}
                    onStationSelect={handleStationSelect}
                  />
                  {selectedStation && (
                    <StationMetrics
                      stationName={cityMetroNetworks.london.stations.find(s => s.id.toString() === selectedStation)?.name || ""}
                      metrics={mockMetrics}
                    />
                  )}
                  <LondonMetroRoutes onRouteSelect={handleRouteSelect} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lines">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {londonUndergroundLines.map(line => (
                  <div key={line.id} className="border rounded-md overflow-hidden">
                    <div 
                      className="p-3 text-white font-medium flex justify-between items-center" 
                      style={{ backgroundColor: line.color }}
                    >
                      <span>{line.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">
                        {cityRealTimeData.london?.lineStatuses?.find(l => l.line === line.id)?.status || "Unknown"}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-xs text-muted-foreground">Current Load</div>
                          <div className="font-medium">
                            {["Low", "Medium", "High"][Math.floor(Math.random() * 3)]}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-md text-center">
                          <div className="text-xs text-muted-foreground">Prediction</div>
                          <div className="font-medium">
                            {["Increasing", "Stable", "Decreasing"][Math.floor(Math.random() * 3)]}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {line.id === "central" ? 
                          "Partial closure between Liverpool Street and Holborn" : 
                          line.id === "northern" ? 
                          "Planned engineering works between Camden Town and Kennington" :
                          line.id === "victoria" ?
                          "Minor delays due to earlier signal failure at Victoria" :
                          "Good service on all stations"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="model">
              <DeepLearningArchitecture />
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">London Underground Passenger Flow</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Daily Passengers</p>
                      <p className="text-xl font-bold">{londonData?.currentPassengerLoad}M</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Peak Hour Load</p>
                      <p className="text-xl font-bold">450K</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Active Trains</p>
                      <p className="text-xl font-bold">89</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                      <p className="text-xl font-bold">3.5m</p>
                    </div>
                  </div>
                  
                  <div className="h-60 bg-muted/20 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Passenger flow visualization</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Busiest Stations</h3>
                      <div className="space-y-2">
                        {['King\'s Cross', 'Victoria', 'Liverpool Street'].map((station, i) => (
                          <div key={station} className="flex justify-between items-center">
                            <span className="text-sm">{station}</span>
                            <Badge variant="secondary">{120 - i * 20}K/hour</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Peak Hours</h3>
                      <div className="space-y-2">
                        {['08:00 - 09:30', '17:30 - 19:00'].map((time, i) => (
                          <div key={time} className="flex justify-between items-center">
                            <span className="text-sm">{time}</span>
                            <Badge variant="secondary">{i === 0 ? 'Morning' : 'Evening'}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <RealTimeFlowPanel 
                cityId="london" 
                routeInfo={selectedRoute ?? undefined}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-primary/5 py-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>London Underground Passenger Flow Forecasting System</p>
          <p className="text-xs mt-1">Data Source: Transport for London Open Data</p>
        </div>
      </footer>
    </div>
  );
};

export default LondonUndergroundAnalysis;
