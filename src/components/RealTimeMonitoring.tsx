
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Signal
} from 'lucide-react';

interface StationMetrics {
  id: string;
  name: string;
  currentCapacity: number;
  maxCapacity: number;
  avgWaitTime: number;
  status: 'normal' | 'busy' | 'critical';
  passengerFlow: number;
  trend: 'up' | 'down' | 'stable';
}

const RealTimeMonitoring = () => {
  const [metrics, setMetrics] = useState<StationMetrics[]>([
    {
      id: '1',
      name: 'Oxford Circus',
      currentCapacity: 320,
      maxCapacity: 400,
      avgWaitTime: 4.2,
      status: 'busy',
      passengerFlow: 1250,
      trend: 'up'
    },
    {
      id: '2',
      name: 'King\'s Cross St. Pancras',
      currentCapacity: 180,
      maxCapacity: 500,
      avgWaitTime: 2.1,
      status: 'normal',
      passengerFlow: 890,
      trend: 'stable'
    },
    {
      id: '3',
      name: 'London Bridge',
      currentCapacity: 420,
      maxCapacity: 450,
      avgWaitTime: 6.8,
      status: 'critical',
      passengerFlow: 1650,
      trend: 'up'
    },
    {
      id: '4',
      name: 'Piccadilly Circus',
      currentCapacity: 290,
      maxCapacity: 380,
      avgWaitTime: 3.5,
      status: 'busy',
      passengerFlow: 1100,
      trend: 'down'
    }
  ]);

  const [systemStatus, setSystemStatus] = useState({
    overallHealth: 92,
    activeAlerts: 3,
    dataLatency: 0.8,
    networkUptime: 99.7
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(station => ({
        ...station,
        currentCapacity: Math.max(50, station.currentCapacity + (Math.random() - 0.5) * 20),
        avgWaitTime: Math.max(1, station.avgWaitTime + (Math.random() - 0.5) * 0.5),
        passengerFlow: Math.max(100, station.passengerFlow + (Math.random() - 0.5) * 100)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'busy': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-green-600">{systemStatus.overallHealth}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-amber-600">{systemStatus.activeAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Latency</p>
                <p className="text-2xl font-bold text-blue-600">{systemStatus.dataLatency}s</p>
              </div>
              <Signal className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Uptime</p>
                <p className="text-2xl font-bold text-green-600">{systemStatus.networkUptime}%</p>
              </div>
              <Wifi className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Station Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Station Monitoring
            <Badge variant="outline" className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((station) => {
              const capacityPercentage = (station.currentCapacity / station.maxCapacity) * 100;
              
              return (
                <Card key={station.id} className={`border ${getStatusColor(station.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{station.name}</h3>
                        <Badge variant={station.status === 'critical' ? 'destructive' : 
                                     station.status === 'busy' ? 'secondary' : 'default'}>
                          {station.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(station.trend)}
                          <span className="text-sm font-medium">{station.passengerFlow} pax/hr</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capacity</span>
                          <span>{station.currentCapacity}/{station.maxCapacity}</span>
                        </div>
                        <Progress 
                          value={capacityPercentage} 
                          className={`h-2 ${capacityPercentage > 90 ? 'bg-red-200' : 
                                          capacityPercentage > 75 ? 'bg-amber-200' : 'bg-green-200'}`}
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Avg Wait Time</div>
                        <div className="text-xl font-bold">{station.avgWaitTime.toFixed(1)}m</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Current Load</div>
                        <div className={`text-xl font-bold ${
                          capacityPercentage > 90 ? 'text-red-600' :
                          capacityPercentage > 75 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {capacityPercentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    
                    {station.status === 'critical' && (
                      <Alert className="mt-3 border-red-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Station operating at critical capacity. Consider implementing crowd control measures.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoring;
