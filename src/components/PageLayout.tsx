
import React from 'react';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <Navigation />
      <main className={cn("flex-1 ml-[70px] md:ml-[240px] p-6", className)}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
