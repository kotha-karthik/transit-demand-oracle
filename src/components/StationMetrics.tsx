
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Navigation } from 'lucide-react';

interface StationMetricsProps {
  stationName: string;
  metrics: {
    currentPassengers: number;
    avgWaitTime: number;
    nextTrain: number;
  };
}

const StationMetrics: React.FC<StationMetricsProps> = ({ stationName, metrics }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Real-time Metrics: {stationName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/20 rounded-lg text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{metrics.currentPassengers}</div>
            <div className="text-sm text-muted-foreground">Current Passengers</div>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{metrics.avgWaitTime}m</div>
            <div className="text-sm text-muted-foreground">Avg Wait Time</div>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg text-center">
            <Navigation className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{metrics.nextTrain}m</div>
            <div className="text-sm text-muted-foreground">Next Train</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationMetrics;
