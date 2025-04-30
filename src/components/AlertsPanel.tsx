
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

type Alert = {
  id: string;
  type: 'disruption' | 'delay' | 'emergency' | 'info';
  title: string;
  description: string;
  line: string;
  lineColor: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
};

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'disruption',
    title: 'Service Suspended',
    description: 'No service between Baker Street and Liverpool Street due to planned engineering works.',
    line: 'Circle Line',
    lineColor: '#FFD300',
    timestamp: '10:15 AM',
    severity: 'high',
  },
  {
    id: '2',
    type: 'delay',
    title: 'Minor Delays',
    description: 'Minor delays between Oxford Circus and Piccadilly Circus due to signal failure.',
    line: 'Bakerloo Line',
    lineColor: '#B36305',
    timestamp: '09:45 AM',
    severity: 'medium',
  },
  {
    id: '3',
    type: 'info',
    title: 'Station Crowding',
    description: 'Increased passenger volume at King\'s Cross St. Pancras. Consider alternate routes.',
    line: 'Network Wide',
    lineColor: '#009FE0',
    timestamp: '08:30 AM',
    severity: 'low',
  },
];

const AlertsPanel = () => {
  const handleSubscribe = () => {
    toast({
      title: "Alerts Enabled",
      description: "You will now receive real-time alerts for the London Underground network.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-lg font-medium">Real-time Alerts</CardTitle>
          <CardDescription>Latest service disruptions and updates</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleSubscribe}
        >
          <Bell className="w-4 h-4" />
          <span>Subscribe</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="border rounded-lg p-3 bg-background"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {alert.severity === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : alert.severity === 'medium' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="font-medium">{alert.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: alert.lineColor }}
                  />
                  <span className="text-xs text-muted-foreground">{alert.line}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
              <div className="flex justify-between items-center mt-2">
                <Badge 
                  variant={
                    alert.severity === 'high' ? 'destructive' : 
                    alert.severity === 'medium' ? 'outline' : 'secondary'
                  }
                  className="text-xs"
                >
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
