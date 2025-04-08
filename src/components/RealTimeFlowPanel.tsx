
import React from 'react';
import { cityRealTimeData, topMetroCities } from '@/data/cityData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface RealTimeFlowPanelProps {
  cityId: string;
}

const RealTimeFlowPanel: React.FC<RealTimeFlowPanelProps> = ({ cityId }) => {
  const city = topMetroCities.find(city => city.id === cityId);
  const data = cityRealTimeData[cityId as keyof typeof cityRealTimeData];
  
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
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Live</span>
        </Badge>
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
        {data.alerts.length > 0 && (
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
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Trending Impact Factors</span>
          </h3>
          <div className="space-y-1">
            {data.trendingFactors.map((factor, index) => (
              <div key={index} className="text-sm flex justify-between">
                <span>{factor.split('(')[0]}</span>
                <span className="text-muted-foreground">{factor.split('(')[1].replace(')', '')}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* City info */}
        <div className="text-sm">
          <h3 className="font-medium">About {city?.name} Metro</h3>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Lines:</div>
            <div className="font-medium">{city?.stats.lines}</div>
            <div>Stations:</div>
            <div className="font-medium">{city?.stats.stations}</div>
            <div>Network Length:</div>
            <div className="font-medium">{city?.stats.networkLength} km</div>
            <div>Daily Ridership:</div>
            <div className="font-medium">{city?.stats.dailyRidership}M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeFlowPanel;
