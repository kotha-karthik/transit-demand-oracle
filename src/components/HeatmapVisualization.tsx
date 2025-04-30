
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const HeatmapVisualization = () => {
  const [timeOfDay, setTimeOfDay] = useState('8');
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // This would be a placeholder for a real map visualization
  // In a real implementation, you would use a mapping library like Mapbox, Leaflet, etc.
  const getHeatmapIntensity = (hour: number) => {
    // Morning rush 7-9, evening rush 17-19
    if (hour >= 7 && hour <= 9) return 0.8 + Math.random() * 0.2;
    if (hour >= 17 && hour <= 19) return 0.7 + Math.random() * 0.3;
    if (hour >= 10 && hour <= 16) return 0.3 + Math.random() * 0.3;
    return 0.1 + Math.random() * 0.2;
  };

  // Generate station dots with dynamic opacity based on time
  const stationDots = Array.from({ length: 50 }, (_, i) => {
    const intensity = getHeatmapIntensity(Number(timeOfDay));
    const randomizer = Math.random() * 0.5;
    const opacity = Math.max(0.1, Math.min(0.9, intensity - randomizer));
    
    return {
      id: i,
      size: 10 + Math.random() * 20,
      opacity,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
    };
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg">Passenger Density Heatmap</CardTitle>
            <CardDescription>Visualize congestion across the network</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Time: {timeOfDay}:00</div>
          <Slider
            value={[Number(timeOfDay)]}
            min={0}
            max={23}
            step={1}
            onValueChange={(value) => setTimeOfDay(value[0].toString())}
          />
        </div>
        
        <div className="relative h-[400px] border rounded-md bg-secondary/10 overflow-hidden">
          {/* Simplified network visualization */}
          <svg 
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Draw simplified metro lines */}
            <path d="M10,50 H90" stroke="#DC241F" strokeWidth="1.5" fill="none" />
            <path d="M20,20 V80" stroke="#0019A8" strokeWidth="1.5" fill="none" />
            <path d="M80,20 V80" stroke="#9B0056" strokeWidth="1.5" fill="none" />
            <path d="M20,20 L80,80" stroke="#007229" strokeWidth="1.5" fill="none" />
            <path d="M20,80 L80,20" stroke="#F3A9BB" strokeWidth="1.5" fill="none" />
            
            {/* Draw station dots with dynamic opacity based on congestion */}
            {stationDots.map(dot => (
              <circle
                key={dot.id}
                cx={`${dot.x}%`}
                cy={`${dot.y}%`}
                r={dot.size / 10}
                fill="red"
                opacity={dot.opacity}
                stroke="#fff"
                strokeWidth="0.5"
              />
            ))}
          </svg>
          
          {/* Color legend */}
          <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/80 p-2 rounded-md text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              <span>Passenger density</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>The heatmap shows real-time passenger density across the network. Red areas indicate high congestion, while green areas are less crowded.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapVisualization;
