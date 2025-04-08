
// Top metro cities data with information about their metro systems
export const topMetroCities = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    stats: {
      dailyRidership: 8.66, // million
      lines: 13,
      stations: 290,
      networkLength: 304, // km
    },
    modelAccuracy: 94.7, // percentage
    peakHours: ["7:30 - 8:30", "18:00 - 19:00"],
    significantFactors: ["Rain", "National Holidays", "Sports Events"]
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    stats: {
      dailyRidership: 7.12, // million
      lines: 24,
      stations: 428,
      networkLength: 727, // km
    },
    modelAccuracy: 93.2, // percentage
    peakHours: ["7:00 - 8:00", "17:30 - 18:30"],
    significantFactors: ["Air Quality", "Major Events", "Weekend"]
  },
  {
    id: "shanghai",
    name: "Shanghai",
    country: "China",
    stats: {
      dailyRidership: 6.66, // million
      lines: 20,
      stations: 413,
      networkLength: 802, // km
    },
    modelAccuracy: 92.8, // percentage
    peakHours: ["7:30 - 8:30", "17:30 - 18:30"],
    significantFactors: ["Weather", "Public Holidays", "Sporting Events"]
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    stats: {
      dailyRidership: 5.6, // million
      lines: 23,
      stations: 341,
      networkLength: 353, // km
    },
    modelAccuracy: 91.5, // percentage
    peakHours: ["7:00 - 9:00", "18:00 - 20:00"],
    significantFactors: ["Festivals", "Temperature", "COVID Restrictions"]
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    stats: {
      dailyRidership: 5.4, // million
      lines: 14,
      stations: 246,
      networkLength: 412, // km
    },
    modelAccuracy: 90.1, // percentage
    peakHours: ["7:30 - 9:30", "17:00 - 19:00"],
    significantFactors: ["Snow", "Cultural Events", "Temperature"]
  },
  {
    id: "nyc",
    name: "New York City",
    country: "USA",
    stats: {
      dailyRidership: 4.3, // million
      lines: 36,
      stations: 472,
      networkLength: 380, // km
    },
    modelAccuracy: 89.4, // percentage
    peakHours: ["7:00 - 9:00", "16:30 - 18:30"],
    significantFactors: ["Rain", "Snow", "Major Events", "Tourism Seasons"]
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    stats: {
      dailyRidership: 3.8, // million
      lines: 11,
      stations: 270,
      networkLength: 402, // km
    },
    modelAccuracy: 91.3, // percentage
    peakHours: ["7:30 - 9:30", "17:00 - 19:00"],
    significantFactors: ["Rain", "Tourism", "Sporting Events"]
  },
  {
    id: "mexico",
    name: "Mexico City",
    country: "Mexico",
    stats: {
      dailyRidership: 3.2, // million
      lines: 12,
      stations: 195,
      networkLength: 226, // km
    },
    modelAccuracy: 87.6, // percentage
    peakHours: ["6:30 - 8:30", "17:30 - 19:30"],
    significantFactors: ["Rain", "Holidays", "Air Quality"]
  }
];

// Real-time data for each city (this would come from an API in a real application)
export const cityRealTimeData = {
  "tokyo": {
    currentPassengerLoad: 4.2, // million
    forecastAccuracy: 95.1, // percentage last 24h
    criticalStations: [
      { name: "Shinjuku", load: "Heavy", prediction: "Increasing" },
      { name: "Tokyo Station", load: "Moderate", prediction: "Stable" },
      { name: "Shibuya", load: "Heavy", prediction: "Decreasing" }
    ],
    alerts: ["Heavy rain affecting eastern lines", "Delay on Yamanote Line due to maintenance"],
    trendingFactors: ["Rain (43% impact)", "Baseball game (27% impact)", "Friday evening (18% impact)"]
  },
  "beijing": {
    currentPassengerLoad: 3.8, // million
    forecastAccuracy: 94.2, // percentage last 24h
    criticalStations: [
      { name: "Beijing South Railway", load: "Heavy", prediction: "Stable" },
      { name: "Guomao", load: "Moderate", prediction: "Increasing" },
      { name: "Dongdan", load: "Low", prediction: "Stable" }
    ],
    alerts: ["Line 1 running at reduced frequency", "Construction affecting transfers at Dongzhimen"],
    trendingFactors: ["Weekend (38% impact)", "Cultural festival (29% impact)", "Clear weather (12% impact)"]
  },
  "shanghai": {
    currentPassengerLoad: 3.5, // million
    forecastAccuracy: 93.7, // percentage last 24h
    criticalStations: [
      { name: "People's Square", load: "Heavy", prediction: "Stable" },
      { name: "Century Avenue", load: "Heavy", prediction: "Decreasing" },
      { name: "Hongqiao Railway", load: "Moderate", prediction: "Increasing" }
    ],
    alerts: ["Signal issue on Line 2", "Planned maintenance on Line 9 this weekend"],
    trendingFactors: ["Shopping festival (41% impact)", "Light rain (23% impact)", "Tourist season (19% impact)"]
  },
  "seoul": {
    currentPassengerLoad: 2.9, // million
    forecastAccuracy: 92.5, // percentage last 24h
    criticalStations: [
      { name: "Gangnam", load: "Heavy", prediction: "Stable" },
      { name: "Seoul Station", load: "Heavy", prediction: "Increasing" },
      { name: "Hongik Univ.", load: "Moderate", prediction: "Increasing" }
    ],
    alerts: ["Minor delay on Line 2", "Reduced service on Line 9 after 10 PM"],
    trendingFactors: ["K-pop concert (35% impact)", "Business day (32% impact)", "Mild weather (11% impact)"]
  },
  "moscow": {
    currentPassengerLoad: 2.7, // million
    forecastAccuracy: 90.8, // percentage last 24h
    criticalStations: [
      { name: "Komsomolskaya", load: "Heavy", prediction: "Stable" },
      { name: "Park Kultury", load: "Moderate", prediction: "Decreasing" },
      { name: "Kievskaya", load: "Moderate", prediction: "Stable" }
    ],
    alerts: ["Planned closure for Line 14 maintenance", "Slight delays on Red Line"],
    trendingFactors: ["Snow (38% impact)", "Theatre festival (22% impact)", "Monday morning (18% impact)"]
  },
  "nyc": {
    currentPassengerLoad: 2.1, // million
    forecastAccuracy: 89.9, // percentage last 24h
    criticalStations: [
      { name: "Times Square", load: "Heavy", prediction: "Increasing" },
      { name: "Grand Central", load: "Heavy", prediction: "Stable" },
      { name: "Union Square", load: "Moderate", prediction: "Decreasing" }
    ],
    alerts: ["Service changes on A,C,E lines this weekend", "Signal problems at 34th St"],
    trendingFactors: ["Basketball game (31% impact)", "Rain forecast (25% impact)", "Broadway shows (22% impact)"]
  },
  "london": {
    currentPassengerLoad: 2.0, // million
    forecastAccuracy: 91.5, // percentage last 24h
    criticalStations: [
      { name: "King's Cross", load: "Heavy", prediction: "Stable" },
      { name: "Waterloo", load: "Heavy", prediction: "Decreasing" },
      { name: "Oxford Circus", load: "Moderate", prediction: "Increasing" }
    ],
    alerts: ["Central Line partial closure", "Planned engineering works on Northern Line"],
    trendingFactors: ["Football match (36% impact)", "Tourism (27% impact)", "Light rain (16% impact)"]
  },
  "mexico": {
    currentPassengerLoad: 1.7, // million
    forecastAccuracy: 87.3, // percentage last 24h
    criticalStations: [
      { name: "Pantitlán", load: "Heavy", prediction: "Stable" },
      { name: "Indios Verdes", load: "Moderate", prediction: "Decreasing" },
      { name: "Constitución", load: "Moderate", prediction: "Stable" }
    ],
    alerts: ["Reduced frequency on Line 3", "Construction affecting Line 12"],
    trendingFactors: ["Festival (33% impact)", "Public holiday (28% impact)", "High temperature (21% impact)"]
  }
};

