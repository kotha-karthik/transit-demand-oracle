
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Train, BarChart3, LineChart, Network, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/network', 
      name: 'Network Map', 
      icon: <Network className="h-5 w-5" /> 
    },
    { 
      path: '/analytics', 
      name: 'Real-time Analytics', 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    { 
      path: '/forecasting', 
      name: 'Forecasting', 
      icon: <LineChart className="h-5 w-5" /> 
    },
    { 
      path: '/advanced-forecasting', 
      name: 'Advanced Models', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
    <div className="fixed left-0 top-0 z-30 h-screen w-[70px] border-r bg-card px-3 py-8 md:w-[240px] overflow-y-auto">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-2 px-2">
            <Train className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-lg md:inline-flex">London Metro</span>
          </div>
          
          <div className="space-y-1 pt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    isActive ? "bg-primary text-primary-foreground hover:text-primary-foreground" : "hover:bg-secondary/50"
                  )
                }
              >
                {item.icon}
                <span className="hidden md:inline-flex">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="hidden md:flex mb-2 px-3 flex-col gap-2">
          <Badge variant="outline" className="justify-center gap-1 text-xs">
            <span>v1.0.0</span>
          </Badge>
          <div className="text-xs text-muted-foreground text-center">
            Metro Passenger Analytics
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
