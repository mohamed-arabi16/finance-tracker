
-- Create tables with proper RLS policies

-- User Settings Table
CREATE TABLE public.user_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  default_currency text NOT NULL DEFAULT 'USD' CHECK (default_currency IN ('USD', 'TRY')),
  include_long_term_debt boolean NOT NULL DEFAULT false,
  exchange_rate_last_updated timestamp with time zone,
  exchange_rate_value numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Income Table
CREATE TABLE public.incomes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('freelance', 'student', 'rent', 'videography', 'other')),
  date timestamp with time zone NOT NULL,
  status text NOT NULL CHECK (status IN ('received', 'expected')),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'TRY')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Expense Table
CREATE TABLE public.expenses (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  date timestamp with time zone NOT NULL,
  type text NOT NULL CHECK (type IN ('recurring', 'one-time')),
  category text,
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'TRY')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Debt Table
CREATE TABLE public.debts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL,
  creditor text NOT NULL,
  deadline timestamp with time zone NOT NULL,
  is_long_term boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('pending', 'paid')),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'TRY')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Asset Table
CREATE TABLE public.assets (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  current_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Exchange Rate Table
CREATE TABLE public.exchange_rates (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_currency text NOT NULL,
  to_currency text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(from_currency, to_currency)
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY user_settings_select ON public.user_settings 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_settings_insert ON public.user_settings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_settings_update ON public.user_settings 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for incomes
CREATE POLICY incomes_select ON public.incomes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY incomes_insert ON public.incomes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY incomes_update ON public.incomes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY incomes_delete ON public.incomes 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY expenses_select ON public.expenses 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY expenses_insert ON public.expenses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY expenses_update ON public.expenses 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY expenses_delete ON public.expenses 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for debts
CREATE POLICY debts_select ON public.debts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY debts_insert ON public.debts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY debts_update ON public.debts 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY debts_delete ON public.debts 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for assets
CREATE POLICY assets_select ON public.assets 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY assets_insert ON public.assets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY assets_update ON public.assets 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY assets_delete ON public.assets 
  FOR DELETE USING (auth.uid() = user_id);

-- Exchange Rate access (public read, authenticated write)
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY exchange_rates_select ON public.exchange_rates 
  FOR SELECT USING (true);

-- Only allow authenticated users to update
CREATE POLICY exchange_rates_insert ON public.exchange_rates 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY exchange_rates_update ON public.exchange_rates 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert initial exchange rate
INSERT INTO public.exchange_rates (from_currency, to_currency, rate) 
VALUES ('USD', 'TRY', 38.76);
