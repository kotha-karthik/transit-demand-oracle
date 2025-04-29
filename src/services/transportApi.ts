
import { toast } from "@/components/ui/use-toast";

// Transport API configuration
const TRANSPORT_API_KEY = "YOUR_TRANSPORT_API_KEY"; // Replace with actual API key when available
const TRANSPORT_API_APP_ID = "YOUR_APP_ID";         // Replace with actual app ID when available
const BASE_URL = "https://transportapi.com/v3";

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

export type Station = {
  id: string;
  name: string;
  code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type LineStatus = {
  id: string;
  name: string;
  status: string;
  description: string;
  updatedAt: string;
};

export type TrainArrival = {
  id: string;
  destination: string;
  expectedArrival: string;
  platformName: string;
  lineId: string;
  lineName: string;
  status: string;
  currentLocation?: string;
};

export const transportApi = {
  // Fetch line statuses for London Underground
  async getLineStatuses(): Promise<ApiResponse<LineStatus[]>> {
    try {
      // For demonstration - this would be a real API call
      // const response = await fetch(`${BASE_URL}/uk/tube/status.json?app_id=${TRANSPORT_API_APP_ID}&app_key=${TRANSPORT_API_KEY}`);
      
      // Mock data based on the structure of TransportAPI's response
      console.log("Fetching line statuses (mock)");
      const mockData: LineStatus[] = [
        { id: "bakerloo", name: "Bakerloo Line", status: "Good Service", description: "Running normally", updatedAt: new Date().toISOString() },
        { id: "central", name: "Central Line", status: "Minor Delays", description: "Minor delays due to signal failure at Liverpool Street", updatedAt: new Date().toISOString() },
        { id: "circle", name: "Circle Line", status: "Good Service", description: "Running normally", updatedAt: new Date().toISOString() },
        { id: "district", name: "District Line", status: "Part Closure", description: "No service between Earls Court and Wimbledon", updatedAt: new Date().toISOString() },
        { id: "jubilee", name: "Jubilee Line", status: "Good Service", description: "Running normally", updatedAt: new Date().toISOString() },
        { id: "northern", name: "Northern Line", status: "Severe Delays", description: "Severe delays due to earlier track fault at Camden Town", updatedAt: new Date().toISOString() },
        { id: "piccadilly", name: "Piccadilly Line", status: "Good Service", description: "Running normally", updatedAt: new Date().toISOString() },
        { id: "victoria", name: "Victoria Line", status: "Good Service", description: "Running normally", updatedAt: new Date().toISOString() },
      ];
      
      return { data: mockData, error: null, isLoading: false };
    } catch (error) {
      console.error("Error fetching line statuses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch line statuses",
        variant: "destructive",
      });
      return { data: null, error: "Failed to fetch line statuses", isLoading: false };
    }
  },
  
  // Get arrivals for a specific station
  async getStationArrivals(stationId: string): Promise<ApiResponse<TrainArrival[]>> {
    try {
      // For demonstration - this would be a real API call
      // const response = await fetch(`${BASE_URL}/uk/tube/station/${stationId}/live.json?app_id=${TRANSPORT_API_APP_ID}&app_key=${TRANSPORT_API_KEY}`);
      
      console.log(`Fetching arrivals for station ${stationId} (mock)`);
      
      // Mock data based on the structure of TransportAPI's response
      const mockArrivals: TrainArrival[] = [
        { id: "1", destination: "Morden via Bank", expectedArrival: new Date(Date.now() + 120000).toISOString(), platformName: "Southbound - Platform 2", lineId: "northern", lineName: "Northern Line", status: "On Time", currentLocation: "Approaching" },
        { id: "2", destination: "Edgware via Charing Cross", expectedArrival: new Date(Date.now() + 240000).toISOString(), platformName: "Northbound - Platform 1", lineId: "northern", lineName: "Northern Line", status: "On Time", currentLocation: "2 mins away" },
        { id: "3", destination: "Heathrow Terminal 5", expectedArrival: new Date(Date.now() + 320000).toISOString(), platformName: "Westbound - Platform 3", lineId: "piccadilly", lineName: "Piccadilly Line", status: "Delayed", currentLocation: "Departing previous station" },
      ];
      
      return { data: mockArrivals, error: null, isLoading: false };
    } catch (error) {
      console.error("Error fetching station arrivals:", error);
      toast({
        title: "Error",
        description: `Failed to fetch arrivals for station ${stationId}`,
        variant: "destructive",
      });
      return { data: null, error: `Failed to fetch arrivals for station ${stationId}`, isLoading: false };
    }
  },
  
  // Get passenger flow forecast
  async getPassengerFlowForecast(stationId: string, date: string): Promise<ApiResponse<any>> {
    try {
      console.log(`Fetching passenger flow forecast for station ${stationId} on ${date} (mock)`);
      
      // Mock data for passenger flow forecast
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const mockData = {
        stationId,
        date,
        hourlyForecasts: hours.map(hour => ({
          hour: `${hour}:00`,
          actualFlow: hour >= (new Date()).getHours() ? null : Math.floor(Math.random() * 1000) + 100,
          predictedFlow: Math.floor(Math.random() * 1000) + 100,
          confidenceScore: Math.round((Math.random() * 20) + 80),
        })),
        peakHours: [8, 9, 17, 18],
        totalDailyForecast: Math.floor(Math.random() * 20000) + 10000,
        comparedToYesterday: Math.random() > 0.5 ? Math.random() * 10 : -Math.random() * 10,
      };
      
      return { data: mockData, error: null, isLoading: false };
    } catch (error) {
      console.error("Error fetching passenger flow forecast:", error);
      toast({
        title: "Error",
        description: `Failed to fetch passenger flow forecast for station ${stationId}`,
        variant: "destructive",
      });
      return { data: null, error: `Failed to fetch passenger flow forecast for station ${stationId}`, isLoading: false };
    }
  }
};
