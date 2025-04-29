
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, MapPin, Clock, BarChart, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Train className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">London Underground</h1>
              <p className="text-xs text-muted-foreground">Passenger Flow Analysis System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/network" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Network Map</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/analytics" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/forecasting" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Forecasting</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">API Docs</Button>
            <Button size="sm">Dashboard</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
