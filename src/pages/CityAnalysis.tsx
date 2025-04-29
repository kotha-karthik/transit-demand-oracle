
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UndergroundMap3D from '@/components/UndergroundMap3D';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import LondonMetroRoutes from '@/components/LondonMetroRoutes';
import StationSelector from '@/components/StationSelector';
import StationMetrics from '@/components/StationMetrics';
import StationArrivals from '@/components/StationArrivals';
import { cityRealTimeData, londonUndergroundLines, cityMetroNetworks } from '@/data/cityData';
import { transportApi } from '@/services/transportApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Train, Navigation, BarChart3, TrendingUp, BrainCircuit } from 'lucide-react';
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
  const [lineStatuses, setLineStatuses] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const londonData = cityRealTimeData["london"];
  
  useEffect(() => {
    const fetchLineStatuses = async () => {
      const response = await transportApi.getLineStatuses();
      if (response.data) {
        setLineStatuses(response.data);
      }
    };
    
    fetchLineStatuses();
  }, []);
  
  const handleRouteSelect = (route: RouteInfo) => {
    setSelectedRoute(route);
    setSelectedStation(null);
  };

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    setSelectedRoute(null);
  };

  const getStationName = (stationId: string | null) => {
    if (!stationId) return null;
    return cityMetroNetworks.london.stations.find(s => s.id.toString() === stationId)?.name || null;
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
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/forecasting')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Basic Forecasting</span>
              </Button>
              
              <Button 
                onClick={() => navigate('/advanced-forecasting')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Advanced Analytics</span>
              </Button>
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
                    <>
                      <StationMetrics
                        stationName={getStationName(selectedStation) || ""}
                        metrics={{
                          currentPassengers: Math.floor(Math.random() * 1000),
                          avgWaitTime: Math.floor(Math.random() * 10),
                          nextTrain: Math.floor(Math.random() * 5),
                        }}
                      />
                      <StationArrivals 
                        stationId={selectedStation} 
                        stationName={getStationName(selectedStation)}
                      />
                    </>
                  )}
                  {!selectedStation && (
                    <LondonMetroRoutes onRouteSelect={handleRouteSelect} />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lines">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {londonUndergroundLines.map(line => {
                  const lineStatus = lineStatuses.find(s => s.id === line.id) || { 
                    status: "Unknown", 
                    description: "Status information unavailable" 
                  };
                  
                  return (
                    <div key={line.id} className="border rounded-md overflow-hidden">
                      <div 
                        className="p-3 text-white font-medium flex justify-between items-center" 
                        style={{ backgroundColor: line.color }}
                      >
                        <span>{line.name}</span>
                        <Badge className={`text-xs ${
                          lineStatus.status === "Good Service" ? "bg-green-500" :
                          lineStatus.status === "Minor Delays" ? "bg-amber-500" : 
                          "bg-red-500"
                        } text-white`}>
                          {lineStatus.status}
                        </Badge>
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
                          {lineStatus.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="stations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityMetroNetworks.london.stations.map(station => {
                  const stationLines = cityMetroNetworks.london.lines
                    .filter(l => l.source === station.id || l.target === station.id)
                    .map(l => l.line)
                    .filter((value, index, self) => value !== undefined && self.indexOf(value) === index) as string[];
                  
                  return (
                    <div 
                      key={station.id} 
                      className={`border p-4 rounded-md cursor-pointer transition-all ${
                        selectedStation === station.id.toString() ? 'bg-primary/10 border-primary/30' : 'hover:bg-accent/10'
                      }`}
                      onClick={() => handleStationSelect(station.id.toString())}
                    >
                      <h3 className="font-medium">{station.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stationLines.map(lineId => (
                          <LineBadge key={lineId} lineId={lineId} small />
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Tap to view station details
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span>London Underground Passenger Flow</span>
                </h2>
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
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Passenger flow visualization</p>
                      <Button 
                        onClick={() => navigate('/advanced-forecasting')}
                        variant="outline"
                        size="sm"
                      >
                        View Detailed Analysis
                      </Button>
                    </div>
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
          <p className="text-xs mt-1">Data Source: Transport for London API</p>
        </div>
      </footer>
    </div>
  );
};

export default LondonUndergroundAnalysis;
