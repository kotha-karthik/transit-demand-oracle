
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Train, Route, Map, BarChart } from 'lucide-react';

// London Metro (Underground) lines
const londonLines = [
  { id: 'bakerloo', name: 'Bakerloo Line', color: 'bg-[#B36305]', stations: ['Elephant & Castle', 'Lambeth North', 'Waterloo', 'Embankment', 'Charing Cross', 'Piccadilly Circus'] },
  { id: 'central', name: 'Central Line', color: 'bg-[#E32017]', stations: ['Liverpool Street', 'Bank', 'St. Paul\'s', 'Chancery Lane', 'Holborn', 'Tottenham Court Road'] },
  { id: 'circle', name: 'Circle Line', color: 'bg-[#FFD300]', stations: ['King\'s Cross', 'Farringdon', 'Barbican', 'Moorgate', 'Liverpool Street', 'Tower Hill'] },
  { id: 'district', name: 'District Line', color: 'bg-[#00782A]', stations: ['Victoria', 'Westminster', 'Embankment', 'Temple', 'Blackfriars', 'Mansion House'] },
  { id: 'jubilee', name: 'Jubilee Line', color: 'bg-[#A0A5A9]', stations: ['Westminster', 'Green Park', 'Bond Street', 'Baker Street', 'St. John\'s Wood', 'Swiss Cottage'] },
  { id: 'northern', name: 'Northern Line', color: 'bg-[#000000]', stations: ['King\'s Cross', 'Angel', 'Old Street', 'Moorgate', 'Bank', 'London Bridge'] },
  { id: 'piccadilly', name: 'Piccadilly Line', color: 'bg-[#003688]', stations: ['King\'s Cross', 'Russell Square', 'Holborn', 'Covent Garden', 'Leicester Square', 'Piccadilly Circus'] },
  { id: 'victoria', name: 'Victoria Line', color: 'bg-[#0098D4]', stations: ['King\'s Cross', 'Euston', 'Warren Street', 'Oxford Circus', 'Green Park', 'Victoria'] },
];

interface Route {
  origin: string;
  destination: string;
  line: string;
  estimatedTime: string;
  passengerLoad: string;
  prediction: string;
}

interface LondonMetroRoutesProps {
  onRouteSelect: (route: Route) => void;
}

const LondonMetroRoutes: React.FC<LondonMetroRoutesProps> = ({ onRouteSelect }) => {
  const [selectedLine, setSelectedLine] = useState<string>("northern");
  const [originStation, setOriginStation] = useState<string>("");
  const [destinationStation, setDestinationStation] = useState<string>("");
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([
    {
      origin: "King's Cross",
      destination: "Bank",
      line: "northern",
      estimatedTime: "12 mins",
      passengerLoad: "High",
      prediction: "Increasing"
    },
    {
      origin: "Oxford Circus",
      destination: "Victoria",
      line: "victoria",
      estimatedTime: "8 mins",
      passengerLoad: "Medium",
      prediction: "Stable"
    }
  ]);

  const currentLine = londonLines.find(line => line.id === selectedLine) || londonLines[0];
  
  const handleSelectRoute = () => {
    if (!originStation || !destinationStation) return;
    
    const newRoute: Route = {
      origin: originStation,
      destination: destinationStation,
      line: selectedLine,
      estimatedTime: `${Math.floor(Math.random() * 15) + 5} mins`,
      passengerLoad: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
      prediction: ["Increasing", "Decreasing", "Stable"][Math.floor(Math.random() * 3)]
    };
    
    onRouteSelect(newRoute);
    setRecentRoutes(prev => [newRoute, ...prev.slice(0, 2)]);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="h-5 w-5" />
          <span>London Underground Routes</span>
        </CardTitle>
        <CardDescription>Select metro line and stations to analyze passenger flow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Select Line</label>
            <Select value={selectedLine} onValueChange={setSelectedLine}>
              <SelectTrigger>
                <SelectValue placeholder="Select a line" />
              </SelectTrigger>
              <SelectContent>
                {londonLines.map(line => (
                  <SelectItem key={line.id} value={line.id} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${line.color}`}></div>
                      <span>{line.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Origin Station</label>
              <Select value={originStation} onValueChange={setOriginStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {currentLine.stations.map(station => (
                    <SelectItem key={station} value={station}>{station}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Destination Station</label>
              <Select value={destinationStation} onValueChange={setDestinationStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {currentLine.stations
                    .filter(s => s !== originStation)
                    .map(station => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSelectRoute} 
            className="w-full" 
            disabled={!originStation || !destinationStation}
          >
            <Route className="mr-2 h-4 w-4" />
            Analyze Route
          </Button>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Recent Analyzed Routes</h3>
            <div className="space-y-2">
              {recentRoutes.map((route, index) => {
                const lineName = londonLines.find(l => l.id === route.line)?.name || "";
                const lineColor = londonLines.find(l => l.id === route.line)?.color || "bg-gray-500";
                
                return (
                  <div 
                    key={index} 
                    className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                    onClick={() => onRouteSelect(route)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="font-medium">{route.origin} → {route.destination}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className={`w-2 h-2 rounded-full ${lineColor}`}></div>
                          <span>{lineName}</span>
                        </div>
                      </div>
                      <Badge variant={
                        route.passengerLoad === "High" ? "destructive" : 
                        route.passengerLoad === "Medium" ? "warning" : 
                        "outline"
                      }>
                        {route.passengerLoad}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{route.estimatedTime}</span>
                      </div>
                      <div>
                        Trend: {route.prediction}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LondonMetroRoutes;
