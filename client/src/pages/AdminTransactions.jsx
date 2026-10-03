import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AdminTransactions = () => {
  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)',
          borderRadius: 2,
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5" sx={{ color: '#78716C', fontFamily: '"Cormorant", serif' }}>
          Transactions Management (Coming Soon)
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminTransactions;
