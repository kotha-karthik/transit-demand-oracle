import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvData } = await req.json();
    
    if (!csvData || !Array.isArray(csvData)) {
      throw new Error('Invalid CSV data format');
    }

    console.log(`Uploading ${csvData.length} rows to database`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process data in batches of 1000
    const batchSize = 1000;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('underground_data')
        .insert(batch);

      if (error) {
        console.error(`Batch ${i / batchSize + 1} error:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
      }
    }

    console.log(`Upload complete: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        totalRows: csvData.length,
        successCount,
        errorCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in upload-csv-data:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});