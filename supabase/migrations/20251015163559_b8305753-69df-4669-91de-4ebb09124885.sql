-- Create table for London Underground passenger data
CREATE TABLE public.underground_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamptz NOT NULL,
  station_name text NOT NULL,
  line text NOT NULL,
  passenger_count integer NOT NULL,
  entry_count integer NOT NULL,
  exit_count integer NOT NULL,
  temperature numeric(4,1),
  weather_condition text,
  day_of_week text NOT NULL,
  hour integer NOT NULL CHECK (hour >= 0 AND hour < 24),
  is_rush_hour integer NOT NULL CHECK (is_rush_hour IN (0, 1)),
  delays_minutes integer DEFAULT 0,
  service_status text NOT NULL,
  congestion_level text NOT NULL,
  platform_crowding integer,
  train_frequency integer,
  avg_dwell_time integer,
  incidents integer DEFAULT 0,
  maintenance_scheduled integer DEFAULT 0,
  accessibility_requests integer DEFAULT 0,
  ticket_sales integer,
  contactless_payments integer,
  oyster_payments integer,
  peak_multiplier numeric(3,1),
  previous_hour_flow integer,
  predicted_next_hour integer,
  anomaly_detected integer DEFAULT 0 CHECK (anomaly_detected IN (0, 1)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_underground_data_timestamp ON public.underground_data(timestamp);
CREATE INDEX idx_underground_data_station ON public.underground_data(station_name);
CREATE INDEX idx_underground_data_line ON public.underground_data(line);
CREATE INDEX idx_underground_data_hour ON public.underground_data(hour);
CREATE INDEX idx_underground_data_rush_hour ON public.underground_data(is_rush_hour);

-- Enable Row Level Security
ALTER TABLE public.underground_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for analytics dashboard)
CREATE POLICY "Allow public read access to underground data"
ON public.underground_data
FOR SELECT
USING (true);

-- Create policy to allow authenticated users to insert data
CREATE POLICY "Allow authenticated users to insert underground data"
ON public.underground_data
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create table for AI predictions
CREATE TABLE public.predictions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_name text NOT NULL,
  prediction_type text NOT NULL,
  predicted_value numeric NOT NULL,
  confidence_score numeric(5,2),
  prediction_time timestamptz NOT NULL,
  input_features jsonb,
  model_version text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS for predictions
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policy for predictions
CREATE POLICY "Allow public read access to predictions"
ON public.predictions
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to insert predictions"
ON public.predictions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for predictions
CREATE INDEX idx_predictions_station ON public.predictions(station_name);
CREATE INDEX idx_predictions_time ON public.predictions(prediction_time);