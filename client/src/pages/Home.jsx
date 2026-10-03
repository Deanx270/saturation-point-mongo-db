import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import axios from 'axios';

// Assets
import heroImg from '../assets/hero.png'; // Fallback
import storyImg from '../../public/images/story_ink_flow.png';
import bentoNib from '../../public/images/bento_nib_macro.png';
import bentoInk from '../../public/images/bento_ink_bottle.png';
import bentoPaper from '../../public/images/bento_premium_paper.png';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch only up to 3 products for the featured section
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setFeatured(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      {/* 1. HERO SECTION */}
      <Box 
        sx={{ 
          width: '100%', 
          minHeight: '80vh', 
          backgroundImage: `url(/images/hero_luxury_pen.png), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(27, 38, 59, 0.4)', // matches #1B263B 
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', px: 2, width: '100%', maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 3, fontSize: { xs: '3.5rem', md: '5rem' }, lineHeight: 1.1 }}>
            The Weight<br />of Words.
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 300, mb: 5, mx: 'auto', maxWidth: '600px', lineHeight: 1.6, opacity: 0.9 }}>
            Curated instruments for the modern connoisseur. Experience elite craftsmanship designed for those who appreciate the permanence of ink.
          </Typography>

          {/* Embedded Search Bar */}
          <Box 
            component="form" 
            onSubmit={handleSearchSubmit}
            sx={{ 
              maxWidth: '500px', 
              mx: 'auto', 
              mb: 5, 
              position: 'relative' 
            }}
          >
            <SearchIcon sx={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#1B263B', zIndex: 3 }} />
            <input 
              type="text" 
              placeholder="Search the collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 24px 18px 52px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '1rem',
                color: '#1B263B',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Box>

          <Button 
            component={Link} 
            to="/catalog"
            endIcon={<ArrowRightAltIcon />}
            sx={{ 
              bgcolor: '#fff', 
              color: '#1B263B', 
              py: 1.5, 
              px: 4, 
              borderRadius: '50px',
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            Explore Collection
          </Button>
        </Box>
      </Box>

      {/* 2. FEATURED ADDITIONS */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 6, color: '#1B263B', textAlign: 'center' }}>
          Featured Additions
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress sx={{ color: '#CA8A04' }}/></Box>
        ) : (
          <Grid container spacing={4}>
            {featured.map(product => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Paper 
                  component={Link} 
                  to={`/product/${product._id}`}
                  elevation={0}
                  sx={{ 
                    display: 'block', 
                    textDecoration: 'none', 
                    border: '1px solid rgba(27, 38, 59, 0.05)', 
                    transition: 'transform 0.3s', 
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } 
                  }}
                >
                  <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid rgba(27,38,59,0.05)', position: 'relative', aspectRatio: '1 / 1', width: '100%', overflow: 'hidden' }}>
                    {product.images && product.images.length > 0 ? (
                      <Box component="img" src={product.images[0]} sx={{ width: '100%', height: '100%', objectFit: 'cover', p: 3 }} />
                    ) : (
                      <Box component="img" src="/images/default-avatar.png" sx={{ width: '100%', height: '100%', objectFit: 'cover', p: 3 }} />
                    )}
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontFamily: '"Cormorant", serif', color: '#1B263B', fontWeight: 600, mb: 1 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 3, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1C1917', fontFamily: '"Montserrat", sans-serif' }}>
                        ₱{parseFloat(product.price).toFixed(2)}
                      </Typography>
                      <ShoppingCartOutlinedIcon sx={{ color: '#1B263B' }} />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 3. STORYTELLING */}
      <Box sx={{ bgcolor: '#FAF9F6', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', width: '100%', paddingBottom: '120%', borderRadius: 1, overflow: 'hidden', boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)' }}>
                <Box component="img" src="/images/story_ink_flow.png" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: '#CA8A04', letterSpacing: '0.15em', fontWeight: 600, mb: 1, display: 'block' }}>
                OUR HERITAGE
              </Typography>
              <Typography variant="h3" sx={{ fontFamily: '"Cormorant", serif', color: '#1B263B', fontWeight: 600, mb: 3 }}>
                A Tradition of <em style={{ fontStyle: 'italic', color: '#CA8A04' }}>Excellence</em>
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.8, mb: 2 }}>
                At The Saturation Point, we believe that the act of writing is sacred. In a fleeting digital world, a fine fountain pen anchors your thoughts to paper.
              </Typography>
              <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.8, mb: 4 }}>
                We source only the rarest materials—18k solid gold nibs, meticulously hand-turned resins, and inks saturated with the deepest pigments. This is more than stationery; it is an heirloom.
              </Typography>
              
              <Box sx={{ width: '50px', height: '2px', bgcolor: '#CA8A04', mb: 4 }} />

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <DiamondOutlinedIcon sx={{ color: '#1B263B', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600, color: '#1B263B' }}>Quality</Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>Unmatched materials</Typography>
                </Box>
                <Box>
                  <CreateOutlinedIcon sx={{ color: '#1B263B', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600, color: '#1B263B' }}>Passion</Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>Artisan crafted</Typography>
                </Box>
                <Box>
                  <HourglassEmptyOutlinedIcon sx={{ color: '#1B263B', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 600, color: '#1B263B' }}>Timeless</Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>Heirloom status</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. THE COLLECTION (BENTO GRID) */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h3" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 6, color: '#1B263B', textAlign: 'center' }}>
          The Collection
        </Typography>

        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gridAutoRows: '250px', 
            gap: 3 
          }}
        >
          {/* Nibs (Large spanning 2 cols) */}
          <Box 
            component={Link} 
            to="/catalog?category=Fountain%20Pens"
            sx={{ 
              gridColumn: { md: 'span 2' }, 
              position: 'relative', 
              overflow: 'hidden', 
              textDecoration: 'none',
              borderRadius: 2,
              '&:hover img': { transform: 'scale(1.05)' }
            }}
          >
            <Box component="img" src="/images/bento_nib_macro.png" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <Box sx={{ position: 'absolute', bottom: 30, left: 30, zIndex: 2 }}>
              <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', color: '#fff', mb: 1 }}>Exquisite Nibs</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>14k & 18k gold mastery for a breathtaking glide.</Typography>
            </Box>
          </Box>

          {/* Inks (Tall spanning 2 rows) */}
          <Box 
            component={Link} 
            to="/catalog?category=Inks"
            sx={{ 
              gridRow: { md: 'span 2' }, 
              position: 'relative', 
              overflow: 'hidden', 
              textDecoration: 'none',
              borderRadius: 2,
              '&:hover img': { transform: 'scale(1.05)' }
            }}
          >
            <Box component="img" src="/images/bento_ink_bottle.png" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <Box sx={{ position: 'absolute', bottom: 30, left: 30, zIndex: 2 }}>
              <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', color: '#fff', mb: 1 }}>Deep Inks</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>Rich, saturated tones and shimmering flows.</Typography>
            </Box>
          </Box>

          {/* Paper */}
          <Box 
            component={Link} 
            to="/catalog?category=Paper"
            sx={{ 
              position: 'relative', 
              overflow: 'hidden', 
              textDecoration: 'none',
              borderRadius: 2,
              '&:hover img': { transform: 'scale(1.05)' }
            }}
          >
            <Box component="img" src="/images/bento_premium_paper.png" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
            <Box sx={{ position: 'absolute', bottom: 30, left: 30, zIndex: 2 }}>
              <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', color: '#fff', mb: 1 }}>Tomoe River</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>The global standard in premium writing paper.</Typography>
            </Box>
          </Box>

          {/* Bespoke Editions */}
          <Box 
            sx={{ 
              bgcolor: '#1C1917', 
              position: 'relative', 
              overflow: 'hidden', 
              textDecoration: 'none',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: 4
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', color: '#fff', mb: 1 }}>Bespoke Editions</Typography>
            <Typography variant="body2" sx={{ color: '#A8A29E', mb: 3 }}>Limited runs from legendary houses.</Typography>
            <Button 
              component={Link} 
              to="/catalog"
              endIcon={<ArrowRightAltIcon />}
              sx={{ 
                color: '#CA8A04', 
                p: 0, 
                minWidth: 'auto', 
                justifyContent: 'flex-start',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                '&:hover': { bgcolor: 'transparent', color: '#a16207' }
              }}
            >
              View Catalog
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
