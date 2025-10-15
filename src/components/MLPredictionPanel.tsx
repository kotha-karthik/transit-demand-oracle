import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Users, AlertTriangle, CheckCircle2, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const STATIONS = [
  "King's Cross St. Pancras",
  "Victoria",
  "Oxford Circus",
  "Liverpool Street",
  "Waterloo",
  "London Bridge",
  "Piccadilly Circus",
  "Leicester Square",
  "Bank",
  "Canary Wharf"
];

const MLPredictionPanel = () => {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { toast } = useToast();

  const runPrediction = async () => {
    if (!selectedStation) {
      toast({
        title: "Station Required",
        description: "Please select a station first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const currentHour = new Date().getHours();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = daysOfWeek[new Date().getDay()];
      
      // Fetch historical data
      const { data: historicalData } = await supabase
        .from('underground_data')
        .select('*')
        .eq('station_name', selectedStation)
        .eq('hour', currentHour)
        .order('timestamp', { ascending: false })
        .limit(7);

      const { data, error } = await supabase.functions.invoke('predict-passenger-flow', {
        body: {
          stationName: selectedStation,
          hour: currentHour,
          dayOfWeek: currentDay,
          weatherCondition: 'Clear',
          historicalData: historicalData || []
        }
      });

      if (error) throw error;

      if (data?.success) {
        setPrediction(data.prediction);
        toast({
          title: "Prediction Complete",
          description: `AI analysis for ${selectedStation} generated successfully`,
        });
      } else {
        throw new Error(data?.error || 'Prediction failed');
      }

    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Error",
        description: error.message || 'Failed to generate prediction',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (level: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-green-500',
      'Medium': 'bg-yellow-500',
      'High': 'bg-orange-500',
      'Very High': 'bg-red-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI-Powered Predictions</CardTitle>
        </div>
        <CardDescription>
          Real-time passenger flow predictions using Lovable AI (Gemini 2.5 Flash)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {STATIONS.map(station => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={runPrediction} 
            disabled={loading || !selectedStation}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Predict Flow
              </>
            )}
          </Button>
        </div>

        {prediction && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Expected Passengers</span>
                </div>
                <div className="text-2xl font-bold">
                  {prediction.passenger_count?.toLocaleString()}
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Entry: {prediction.entry_count}</span>
                  <span>Exit: {prediction.exit_count}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Congestion Level</span>
                </div>
                <Badge className={`${getCongestionColor(prediction.congestion_level)} text-white text-lg px-4 py-2`}>
                  {prediction.congestion_level}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  Trains/hour: {prediction.recommended_train_frequency}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confidence</span>
                </div>
                <div className="text-2xl font-bold">
                  {prediction.confidence_score}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Anomaly risk: {prediction.anomaly_risk}%
                </div>
              </div>
            </div>

            {prediction.reasoning && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground font-medium mb-2">AI Reasoning:</p>
                <p className="text-sm">{prediction.reasoning}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          <p className="font-medium mb-1">Model Information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Model: Google Gemini 2.5 Flash (via Lovable AI)</li>
            <li>Analysis Type: Passenger flow prediction with congestion analysis</li>
            <li>Data Sources: Historical patterns, time-based factors, weather conditions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLPredictionPanel;