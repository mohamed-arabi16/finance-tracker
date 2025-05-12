
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  session: Session | null;
}

const ProtectedRoute = ({ session }: ProtectedRouteProps) => {
  // If we haven't checked the session yet, show a loading state
  if (session === undefined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
