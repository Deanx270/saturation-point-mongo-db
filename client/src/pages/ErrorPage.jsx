import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import { Link } from 'react-router-dom';

const ErrorPage = ({ code = 404 }) => {
  const is403 = code === 403;
  
  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 5 }}>
      <ExploreIcon sx={{ fontSize: 64, color: '#CA8A04', mb: 3 }} />
      <Typography variant="h1" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, fontSize: { xs: '3rem', sm: '4rem' }, color: '#1C1917', mb: 2 }}>
        {is403 ? 'Access Denied' : 'Page Not Found'}
      </Typography>
      <Typography variant="body1" sx={{ color: '#78716C', fontSize: '1.1rem', maxWidth: 500, mb: 4 }}>
        {is403 
          ? "You don't have permission to access this page. Please contact an administrator if you believe this is an error."
          : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        }
      </Typography>
      <Button 
        component={Link} 
        to="/catalog"
        variant="contained" 
        sx={{ 
          bgcolor: '#1C1917', 
          color: 'white', 
          px: 4, 
          py: 1.5, 
          borderRadius: 1, 
          textTransform: 'none', 
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 500,
          '&:hover': { bgcolor: '#292524' } 
        }}
      >
        Return to Catalog
      </Button>
    </Box>
  );
};

export default ErrorPage;
