
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NetworkMap from "./pages/NetworkMap";
import Analytics from "./pages/Analytics";
import Forecasting from "./pages/Forecasting";
import AdvancedForecasting from "./pages/AdvancedForecasting";
import Alerts from "./pages/Alerts";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/network" replace />} />
          <Route path="/network" element={<NetworkMap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/advanced-forecasting" element={<AdvancedForecasting />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/journey-planner" element={<Alerts />} />
          <Route path="/historical" element={<Explore />} />
          <Route path="/weather" element={<Alerts />} />
          <Route path="/accessibility" element={<Explore />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
