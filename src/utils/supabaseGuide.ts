
/**
 * SUPABASE INTEGRATION GUIDE
 * 
 * This file provides guidance on setting up Supabase for your Balance Tracker application.
 * Steps to integrate Supabase:
 * 
 * 1. Create a Supabase account and project at https://supabase.com
 * 2. Install the Supabase client libraries
 * 3. Set up authentication
 * 4. Create database tables
 * 5. Create API functions
 * 6. Connect your application
 */

/**
 * HOW TO INSTALL SUPABASE
 * 
 * Run the following commands to install the required packages:
 * 
 * npm install @supabase/supabase-js
 * 
 * Or if using Yarn:
 * 
 * yarn add @supabase/supabase-js
 */

/**
 * BASIC SUPABASE CLIENT SETUP
 * 
 * Create a file src/utils/supabase.ts with the following content:
 */

/*
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
*/

/**
 * DATABASE SCHEMA
 * 
 * Here's the recommended database schema for the Balance Tracker app:
 * 
 * 1. users - Managed by Supabase Auth
 * 
 * 2. profiles
 *    - id (references auth.users.id)
 *    - created_at
 *    - default_currency (TEXT, 'USD' or 'TRY')
 *    - include_long_term_debt (BOOLEAN)
 * 
 * 3. incomes
 *    - id (UUID, primary key)
 *    - user_id (references auth.users.id)
 *    - title (TEXT)
 *    - amount (NUMERIC)
 *    - category (TEXT)
 *    - date (TIMESTAMP)
 *    - status (TEXT, 'received' or 'expected')
 *    - currency (TEXT, 'USD' or 'TRY')
 *    - created_at (TIMESTAMP)
 * 
 * 4. expenses
 *    - id (UUID, primary key)
 *    - user_id (references auth.users.id)
 *    - title (TEXT)
 *    - amount (NUMERIC)
 *    - category (TEXT)
 *    - date (TIMESTAMP)
 *    - type (TEXT, 'recurring' or 'one-time')
 *    - currency (TEXT, 'USD' or 'TRY')
 *    - created_at (TIMESTAMP)
 * 
 * 5. debts
 *    - id (UUID, primary key)
 *    - user_id (references auth.users.id)
 *    - title (TEXT)
 *    - amount (NUMERIC)
 *    - creditor (TEXT)
 *    - deadline (TIMESTAMP)
 *    - is_long_term (BOOLEAN)
 *    - status (TEXT, 'pending' or 'paid')
 *    - currency (TEXT, 'USD' or 'TRY')
 *    - created_at (TIMESTAMP)
 * 
 * 6. assets
 *    - id (UUID, primary key)
 *    - user_id (references auth.users.id)
 *    - title (TEXT)
 *    - type (TEXT, 'silver', 'gold', etc.)
 *    - amount (NUMERIC)
 *    - unit (TEXT, 'kg', 'oz', etc.)
 *    - current_price (NUMERIC)
 *    - created_at (TIMESTAMP)
 * 
 * 7. exchange_rates
 *    - id (UUID, primary key)
 *    - from_currency (TEXT)
 *    - to_currency (TEXT)
 *    - rate (NUMERIC)
 *    - updated_at (TIMESTAMP)
 */

/**
 * ROW LEVEL SECURITY (RLS) POLICIES
 * 
 * Set up the following RLS policies to secure your data:
 * 
 * For each table (except exchange_rates), create policies like:
 * 
 * 1. Enable RLS on the table:
 *    ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;
 * 
 * 2. Create a policy for SELECT:
 *    CREATE POLICY "<table_name>_select_policy"
 *    ON <table_name>
 *    FOR SELECT
 *    USING (auth.uid() = user_id);
 * 
 * 3. Create a policy for INSERT:
 *    CREATE POLICY "<table_name>_insert_policy"
 *    ON <table_name>
 *    FOR INSERT
 *    WITH CHECK (auth.uid() = user_id);
 * 
 * 4. Create policies for UPDATE and DELETE similarly
 * 
 * For exchange_rates, allow public read access but restrict write access to authenticated users with specific roles.
 */

/**
 * SAMPLE DATA ACCESS FUNCTIONS
 * 
 * Here are examples of functions to interact with your Supabase data:
 */

/*
// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Profile functions
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
};

export const updateProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);
    
  return { data, error };
};

// Income functions
export const getIncomes = async () => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .order('date', { ascending: false });
    
  return { data, error };
};

export const addIncome = async (income: Omit<Income, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('incomes')
    .insert([{ ...income, user_id: user.id }]);
    
  return { data, error };
};

// Similar functions for expenses, debts, and assets
*/

/**
 * INTEGRATING WITH EXTERNAL APIS
 * 
 * For currency exchange rates and metal prices, consider these APIs:
 * 
 * 1. Currency Exchange: 
 *    - https://app.exchangerate-api.com/ 
 *    - https://currencylayer.com/
 * 
 * 2. Metal Prices:
 *    - https://metals-api.com/
 *    - https://www.goldapi.io/
 * 
 * Set up Edge Functions in Supabase to interact with these APIs securely,
 * keeping your API keys protected.
 */

/**
 * SUPABASE EDGE FUNCTIONS
 * 
 * Create an edge function to fetch exchange rates:
 */

/*
// exchange-rates.ts edge function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const apiKey = Deno.env.get('EXCHANGE_RATE_API_KEY');
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD?api_key=${apiKey}`);
    const rateData = await response.json();
    
    // Update database
    const { data, error } = await supabaseClient
      .from('exchange_rates')
      .upsert({
        from_currency: 'USD',
        to_currency: 'TRY',
        rate: rateData.rates.TRY,
        updated_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
*/

/**
 * CONTEXT PROVIDER FOR STATE MANAGEMENT
 * 
 * Create a context provider to manage authentication and data state:
 */

/*
// src/contexts/SupabaseContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
*/

/**
 * INITIALIZATION
 * 
 * Wrap your application with the SupabaseProvider in your main.tsx:
 */

/*
import { SupabaseProvider } from './contexts/SupabaseContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>
);
*/

export {};
