import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, ReferenceLine
} from 'recharts';
import { transportApi } from '@/services/transportApi';
import { cityMetroNetworks } from '@/data/cityData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, BrainCircuit, BarChart3, Calendar as CalendarIcon, 
  Info, Users, Clock, AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const AdvancedForecasting = () => {
  const [selectedStation, setSelectedStation] = useState<string>("1"); // Default to Kings Cross
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const londonStations = cityMetroNetworks.london.stations;
  
  const { data: forecastData, isLoading, error, refetch } = useQuery({
    queryKey: ['passengerForecast', selectedStation, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => transportApi.getPassengerFlowForecast(
      selectedStation,
      format(selectedDate, 'yyyy-MM-dd')
    ),
  });
  
  // Extract error message from the error object
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null;
  
  const mlModels = [
    { id: 'lstm', name: 'LSTM Time Series', accuracy: '92.4%', description: 'Long Short-Term Memory neural network optimized for sequential data' },
    { id: 'mgcn', name: 'Multi-Graph Convolutional Network', accuracy: '93.8%', description: 'Graph neural network that captures station interconnections' },
    { id: 'ensemble', name: 'Ensemble Model (LSTM+MGCN)', accuracy: '95.2%', description: 'Combines multiple models for higher accuracy prediction' },
  ];
  
  const externalFactors = [
    { name: 'Weather', impact: 'High', correlation: 0.78 },
    { name: 'Events', impact: 'High', correlation: 0.82 },
    { name: 'Time of Day', impact: 'Very High', correlation: 0.95 },
    { name: 'Day of Week', impact: 'Medium', correlation: 0.67 },
    { name: 'Public Holidays', impact: 'High', correlation: 0.84 },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Advanced Passenger Flow Forecasting</h1>
              <p className="text-muted-foreground">
                Machine learning-powered predictive analysis for London Underground
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1 bg-primary/10">
                <BrainCircuit className="h-4 w-4 text-primary" />
                <span>Machine Learning</span>
              </Badge>
              
              <Button variant="outline" onClick={() => refetch()} className="gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Refresh Data</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <div className="md:col-span-8 space-y-6">
              {/* Station and date selection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Station</label>
                      <Select 
                        value={selectedStation} 
                        onValueChange={setSelectedStation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a station" />
                        </SelectTrigger>
                        <SelectContent>
                          {londonStations.map((station) => (
                            <SelectItem key={station.id} value={station.id.toString()}>
                              {station.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(selectedDate, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Forecast visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Flow Forecast</CardTitle>
                  <CardDescription>
                    Actual vs. predicted passenger volume for {
                      londonStations.find(s => s.id.toString() === selectedStation)?.name
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="w-full h-[300px] flex items-center justify-center">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : errorMessage ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  ) : forecastData?.data ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={forecastData.data.hourlyForecasts}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis 
                            dataKey="hour" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            label={{ value: 'Passengers', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border p-3 rounded-md shadow-md">
                                    <p className="font-medium">{payload[0].payload.hour}</p>
                                    <p className="text-sm">
                                      <span className="font-medium text-[#10B981]">Actual: </span>
                                      {payload[0].payload.actualFlow !== null ? 
                                        `${payload[0].payload.actualFlow} passengers` : 
                                        'Not available yet'}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium text-[#3B82F6]">Predicted: </span>
                                      {payload[0].payload.predictedFlow} passengers
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Confidence: {payload[0].payload.confidenceScore}%
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="actualFlow" 
                            name="Actual Flow"
                            stroke="#10B981" 
                            strokeWidth={2} 
                            dot={{ r: 2 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="predictedFlow" 
                            name="Predicted Flow"
                            stroke="#3B82F6" 
                            strokeWidth={2} 
                            dot={{ r: 2 }}
                            activeDot={{ r: 6 }}
                          />
                          {forecastData.data.peakHours.map((hour, index) => (
                            <ReferenceLine 
                              key={index} 
                              x={`${hour}:00`} 
                              stroke="#EF4444" 
                              strokeDasharray="3 3"
                              label={{ 
                                value: 'Peak', 
                                position: 'top', 
                                fill: '#EF4444',
                                fontSize: 12
                              }} 
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px]">
                      <p className="text-muted-foreground">No forecast data available</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xs text-muted-foreground">Daily Forecast</div>
                      <div className="font-bold text-lg">
                        {forecastData?.data?.totalDailyForecast?.toLocaleString() || '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">passengers</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xs text-muted-foreground">Peak Hour</div>
                      <div className="font-bold text-lg">
                        {forecastData?.data?.peakHours?.[0] ? `${forecastData.data.peakHours[0]}:00` : '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">highest volume</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-xs text-muted-foreground">vs. Yesterday</div>
                      <div className={`font-bold text-lg ${forecastData?.data?.comparedToYesterday && forecastData.data.comparedToYesterday > 0 ? 'text-green-500' : forecastData?.data?.comparedToYesterday && forecastData.data.comparedToYesterday < 0 ? 'text-red-500' : ''}`}>
                        {forecastData?.data?.comparedToYesterday ? 
                          (forecastData.data.comparedToYesterday > 0 ? '+' : '') + 
                          forecastData.data.comparedToYesterday.toFixed(1) + '%' 
                          : '—'}
                      </div>
                      <div className="text-xs text-muted-foreground">change</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-4 space-y-6">
              {/* ML model information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    ML Models
                  </CardTitle>
                  <CardDescription>
                    Machine learning models used for forecasting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mlModels.map(model => (
                      <div key={model.id} className="p-3 border rounded-md hover:bg-accent/10 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{model.name}</span>
                          <Badge variant={
                            model.id === 'ensemble' ? 'default' : 'outline'
                          }>
                            {model.accuracy}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {model.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* External Factors */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">External Factors</CardTitle>
                  <CardDescription>
                    Factors that influence passenger flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {externalFactors.map(factor => (
                      <div key={factor.name} className="flex justify-between items-center p-2 bg-accent/10 rounded-md">
                        <span>{factor.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            factor.impact === 'Very High' ? 'default' : 
                            factor.impact === 'High' ? 'secondary' : 
                            'outline'
                          }>
                            {factor.impact}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            r={factor.correlation.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="hourly" className="mb-6">
            <TabsList>
              <TabsTrigger value="hourly">Hourly Distribution</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Pattern</TabsTrigger>
              <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hourly" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Passenger Distribution</CardTitle>
                  <CardDescription>
                    Analysis of passenger flow patterns throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  {forecastData?.data ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={forecastData.data.hourlyForecasts}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="predictedFlow" 
                          stroke="#3B82F6" 
                          fillOpacity={1} 
                          fill="url(#colorPredicted)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weekly" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Pattern Analysis</CardTitle>
                  <CardDescription>
                    Passenger flow patterns across different days of the week
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { day: 'Monday', passengers: 42500, average: 40000 },
                        { day: 'Tuesday', passengers: 44200, average: 41000 },
                        { day: 'Wednesday', passengers: 45800, average: 42000 },
                        { day: 'Thursday', passengers: 49200, average: 44000 },
                        { day: 'Friday', passengers: 52300, average: 48000 },
                        { day: 'Saturday', passengers: 38500, average: 35000 },
                        { day: 'Sunday', passengers: 31200, average: 30000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="passengers" name="This Week" fill="#3B82F6" />
                      <Bar dataKey="average" name="Average" fill="#94A3B8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="anomaly" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Anomaly Detection</CardTitle>
                  <CardDescription>
                    Identification of unusual passenger flow patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { hour: '06:00', actual: 120, predicted: 150, threshold: 195, lowerThreshold: 105 },
                          { hour: '07:00', actual: 250, predicted: 240, threshold: 312, lowerThreshold: 168 },
                          { hour: '08:00', actual: 380, predicted: 350, threshold: 455, lowerThreshold: 245 },
                          { hour: '09:00', actual: 520, predicted: 400, threshold: 520, lowerThreshold: 280 },
                          { hour: '10:00', actual: 350, predicted: 300, threshold: 390, lowerThreshold: 210 },
                          { hour: '11:00', actual: 270, predicted: 280, threshold: 364, lowerThreshold: 196 },
                          { hour: '12:00', actual: 310, predicted: 320, threshold: 416, lowerThreshold: 224 },
                          { hour: '13:00', actual: 350, predicted: 330, threshold: 429, lowerThreshold: 231 },
                          { hour: '14:00', actual: 280, predicted: 290, threshold: 377, lowerThreshold: 203 },
                          { hour: '15:00', actual: 320, predicted: 310, threshold: 403, lowerThreshold: 217 },
                          { hour: '16:00', actual: 450, predicted: 370, threshold: 481, lowerThreshold: 259 },
                          { hour: '17:00', actual: 590, predicted: 460, threshold: 598, lowerThreshold: 322 },
                          { hour: '18:00', actual: 530, predicted: 500, threshold: 650, lowerThreshold: 350 },
                          { hour: '19:00', actual: 420, predicted: 410, threshold: 533, lowerThreshold: 287 },
                          { hour: '20:00', actual: 300, predicted: 320, threshold: 416, lowerThreshold: 224 },
                          { hour: '21:00', actual: 230, predicted: 250, threshold: 325, lowerThreshold: 175 },
                          { hour: '22:00', actual: 180, predicted: 200, threshold: 260, lowerThreshold: 140 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="actual" name="Actual" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="threshold" name="Upper Threshold" stroke="#F59E0B" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" dataKey="lowerThreshold" name="Lower Threshold" stroke="#F59E0B" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-800" />
                      <AlertDescription>
                        Anomalies detected at 09:00 and 17:00 - passenger volume exceeded predictions by more than 30%
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdvancedForecasting;
