
import React, { useState } from 'react';
import StationMap from './StationMap';
import FlowVisualization from './FlowVisualization';
import DeepLearningArchitecture from './DeepLearningArchitecture';
import APIEndpoints from './APIEndpoints';
import FactorSelector from './FactorSelector';
import { stations } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { BarChart, BrainCircuit, Cpu, Database, Network } from 'lucide-react';

const Dashboard = () => {
  const [selectedStation, setSelectedStation] = useState<number | null>(1); // Default to Central Station
  const [date, setDate] = useState<Date>(new Date());
  
  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
  };
  
  const handleFactorChange = (factorId: string, value: string) => {
    console.log(`Factor ${factorId} changed to ${value}`);
    // In a real app, this would trigger a new prediction
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Metro Travel Flow Dashboard</h1>
          <p className="text-muted-foreground">
            Origin-to-Destination Flow Forecasting with LSTM, MGCN, and External Factor Attention
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <span>{date.toLocaleDateString()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button>Generate Forecast</Button>
        </div>
      </div>
      
      <Tabs defaultValue="flow" className="mb-6">
        <TabsList>
          <TabsTrigger value="flow" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            <span>Flow Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-1">
            <BrainCircuit className="h-4 w-4" />
            <span>Model Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-1">
            <Cpu className="h-4 w-4" />
            <span>API Endpoints</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="flow" className="pt-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-7">
              <div className="grid gap-6">
                <StationMap 
                  onStationSelect={handleStationSelect} 
                  selectedStation={selectedStation} 
                />
                <FlowVisualization />
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-5">
              <div className="grid gap-6">
                <div className="bg-card p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-4">Station Details</h2>
                  
                  {selectedStation ? (
                    <>
                      <h3 className="text-xl font-medium">
                        {stations.find(s => s.id === selectedStation)?.name}
                      </h3>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="bg-secondary/30 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Total Outflow</p>
                          <p className="font-semibold">1,245 passengers</p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Total Inflow</p>
                          <p className="font-semibold">1,078 passengers</p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Peak Hour</p>
                          <p className="font-semibold">08:00 - 09:00</p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
                          <p className="font-semibold">94.2%</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Busiest Routes</h4>
                        <div className="text-sm">
                          <div className="flex justify-between py-1 border-b">
                            <span>To East Junction</span>
                            <span className="font-medium">200 passengers</span>
                          </div>
                          <div className="flex justify-between py-1 border-b">
                            <span>To West Gateway</span>
                            <span className="font-medium">180 passengers</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>To South Plaza</span>
                            <span className="font-medium">150 passengers</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Select a station on the map to view details</p>
                  )}
                </div>
                
                <FactorSelector onFactorChange={handleFactorChange} />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="model" className="pt-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <DeepLearningArchitecture />
            </div>
            
            <div className="col-span-12 md:col-span-4">
              <div className="bg-card p-4 rounded-lg shadow-md h-full">
                <h2 className="text-lg font-semibold mb-4">Model Parameters</h2>
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-medium">LSTM Parameters</h3>
                    <p className="text-xs text-muted-foreground">Units: 64</p>
                    <p className="text-xs text-muted-foreground">Sequence Length: 24 hours</p>
                    <p className="text-xs text-muted-foreground">Dropout: 0.2</p>
                  </div>
                  <div className="border-b pb-2">
                    <h3 className="text-sm font-medium">MGCN Parameters</h3>
                    <p className="text-xs text-muted-foreground">Graph Layers: 2</p>
                    <p className="text-xs text-muted-foreground">Hidden Channels: 32</p>
                    <p className="text-xs text-muted-foreground">Edge Types: 3</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Attention Parameters</h3>
                    <p className="text-xs text-muted-foreground">Attention Heads: 4</p>
                    <p className="text-xs text-muted-foreground">Key Dimension: 16</p>
                    <p className="text-xs text-muted-foreground">External Factors: 4</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">External Factors</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Weather Conditions</span>
                      <span className="font-medium">High Impact</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Public Events</span>
                      <span className="font-medium">Medium Impact</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Time of Day</span>
                      <span className="font-medium">High Impact</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Day of Week</span>
                      <span className="font-medium">Medium Impact</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="pt-4">
          <APIEndpoints />
        </TabsContent>
        
        <TabsContent value="performance" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Model Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Mean Absolute Error</p>
                  <p className="text-2xl font-semibold">12.5</p>
                  <p className="text-xs text-muted-foreground mt-1">passengers</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Root Mean Square Error</p>
                  <p className="text-2xl font-semibold">18.2</p>
                  <p className="text-xs text-muted-foreground mt-1">passengers</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">R² Score</p>
                  <p className="text-2xl font-semibold">0.87</p>
                  <p className="text-xs text-muted-foreground mt-1">coefficient</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Mean Relative Error</p>
                  <p className="text-2xl font-semibold">5.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">percentage</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Performance by City</h3>
                <ChartContainer 
                  className="h-60"
                  config={{
                    london: { color: "#3B82F6" },
                    tokyo: { color: "#10B981" },
                    nyc: { color: "#F59E0B" },
                    beijing: { color: "#EF4444" }
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-sm">Model performance chart placeholder</p>
                  </div>
                </ChartContainer>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Training History</h2>
              <div className="h-[200px] bg-secondary/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Training loss graph visualization placeholder</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary/30 p-2 rounded-md">
                  <p className="text-xs text-muted-foreground">Epochs</p>
                  <p className="font-semibold">100</p>
                </div>
                <div className="bg-secondary/30 p-2 rounded-md">
                  <p className="text-xs text-muted-foreground">Batch Size</p>
                  <p className="font-semibold">64</p>
                </div>
                <div className="bg-secondary/30 p-2 rounded-md">
                  <p className="text-xs text-muted-foreground">Learning Rate</p>
                  <p className="font-semibold">0.001</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Ablation Studies</h3>
                <div className="space-y-2">
                  <div className="flex justify-between bg-secondary/20 p-2 rounded-md">
                    <span className="text-xs">Base LSTM only</span>
                    <span className="text-xs font-medium">MAE: 22.7</span>
                  </div>
                  <div className="flex justify-between bg-secondary/20 p-2 rounded-md">
                    <span className="text-xs">LSTM + MGCN</span>
                    <span className="text-xs font-medium">MAE: 16.3</span>
                  </div>
                  <div className="flex justify-between bg-secondary/20 p-2 rounded-md">
                    <span className="text-xs">LSTM + Attention</span>
                    <span className="text-xs font-medium">MAE: 15.8</span>
                  </div>
                  <div className="flex justify-between bg-primary/20 p-2 rounded-md font-medium">
                    <span className="text-xs">Full Model</span>
                    <span className="text-xs">MAE: 12.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
