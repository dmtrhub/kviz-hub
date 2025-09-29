import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavigateToRole: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Ako je admin, redirektuj na admin panel
  if (user.role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Ako je regular user, redirektuj na quizzes
  return <Navigate to="/quizzes" replace />;
};

export default NavigateToRole;