
import { useState, useEffect } from 'react';
import { transportApi, TrainArrival } from '@/services/transportApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Train, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StationArrivalsProps {
  stationId: string | null;
  stationName: string | null;
}

const StationArrivals: React.FC<StationArrivalsProps> = ({ stationId, stationName }) => {
  const [arrivals, setArrivals] = useState<TrainArrival[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArrivals = async () => {
      if (!stationId) return;
      
      setIsLoading(true);
      setError(null);
      
      const response = await transportApi.getStationArrivals(stationId);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setArrivals(response.data);
      }
      
      setIsLoading(false);
    };
    
    fetchArrivals();
    
    // Refresh every 30 seconds
    const intervalId = setInterval(fetchArrivals, 30000);
    
    return () => clearInterval(intervalId);
  }, [stationId]);
  
  // Format arrival time to minutes from now
  const formatArrivalTime = (isoTime: string) => {
    const arrivalTime = new Date(isoTime);
    const now = new Date();
    
    const diffMs = arrivalTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) return 'Arriving';
    if (diffMins === 1) return '1 minute';
    return `${diffMins} minutes`;
  };
  
  if (!stationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Arrivals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a station to view arrivals</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Train className="h-5 w-5 text-primary" />
          Live Arrivals: {stationName || 'Selected Station'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        ) : arrivals.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No arrivals data available
          </div>
        ) : (
          <div className="space-y-2">
            {arrivals.map((arrival) => (
              <div
                key={arrival.id}
                className="flex justify-between items-center p-3 border rounded-md hover:bg-accent/10 transition-colors"
              >
                <div>
                  <div className="font-medium">{arrival.destination}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <span>{arrival.platformName}</span>
                    {arrival.currentLocation && (
                      <>
                        <span>•</span>
                        <span>{arrival.currentLocation}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={arrival.status === "Delayed" ? "destructive" : "outline"} className="flex gap-1 items-center">
                    <Clock className="h-3 w-3" />
                    <span>{formatArrivalTime(arrival.expectedArrival)}</span>
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground text-center pt-2">
              Last updated: {new Date().toLocaleTimeString()}
              <span className="ml-1 cursor-pointer underline" onClick={() => transportApi.getStationArrivals(stationId)}>
                Refresh
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StationArrivals;
