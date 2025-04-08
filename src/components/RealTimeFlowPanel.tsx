
import React from 'react';
import { cityRealTimeData, topMetroCities } from '@/data/cityData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RealTimeFlowPanelProps {
  cityId: string;
}

const RealTimeFlowPanel: React.FC<RealTimeFlowPanelProps> = ({ cityId }) => {
  const city = topMetroCities.find(city => city.id === cityId);
  
  // Check if cityRealTimeData[cityId] exists before accessing it
  const data = cityId in cityRealTimeData 
    ? cityRealTimeData[cityId as keyof typeof cityRealTimeData]
    : null;
  
  if (!data) {
    return (
      <div className="bg-card p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Real-Time Flow Data</h2>
        <div className="text-muted-foreground">
          No real-time data available for this city
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card p-4 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Real-Time Flow Data</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Live</span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Model accuracy: {city?.modelAccuracy}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Current stats */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/30 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Current Load</p>
              <p className="text-xl font-semibold">{data.currentPassengerLoad}M</p>
              <p className="text-xs text-muted-foreground mt-1">passengers</p>
            </div>
            <div className="bg-secondary/30 p-3 rounded-md">
              <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
              <p className="text-xl font-semibold">{data.forecastAccuracy}%</p>
              <p className="text-xs text-muted-foreground mt-1">last 24 hours</p>
            </div>
          </div>
        </div>
        
        {/* Critical stations */}
        <div>
          <h3 className="text-sm font-medium mb-2">Critical Stations</h3>
          <div className="space-y-2">
            {data.criticalStations.map((station, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-accent/10 rounded-md">
                <div>
                  <p className="font-medium">{station.name}</p>
                  <p className="text-xs text-muted-foreground">Load: {station.load}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={
                    station.prediction === "Increasing" ? "destructive" :
                    station.prediction === "Decreasing" ? "secondary" : "outline"
                  }>
                    {station.prediction}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Current Alerts</h3>
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
        
        {/* Trending factors */}
        {data.trendingFactors && data.trendingFactors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trending Impact Factors</span>
            </h3>
            <div className="space-y-1">
              {data.trendingFactors.map((factor, index) => {
                const parts = factor.split('(');
                const label = parts[0] || '';
                const value = parts.length > 1 ? parts[1].replace(')', '') : '';
                return (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{label}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <Separator />
        
        {/* City info */}
        <div className="text-sm">
          <h3 className="font-medium">About {city?.name} Metro</h3>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Lines:</div>
            <div className="font-medium">{city?.stats?.lines || 'N/A'}</div>
            <div>Stations:</div>
            <div className="font-medium">{city?.stats?.stations || 'N/A'}</div>
            <div>Network Length:</div>
            <div className="font-medium">{city?.stats?.networkLength ? `${city.stats.networkLength} km` : 'N/A'}</div>
            <div>Daily Ridership:</div>
            <div className="font-medium">{city?.stats?.dailyRidership ? `${city.stats.dailyRidership}M` : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeFlowPanel;
