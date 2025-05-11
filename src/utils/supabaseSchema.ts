
/**
 * Supabase Database Schema Guide
 * 
 * This file serves as documentation for the database schema needed to replace the mock data
 * in this application with real data from Supabase.
 */

/**
 * Table: incomes
 * 
 * Fields:
 * - id: uuid (PRIMARY KEY, auto-generated)
 * - user_id: uuid (REFERENCES auth.users.id) - Links income to specific user
 * - title: text (NOT NULL) - Title/description of income
 * - amount: numeric (NOT NULL) - Income amount
 * - category: text (NOT NULL) - One of: 'freelance', 'student', 'rent', 'videography', 'other'
 * - date: timestamp with time zone (NOT NULL) - When income was/will be received
 * - status: text (NOT NULL) - One of: 'received', 'expected'
 * - currency: text (NOT NULL, DEFAULT 'USD') - One of: 'USD', 'TRY'
 * - created_at: timestamp with time zone (DEFAULT now())
 * - updated_at: timestamp with time zone
 * 
 * Example SQL:
 * CREATE TABLE public.incomes (
 *   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) NOT NULL,
 *   title text NOT NULL,
 *   amount numeric NOT NULL,
 *   category text NOT NULL,
 *   date timestamp with time zone NOT NULL,
 *   status text NOT NULL,
 *   currency text NOT NULL DEFAULT 'USD',
 *   created_at timestamp with time zone DEFAULT now(),
 *   updated_at timestamp with time zone
 * );
 * 
 * RLS Policy:
 * ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
 * 
 * -- Allow users to select only their own incomes
 * CREATE POLICY select_own_incomes ON public.incomes
 *   FOR SELECT USING (auth.uid() = user_id);
 * 
 * -- Allow users to insert their own incomes
 * CREATE POLICY insert_own_incomes ON public.incomes
 *   FOR INSERT WITH CHECK (auth.uid() = user_id);
 * 
 * -- Allow users to update only their own incomes
 * CREATE POLICY update_own_incomes ON public.incomes
 *   FOR UPDATE USING (auth.uid() = user_id);
 * 
 * -- Allow users to delete only their own incomes
 * CREATE POLICY delete_own_incomes ON public.incomes
 *   FOR DELETE USING (auth.uid() = user_id);
 */

/**
 * Table: expenses
 * 
 * Fields:
 * - id: uuid (PRIMARY KEY, auto-generated)
 * - user_id: uuid (REFERENCES auth.users.id) - Links expense to specific user
 * - title: text (NOT NULL) - Title/description of expense
 * - amount: numeric (NOT NULL) - Expense amount
 * - date: timestamp with time zone (NOT NULL) - When expense was/will be paid
 * - type: text (NOT NULL) - One of: 'recurring', 'one-time'
 * - category: text - Optional category for expense (Housing, Utilities, Bills, etc.)
 * - currency: text (NOT NULL, DEFAULT 'USD') - One of: 'USD', 'TRY'
 * - created_at: timestamp with time zone (DEFAULT now())
 * - updated_at: timestamp with time zone
 * 
 * Example SQL:
 * CREATE TABLE public.expenses (
 *   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) NOT NULL,
 *   title text NOT NULL,
 *   amount numeric NOT NULL,
 *   date timestamp with time zone NOT NULL,
 *   type text NOT NULL,
 *   category text,
 *   currency text NOT NULL DEFAULT 'USD',
 *   created_at timestamp with time zone DEFAULT now(),
 *   updated_at timestamp with time zone
 * );
 * 
 * RLS Policy: (Similar to incomes table)
 */

/**
 * Table: debts
 * 
 * Fields:
 * - id: uuid (PRIMARY KEY, auto-generated)
 * - user_id: uuid (REFERENCES auth.users.id) - Links debt to specific user
 * - title: text (NOT NULL) - Title/description of debt
 * - amount: numeric (NOT NULL) - Debt amount
 * - creditor: text (NOT NULL) - Who the debt is owed to
 * - deadline: timestamp with time zone (NOT NULL) - When debt is due
 * - is_long_term: boolean (NOT NULL, DEFAULT false) - Whether debt is long-term
 * - status: text (NOT NULL) - One of: 'pending', 'paid'
 * - currency: text (NOT NULL, DEFAULT 'USD') - One of: 'USD', 'TRY'
 * - created_at: timestamp with time zone (DEFAULT now())
 * - updated_at: timestamp with time zone
 * 
 * Example SQL:
 * CREATE TABLE public.debts (
 *   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) NOT NULL,
 *   title text NOT NULL,
 *   amount numeric NOT NULL,
 *   creditor text NOT NULL,
 *   deadline timestamp with time zone NOT NULL,
 *   is_long_term boolean NOT NULL DEFAULT false,
 *   status text NOT NULL,
 *   currency text NOT NULL DEFAULT 'USD',
 *   created_at timestamp with time zone DEFAULT now(),
 *   updated_at timestamp with time zone
 * );
 * 
 * RLS Policy: (Similar to incomes table)
 */

