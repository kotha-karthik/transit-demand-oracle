
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UndergroundMap3D from '@/components/UndergroundMap3D';
import StationSelector from '@/components/StationSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StationMetrics from '@/components/StationMetrics';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, Clock } from 'lucide-react';
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
            <h1 className="text-2xl font-bold">London Underground Network</h1>
            <p className="text-muted-foreground">Interactive metro map with real-time data</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>270 Stations</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Live Data</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-card border-b p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  London Underground Map
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
                    <CardTitle className="text-lg">Explore</CardTitle>
                    <TabsList>
                      <TabsTrigger value="stations">Stations</TabsTrigger>
                      <TabsTrigger value="metrics">Details</TabsTrigger>
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
                  <TabsContent value="metrics" className="mt-0 pt-3">
                    {currentStation ? (
                      <StationMetrics stationId={selectedStation || ""} />
                    ) : (
                      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                        Select a station to view metrics
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NetworkMap;
