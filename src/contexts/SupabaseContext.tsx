
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<{ error?: Error }>;
  updateUserSettings: (settings: { default_currency?: 'USD' | 'TRY', include_long_term_debt?: boolean }) => Promise<void>;
  refreshExchangeRate: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication functions
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${email}!`
      });
      return {};
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({
        title: "Account created",
        description: "Please check your email for verification instructions."
      });
      return {};
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      return {};
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const updateUserSettings = async (settings: { default_currency?: 'USD' | 'TRY', include_long_term_debt?: boolean }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      if (settings.default_currency) {
        localStorage.setItem('defaultCurrency', settings.default_currency);
        window.dispatchEvent(new Event('storage'));
      }

      toast({
        title: "Settings updated",
        description: "Your preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const refreshExchangeRate = async () => {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('update-exchange-rates');
      
      if (error) throw error;
      
      if (data && data.rate) {
        // Update localStorage
        localStorage.setItem('currentExchangeRate', data.rate.toString());
        
        // Notify components of the change
        window.dispatchEvent(new Event('exchangeRateUpdated'));
      }
      
      toast({
        title: "Exchange rate updated",
        description: `Latest USD/TRY rate: ${data.rate || 'Updated'}`
      });
    } catch (error) {
      toast({
        title: "Failed to update exchange rate",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <SupabaseContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      updateUserSettings,
      refreshExchangeRate
    }}>
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
