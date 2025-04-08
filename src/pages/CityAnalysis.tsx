
import React, { useState } from 'react';
import Header from '@/components/Header';
import CitySelector from '@/components/CitySelector';
import CityMetroNetwork from '@/components/CityMetroNetwork';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import { topMetroCities } from '@/data/cityData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeepLearningArchitecture from '@/components/DeepLearningArchitecture';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const CityAnalysis = () => {
  // Default to London Metro
  const londonCity = topMetroCities.find(city => city.id === "london") || topMetroCities[0];
  const [selectedCity, setSelectedCity] = useState(londonCity.id);
  
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
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
          
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              This demonstration focuses on the London Metro system, showcasing our deep learning model's ability to predict passenger flows and station loads.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="network" className="mb-6">
            <TabsList>
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="model">Model Architecture</TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CityMetroNetwork cityId={selectedCity} />
                </div>
                <div>
                  <RealTimeFlowPanel cityId={selectedCity} />
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
