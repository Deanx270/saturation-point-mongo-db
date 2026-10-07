import { Box, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from 'react';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const justCheckedOut = sessionStorage.getItem('justCheckedOut');
    if (!justCheckedOut) {
      navigate('/catalog', { replace: true });
    } else {
      sessionStorage.removeItem('justCheckedOut');
    }
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
      <Box sx={{ p: 5, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(28, 25, 23, 0.08)' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: '#10B981', mb: 3 }} />
        <Typography variant="h3" sx={{ fontFamily: 'Lora, serif', color: '#1C1917', mb: 2 }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#78716C', mb: 4, lineHeight: 1.6 }}>
          Thank you for shopping with The Saturation Point.<br />
          Your order has been successfully placed and will be processed via Cash on Delivery.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            component={Link} 
            to="/profile"
            variant="outlined" 
            sx={{ 
              borderColor: '#1C1917', 
              color: '#1C1917', 
              borderRadius: 2, 
              px: 4, 
              py: 1.5,
              textTransform: 'none',
              fontFamily: 'Montserrat, sans-serif',
              '&:hover': { borderColor: '#CA8A04', color: '#CA8A04', bgcolor: 'transparent' }
            }}
          >
            View My Orders
          </Button>
          <Button 
            component={Link} 
            to="/catalog"
            variant="contained" 
            sx={{ 
              bgcolor: '#1C1917', 
              color: '#fff', 
              borderRadius: 2, 
              px: 4, 
              py: 1.5,
              textTransform: 'none',
              fontFamily: 'Montserrat, sans-serif',
              '&:hover': { bgcolor: '#CA8A04' }
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CheckoutSuccess;
