
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Radio, 
  Camera, 
  Users, 
  Clock, 
  MapPin,
  Activity,
  Phone,
  MessageSquare,
  Eye,
  Zap
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface IncidentReport {
  id: string;
  type: 'security' | 'medical' | 'technical' | 'crowd';
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  status: 'active' | 'responding' | 'resolved';
  assignedOfficer?: string;
}

const OfficerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [incidents, setIncidents] = useState<IncidentReport[]>([
    {
      id: '1',
      type: 'security',
      location: 'Oxford Circus Station - Platform 2',
      severity: 'high',
      timestamp: '14:32',
      description: 'Suspicious package reported near the platform edge',
      status: 'active',
      assignedOfficer: 'Officer Johnson'
    },
    {
      id: '2',
      type: 'medical',
      location: 'King\'s Cross St. Pancras - Main Concourse',
      severity: 'medium',
      timestamp: '14:28',
      description: 'Passenger collapsed, ambulance requested',
      status: 'responding'
    },
    {
      id: '3',
      type: 'crowd',
      location: 'London Bridge Station - Northern Line',
      severity: 'medium',
      timestamp: '14:25',
      description: 'Overcrowding detected, crowd control needed',
      status: 'active'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleIncidentAction = (incidentId: string, action: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { ...incident, status: action as any }
        : incident
    ));
    
    toast({
      title: "Incident Updated",
      description: `Incident ${incidentId} marked as ${action}`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch(type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'medical': return <Activity className="h-4 w-4" />;
      case 'technical': return <Zap className="h-4 w-4" />;
      case 'crowd': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Command Header */}
      <Card className="bg-slate-900 text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-400" />
              <div>
                <CardTitle className="text-lg">London Metro Command Center</CardTitle>
                <p className="text-sm text-slate-300">Officer Control Panel - Live Operations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-400 text-green-400">
                <Radio className="h-3 w-3 mr-1" />
                ONLINE
              </Badge>
              <div className="text-right">
                <div className="text-lg font-mono">{currentTime.toLocaleTimeString()}</div>
                <div className="text-xs text-slate-400">{currentTime.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Phone className="h-5 w-5" />
          <span className="text-xs">Emergency Call</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Camera className="h-5 w-5" />
          <span className="text-xs">CCTV Access</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Dispatch Radio</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Eye className="h-5 w-5" />
          <span className="text-xs">Live Monitoring</span>
        </Button>
      </div>

      {/* Active Incidents */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="text-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Active Incidents ({incidents.filter(i => i.status === 'active').length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {incidents.map((incident) => (
              <div key={incident.id} className="border-b p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getIncidentIcon(incident.type)}
                    <span className="font-medium">{incident.location}</span>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={incident.status === 'active' ? 'destructive' : 
                                  incident.status === 'responding' ? 'secondary' : 'outline'}>
                      {incident.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">{incident.timestamp}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                
                {incident.assignedOfficer && (
                  <p className="text-xs text-blue-600 mb-2">Assigned: {incident.assignedOfficer}</p>
                )}
                
                <div className="flex gap-2">
                  {incident.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleIncidentAction(incident.id, 'responding')}
                    >
                      Respond
                    </Button>
                  )}
                  {incident.status === 'responding' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleIncidentAction(incident.id, 'resolved')}
                    >
                      Resolve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <MapPin className="h-3 w-3 mr-1" />
                    Locate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerDashboard;
