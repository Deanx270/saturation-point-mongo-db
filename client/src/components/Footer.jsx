import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        borderTop: '1px solid rgba(28, 25, 23, 0.08)',
        py: 4, 
        textAlign: 'center',
        backgroundColor: '#FAF9F6'
      }}
    >
      <Typography variant="body2" sx={{ color: '#44403C', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} The Saturation Point. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
