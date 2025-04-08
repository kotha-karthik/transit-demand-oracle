
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DeepLearningArchitecture = () => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Deep Learning Pipeline</h2>
      
      <div className="relative overflow-x-auto py-4">
        <div className="flex items-center justify-between min-w-[600px]">
          {/* Input Layer */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-36 border border-border rounded-md p-2 bg-secondary/20 flex flex-col items-center justify-center">
              <div className="text-xs font-medium mb-2">Input Data</div>
              <div className="space-y-1">
                <div className="bg-primary/10 rounded px-2 py-1 text-xs">Historical OD Flows</div>
                <div className="bg-primary/10 rounded px-2 py-1 text-xs">Weather Data</div>
                <div className="bg-primary/10 rounded px-2 py-1 text-xs">Events</div>
                <div className="bg-primary/10 rounded px-2 py-1 text-xs">Time Features</div>
              </div>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          
          {/* LSTM Layer */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-32 h-28 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-2 flex flex-col items-center justify-center cursor-help">
                  <div className="text-xs font-medium mb-2">LSTM Layers</div>
                  <div className="w-full h-16 relative">
                    <div className="absolute inset-0 flex flex-col space-y-1">
                      <div className="h-1/3 bg-blue-200 dark:bg-blue-800 rounded-sm flex items-center justify-center text-[10px]">64 units</div>
                      <div className="h-1/3 bg-blue-300 dark:bg-blue-700 rounded-sm flex items-center justify-center text-[10px]">64 units</div>
                      <div className="h-1/3 bg-blue-400 dark:bg-blue-600 rounded-sm flex items-center justify-center text-[10px]">32 units</div>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">Captures temporal patterns in passenger flow over time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          
          {/* MGCN Layer */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-32 h-28 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-md p-2 flex flex-col items-center justify-center cursor-help">
                  <div className="text-xs font-medium mb-2">MGCN</div>
                  <div className="w-24 h-16 relative">
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full top-2 left-2"></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full top-10 left-6"></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full top-2 left-12"></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full top-10 left-16"></div>
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full top-2 right-2"></div>
                    <svg className="absolute inset-0" width="100%" height="100%">
                      <line x1="5" y1="3.5" x2="15" y2="12.5" stroke="#A78BFA" strokeWidth="1" />
                      <line x1="15" y1="12.5" x2="30" y2="3.5" stroke="#A78BFA" strokeWidth="1" />
                      <line x1="30" y1="3.5" x2="46" y2="12.5" stroke="#A78BFA" strokeWidth="1" />
                      <line x1="46" y1="12.5" x2="62" y2="3.5" stroke="#A78BFA" strokeWidth="1" />
                      <line x1="46" y1="12.5" x2="15" y2="12.5" stroke="#A78BFA" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">Models spatial relationships between stations in the metro network</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          
          {/* Attention Layer */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-32 h-28 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-2 flex flex-col items-center justify-center cursor-help">
                  <div className="text-xs font-medium mb-2">Attention</div>
                  <div className="w-full grid grid-cols-4 gap-0.5">
                    <div className="h-3 bg-amber-200 dark:bg-amber-800 rounded-sm"></div>
                    <div className="h-3 bg-amber-300 dark:bg-amber-700 rounded-sm"></div>
                    <div className="h-3 bg-amber-400 dark:bg-amber-600 rounded-sm"></div>
                    <div className="h-3 bg-amber-500 dark:bg-amber-500 rounded-sm"></div>
                    
                    <div className="h-3 bg-amber-300 dark:bg-amber-700 rounded-sm"></div>
                    <div className="h-3 bg-amber-400 dark:bg-amber-600 rounded-sm"></div>
                    <div className="h-3 bg-amber-500 dark:bg-amber-500 rounded-sm"></div>
                    <div className="h-3 bg-amber-200 dark:bg-amber-800 rounded-sm"></div>
                    
                    <div className="h-3 bg-amber-400 dark:bg-amber-600 rounded-sm"></div>
                    <div className="h-3 bg-amber-500 dark:bg-amber-500 rounded-sm"></div>
                    <div className="h-3 bg-amber-200 dark:bg-amber-800 rounded-sm"></div>
                    <div className="h-3 bg-amber-300 dark:bg-amber-700 rounded-sm"></div>
                    
                    <div className="h-3 bg-amber-500 dark:bg-amber-500 rounded-sm"></div>
                    <div className="h-3 bg-amber-200 dark:bg-amber-800 rounded-sm"></div>
                    <div className="h-3 bg-amber-300 dark:bg-amber-700 rounded-sm"></div>
                    <div className="h-3 bg-amber-400 dark:bg-amber-600 rounded-sm"></div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs max-w-xs">Dynamically weights the importance of external factors like weather and events</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          
          {/* Output Layer */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-28 border border-border rounded-md p-2 bg-green-100 dark:bg-green-900/30 flex flex-col items-center justify-center">
              <div className="text-xs font-medium mb-2">Predictions</div>
              <div className="space-y-1">
                <div className="bg-green-200 dark:bg-green-800 rounded px-2 py-1 text-xs">O-D Flow Matrix</div>
                <div className="bg-green-300 dark:bg-green-700 rounded px-2 py-1 text-xs">Station Load</div>
                <div className="bg-green-400 dark:bg-green-600 rounded px-2 py-1 text-xs">Peak Times</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="p-2 border border-border rounded-md bg-secondary/10">
          <h3 className="font-medium text-xs mb-1">Model Parameters</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>LSTM: 3 layers (64-64-32 units)</li>
            <li>MGCN: 2 graph conv layers</li>
            <li>Attention: 4-head mechanism</li>
            <li>Optimizer: Adam (lr=0.001)</li>
          </ul>
        </div>
        <div className="p-2 border border-border rounded-md bg-secondary/10">
          <h3 className="font-medium text-xs mb-1">Training Setup</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>Data: 12 months historical</li>
            <li>Batch size: 64</li>
            <li>Epochs: 100</li>
            <li>Validation: 20% holdout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeepLearningArchitecture;
