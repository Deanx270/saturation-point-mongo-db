import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Box, Paper, Button, CircularProgress, 
  Popover, TextField, FormControl, InputLabel, Select, MenuItem, Rating, Checkbox, ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Popover state
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Debounce search
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?limit=100`; // High limit for now before pagination UI
      if (debouncedKeyword) url += `&keyword=${debouncedKeyword}`;
      if (selectedCategories.length > 0) url += `&category=${selectedCategories.join(',')}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (minRating > 0) url += `&minRating=${minRating}`;
      
      const res = await axios.get(url);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, selectedCategories, minPrice, maxPrice, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 250);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 12 }}>
      <Typography variant="h3" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mb: 2, color: '#1C1917', textAlign: 'center' }}>
        The Complete Catalog
      </Typography>

      {/* Sticky Pill Filter Bar */}
      <Box sx={{ position: 'sticky', top: { xs: 70, md: 85 }, zIndex: 50, bgcolor: 'transparent', py: 2, mb: 6, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <Box 
          sx={{ 
            pointerEvents: 'auto',
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: '#FFFFFF', 
            borderRadius: '50px', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
            border: '1px solid rgba(27,38,59,0.08)', 
            p: '6px 12px', 
            width: '100%', 
            maxWidth: '650px' 
          }}
        >
          <SearchIcon sx={{ color: '#78716C', ml: 1, width: 20 }} />
          <input 
            type="text" 
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: '12px 15px',
              width: '100%',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '1rem'
            }}
          />
          <Button 
            onClick={handleFilterClick}
            sx={{ 
              bgcolor: 'transparent', 
              border: 'none', 
              borderLeft: '1px solid rgba(27,38,59,0.1)', 
              borderRadius: 0,
              pl: 2, 
              pr: 1, 
              color: '#1C1917',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { bgcolor: 'transparent', opacity: 0.7 }
            }}
          >
            <TuneIcon sx={{ width: 18, height: 18 }} />
            Filter
          </Button>
        </Box>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 3, width: 300, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600 }}>
            Filters
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={(e) => setSelectedCategories(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  <Checkbox checked={selectedCategories.indexOf(cat) > -1} />
                  <ListItemText primary={cat} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              size="small" 
              label="Min Price" 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)} 
            />
            <TextField 
              size="small" 
              label="Max Price" 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)} 
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: '#78716C', mb: 1 }}>Minimum Rating</Typography>
            <Rating 
              value={minRating}
              onChange={(event, newValue) => {
                setMinRating(newValue);
              }}
            />
          </Box>
          
          <Button 
            variant="contained" 
            onClick={() => {
              setSelectedCategories([]);
              setMinPrice('');
              setMaxPrice('');
              setMinRating(0);
            }}
            sx={{ bgcolor: '#1C1917', '&:hover': { bgcolor: '#292524' } }}
          >
            Clear Filters
          </Button>
        </Box>
      </Popover>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#CA8A04' }} />
        </Box>
      ) : products.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 10, color: '#78716C', fontFamily: '"Montserrat", sans-serif' }}>
          No products found matching your filters.
        </Typography>
      ) : (
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
                <Box sx={{ aspectRatio: '1 / 1', bgcolor: '#fff', overflow: 'hidden' }}>
                  {product.images && product.images.length > 0 ? (
                    <Box 
                      component="img"
                      src={product.images[0]}
                      alt={product.name}
                      sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2, boxSizing: 'border-box' }}
                    />
                  ) : (
                    <Box 
                      component="img"
                      src="/images/default-avatar.png"
                      alt="default"
                      sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2, boxSizing: 'border-box' }}
                    />
                  )}
                </Box>
                
                <Box sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mt: 1, mb: 2, color: '#1C1917' }}>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1C1917', fontFamily: '"Montserrat", sans-serif' }}>
                      ₱{parseFloat(product.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#78716C' }}>
                      ★ {product.rating > 0 ? product.rating.toFixed(1) : 'No reviews'} 
                      {' '}({product.numReviews})
                    </Typography>
                  </Box>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<AddShoppingCartIcon />}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!currentUser) {
                        Swal.fire({
                          icon: 'warning',
                          title: '<span style="font-family: \'Lora\', serif;">Login Required</span>',
                          text: 'Please log in to add items to your cart.',
                          confirmButtonText: 'Log In',
                          confirmButtonColor: '#1C1917',
                          showCancelButton: true,
                          cancelButtonText: 'Cancel',
                          customClass: { popup: 'premium-swal-popup' }
                        }).then((result) => {
                          if (result.isConfirmed) {
                            navigate('/login');
                          }
                        });
                        return;
                      }
                      const productToAdd = {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        photos: product.images,
                        stock: product.stock
                      };
                      const wasAdded = await addToCart(productToAdd, 1);
                      if (wasAdded) {
                        Swal.fire({
                          icon: 'success',
                          title: '<span style="font-family: \'Lora\', serif;">Added to Cart</span>',
                          showConfirmButton: false,
                          timer: 1500,
                          customClass: { popup: 'premium-swal-popup' }
                        });
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: '<span style="font-family: \'Lora\', serif;">Stock Limit Reached</span>',
                          text: 'You cannot add more of this item.',
                          confirmButtonColor: '#1C1917',
                          customClass: { popup: 'premium-swal-popup' }
                        });
                      }
                    }}
                    sx={{ 
                      mt: 2, 
                      borderColor: '#1C1917', 
                      color: '#1C1917', 
                      textTransform: 'none', 
                      fontFamily: '"Montserrat", sans-serif',
                      '&:hover': { borderColor: '#CA8A04', color: '#CA8A04', bgcolor: 'transparent' }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Catalog;

