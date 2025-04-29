
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import PredictionModel from '@/components/PredictionModel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Forecasting = () => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Passenger Flow Forecasting</h1>
            <p className="text-muted-foreground">
              Predictive analysis for London Underground network
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>AI Powered</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expected Peak</p>
                  <h3 className="text-2xl font-bold">5.2M</h3>
                </div>
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Peak Hours</p>
                  <h3 className="text-2xl font-bold">8-10 AM</h3>
                </div>
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
                  <h3 className="text-2xl font-bold">94.5%</h3>
                </div>
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Stations</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Tabs defaultValue="prediction">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Flow Prediction Models</CardTitle>
                  <TabsList>
                    <TabsTrigger value="prediction">Current</TabsTrigger>
                    <TabsTrigger value="historical">Historical</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="prediction" className="mt-0">
                  <PredictionModel />
                </TabsContent>
                <TabsContent value="historical" className="mt-0">
                  <div className="h-[400px] flex items-center justify-center border rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Historical prediction data visualization</p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Station Load Distribution</CardTitle>
              <CardDescription>Predicted passenger distribution across key stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({length: 5}, (_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Station {i + 1}</span>
                      <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 2000 + 1000)} pax</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.random() * 70 + 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="text-sm text-muted-foreground">
                  <p>Prediction accuracy: <span className="text-foreground font-medium">94.5%</span></p>
                  <p>Last updated: <span className="text-foreground font-medium">Today, 10:45 AM</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Forecasting;
