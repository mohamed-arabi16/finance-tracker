
// This file serves as a template for a Supabase Edge Function
// to automatically update exchange rates daily

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// For CORS support
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      // These would be environment variables in your Edge Function
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the latest exchange rate from an API
    const apiKey = Deno.env.get('EXCHANGE_RATE_API_KEY') ?? '';
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.rates || !data.rates.TRY) {
      throw new Error('Invalid response from exchange rate API');
    }

    const tryRate = data.rates.TRY;
    const timestamp = new Date().toISOString();

    // Update the exchange rate in the database
    const { data: updatedRate, error } = await supabaseClient
      .from('exchange_rates')
      .upsert({
        from_currency: 'USD',
        to_currency: 'TRY',
        rate: tryRate,
        updated_at: timestamp
      }, {
        onConflict: 'from_currency,to_currency'
      })
      .select();
      
    if (error) {
      throw error;
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          from: 'USD',
          to: 'TRY',
          rate: tryRate,
          updated_at: timestamp
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

// To deploy this function to Supabase:
// 1. Save this file as update-exchange-rates.ts in your Supabase project
// 2. Run: supabase functions deploy update-exchange-rates
// 3. Create a scheduled trigger in the Supabase dashboard to run this function daily