/**
 * Table: assets
 * 
 * Fields:
 * - id: uuid (PRIMARY KEY, auto-generated)
 * - user_id: uuid (REFERENCES auth.users.id) - Links asset to specific user
 * - title: text (NOT NULL) - Title/description of asset
 * - type: text (NOT NULL) - Type of asset (silver, gold, etc.)
 * - amount: numeric (NOT NULL) - Amount of asset
 * - unit: text (NOT NULL) - Unit of measurement (kg, oz, etc.)
 * - current_price: numeric (NOT NULL) - Current price per unit (in USD)
 * - created_at: timestamp with time zone (DEFAULT now())
 * - updated_at: timestamp with time zone
 * 
 * Example SQL:
 * CREATE TABLE public.assets (
 *   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) NOT NULL,
 *   title text NOT NULL,
 *   type text NOT NULL,
 *   amount numeric NOT NULL,
 *   unit text NOT NULL,
 *   current_price numeric NOT NULL,
 *   created_at timestamp with time zone DEFAULT now(),
 *   updated_at timestamp with time zone
 * );
 * 
 * RLS Policy: (Similar to incomes table)
 */

/**
 * Table: user_settings
 * 
 * Fields:
 * - id: uuid (PRIMARY KEY, auto-generated)
 * - user_id: uuid (REFERENCES auth.users.id) - Links settings to specific user
 * - default_currency: text (NOT NULL, DEFAULT 'USD') - One of: 'USD', 'TRY'
 * - include_long_term_debt: boolean (NOT NULL, DEFAULT false) - Whether to include long-term debt in calculations
 * - exchange_rate_last_updated: timestamp with time zone - When exchange rate was last updated
 * - exchange_rate_value: numeric - Last known exchange rate value
 * - created_at: timestamp with time zone (DEFAULT now())
 * - updated_at: timestamp with time zone
 * 
 * Example SQL:
 * CREATE TABLE public.user_settings (
 *   id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
 *   default_currency text NOT NULL DEFAULT 'USD',
 *   include_long_term_debt boolean NOT NULL DEFAULT false,
 *   exchange_rate_last_updated timestamp with time zone,
 *   exchange_rate_value numeric,
 *   created_at timestamp with time zone DEFAULT now(),
 *   updated_at timestamp with time zone
 * );
 * 
 * RLS Policy: (Similar to incomes table)
 */

/**
 * Integration Functions
 * 
 * The following functions should be implemented to interface with Supabase:
 * 
 * 1. Authentication:
 *    - signUp(email, password)
 *    - signIn(email, password)
 *    - signOut()
 *    - getCurrentUser()
 * 
 * 2. Data Access:
 *    - getIncomes()
 *    - getExpenses()
 *    - getDebts()
 *    - getAssets()
 *    - getUserSettings()
 * 
 * 3. Data Modification:
 *    - addIncome(incomeData)
 *    - updateIncome(id, incomeData)
 *    - deleteIncome(id)
 *    - (Similarly for expenses, debts, assets)
 *    - updateUserSettings(settingsData)
 * 
 * 4. Exchange Rate:
 *    - Create an Edge Function to fetch exchange rates from an API
 *    - This should be scheduled to run daily and update the exchange_rate_value in user_settings
 *    - Example API: https://open.er-api.com/v6/latest/USD
 */

/**
 * Example Supabase Client Setup:
 */
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
*/

/**
 * Example Data Access Function:
 */
/*
export const getIncomes = async () => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .order('date', { ascending: false })
  
  if (error) {
    console.error('Error fetching incomes:', error)
    return []
  }
  
  return data
}
*/

/**
 * Example Data Modification Function:
 */
/*
export const addIncome = async (incomeData) => {
  const { data, error } = await supabase
    .from('incomes')
    .insert([
      { 
        ...incomeData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }
    ])
    .select()
  
  if (error) {
    console.error('Error adding income:', error)
    throw error
  }
  
  return data[0]
}
*/

// Placeholder export to avoid TypeScript errors
export const supabasePlaceholder = true;
