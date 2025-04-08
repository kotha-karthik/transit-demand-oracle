
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CitySelector from '@/components/CitySelector';
import CityMetroNetwork from '@/components/CityMetroNetwork';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import LondonMetroRoutes from '@/components/LondonMetroRoutes';
import { topMetroCities } from '@/data/cityData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeepLearningArchitecture from '@/components/DeepLearningArchitecture';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, MapPin } from 'lucide-react';

interface RouteInfo {
  origin: string;
  destination: string;
  line: string;
  estimatedTime: string;
  passengerLoad: string;
  prediction: string;
}

const CityAnalysis = () => {
  // Default to London Metro
  const londonCity = topMetroCities.find(city => city.id === "london") || topMetroCities[0];
  const [selectedCity, setSelectedCity] = useState(londonCity.id);
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  
  // Force London as the selected city when the component loads
  useEffect(() => {
    setSelectedCity("london");
  }, []);
  
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    // Reset selected route when changing cities
    setSelectedRoute(null);
  };
  
  const handleRouteSelect = (route: RouteInfo) => {
    setSelectedRoute(route);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">City Metro Analysis</h1>
              <p className="text-muted-foreground">
                Real-time forecasting for major metro systems around the world
              </p>
            </div>
            
            <CitySelector 
              cities={topMetroCities} 
              selectedCity={selectedCity} 
              onCityChange={handleCityChange} 
            />
          </div>
          
          {selectedCity !== "london" && (
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                For detailed route analysis and real-time flow forecasting, please select the London Metro system.
              </AlertDescription>
            </Alert>
          )}
          
          {selectedCity === "london" && selectedRoute && (
            <Alert className="mb-6 bg-primary/5 border-primary/20">
              <MapPin className="h-4 w-4 text-primary" />
              <AlertDescription>
                Analyzing route: <span className="font-medium">{selectedRoute.origin} → {selectedRoute.destination}</span> on the {
                  {
                    'bakerloo': 'Bakerloo Line',
                    'central': 'Central Line',
                    'circle': 'Circle Line',
                    'district': 'District Line',
                    'jubilee': 'Jubilee Line',
                    'northern': 'Northern Line',
                    'piccadilly': 'Piccadilly Line',
                    'victoria': 'Victoria Line',
                  }[selectedRoute.line] || 'London Underground'
                }
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="network" className="mb-6">
            <TabsList>
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="model">Model Architecture</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {selectedCity === "london" && (
                  <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <CityMetroNetwork 
                        cityId={selectedCity} 
                        selectedRoute={selectedRoute ? {
                          origin: selectedRoute.origin,
                          destination: selectedRoute.destination,
                          line: selectedRoute.line
                        } : undefined}
                      />
                    </div>
                    <div>
                      <LondonMetroRoutes onRouteSelect={handleRouteSelect} />
                    </div>
                  </div>
                )}
                
                <div className={selectedCity === "london" ? "lg:col-span-2" : "lg:col-span-2"}>
                  <CityMetroNetwork cityId={selectedCity} />
                </div>
                <div>
                  <RealTimeFlowPanel 
                    cityId={selectedCity} 
                    routeInfo={selectedRoute ?? undefined}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="model">
              <DeepLearningArchitecture />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="bg-primary/5 py-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Metro Travel Flow Forecasting System - LSTM with Multigraph Convolution and External Factor Attention</p>
          <p className="text-xs mt-1">London Underground Data Source: Transport for London Open Data</p>
        </div>
      </footer>
    </div>
  );
};

export default CityAnalysis;
