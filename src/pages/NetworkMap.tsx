
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UndergroundMap3D from '@/components/UndergroundMap3D';
import StationSelector from '@/components/StationSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StationMetrics from '@/components/StationMetrics';
import OfficerDashboard from '@/components/OfficerDashboard';
import RealTimeMonitoring from '@/components/RealTimeMonitoring';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, Clock, Shield, Activity, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cityMetroNetworks } from '@/data/cityData';

const NetworkMap = () => {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('map');
  
  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
  };

  const currentStation = selectedStation 
    ? cityMetroNetworks.london.stations.find(s => s.id.toString() === selectedStation)
    : null;

  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">London Underground Control Center</h1>
            <p className="text-muted-foreground">Professional command & control interface for metro operations</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700">OPERATIONAL</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>270 Stations</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Radio className="h-4 w-4" />
              <span>Live Feed</span>
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="command" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="command" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Command Center
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Network Map
            </TabsTrigger>
            <TabsTrigger value="station" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Station Details
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="command" className="mt-0">
              <OfficerDashboard />
            </TabsContent>
            
            <TabsContent value="monitoring" className="mt-0">
              <RealTimeMonitoring />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden border-2">
                    <CardHeader className="bg-slate-50 border-b p-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Interactive Network Map
                        <Badge variant="outline" className="ml-auto">
                          Real-time Data
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <UndergroundMap3D 
                        selectedStation={selectedStation} 
                        onStationSelect={handleStationSelect}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <Tabs defaultValue="stations" className="w-full">
                      <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Network Control</CardTitle>
                          <TabsList>
                            <TabsTrigger value="stations">Stations</TabsTrigger>
                            <TabsTrigger value="details">Analytics</TabsTrigger>
                          </TabsList>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <TabsContent value="stations" className="mt-0 pt-3">
                          <StationSelector 
                            selectedStation={selectedStation} 
                            onStationSelect={handleStationSelect}
                          />
                        </TabsContent>
                        <TabsContent value="details" className="mt-0 pt-3">
                          {currentStation ? (
                            <StationMetrics 
                              stationName={currentStation.name} 
                              metrics={{
                                currentPassengers: 245,
                                avgWaitTime: 3,
                                nextTrain: 2
                              }} 
                            />
                          ) : (
                            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                              Select a station to view real-time analytics
                            </div>
                          )}
                        </TabsContent>
                      </CardContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="station" className="mt-0">
              {currentStation ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StationMetrics 
                    stationName={currentStation.name} 
                    metrics={{
                      currentPassengers: 245,
                      avgWaitTime: 3,
                      nextTrain: 2
                    }} 
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Station Operations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600">Platform Status</div>
                            <div className="font-semibold">Operational</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-600">Accessibility</div>
                            <div className="font-semibold">Full Access</div>
                          </div>
                          <div className="p-3 bg-amber-50 rounded-lg">
                            <div className="text-sm text-amber-600">Security Level</div>
                            <div className="font-semibold">Normal</div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm text-purple-600">Staff Present</div>
                            <div className="font-semibold">3 Officers</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  Select a station from the map to view detailed information
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default NetworkMap;
