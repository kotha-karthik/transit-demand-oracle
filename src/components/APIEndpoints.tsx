
import React from 'react';
import { Code } from '@/components/ui/code';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const APIEndpoints = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">FastAPI Backend</h2>
      
      <Tabs defaultValue="predict">
        <TabsList className="mb-4">
          <TabsTrigger value="predict">Prediction API</TabsTrigger>
          <TabsTrigger value="train">Training API</TabsTrigger>
          <TabsTrigger value="data">Data API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="predict" className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">GET /api/predict/flow</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Get real-time predictions for passenger flow between all station pairs
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
GET /api/predict/flow?city=london&timestamp=2025-04-08T08:30:00

# Response
{
  "city": "london",
  "timestamp": "2025-04-08T08:30:00",
  "predictions": [
    {"origin": "Kings Cross", "destination": "Oxford Circus", "flow": 342},
    {"origin": "Waterloo", "destination": "Bank", "flow": 287},
    ...
  ],
  "factors": {
    "weather": "Light Rain",
    "events": ["Business Day", "Football Match: Arsenal"],
    "impact_weights": {
      "weather": 0.23,
      "time_of_day": 0.42,
      "events": 0.35
    }
  },
  "model_confidence": 0.91
}`}
              </Code>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">GET /api/predict/station/{'{station_id}'}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Get predicted passenger load for a specific station
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
GET /api/predict/station/kings-cross?timestamp=2025-04-08T08:30:00

# Response
{
  "station_id": "kings-cross",
  "station_name": "Kings Cross",
  "timestamp": "2025-04-08T08:30:00",
  "inflow": 1240,
  "outflow": 980,
  "total_load": 2220,
  "prediction_trend": "increasing",
  "peak_hours": ["08:00-09:00", "17:30-18:30"]
}`}
              </Code>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="train" className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">POST /api/train/model</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Trigger model retraining with new data
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
POST /api/train/model
{
  "city": "london",
  "training_config": {
    "epochs": 100,
    "batch_size": 64,
    "learning_rate": 0.001,
    "include_weather": true,
    "include_events": true,
    "train_test_split": 0.8
  }
}

# Response
{
  "job_id": "train-2025-04-08-001",
  "status": "started",
  "estimated_completion": "2025-04-08T12:30:00"
}`}
              </Code>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">GET /api/train/status/{'{job_id}'}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Check status of model training job
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
GET /api/train/status/train-2025-04-08-001

# Response
{
  "job_id": "train-2025-04-08-001",
  "status": "completed",
  "metrics": {
    "mae": 12.4,
    "rmse": 18.6,
    "r2_score": 0.87
  },
  "completion_time": "2025-04-08T11:45:23",
  "model_version": "london-v2.1.0"
}`}
              </Code>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">GET /api/data/historical</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Retrieve historical passenger flow data
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
GET /api/data/historical?city=london&start_date=2025-03-01&end_date=2025-03-07

# Response
{
  "city": "london",
  "start_date": "2025-03-01",
  "end_date": "2025-03-07",
  "resolution": "hourly",
  "data": [
    {
      "timestamp": "2025-03-01T08:00:00",
      "flows": [
        {"origin": "Kings Cross", "destination": "Oxford Circus", "flow": 325},
        ...
      ]
    },
    ...
  ]
}`}
              </Code>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">GET /api/data/network</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Get metro network topology data
            </p>
            <div className="bg-muted p-2 rounded-md text-xs">
              <Code>
{`# Example request
GET /api/data/network?city=london

# Response
{
  "city": "london",
  "stations": [
    {"id": "kings-cross", "name": "Kings Cross", "coordinates": [51.5308, -0.1238]},
    {"id": "oxford-circus", "name": "Oxford Circus", "coordinates": [51.5152, -0.1422]},
    ...
  ],
  "lines": [
    {"id": "victoria", "name": "Victoria Line", "color": "#0098D4"},
    {"id": "northern", "name": "Northern Line", "color": "#000000"},
    ...
  ],
  "connections": [
    {"station1": "kings-cross", "station2": "euston", "line": "victoria", "travel_time": 2},
    ...
  ]
}`}
              </Code>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIEndpoints;
