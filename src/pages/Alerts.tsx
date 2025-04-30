
import React from 'react';
import PageLayout from '@/components/PageLayout';
import AlertsPanel from '@/components/AlertsPanel';
import WeatherImpactPanel from '@/components/WeatherImpactPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, Clock, ArrowUpDown, Smartphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const Alerts = () => {
  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Service Alerts & Notifications</h1>
            <p className="text-muted-foreground">Real-time updates and service status</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Live Alerts</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated: Now</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <AlertsPanel />
          </div>
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Settings</CardTitle>
                <CardDescription>Manage your alert preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="service-disruptions">Service Disruptions</Label>
                  </div>
                  <Switch id="service-disruptions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="line-status">Line Status Changes</Label>
                  </div>
                  <Switch id="line-status" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="planned-works">Planned Engineering Works</Label>
                  </div>
                  <Switch id="planned-works" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                  </div>
                  <Switch id="push-notifications" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <WeatherImpactPanel />
      </div>
    </PageLayout>
  );
};

export default Alerts;
