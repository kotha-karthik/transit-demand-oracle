
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accessibility, Users, Stairs as StairsIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type AccessibilityFeature = 'wheelchair' | 'step-free' | 'escalator' | 'elevator' | 'accessible-toilet' | 'staff-assistance';

type Station = {
  id: string;
  name: string;
  line: string;
  lineColor: string;
  features: AccessibilityFeature[];
  notes?: string;
};

const mockAccessibleStations: Station[] = [
  {
    id: '1',
    name: 'Westminster',
    line: 'Jubilee Line',
    lineColor: '#A0A5A9',
    features: ['wheelchair', 'step-free', 'escalator', 'elevator', 'accessible-toilet'],
    notes: 'Step-free access from street to platform. Staff assistance available.'
  },
  {
    id: '2',
    name: 'Kings Cross St. Pancras',
    line: 'Multiple Lines',
    lineColor: '#000000',
    features: ['wheelchair', 'step-free', 'escalator', 'elevator', 'accessible-toilet', 'staff-assistance'],
    notes: 'Full step-free access to all platforms.'
  },
  {
    id: '3',
    name: 'London Bridge',
    line: 'Northern Line',
    lineColor: '#000000',
    features: ['wheelchair', 'step-free', 'escalator', 'elevator'],
    notes: 'Step-free access to Jubilee line only.'
  },
  {
    id: '4',
    name: 'Stratford',
    line: 'Central Line',
    lineColor: '#E32017',
    features: ['wheelchair', 'step-free', 'escalator', 'elevator', 'accessible-toilet', 'staff-assistance'],
    notes: 'Full step-free access throughout the station.'
  },
];

const AccessibilityPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-blue-500" />
          Accessibility Information
        </CardTitle>
        <CardDescription>Station accessibility features and routes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Accessible Stations</h3>
            <div className="space-y-3">
              {mockAccessibleStations.map((station) => (
                <div 
                  key={station.id} 
                  className="border rounded-md p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: station.lineColor }}
                      />
                      <span className="font-medium">{station.name}</span>
                    </div>
                    <Badge variant="outline">{station.line}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {station.features.includes('wheelchair') && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Accessibility className="h-3 w-3" />
                        <span>Wheelchair</span>
                      </Badge>
                    )}
                    {station.features.includes('elevator') && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Elevator</span>
                      </Badge>
                    )}
                    {station.features.includes('escalator') && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <StairsIcon className="h-3 w-3" />
                        <span>Escalator</span>
                      </Badge>
                    )}
                  </div>
                  
                  {station.notes && (
                    <p className="text-xs text-muted-foreground">{station.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Accessible Route Planner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plan your journey using only accessible stations and routes with step-free access.
            </p>
            
            <div className="bg-secondary/20 p-3 rounded-md">
              <div className="text-sm">
                <p className="flex items-center gap-2 mb-2">
                  <Accessibility className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Currently 86 out of 270 stations have step-free access</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Use our accessibility filter when planning your journey to see only accessible routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityPanel;
