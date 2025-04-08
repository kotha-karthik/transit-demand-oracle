
import React, { useState } from 'react';
import Header from '@/components/Header';
import CitySelector from '@/components/CitySelector';
import CityMetroNetwork from '@/components/CityMetroNetwork';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import { topMetroCities } from '@/data/cityData';

const CityAnalysis = () => {
  const [selectedCity, setSelectedCity] = useState(topMetroCities[0].id);
  
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CityMetroNetwork cityId={selectedCity} />
            </div>
            <div>
              <RealTimeFlowPanel cityId={selectedCity} />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-primary/5 py-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Metro Travel Flow Forecasting System - LSTM with Multigraph Convolution and External Factor Attention</p>
        </div>
      </footer>
    </div>
  );
};

export default CityAnalysis;
