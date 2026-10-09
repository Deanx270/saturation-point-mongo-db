import { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { currentUser, mongoUser, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const isFullyAuthenticated = currentUser && currentUser.emailVerified;
  const needsProfileCompletion = isFullyAuthenticated && mongoUser && !mongoUser.username;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const navLinksStyle = {
    color: '#44403C', 
    fontSize: '0.85rem', 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em', 
    fontWeight: 500, 
    textDecoration: 'none',
    '&:hover': { color: '#1C1917' }
  };

  return (
    <Box 
      component="header" 
      sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: 'rgba(250, 249, 246, 0.8)', 
        backdropFilter: 'blur(16px)', 
        borderBottom: '1px solid rgba(27, 38, 59, 0.1)',
        py: { xs: 2, md: 3 }, 
        px: { xs: 2, md: 4 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: { xs: '72px', md: '88px' }
      }}
    >
      <Typography 
        component={Link} 
        to="/" 
        sx={{ 
          fontFamily: '"Cormorant", serif', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.18em', 
          fontSize: { xs: '1rem', md: '1.25rem' }, 
          color: '#1C1917', 
          textDecoration: 'none' 
        }}
      >
        The Saturation Point
      </Typography>

      {isMobile ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isFullyAuthenticated && !needsProfileCompletion && (
            <IconButton component={Link} to="/cart" sx={{ color: '#1C1917' }}>
              <Badge badgeContent={cartItemCount} color="error" sx={{ '& .MuiBadge-badge': { fontFamily: 'Montserrat', fontSize: '0.7rem' } }}>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          )}
          <IconButton onClick={handleMenuClick} sx={{ color: '#1C1917' }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { mt: 1, width: 200, borderRadius: 0, border: '1px solid rgba(28, 25, 23, 0.08)' }
            }}
          >
            {!needsProfileCompletion && <MenuItem onClick={handleMenuClose} component={Link} to="/catalog" sx={navLinksStyle}>Catalog</MenuItem>}
            {!isFullyAuthenticated ? (
              <>
                <MenuItem onClick={handleMenuClose} component={Link} to="/login" sx={navLinksStyle}>Login</MenuItem>
                <MenuItem onClick={handleMenuClose} component={Link} to="/register" sx={navLinksStyle}>Register</MenuItem>
              </>
            ) : (
              <>
                {!needsProfileCompletion && <MenuItem onClick={handleMenuClose} component={Link} to="/profile" sx={navLinksStyle}>Profile</MenuItem>}
                {!needsProfileCompletion && mongoUser?.role === 'admin' && (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin/products" sx={navLinksStyle}>Admin Panel</MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={navLinksStyle}>Logout</MenuItem>
              </>
            )}
          </Menu>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {!needsProfileCompletion && <Typography component={Link} to="/catalog" sx={navLinksStyle}>Catalog</Typography>}

          {!isFullyAuthenticated ? (
            <>
              <Typography component={Link} to="/login" sx={navLinksStyle}>Login</Typography>
              <Typography component={Link} to="/register" sx={navLinksStyle}>Register</Typography>
            </>
          ) : (
            <>
              {!needsProfileCompletion && <Typography component={Link} to="/profile" sx={navLinksStyle}>Profile</Typography>}
              {!needsProfileCompletion && mongoUser?.role === 'admin' && (
                <Typography component={Link} to="/admin/products" sx={navLinksStyle}>Admin Panel</Typography>
              )}
              <Typography component="button" onClick={handleLogout} sx={{ ...navLinksStyle, background: 'none', border: 'none', cursor: 'pointer', p: 0 }}>
                Logout
              </Typography>
              
              {!needsProfileCompletion && (
                <IconButton component={Link} to="/cart" sx={{ color: '#1C1917', ml: 1 }}>
                  <Badge badgeContent={cartItemCount} color="error" sx={{ '& .MuiBadge-badge': { fontFamily: 'Montserrat', fontSize: '0.7rem' } }}>
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
