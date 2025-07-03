import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Typography, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // Debugging Indicator
  console.log('ProtectedRoute rendering. Token present:', !!token);
  // Add a visual indicator too

  if (!token) {
    console.log('No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('Token found, rendering protected content');
  return (
    <Box>
      {/* Visual ProtectedRoute Indicator */}
      {/* <Typography variant="h6" color="success.main">ProtectedRoute Active</Typography> */}
      {children}
    </Box>
  );
};

export default ProtectedRoute; 