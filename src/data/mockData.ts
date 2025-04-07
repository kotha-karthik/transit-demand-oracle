
// Mock station data with coordinates for visualization
export const stations = [
  { id: 1, name: "Central Station", x: 50, y: 50 },
  { id: 2, name: "North Terminal", x: 50, y: 20 },
  { id: 3, name: "East Junction", x: 80, y: 50 },
  { id: 4, name: "South Plaza", x: 50, y: 80 },
  { id: 5, name: "West Gateway", x: 20, y: 50 },
  { id: 6, name: "Downtown", x: 35, y: 35 },
  { id: 7, name: "Uptown", x: 65, y: 35 },
  { id: 8, name: "Riverside", x: 65, y: 65 },
  { id: 9, name: "Parkside", x: 35, y: 65 },
];

// Mock OD flow data
export const flowData = [
  { origin: 1, destination: 2, volume: 120, predictedVolume: 135 },
  { origin: 1, destination: 3, volume: 200, predictedVolume: 210 },
  { origin: 1, destination: 4, volume: 150, predictedVolume: 145 },
  { origin: 1, destination: 5, volume: 180, predictedVolume: 190 },
  { origin: 2, destination: 6, volume: 90, predictedVolume: 95 },
  { origin: 3, destination: 7, volume: 110, predictedVolume: 125 },
  { origin: 4, destination: 8, volume: 130, predictedVolume: 120 },
  { origin: 5, destination: 9, volume: 100, predictedVolume: 115 },
  { origin: 6, destination: 1, volume: 95, predictedVolume: 90 },
  { origin: 7, destination: 1, volume: 105, predictedVolume: 110 },
  { origin: 8, destination: 1, volume: 125, predictedVolume: 130 },
  { origin: 9, destination: 1, volume: 115, predictedVolume: 105 },
];

// Mock time series data for hourly passenger flow
export const timeSeriesData = [
  { time: "00:00", actual: 50, predicted: 55 },
  { time: "01:00", actual: 30, predicted: 35 },
  { time: "02:00", actual: 20, predicted: 25 },
  { time: "03:00", actual: 15, predicted: 20 },
  { time: "04:00", actual: 25, predicted: 30 },
  { time: "05:00", actual: 60, predicted: 65 },
  { time: "06:00", actual: 120, predicted: 125 },
  { time: "07:00", actual: 200, predicted: 210 },
  { time: "08:00", actual: 280, predicted: 290 },
  { time: "09:00", actual: 230, predicted: 225 },
  { time: "10:00", actual: 180, predicted: 175 },
  { time: "11:00", actual: 160, predicted: 170 },
  { time: "12:00", actual: 200, predicted: 205 },
  { time: "13:00", actual: 220, predicted: 215 },
  { time: "14:00", actual: 190, predicted: 200 },
  { time: "15:00", actual: 170, predicted: 165 },
  { time: "16:00", actual: 210, predicted: 215 },
  { time: "17:00", actual: 290, predicted: 280 },
  { time: "18:00", actual: 260, predicted: 270 },
  { time: "19:00", actual: 210, predicted: 200 },
  { time: "20:00", actual: 150, predicted: 145 },
  { time: "21:00", actual: 120, predicted: 125 },
  { time: "22:00", actual: 90, predicted: 95 },
  { time: "23:00", actual: 70, predicted: 75 },
];

// Mock external factors data
export const externalFactors = [
  { id: "weather", name: "Weather Conditions", options: ["Sunny", "Rainy", "Snowy", "Cloudy"], current: "Sunny" },
  { id: "event", name: "Special Events", options: ["None", "Concert", "Sports", "Festival"], current: "None" },
  { id: "holiday", name: "Holiday", options: ["None", "National Holiday", "School Holiday"], current: "None" },
  { id: "dayType", name: "Day Type", options: ["Weekday", "Weekend"], current: "Weekday" },
];

// Mock model components for visualization
export const modelComponents = [
  { id: "lstm", name: "LSTM Network", description: "Captures temporal dependencies in flow data" },
  { id: "mgcn", name: "Multigraph Convolutional Network", description: "Models spatial relationships between stations" },
  { id: "attention", name: "External Factor Attention", description: "Incorporates impact of external variables" },
];

// Prediction performance metrics
export const performanceMetrics = [
  { name: "MAE", value: 12.5 },
  { name: "RMSE", value: 18.2 },
  { name: "R²", value: 0.87 },
];
