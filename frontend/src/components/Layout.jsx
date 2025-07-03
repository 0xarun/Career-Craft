import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Navbar />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4,
          maxWidth: 'lg',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout; 