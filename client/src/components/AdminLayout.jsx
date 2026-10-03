import React from 'react';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 4, color: '#1C1917' }}>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={location.pathname} 
          onChange={handleTabChange} 
          TabIndicatorProps={{ style: { backgroundColor: '#1C1917' } }}
          sx={{
            '& .MuiTab-root': {
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              color: '#78716C',
              '&.Mui-selected': {
                color: '#1C1917'
              }
            }
          }}
        >
          <Tab label="Products" value="/admin/products" />
          <Tab label="Transactions (Pending)" value="/admin/transactions" />
          <Tab label="Users (Pending)" value="/admin/users" />
        </Tabs>
      </Box>

      {children}
    </Container>
  );
};

export default AdminLayout;
