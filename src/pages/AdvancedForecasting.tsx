
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
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronRight, Calculator, TrendingUp, RefreshCcw, Activity } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cityMetroNetworks } from '@/data/cityData';

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

const AdvancedForecasting = () => {
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [forecastData, setForecastData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('architecture');
  const [predictionTab, setPredictionTab] = useState('route');
  const [routePrediction, setRoutePrediction] = useState<any>(null);

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

  // Get london stations for the dropdown
  const stations = cityMetroNetworks.london.stations;

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
