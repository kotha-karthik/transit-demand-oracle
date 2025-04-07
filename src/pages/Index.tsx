
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <Dashboard />
      </main>
      <footer className="bg-primary/5 py-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Metro Travel Flow Forecasting System - LSTM with Multigraph Convolution and External Factor Attention</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
