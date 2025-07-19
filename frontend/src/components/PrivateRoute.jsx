import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;