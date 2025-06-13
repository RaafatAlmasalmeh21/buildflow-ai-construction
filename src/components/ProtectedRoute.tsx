
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Special handling for /tasks/my route - only workers and foremen can access
  if (location.pathname === '/tasks/my') {
    if (!profile?.role || !['worker', 'foreman'].includes(profile.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Special handling for /timesheet route - only workers and foremen can access
  if (location.pathname === '/timesheet') {
    if (!profile?.role || !['worker', 'foreman'].includes(profile.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
