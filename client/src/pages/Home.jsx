import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#CA8A04' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 6, color: '#1C1917', textAlign: 'center' }}>
        Our Collection
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 4 }}>
        {products.map(product => (
          <Paper 
            key={product._id} 
            elevation={0}
            sx={{ 
              borderRadius: 0, 
              border: '1px solid rgba(28, 25, 23, 0.08)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', borderColor: '#CA8A04' }
            }}
          >
            <Box 
              component={Link} 
              to={`/product/${product._id}`}
              sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <Box sx={{ height: 280, bgcolor: '#FAF9F6', overflow: 'hidden' }}>
                {product.images && product.images.length > 0 ? (
                  <Box 
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No image available</Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>
                  {product.category}
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mt: 1, mb: 2, color: '#1C1917' }}>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1C1917', fontFamily: '"Montserrat", sans-serif' }}>
                    ₱{parseFloat(product.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#78716C' }}>
                    ★ {product.rating > 0 ? product.rating.toFixed(1) : 'No reviews'} 
                    ({product.numReviews})
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
