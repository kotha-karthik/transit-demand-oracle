
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HeatmapVisualization from '@/components/HeatmapVisualization';
import AccessibilityPanel from '@/components/AccessibilityPanel';
import HistoricalComparison from '@/components/HistoricalComparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Explore = () => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h1 className="text-2xl font-bold">Explore Metro Data</h1>
          <p className="text-muted-foreground">Interactive visualizations and analytics</p>
        </div>

        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="heatmap" className="mt-0">
              <HeatmapVisualization />
            </TabsContent>
            <TabsContent value="historical" className="mt-0">
              <HistoricalComparison />
            </TabsContent>
            <TabsContent value="accessibility" className="mt-0">
              <AccessibilityPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Explore;
