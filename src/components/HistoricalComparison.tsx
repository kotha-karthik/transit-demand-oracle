
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar as CalendarIcon, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

const mockHistoricalData = [
  { hour: '00:00', current: 420, previous: 380, baseline: 400 },
  { hour: '02:00', current: 320, previous: 290, baseline: 300 },
  { hour: '04:00', current: 280, previous: 260, baseline: 270 },
  { hour: '06:00', current: 890, previous: 800, baseline: 850 },
  { hour: '08:00', current: 2200, previous: 2000, baseline: 2100 },
  { hour: '10:00', current: 1800, previous: 1700, baseline: 1750 },
  { hour: '12:00', current: 1600, previous: 1550, baseline: 1580 },
  { hour: '14:00', current: 1400, previous: 1350, baseline: 1380 },
  { hour: '16:00', current: 1700, previous: 1600, baseline: 1650 },
  { hour: '18:00', current: 2300, previous: 2150, baseline: 2200 },
  { hour: '20:00', current: 1200, previous: 1150, baseline: 1180 },
  { hour: '22:00', current: 800, previous: 750, baseline: 780 },
];

const HistoricalComparison = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [compareDate, setCompareDate] = useState<Date | undefined>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // One week ago
  );

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate percentage change
  const calculateChange = () => {
    const currentTotal = mockHistoricalData.reduce((sum, item) => sum + item.current, 0);
    const previousTotal = mockHistoricalData.reduce((sum, item) => sum + item.previous, 0);
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    return change.toFixed(1);
  };

  const percentChange = calculateChange();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg">Historical Comparison</CardTitle>
            <CardDescription>Compare passenger flows over time</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(date)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Badge variant="outline" className="gap-1">
              <ArrowUpDown className="h-4 w-4" />
            </Badge>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(compareDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={compareDate}
                  onSelect={(date) => setCompareDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Overall Change</div>
            <div className="flex items-center">
              {parseFloat(percentChange) > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500 mr-1" />
              )}
              <span className={`text-xl font-bold ${parseFloat(percentChange) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentChange}%
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Peak Difference</div>
            <div className="text-xl font-bold">+150</div>
            <div className="text-xs text-muted-foreground">passengers at 18:00</div>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
            <div className="text-xl font-bold">14,910</div>
            <div className="text-xs text-muted-foreground">passengers in 24h</div>
          </div>
        </div>

        <ChartContainer
          className="h-64" 
          config={{
            current: { color: "#3B82F6" },
            previous: { color: "#9CA3AF" },
            baseline: { color: "#10B981" }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockHistoricalData}
              margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                name="Current"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                name="Previous"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={{ r: 3 }}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="baseline"
                name="Average"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>This chart compares passenger volumes between the selected dates. The baseline represents the average for this day of the week.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalComparison;
