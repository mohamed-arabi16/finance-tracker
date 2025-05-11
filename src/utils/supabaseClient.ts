
import { createClient } from '@supabase/supabase-js'
import { Asset, Debt, Expense, Income } from '@/types/finance';

// In a real app, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// User settings functions
export const getUserSettings = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return { data, error };
};

export const updateUserSettings = async (settings: {
  default_currency?: 'USD' | 'TRY';
  include_long_term_debt?: boolean;
}) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })
    .select();
  
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

export const addIncome = async (income: Omit<Income, 'id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('incomes')
    .insert([{ ...income, user_id: user.id }])
    .select();
  
  return { data, error };
};

export const updateIncome = async (id: string, income: Partial<Income>) => {
  const { data, error } = await supabase
    .from('incomes')
    .update(income)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteIncome = async (id: string) => {
  const { error } = await supabase
    .from('incomes')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Expense functions
export const getExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  return { data, error };
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('expenses')
    .insert([{ ...expense, user_id: user.id }])
    .select();
  
  return { data, error };
};

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Debt functions
export const getDebts = async () => {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .order('deadline', { ascending: true });
  
  return { data, error };
};

export const addDebt = async (debt: Omit<Debt, 'id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('debts')
    .insert([{ ...debt, user_id: user.id }])
    .select();
  
  return { data, error };
};

export const updateDebt = async (id: string, debt: Partial<Debt>) => {
  const { data, error } = await supabase
    .from('debts')
    .update(debt)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteDebt = async (id: string) => {
  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Asset functions
export const getAssets = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select('*');
  
  return { data, error };
};

export const addAsset = async (asset: Omit<Asset, 'id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from('assets')
    .insert([{ ...asset, user_id: user.id }])
    .select();
  
  return { data, error };
};

export const updateAsset = async (id: string, asset: Partial<Asset>) => {
  const { data, error } = await supabase
    .from('assets')
    .update(asset)
    .eq('id', id)
    .select();
  
  return { data, error };
};

export const deleteAsset = async (id: string) => {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Exchange rate functions
export const getExchangeRate = async () => {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .eq('from_currency', 'USD')
    .eq('to_currency', 'TRY')
    .single();
  
  return { data, error };
};

export const updateExchangeRate = async () => {
  // This would typically be handled by a Supabase Edge Function
  // Here's a client-side implementation for demonstration
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    
    if (data && data.rates && data.rates.TRY) {
      const newRate = data.rates.TRY;
      
      const { data: updatedRate, error } = await supabase
        .from('exchange_rates')
        .upsert({
          from_currency: 'USD',
          to_currency: 'TRY',
          rate: newRate,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'from_currency,to_currency'
        })
        .select();
      
      // Update the rate in localStorage for client-side use
      localStorage.setItem('currentExchangeRate', newRate.toString());
      window.dispatchEvent(new Event('exchangeRateUpdated'));
      
      return { data: updatedRate, error };
    }
    
    throw new Error('Failed to fetch TRY rate');
  } catch (error) {
    console.error('Failed to update exchange rate:', error);
    return { data: null, error };
  }
};
