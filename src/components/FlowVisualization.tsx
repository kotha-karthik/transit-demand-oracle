
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { timeSeriesData } from '../data/mockData';

const FlowVisualization = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Passenger Flow Analysis</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeSeriesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickFormatter={(time) => time.split(':')[0]}
            />
            <YAxis 
              label={{ value: 'Passengers', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.375rem', border: '1px solid #E2E8F0' }}
              formatter={(value: number) => [`${value} passengers`, '']}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              name="Actual Flow"
              stroke="#10B981" 
              strokeWidth={2} 
              dot={{ r: 2 }}
              className="forecast-line"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted Flow"
              stroke="#3B82F6" 
              strokeWidth={2} 
              dot={{ r: 2 }}
              className="forecast-line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-secondary/30 p-2 rounded-md">
          <p className="text-xs text-muted-foreground">Peak Hour</p>
          <p className="font-semibold">08:00</p>
        </div>
        <div className="bg-secondary/30 p-2 rounded-md">
          <p className="text-xs text-muted-foreground">Average Error</p>
          <p className="font-semibold">±5.2%</p>
        </div>
        <div className="bg-secondary/30 p-2 rounded-md">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="font-semibold">92%</p>
        </div>
      </div>
    </div>
  );
};

export default FlowVisualization;
