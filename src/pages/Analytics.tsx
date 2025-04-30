
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StationArrivals from '@/components/StationArrivals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeFlowPanel from '@/components/RealTimeFlowPanel';
import { BarChart3, Clock, Users, ArrowUpDown } from 'lucide-react';
import FlowVisualization from '@/components/FlowVisualization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cityMetroNetworks } from '@/data/cityData';
import { londonUndergroundLines } from '@/data/cityData';

const Analytics = () => {
  const [selectedTab, setSelectedTab] = useState('realtime');
  const [selectedView, setSelectedView] = useState('flow');
  const [selectedTimeframe, setSelectedTimeframe] = useState('day');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Default to London for cityId
  const defaultCityId = 'london';

  const timeframes = [
    { value: 'hour', label: 'Last Hour' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const stats = [
    { 
      title: 'Total Passengers', 
      value: '4.2M', 
      change: '+12%', 
      icon: <Users className="h-5 w-5 text-blue-500" /> 
    },
    { 
      title: 'Peak Time', 
      value: '08:15', 
      change: 'AM', 
      icon: <Clock className="h-5 w-5 text-amber-500" /> 
    },
    { 
      title: 'Busiest Line', 
      value: 'Central', 
      change: '+8%', 
      icon: <ArrowUpDown className="h-5 w-5 text-red-500" /> 
    },
    { 
      title: 'Data Points', 
      value: '153K', 
      change: 'Live', 
      icon: <BarChart3 className="h-5 w-5 text-green-500" /> 
    },
  ];

  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Real-time Analytics</h1>
            <p className="text-muted-foreground">Live passenger flow and station metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" /> Live
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-muted-foreground mb-0.5">{stat.change}</span>
                  </div>
                </div>
                <div className="bg-background rounded-full p-2">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg">Passenger Flow Analysis</CardTitle>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="realtime">Real-time</TabsTrigger>
                  <TabsTrigger value="historical">Historical</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {selectedTab === 'realtime' ? (
              <div className="mt-4">
                <RealTimeFlowPanel cityId={defaultCityId} />
              </div>
            ) : (
              <div className="mt-4 h-[400px]">
                <FlowVisualization />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Station Activity</CardTitle>
              <CardDescription>Real-time passenger arrivals and departures</CardDescription>
            </CardHeader>
            <CardContent>
              <StationArrivals 
                stationId={selectedStation} 
                stationName={selectedStation ? 
                  cityMetroNetworks.london.stations.find(s => s.id.toString() === selectedStation)?.name || null : null} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Performance</CardTitle>
              <CardDescription>Current status and passenger distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {londonUndergroundLines.slice(0, 5).map((line, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: ['#DC241F', '#0019A8', '#9B0056', '#007229', '#F3A9BB'][i] }}
                      ></div>
                      <span className="font-medium">{line.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 2000 + 500)} pax/hr</span>
                      <Badge variant={i % 3 === 0 ? 'destructive' : i % 2 === 0 ? 'secondary' : 'default'}>
                        {i % 3 === 0 ? 'Busy' : i % 2 === 0 ? 'Normal' : 'Light'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
