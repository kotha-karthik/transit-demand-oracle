
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from 'lucide-react';
import { cityMetroNetworks } from '@/data/cityData';

interface StationSelectorProps {
  selectedStation: string | null;
  onStationSelect: (stationId: string) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({ selectedStation, onStationSelect }) => {
  const londonStations = cityMetroNetworks.london.stations;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Station List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {londonStations.map((station) => (
              <Button
                key={station.id}
                variant={selectedStation === station.id.toString() ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => onStationSelect(station.id.toString())}
              >
                <MapPin className="h-4 w-4" />
                <span className="flex-1 text-left">{station.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {Math.floor(Math.random() * 1000)} pax/h
                </Badge>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StationSelector;
