import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 700,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CareerCraft
        </Typography>
        <Box>
          {token ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Button
                color="primary"
                component={RouterLink}
                to="/dashboard"
                sx={{ mr: 1, borderRadius: 2 }}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={logout}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Button
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1, borderRadius: 2 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/register"
                sx={{ borderRadius: 2 }}
              >
                Register
              </Button>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 