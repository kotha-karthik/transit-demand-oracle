import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, CheckCircle2, XCircle, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const CSVUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const obj: any = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim();
        
        // Convert to appropriate types
        if (header === 'timestamp') {
          obj[header] = value;
        } else if (['passenger_count', 'entry_count', 'exit_count', 'hour', 'is_rush_hour', 
                    'delays_minutes', 'platform_crowding', 'train_frequency', 'avg_dwell_time',
                    'incidents', 'maintenance_scheduled', 'accessibility_requests', 
                    'ticket_sales', 'contactless_payments', 'oyster_payments',
                    'previous_hour_flow', 'predicted_next_hour', 'anomaly_detected'].includes(header)) {
          obj[header] = parseInt(value) || 0;
        } else if (['temperature', 'peak_multiplier'].includes(header)) {
          obj[header] = parseFloat(value) || 0;
        } else {
          obj[header] = value;
        }
      });
      
      data.push(obj);
    }

    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    try {
      const text = await file.text();
      setProgress(20);
      
      const csvData = parseCSV(text);
      setProgress(40);

      if (csvData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      toast({
        title: "Processing Data",
        description: `Uploading ${csvData.length} records to database...`,
      });

      setProgress(60);

      const { data, error } = await supabase.functions.invoke('upload-csv-data', {
        body: { csvData }
      });

      setProgress(100);

      if (error) throw error;

      setUploadResult(data);
      
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${data.successCount} records`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || 'Failed to upload CSV data',
        variant: "destructive"
      });
      setUploadResult({ error: error.message });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>Dataset Upload</CardTitle>
        </div>
        <CardDescription>
          Upload your CSV file with London Underground data (up to 70,000 rows)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <div>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs mx-auto"
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading... {progress}%
              </p>
            </div>
          )}

          {uploadResult && !uploading && (
            <div className={`p-4 rounded-lg ${uploadResult.error ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
              <div className="flex items-center justify-center gap-2">
                {uploadResult.error ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-500 font-medium">Upload Failed</p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-green-500 font-medium">Upload Successful</p>
                  </>
                )}
              </div>
              {!uploadResult.error && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Total Rows: {uploadResult.totalRows}</p>
                  <p>Success: {uploadResult.successCount}</p>
                  {uploadResult.errorCount > 0 && (
                    <p className="text-red-500">Errors: {uploadResult.errorCount}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Expected CSV Format:</p>
          <p className="font-mono text-xs">timestamp, station_name, line, passenger_count, entry_count, exit_count, temperature, weather_condition, day_of_week, hour, is_rush_hour, delays_minutes, service_status, congestion_level, platform_crowding, train_frequency, avg_dwell_time, incidents, maintenance_scheduled, accessibility_requests, ticket_sales, contactless_payments, oyster_payments, peak_multiplier, previous_hour_flow, predicted_next_hour, anomaly_detected</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;