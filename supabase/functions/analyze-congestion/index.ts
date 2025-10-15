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
    const { stations, timeRange } = await req.json();
    
    console.log('Congestion analysis request:', { stations, timeRange });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get recent data for analysis
    const { data: recentData } = await supabase
      .from('underground_data')
      .select('*')
      .in('station_name', stations)
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);

    const prompt = `Analyze congestion patterns for London Underground stations.

Stations: ${stations.join(', ')}
Recent Data Summary:
${JSON.stringify(recentData?.slice(0, 20), null, 2)}

Provide real-time congestion analysis with:
1. Current congestion hotspots
2. Predicted congestion for next 2 hours
3. Recommended actions for traffic management
4. Alternative routes for passengers

Respond ONLY in valid JSON format:
{
  "hotspots": [{"station": "string", "severity": "string", "passengerCount": number}],
  "predictions": [{"hour": number, "stations": ["string"], "expectedLevel": "string"}],
  "recommendations": ["string"],
  "alternativeRoutes": [{"from": "string", "to": "string", "alternative": "string"}],
  "overallStatus": "string"
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a London Underground congestion analysis expert. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add funds to your workspace.');
      }
      throw new Error('AI analysis service unavailable');
    }

    const aiData = await response.json();
    let analysisText = aiData.choices[0].message.content;
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-congestion:', error);
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