// Metro network data for visualization (simplified for demonstration)
export const cityMetroNetworks = {
  "tokyo": {
    stations: [
      { id: 1, name: "Shinjuku", x: 45, y: 40 },
      { id: 2, name: "Tokyo Station", x: 60, y: 50 },
      { id: 3, name: "Shibuya", x: 40, y: 60 },
      { id: 4, name: "Ikebukuro", x: 45, y: 25 },
      { id: 5, name: "Ginza", x: 65, y: 55 },
      { id: 6, name: "Ueno", x: 60, y: 35 },
      { id: 7, name: "Akihabara", x: 63, y: 45 },
      { id: 8, name: "Roppongi", x: 55, y: 65 }
    ],
    lines: [
      { source: 1, target: 4, volume: 180, predictedVolume: 190 },
      { source: 1, target: 2, volume: 220, predictedVolume: 215 },
      { source: 1, target: 3, volume: 160, predictedVolume: 170 },
      { source: 2, target: 5, volume: 140, predictedVolume: 145 },
      { source: 2, target: 7, volume: 130, predictedVolume: 125 },
      { source: 3, target: 8, volume: 90, predictedVolume: 100 },
      { source: 4, target: 6, volume: 110, predictedVolume: 105 },
      { source: 5, target: 7, volume: 85, predictedVolume: 90 },
      { source: 6, target: 7, volume: 100, predictedVolume: 95 },
      { source: 7, target: 8, volume: 70, predictedVolume: 80 }
    ]
  },
  "beijing": {
    stations: [
      { id: 1, name: "Beijing South", x: 50, y: 70 },
      { id: 2, name: "Guomao", x: 60, y: 50 },
      { id: 3, name: "Dongdan", x: 55, y: 45 },
      { id: 4, name: "Xizhimen", x: 40, y: 35 },
      { id: 5, name: "Wangfujing", x: 55, y: 40 },
      { id: 6, name: "Sanlitun", x: 65, y: 40 },
      { id: 7, name: "Zhongguancun", x: 35, y: 30 },
      { id: 8, name: "Olympic Park", x: 45, y: 25 }
    ],
    lines: [
      { source: 1, target: 2, volume: 200, predictedVolume: 210 },
      { source: 2, target: 3, volume: 180, predictedVolume: 185 },
      { source: 3, target: 5, volume: 160, predictedVolume: 155 },
      { source: 4, target: 7, volume: 120, predictedVolume: 125 },
      { source: 4, target: 3, volume: 150, predictedVolume: 160 },
      { source: 5, target: 6, volume: 100, predictedVolume: 95 },
      { source: 7, target: 8, volume: 90, predictedVolume: 100 },
      { source: 8, target: 4, volume: 110, predictedVolume: 105 }
    ]
  },
  // Add simplified network data for other cities here
  "shanghai": { stations: [], lines: [] },
  "seoul": { stations: [], lines: [] },
  "moscow": { stations: [], lines: [] },
  "nyc": { stations: [], lines: [] },
  "london": { stations: [], lines: [] },
  "mexico": { stations: [], lines: [] }
};
