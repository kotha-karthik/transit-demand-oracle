
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import PredictionModel from '@/components/PredictionModel';

const Forecasting = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <CardHeader>
                <CardTitle>Flow Prediction Model</CardTitle>
              </CardHeader>
              <CardContent>
                <PredictionModel />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Station Load Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Station load distribution visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forecasting;
