
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

const AdvancedForecasting = () => {
  const [selectedModel, setSelectedModel] = useState('transformer');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleRunForecast = async () => {
    setLoading(true);
    try {
      // Use the correct API function
      await transportApi.getPassengerFlowForecast('123', selectedDate.toISOString());
      // Process result as needed
    } catch (error) {
      console.error("Error running forecast:", error);
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
        <div>
          <h1 className="text-2xl font-bold">Advanced Forecasting</h1>
          <p className="text-muted-foreground">Deep learning models for metro passenger flow prediction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Architecture</CardTitle>
                <CardDescription>View and configure deep learning architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="architecture" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="architecture">Architecture</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="architecture">
                    <DeepLearningArchitecture />
                  </TabsContent>
                  
                  <TabsContent value="parameters">
                    <div className="grid gap-4">
                      {/* Render prediction model with modelType */}
                      <PredictionModel modelType={selectedModel} />
                    </div>
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
                    {loading ? 'Processing...' : 'Run Forecast'}
                  </Button>
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
