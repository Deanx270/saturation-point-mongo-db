import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Products', path: '/admin/products' },
    { label: 'Transactions', path: '/admin/transactions' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Brands', path: '/admin/brands' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mb: 2, color: '#1C1917' }}>
        Admin Dashboard
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 5, 
          py: 2,
          position: 'sticky', 
          top: { xs: 70, md: 90 }, // Navbar height offset
          zIndex: 10,
          bgcolor: 'transparent',
          overflowX: 'auto', // For mobile scrolling
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar cleanly
        }}
      >
        {tabs.map(tab => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              sx={{
                pointerEvents: 'auto',
                borderRadius: '50px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                color: isActive ? '#fff' : '#44403C',
                bgcolor: isActive ? '#1C1917' : '#F5F5F4',
                boxShadow: isActive ? '0 4px 14px rgba(28, 25, 23, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                border: isActive ? '1px solid #1C1917' : '1px solid #E7E5E4',
                '&:hover': {
                  bgcolor: isActive ? '#292524' : '#E7E5E4',
                  boxShadow: isActive ? '0 6px 20px rgba(28, 25, 23, 0.23)' : '0 4px 12px rgba(0,0,0,0.08)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Box>

      {children}
    </Container>
  );
};

export default AdminLayout;
