
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Thermometer, Umbrella, Wind, Sun, CloudRain } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';

interface WeatherData {
  day: string;
  temperature: number;
  condition: WeatherCondition;
  impact: number;
  passengers: number;
}

const mockWeatherData: WeatherData[] = [
  { day: 'Mon', temperature: 18, condition: 'sunny', impact: 2, passengers: 4200 },
  { day: 'Tue', temperature: 16, condition: 'cloudy', impact: 0, passengers: 4300 },
  { day: 'Wed', temperature: 14, condition: 'rainy', impact: -10, passengers: 3870 },
  { day: 'Thu', temperature: 12, condition: 'rainy', impact: -15, passengers: 3655 },
  { day: 'Fri', temperature: 15, condition: 'cloudy', impact: -5, passengers: 4085 },
  { day: 'Sat', temperature: 17, condition: 'sunny', impact: 5, passengers: 3200 },
  { day: 'Sun', temperature: 19, condition: 'sunny', impact: 8, passengers: 2900 },
];

const getWeatherIcon = (condition: WeatherCondition) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="w-5 h-5 text-amber-500" />;
    case 'rainy':
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    case 'stormy':
      return <CloudRain className="w-5 h-5 text-indigo-700" />;
    case 'cloudy':
      return <Cloud className="w-5 h-5 text-gray-400" />;
    case 'snowy':
      return <CloudSnow className="w-5 h-5 text-blue-300" />;
    default:
      return <Sun className="w-5 h-5 text-amber-500" />;
  }
};

// Importing missing icons
import { Cloud, CloudSnow } from 'lucide-react';

const WeatherImpactPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-500" />
          Weather Impact Analysis
        </CardTitle>
        <CardDescription>How weather conditions affect passenger volumes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-secondary/20 p-2 rounded-lg text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-500" />
              <div className="text-sm font-medium">Temperature</div>
              <div className="text-xl font-medium">16°C</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="bg-secondary/20 p-2 rounded-lg text-center">
              <Umbrella className="w-5 h-5 mx-auto mb-1 text-blue-500" />
              <div className="text-sm font-medium">Precipitation</div>
              <div className="text-xl font-medium">30%</div>
              <div className="text-xs text-muted-foreground">Chance</div>
            </div>
            <div className="bg-secondary/20 p-2 rounded-lg text-center">
              <Wind className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-sm font-medium">Wind</div>
              <div className="text-xl font-medium">12km/h</div>
              <div className="text-xs text-muted-foreground">North-West</div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Weekly Weather Impact on Passenger Flow</h3>
            <ChartContainer 
              className="h-64" 
              config={{
                passengers: { color: "#3B82F6" },
                temperature: { color: "#F59E0B" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockWeatherData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="passengers" name="Passengers (K)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="temperature" name="Temperature (°C)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Weather Impact Summary</h3>
            <div className="text-sm space-y-1">
              <p className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>Heavy rain reduces passenger volume by approximately <strong>15%</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Sunny weekends see <strong>8%</strong> more leisure travel</span>
              </p>
              <p className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-indigo-500" />
                <span>Strong winds have minimal impact on underground travel</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherImpactPanel;
