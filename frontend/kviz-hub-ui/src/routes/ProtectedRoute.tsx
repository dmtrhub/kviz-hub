import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }: Props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ako korisnik nije prijavljen, redirektuj na login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN ONLY: Ako je adminOnly i korisnik NIJE admin, redirektuj na DASHBOARD (quizzes)
  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/quizzes" replace />;
  }

  // USER ONLY: Ako je userOnly i korisnik JE admin, redirektuj na ADMIN
  if (userOnly && user.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};