import { Box, Container, Typography, Button, IconButton, Divider, Paper } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const SHIPPING_FEE = 150;
  const totalAmount = cartTotal + SHIPPING_FEE;

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    Swal.fire({
      title: '<span style="font-family: \'Lora\', serif; font-size: 2rem;">Confirm Your Order</span>',
      html: `
        <div style="font-family: 'Montserrat', sans-serif; text-align: center; margin-top: 1rem; color: #78716C;">
          Your order will be processed via <strong>Cash on Delivery</strong>.
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Order',
      confirmButtonColor: '#1C1917',
      cancelButtonColor: '#E5E7EB',
      cancelButtonText: '<span style="color: #374151; font-family: \'Montserrat\', sans-serif;">Cancel</span>',
      customClass: {
        popup: 'premium-swal-popup'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await currentUser.getIdToken();
          
          const items = cart.map(item => ({
            productId: item._id,
            quantity: item.quantity
          }));

          await axios.post('http://localhost:5000/api/orders', {
            items,
            paymentMethod: 'Cash on Delivery'
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          clearCart();
          sessionStorage.setItem('justCheckedOut', 'true');
          navigate('/checkout-success');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: '<span style="font-family: \'Lora\', serif;">Checkout Failed</span>',
            html: error.response?.data?.message || 'An error occurred during checkout.',
            confirmButtonColor: '#EF4444',
            customClass: {
              popup: 'premium-swal-popup'
            }
          });
        }
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontFamily: 'Lora, serif', letterSpacing: '0.05em', color: '#1C1917' }}>
        Your Cart
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Lora, serif', mb: 2, color: '#1C1917' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ color: '#78716C', mb: 4, fontFamily: 'Montserrat, sans-serif' }}>
            Discover our premium selection of fountain pens and accessories.
          </Typography>
          <Button 
            component={Link} 
            to="/catalog"
            variant="contained" 
            sx={{ 
              bgcolor: '#1C1917', 
              color: '#fff', 
              borderRadius: '0', 
              px: 4, 
              py: 1.5,
              textTransform: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              '&:hover': { bgcolor: '#44403C' } 
            }}
          >
            Explore Catalog
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* Cart Items List */}
          <Box sx={{ flex: '1 1 65%' }}>
            {cart.map((item) => (
              <Paper 
                key={item._id}
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 3, 
                  mb: 2,
                  borderRadius: 3, 
                  border: '1px solid rgba(28, 25, 23, 0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={item.photos && item.photos.length > 0 ? item.photos[0] : '/default-product.jpg'}
                  alt={item.name}
                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2, mr: 3 }}
                />
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Lora, serif', fontWeight: 600, color: '#1C1917', mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#CA8A04', fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                    ₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F4', borderRadius: '30px', px: 1, py: 0.5 }}>
                    <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 2, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Button 
                  onClick={() => removeFromCart(item._id)}
                  startIcon={<DeleteIcon />}
                  sx={{ color: '#EF4444', textTransform: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
                >
                  Remove
                </Button>
              </Paper>
            ))}
          </Box>

          {/* Order Summary */}
          <Box sx={{ flex: '1 1 35%' }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                border: '1px solid rgba(28, 25, 23, 0.08)',
                position: 'sticky',
                top: 100
              }}
            >
              <Typography variant="h5" sx={{ fontFamily: 'Lora, serif', mb: 4, color: '#1C1917' }}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: '#78716C', fontFamily: 'Montserrat, sans-serif' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600, color: '#1C1917', fontFamily: 'Montserrat, sans-serif' }}>
                  ₱{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ color: '#78716C', fontFamily: 'Montserrat, sans-serif' }}>Shipping (Flat Rate)</Typography>
                <Typography sx={{ fontWeight: 600, color: '#1C1917', fontFamily: 'Montserrat, sans-serif' }}>
                  ₱{SHIPPING_FEE.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, color: '#1C1917' }}>Total</Typography>
                <Typography variant="h5" sx={{ fontFamily: 'Lora, serif', fontWeight: 700, color: '#1C1917' }}>
                  ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Button
                fullWidth
                onClick={handleCheckout}
                variant="contained"
                sx={{
                  bgcolor: '#1C1917',
                  color: '#fff',
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontFamily: 'Montserrat, sans-serif',
                  '&:hover': { bgcolor: '#CA8A04' },
                  transition: 'background 0.3s ease'
                }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
