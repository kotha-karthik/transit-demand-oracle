
import React from 'react';
import { modelComponents, performanceMetrics } from '../data/mockData';

const PredictionModel = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Prediction Model Components</h2>
      
      <div className="flex justify-between space-x-3 mb-6">
        {/* Model Architecture Visualization */}
        <div className="relative w-full h-32 bg-secondary/20 rounded-md p-3">
          {/* LSTM component */}
          <div className="absolute left-[10%] top-1/2 transform -translate-y-1/2 w-[20%] h-16 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
            <span className="text-xs font-medium">LSTM</span>
          </div>
          
          {/* MGCN component */}
          <div className="absolute left-[40%] top-1/2 transform -translate-y-1/2 w-[20%] h-16 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
            <span className="text-xs font-medium">MGCN</span>
          </div>
          
          {/* Attention component */}
          <div className="absolute left-[70%] top-1/2 transform -translate-y-1/2 w-[20%] h-16 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
            <span className="text-xs font-medium">Attention</span>
          </div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="30%" y1="50%" x2="40%" y2="50%" stroke="#3B82F6" strokeWidth="2" />
            <line x1="60%" y1="50%" x2="70%" y2="50%" stroke="#3B82F6" strokeWidth="2" />
          </svg>
        </div>
      </div>
      
      {/* Model components description */}
      <div className="space-y-3 mb-4">
        {modelComponents.map(component => (
          <div key={component.id} className="p-2 border border-border rounded-md hover:bg-secondary/20 transition-colors">
            <h3 className="text-sm font-medium">{component.name}</h3>
            <p className="text-xs text-muted-foreground">{component.description}</p>
          </div>
        ))}
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-3 gap-2">
        {performanceMetrics.map(metric => (
          <div key={metric.name} className="bg-accent/10 p-2 rounded-md text-center">
            <p className="text-xs text-muted-foreground">{metric.name}</p>
            <p className="font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionModel;
