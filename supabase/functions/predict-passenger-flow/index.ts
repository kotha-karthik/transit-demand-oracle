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
    const { stationName, hour, dayOfWeek, weatherCondition, historicalData } = await req.json();
    
    console.log('Prediction request:', { stationName, hour, dayOfWeek, weatherCondition });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare the prompt for AI prediction
    const prompt = `You are a London Underground passenger flow prediction expert. Analyze the following data and predict passenger flow.

Station: ${stationName}
Hour: ${hour}:00
Day of Week: ${dayOfWeek}
Weather: ${weatherCondition}

Historical Data (last 7 days same hour):
${JSON.stringify(historicalData, null, 2)}

Based on this data, provide predictions for:
1. Expected passenger count
2. Entry count
3. Exit count
4. Congestion level (Low/Medium/High/Very High)
5. Recommended train frequency (trains per hour)
6. Anomaly risk (0-100%)

Respond ONLY in valid JSON format:
{
  "passenger_count": number,
  "entry_count": number,
  "exit_count": number,
  "congestion_level": "string",
  "recommended_train_frequency": number,
  "anomaly_risk": number,
  "confidence_score": number (0-100),
  "reasoning": "brief explanation"
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
            content: 'You are an expert in London Underground passenger flow prediction. Always respond with valid JSON only, no markdown or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add funds to your workspace.');
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI prediction service unavailable');
    }

    const aiData = await response.json();
    console.log('AI response:', JSON.stringify(aiData));
    
    let predictionText = aiData.choices[0].message.content;
    
    // Clean up the response to extract JSON
    predictionText = predictionText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const prediction = JSON.parse(predictionText);

    // Store prediction in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('predictions').insert({
      station_name: stationName,
      prediction_type: 'passenger_flow',
      predicted_value: prediction.passenger_count,
      confidence_score: prediction.confidence_score,
      prediction_time: new Date().toISOString(),
      input_features: {
        hour,
        dayOfWeek,
        weatherCondition,
        historicalData
      },
      model_version: 'gemini-2.5-flash-v1'
    });

    return new Response(
      JSON.stringify({
        success: true,
        prediction
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in predict-passenger-flow:', error);
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