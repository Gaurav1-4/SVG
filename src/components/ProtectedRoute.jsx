import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check sessionStorage instead of AuthContext for the upgrade
  const isAuthenticated = sessionStorage.getItem('tr_admin') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
