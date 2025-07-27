
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionData = async () => {
      // Check for mock admin session first
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
          },
          access_token: 'mock-admin-access-token',
          refresh_token: 'mock-admin-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
        };
        setSession(mockSessionData);
        localStorage.removeItem('mockAdminSession'); // Clear flag after use
        setLoading(false);
        return; // Exit early
      }

      // If not using mock session, proceed with Supabase auth
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          if (_event === "SIGNED_OUT") {
              localStorage.removeItem('mockAdminSession');
          }
        }
      );

      return () => subscription.unsubscribe();
    };

    getSessionData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute session={session} loading={loading} />}>
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
