
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, BarChart2, Network, AlertTriangle, 
  Check, RefreshCcw, Download, GanttChartSquare
} from 'lucide-react';
import { transportApi } from '@/services/transportApi';
import DeepLearningArchitecture from '@/components/DeepLearningArchitecture';

const AdvancedForecasting = () => {
  const [selectedModel, setSelectedModel] = useState('lstm');
  
  // Fetch forecast data
  const { data: forecastData, error, isLoading } = useQuery({
    queryKey: ['forecast', selectedModel],
    queryFn: () => transportApi.getForecast(
      selectedModel, 
      { 
        timeRange: '7d', 
        stations: ['victoria', 'oxford_circus', 'kings_cross']
      }
    ),
  });
  
  // Extract error message from the error object
  const errorMessage = error ? (error instanceof Error ? error.message : String(error)) : null;
  
  const mlModels = [
    { id: 'lstm', name: 'LSTM Time Series', accuracy: '92.4%', description: 'Long Short-Term Memory neural network optimized for sequential data' },
    { id: 'mgcn', name: 'Multi-Graph Convolutional Network', accuracy: '93.8%', description: 'Graph neural network that captures station interconnections' },
    { id: 'transformer', name: 'Transformer Model', accuracy: '94.2%', description: 'Attention-based model for complex pattern recognition' },
    { id: 'ensemble', name: 'Ensemble Model', accuracy: '95.1%', description: 'Combination of multiple models for highest accuracy' }
  ];

  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Advanced Forecasting Models</h1>
            <p className="text-muted-foreground">
              Machine learning models for underground passenger prediction
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              AI Powered
            </Badge>
            <Badge variant="outline">ML Models</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Forecast Visualization
                </CardTitle>
                <CardDescription>
                  {mlModels.find(m => m.id === selectedModel)?.description}
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
                    <DeepLearningArchitecture modelType={selectedModel} />
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center border rounded-lg">
                    <p className="text-muted-foreground">No forecast data available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Check className="h-3 w-3 mr-1" /> Model confidence: 94.7%
                  </Badge>
                  <Badge variant="outline">7-day forecast</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GanttChartSquare className="h-5 w-5 text-primary" />
                  ML Models
                </CardTitle>
                <CardDescription>
                  Select a machine learning model to visualize
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <div className="px-6 py-2 space-y-2">
                    {mlModels.map((model) => (
                      <Button
                        key={model.id}
                        variant={selectedModel === model.id ? "default" : "outline"}
                        className="w-full justify-start gap-2 mb-2"
                        onClick={() => setSelectedModel(model.id)}
                      >
                        <div className="flex flex-col items-start">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Accuracy: {model.accuracy}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span className="font-medium">94.7%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: '94.7%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Precision</span>
                      <span className="font-medium">92.3%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-green-500" style={{ width: '92.3%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recall</span>
                      <span className="font-medium">91.8%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: '91.8%' }}></div>
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
