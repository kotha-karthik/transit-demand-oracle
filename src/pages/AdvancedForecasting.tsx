
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { transportApi } from '@/services/transportApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import DeepLearningArchitecture from '@/components/DeepLearningArchitecture';
import PredictionModel from '@/components/PredictionModel';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronRight, Calculator, TrendingUp, RefreshCcw, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cityMetroNetworks } from '@/data/cityData';
import CitySelector from '@/components/CitySelector';

// Form schema for origin-destination prediction
const originDestinationSchema = z.object({
  originStation: z.string({
    required_error: "Please select an origin station.",
  }),
  destinationStation: z.string({
    required_error: "Please select a destination station.",
  }),
  departureTime: z.string({
    required_error: "Please select a departure time.",
  }),
  dayType: z.string({
    required_error: "Please select a day type.",
  }),
});

// Advanced flow forecast form schema
const advancedFlowSchema = z.object({
  city: z.string({
    required_error: "Please select a city.",
  }),
  timeRange: z.string({
    required_error: "Please select a time range.",
  }),
  forecastPeriod: z.string({
    required_error: "Please select a forecast period.",
  }),
  modelType: z.string({
    required_error: "Please select a model type.",
  }),
});

const AdvancedForecasting = () => {
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [forecastData, setForecastData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('architecture');
  const [predictionTab, setPredictionTab] = useState('route');
  const [routePrediction, setRoutePrediction] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState('london');
  const [passengerFlowForecast, setPassengerFlowForecast] = useState<any>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [advancedForecastType, setAdvancedForecastType] = useState('hourly');

  // Form for origin-destination prediction
  const form = useForm<z.infer<typeof originDestinationSchema>>({
    resolver: zodResolver(originDestinationSchema),
    defaultValues: {
      originStation: "",
      destinationStation: "",
      departureTime: "08:00",
      dayType: "weekday",
    },
  });

  // Form for advanced flow forecasting
  const advancedForm = useForm<z.infer<typeof advancedFlowSchema>>({
    resolver: zodResolver(advancedFlowSchema),
    defaultValues: {
      city: "london",
      timeRange: "24h",
      forecastPeriod: "7d",
      modelType: "transformer",
    },
  });

  // Get london stations for the dropdown
  const stations = cityMetroNetworks.london.stations;

  // Available cities for selection
  const availableCities = [
    { id: "london", name: "London", country: "UK" },
    { id: "paris", name: "Paris", country: "France" },
    { id: "newyork", name: "New York", country: "USA" },
    { id: "tokyo", name: "Tokyo", country: "Japan" },
    { id: "berlin", name: "Berlin", country: "Germany" },
  ];

  // Times for selection
  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleRunForecast = async () => {
    setLoading(true);
    try {
      // Use the transportApi to fetch forecast data
      const response = await transportApi.getPassengerFlowForecast('123', selectedDate.toISOString());
      
      if (response.data) {
        setForecastData(response.data);
        
        toast({
          title: "Forecast Generated",
          description: "The passenger flow forecast has been successfully generated.",
        });
      }
    } catch (error) {
      console.error("Error running forecast:", error);
      toast({
        title: "Error",
        description: "Failed to generate forecast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate advanced passenger flow forecast
  const generateAdvancedForecast = async (values: z.infer<typeof advancedFlowSchema>) => {
    setForecastLoading(true);
    try {
      // Mock advanced forecast data generation
      // In a real application, this would call an API
      
      setTimeout(() => {
        // Generate different data based on forecast type
        let forecastData;
        
        if (advancedForecastType === 'hourly') {
          forecastData = {
            type: 'hourly',
            title: 'Hourly Passenger Flow Forecast',
            description: '24-hour forecast with 15-minute intervals',
            data: Array.from({ length: 24 }, (_, hour) => {
              return Array.from({ length: 4 }, (_, quarter) => {
                const timeString = `${hour.toString().padStart(2, '0')}:${(quarter * 15).toString().padStart(2, '0')}`;
                return {
                  time: timeString,
                  predicted: Math.floor(Math.random() * 3000) + 500 + (hour >= 7 && hour <= 9 ? 2000 : 0) + (hour >= 16 && hour <= 18 ? 1800 : 0),
                  actual: hour < new Date().getHours() ? Math.floor(Math.random() * 3000) + 500 + (hour >= 7 && hour <= 9 ? 2000 : 0) + (hour >= 16 && hour <= 18 ? 1800 : 0) : null,
                  confidence: Math.random() * 10 + 85,
                };
              });
            }).flat(),
            metrics: {
              peakTime: '08:15',
              peakVolume: '4,235',
              totalDaily: '89,750',
              avgAccuracy: '93.2%',
              anomalies: 2
            }
          };
        } else if (advancedForecastType === 'daily') {
          forecastData = {
            type: 'daily',
            title: 'Daily Passenger Flow Forecast',
            description: '7-day forecast with daily aggregates',
            data: Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const dayName = dayNames[date.getDay()];
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              return {
                date: `${date.getDate()}/${date.getMonth() + 1}`,
                day: dayName,
                predicted: Math.floor(Math.random() * 30000) + (isWeekend ? 50000 : 80000),
                trend: Math.random() > 0.5 ? Math.random() * 8 : -Math.random() * 5,
                confidence: Math.random() * 5 + 90
              };
            }),
            metrics: {
              peakDay: 'Friday',
              peakVolume: '92,150',
              avgWeekday: '85,320',
              avgWeekend: '64,780',
              weeklyTotal: '574,210'
            }
          };
        } else {
          // Monthly forecast
          forecastData = {
            type: 'monthly',
            title: 'Monthly Passenger Flow Forecast',
            description: '6-month forecast with monthly aggregates',
            data: Array.from({ length: 6 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() + i);
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                                  'July', 'August', 'September', 'October', 'November', 'December'];
              const monthName = monthNames[date.getMonth()];
              const isSummer = date.getMonth() >= 5 && date.getMonth() <= 7;
              const isWinter = date.getMonth() >= 10 || date.getMonth() <= 1;
              
              let baseValue;
              if (isSummer) baseValue = 1800000; // Summer - lower ridership
              else if (isWinter) baseValue = 2200000; // Winter - higher ridership
              else baseValue = 2000000; // Spring/Fall - average ridership
              
              return {
                month: monthName,
                predicted: Math.floor(Math.random() * 300000) + baseValue,
                trend: ((Math.random() > 0.5 ? 1 : -1) * Math.random() * 12).toFixed(1),
                seasonalAdjustment: isSummer ? 'Summer vacation' : 
                                    isWinter ? 'Winter holidays' : 'Standard',
                confidence: (Math.random() * 8 + 85).toFixed(1)
              };
            }),
            metrics: {
              peakMonth: 'December',
              lowestMonth: 'July',
              annualTrend: '+3.2%',
              seasonalVariation: '18.5%',
              yearlyEstimate: '24.3M'
            }
          };
        }
        
        setPassengerFlowForecast(forecastData);
        
        toast({
          title: "Advanced Forecast Generated",
          description: `${advancedForecastType.charAt(0).toUpperCase() + advancedForecastType.slice(1)} forecast has been successfully generated.`,
        });
        
        setForecastLoading(false);
      }, 1500); // Simulate API delay
      
    } catch (error) {
      console.error("Error generating advanced forecast:", error);
      toast({
        title: "Error",
        description: "Failed to generate advanced forecast. Please try again.",
        variant: "destructive",
      });
      setForecastLoading(false);
    }
  };

  // Submit handler for origin-destination prediction
  const onSubmitRoutePredict = async (values: z.infer<typeof originDestinationSchema>) => {
    setLoading(true);
    try {
      // Mock data for the prediction, in a real application, this would be from the API
      const predictionResult = {
        originName: stations.find(s => s.id.toString() === values.originStation)?.name,
        destinationName: stations.find(s => s.id.toString() === values.destinationStation)?.name,
        travelTime: Math.floor(Math.random() * 30) + 15,
        crowdingLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 20) + 80,
        alternativeRoutes: [
          {
            route: "Via Central Line",
            travelTime: Math.floor(Math.random() * 30) + 15,
            crowdingLevel: 'Medium',
          },
          {
            route: "Via Jubilee Line",
            travelTime: Math.floor(Math.random() * 30) + 20,
            crowdingLevel: 'Low',
          }
        ],
        hourlyPredictions: Array.from({ length: 10 }, (_, i) => ({
          hour: `${(parseInt(values.departureTime) + i) % 24}:00`,
          passengers: Math.floor(Math.random() * 1000) + 200,
          crowding: Math.random() * 100,
        })),
      };

      setRoutePrediction(predictionResult);
      
      toast({
        title: "Route Prediction Complete",
        description: "Origin-destination prediction has been generated.",
      });
    } catch (error) {
      console.error("Error predicting route:", error);
      toast({
        title: "Error",
        description: "Failed to predict route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const modelTypes = [
    { value: 'transformer', label: 'Transformer', description: 'Attention-based model optimized for sequential data' },
    { value: 'lstm', label: 'LSTM', description: 'Long Short-Term Memory for time series forecasting' },
    { value: 'cnn', label: 'CNN', description: 'Convolutional Neural Network for spatial patterns' }
  ];

  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Advanced Forecasting</h1>
            <p className="text-muted-foreground">Deep learning models for metro passenger flow prediction</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>AI Models</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Neural Networks</span>
            </Badge>
          </div>
        </div>
        
        {/* New Advanced Passenger Flow Forecasting Section */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Passenger Flow Forecasting</CardTitle>
            <CardDescription>
              High-precision forecasting using multi-modal deep learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...advancedForm}>
              <form onSubmit={advancedForm.handleSubmit(generateAdvancedForecast)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={advancedForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City Network</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                  {city.name}, {city.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={advancedForm.control}
                    name="timeRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Granularity</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15m">15 Minutes</SelectItem>
                              <SelectItem value="30m">30 Minutes</SelectItem>
                              <SelectItem value="1h">Hourly</SelectItem>
                              <SelectItem value="24h">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={advancedForm.control}
                    name="forecastPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forecast Period</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select forecast period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1d">1 Day</SelectItem>
                              <SelectItem value="7d">7 Days</SelectItem>
                              <SelectItem value="30d">30 Days</SelectItem>
                              <SelectItem value="90d">3 Months</SelectItem>
                              <SelectItem value="180d">6 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={advancedForm.control}
                    name="modelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select model type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="transformer">Transformer</SelectItem>
                              <SelectItem value="lstm">LSTM</SelectItem>
                              <SelectItem value="ensemble">Ensemble</SelectItem>
                              <SelectItem value="bayesian">Bayesian</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={() => setAdvancedForecastType('hourly')} 
                      className={advancedForecastType === 'hourly' ? 'bg-primary/20' : ''}>
                      Hourly
                    </Button>
                    <Button variant="outline" type="button" onClick={() => setAdvancedForecastType('daily')}
                      className={advancedForecastType === 'daily' ? 'bg-primary/20' : ''}>
                      Daily
                    </Button>
                    <Button variant="outline" type="button" onClick={() => setAdvancedForecastType('monthly')}
                      className={advancedForecastType === 'monthly' ? 'bg-primary/20' : ''}>
                      Monthly
                    </Button>
                  </div>
                  
                  <Button type="submit" disabled={forecastLoading} className="w-full sm:w-auto">
                    {forecastLoading ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" /> Generate Advanced Forecast
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            {passengerFlowForecast && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium">{passengerFlowForecast.title}</h3>
                  <p className="text-sm text-muted-foreground">{passengerFlowForecast.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {passengerFlowForecast.type === 'hourly' && (
                    <>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Peak Time</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.peakTime}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Peak Volume</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.peakVolume}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Total Daily</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.totalDaily}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Avg. Accuracy</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.avgAccuracy}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Anomalies</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.anomalies}</div>
                      </div>
                    </>
                  )}
                  
                  {passengerFlowForecast.type === 'daily' && (
                    <>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Peak Day</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.peakDay}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Peak Volume</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.peakVolume}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Avg. Weekday</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.avgWeekday}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Avg. Weekend</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.avgWeekend}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Weekly Total</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.weeklyTotal}</div>
                      </div>
                    </>
                  )}
                  
                  {passengerFlowForecast.type === 'monthly' && (
                    <>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Peak Month</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.peakMonth}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Lowest Month</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.lowestMonth}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Annual Trend</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.annualTrend}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Seasonal Var.</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.seasonalVariation}</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground">Yearly Est.</div>
                        <div className="text-xl font-bold">{passengerFlowForecast.metrics.yearlyEstimate}</div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="h-[400px]">
                  <ChartContainer className="h-full w-full" config={{}}>
                    {passengerFlowForecast.type === 'hourly' && (
                      <LineChart data={passengerFlowForecast.data.filter((_: any, i: number) => i % 2 === 0)}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          name="Predicted Flow" 
                          stroke="#8B5CF6" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          name="Actual Flow" 
                          stroke="#06b6d4" 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    )}
                    
                    {passengerFlowForecast.type === 'daily' && (
                      <BarChart data={passengerFlowForecast.data}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar 
                          dataKey="predicted" 
                          name="Passenger Volume" 
                          fill="#8B5CF6" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    )}
                    
                    {passengerFlowForecast.type === 'monthly' && (
                      <AreaChart data={passengerFlowForecast.data}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="predicted" 
                          name="Monthly Passengers" 
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    )}
                  </ChartContainer>
                </div>
                
                {passengerFlowForecast.type === 'hourly' && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Anomaly Detection</h4>
                    <div className="text-sm text-muted-foreground">
                      The model has detected 2 potential anomalies in passenger flow patterns:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Unexpected surge at 08:15 (32% above normal patterns)</li>
                        <li>Unusual decline at 17:30 (27% below expected volume)</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {passengerFlowForecast.type === 'daily' && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Weekly Pattern Analysis</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>The forecast indicates a standard weekly pattern with peak ridership on Fridays (92,150 passengers) 
                      and lowest volume on Sundays (58,620 passengers). Monday and Thursday show similar patterns, 
                      while midweek shows a slight dip in ridership.</p>
                    </div>
                  </div>
                )}
                
                {passengerFlowForecast.type === 'monthly' && (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Seasonal Analysis</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>The 6-month forecast shows strong seasonal variations with December peaking due to holiday travel 
                      and shopping. Summer months (June-August) show the lowest ridership due to vacations and school breaks. 
                      The annual trend shows a 3.2% increase year-over-year, adjusted for seasonal variations.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Architecture</CardTitle>
                <CardDescription>View and configure deep learning architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="architecture">Architecture</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="architecture">
                    <DeepLearningArchitecture />
                  </TabsContent>
                  
                  <TabsContent value="parameters">
                    <div className="grid gap-4">
                      <PredictionModel />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="results">
                    <div className="space-y-4">
                      {forecastData ? (
                        <div>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-secondary/20 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Total Predicted</div>
                              <div className="text-xl font-bold">{forecastData.totalDailyForecast.toLocaleString()} pax</div>
                            </div>
                            <div className="bg-secondary/20 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Peak Hour</div>
                              <div className="text-xl font-bold">{forecastData.peakHours[0]}:00</div>
                            </div>
                            <div className="bg-secondary/20 rounded-lg p-3">
                              <div className="text-xs text-muted-foreground">Confidence</div>
                              <div className="text-xl font-bold">{Math.round(Math.random() * 10) + 85}%</div>
                            </div>
                          </div>
                          
                          <div className="h-[300px] mt-6">
                            <ChartContainer className="h-full w-full" config={{}}>
                              <BarChart data={forecastData.hourlyForecasts}>
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Legend />
                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent />
                                  }
                                />
                                <Bar 
                                  dataKey="actualFlow" 
                                  name="Actual" 
                                  fill="#6E59A5" 
                                  radius={[4, 4, 0, 0]}
                                  stackId="stack"
                                />
                                <Bar 
                                  dataKey="predictedFlow" 
                                  name="Predicted" 
                                  fill="#9b87f5"
                                  radius={[4, 4, 0, 0]}
                                  stackId="stack"
                                />
                              </BarChart>
                            </ChartContainer>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Anomaly Detection</h4>
                            <div className="text-sm text-muted-foreground">
                              The model detected potential anomalies at 08:00 and 17:00 with unusually high passenger flow.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                          <Calculator className="h-10 w-10 text-muted-foreground mb-3" />
                          <h3 className="text-lg font-medium">No Forecast Data</h3>
                          <p className="text-sm text-muted-foreground mt-1 mb-4">
                            Run a forecast to view the results and analytics here.
                          </p>
                          <Button onClick={handleRunForecast} disabled={loading}>
                            {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                            Run Sample Forecast
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Origin-Destination Prediction</CardTitle>
                <CardDescription>AI-powered route analysis and crowding prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={predictionTab} onValueChange={setPredictionTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="route">Route Prediction</TabsTrigger>
                    <TabsTrigger value="results">Prediction Results</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="route">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitRoutePredict)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="originStation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Origin Station</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select origin station" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {stations.map((station) => (
                                      <SelectItem key={station.id} value={station.id.toString()}>
                                        {station.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="destinationStation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Destination Station</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select destination station" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {stations.map((station) => (
                                      <SelectItem key={station.id} value={station.id.toString()}>
                                        {station.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="departureTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Departure Time</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select departure time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {times.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="dayType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Day Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select day type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="weekday">Weekday</SelectItem>
                                    <SelectItem value="weekend">Weekend</SelectItem>
                                    <SelectItem value="holiday">Holiday</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                          Predict Route
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="results">
                    {routePrediction ? (
                      <div className="space-y-4">
                        <div className="bg-secondary/10 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Route Summary</h3>
                            <Badge>{routePrediction.crowdingLevel} Crowding</Badge>
                          </div>
                          <div className="flex items-center text-sm mb-4">
                            <span className="font-medium">{routePrediction.originName}</span>
                            <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{routePrediction.destinationName}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-background p-2 rounded">
                              <div className="text-xs text-muted-foreground">Travel Time</div>
                              <div className="font-medium">{routePrediction.travelTime} mins</div>
                            </div>
                            <div className="bg-background p-2 rounded">
                              <div className="text-xs text-muted-foreground">Crowding</div>
                              <div className="font-medium">{routePrediction.crowdingLevel}</div>
                            </div>
                            <div className="bg-background p-2 rounded">
                              <div className="text-xs text-muted-foreground">Confidence</div>
                              <div className="font-medium">{routePrediction.confidence}%</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Alternative Routes</h4>
                          <div className="space-y-2">
                            {routePrediction.alternativeRoutes.map((route: any, index: number) => (
                              <div key={index} className="border rounded p-3 flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{route.route}</div>
                                  <div className="text-xs text-muted-foreground">{route.travelTime} mins</div>
                                </div>
                                <Badge variant={route.crowdingLevel === 'Low' ? 'outline' : 'secondary'}>
                                  {route.crowdingLevel}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Hourly Prediction</h4>
                          <div className="h-[250px]">
                            <ChartContainer className="h-full w-full" config={{}}>
                              <BarChart data={routePrediction.hourlyPredictions}>
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <ChartTooltip 
                                  content={<ChartTooltipContent />}
                                />
                                <Bar 
                                  dataKey="passengers" 
                                  name="Passengers" 
                                  fill="#8B5CF6" 
                                  radius={[4, 4, 0, 0]} 
                                />
                              </BarChart>
                            </ChartContainer>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center">
                        <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium">No Prediction Data</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Select origin and destination stations to generate a prediction.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Run Forecast</CardTitle>
                <CardDescription>Configure model and run prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        {modelTypes.map(model => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Select Date</label>
                    <div className="mt-2">
                      <Calendar 
                        mode="single" 
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="border rounded-md p-3" 
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleRunForecast}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" /> Run Forecast
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
                <CardDescription>Advanced neural network details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Model: {selectedModel === 'transformer' ? 'Transformer' : selectedModel === 'lstm' ? 'LSTM' : 'CNN'}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedModel === 'transformer' 
                      ? 'The Transformer model uses self-attention mechanisms to process sequential data, providing state-of-the-art performance for time series forecasting.' 
                      : selectedModel === 'lstm' 
                        ? 'Long Short-Term Memory networks are specialized in remembering patterns over extended time periods, ideal for passenger flow prediction.' 
                        : 'Convolutional Neural Networks excel at recognizing spatial patterns in data, useful for detecting trends across station networks.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Advanced Configuration</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/20 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Learning Rate</div>
                      <div className="font-medium">0.001</div>
                    </div>
                    <div className="bg-secondary/20 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Batch Size</div>
                      <div className="font-medium">64</div>
                    </div>
                    <div className="bg-secondary/20 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Epochs</div>
                      <div className="font-medium">100</div>
                    </div>
                    <div className="bg-secondary/20 p-2 rounded text-center">
                      <div className="text-xs text-muted-foreground">Dropout</div>
                      <div className="font-medium">0.2</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdvancedForecasting;

