
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Income from '@/pages/Income';
import Expenses from '@/pages/Expenses';
import Debt from '@/pages/Debt';
import Assets from '@/pages/Assets';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for mock admin session first on component mount
    if (localStorage.getItem('mockAdminSession') === 'true') {
      const mockSessionData: Session = {
        user: {
          id: 'admin-user-id',
          email: 'admin@example.com',
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: { full_name: 'Admin User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // You might need to add other fields if your 'User' type from Supabase has them
          // and they are accessed in your components. For example:
          // confirmed_at: new Date().toISOString(),
          // email_confirmed_at: new Date().toISOString(),
          // last_sign_in_at: new Date().toISOString(),
          // role: '', // if you use roles
          // phone: ''
        },
        access_token: 'mock-admin-access-token',
        refresh_token: 'mock-admin-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
      };
      setSession(mockSessionData);
      localStorage.removeItem('mockAdminSession'); // Clear flag after use
      // Optionally, return early from useEffect if Supabase listeners shouldn't run for mock session
      // However, the current onAuthStateChange has a check for SIGNED_OUT which is good.
      // So, allowing the listeners to attach might be fine.
    }
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        if (_event === "SIGNED_OUT") {
            localStorage.removeItem('mockAdminSession');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute session={session} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/debt" element={<Debt />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
