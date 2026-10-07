import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Box, Typography, TextField, Button, Paper, CircularProgress, Alert, IconButton, InputAdornment,
  FormControl, InputLabel, OutlinedInput, FormHelperText, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CopyableId from '../components/CopyableId';

const Profile = () => {
  const { currentUser, mongoUser, setMongoUser, updateUserPassword, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileError, setFileError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!currentUser || !mongoUser) return;
      try {
        const token = await currentUser.getIdToken();
        const res = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        const ordersArray = Array.isArray(data) ? data : (data.orders || data.data || []);
        setOrders(ordersArray);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [currentUser, mongoUser]);

  const formatFirebaseError = (errorMsg) => {
    const msg = errorMsg.replace('Firebase: ', '').toLowerCase();
    if (msg.includes('auth/requires-recent-login')) {
      return 'Please sign out and sign back in to change your password for security reasons.';
    }
    if (msg.includes('auth/weak-password')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    return errorMsg.replace('Firebase: ', '');
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      firstName: mongoUser?.displayName?.split(' ')[0] || '',
      lastName: mongoUser?.displayName?.split(' ').slice(1).join(' ') || '',
      username: mongoUser?.username || '',
      email: currentUser?.email || '',
      password: '',
      confirmPassword: '',
      profilePicture: null
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('First Name is required.'),
      lastName: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Last Name is required.'),
      username: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores')
        .required('Username is required.'),
      password: Yup.string().min(6, 'Password must be at least 6 characters.'),
      confirmPassword: Yup.string().when('password', (password, field) => {
        const pass = password[0];
        return pass && pass.length > 0
          ? field.required('Confirm Password is required to change password').oneOf([Yup.ref('password')], 'Passwords must match')
          : field;
      })
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage('');
      try {
        if (values.password) {
          await updateUserPassword(values.password);
        }

        const formData = new FormData();
        formData.append('displayName', `${values.firstName} ${values.lastName}`.trim());
        formData.append('username', values.username);
        if (values.profilePicture) {
          formData.append('photo', values.profilePicture);
        }

        const token = await currentUser.getIdToken();
        const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        setMongoUser(res.data.user);
        
        // Reset password fields but keep display name
        resetForm({ 
          values: { ...values, password: '', confirmPassword: '', profilePicture: null } 
        });
        
        setMessage('Profile updated successfully!');
      } catch (error) {
        if (error.code && error.code.startsWith('auth/')) {
          setMessage('Error updating password: ' + formatFirebaseError(error.message));
        } else {
          setMessage('Error updating profile: ' + (error.response?.data?.message || error.message));
        }
      }
      setLoading(false);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (file) {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        setFileError('Only image files are allowed. Reverting to current avatar.');
        formik.setFieldValue('profilePicture', null);
        setPreviewUrl(null);
        return;
      }
      
      if (!isValidSize) {
        setFileError('File is too large (max 5MB). Reverting to current avatar.');
        formik.setFieldValue('profilePicture', null);
        setPreviewUrl(null);
        return;
      }
      
      formik.setFieldValue('profilePicture', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return <Typography>Please log in to view this page.</Typography>;
  if (!mongoUser) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="primary" /></Box>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {/* Profile Settings Column */}
        <Grid item xs={12} md={3}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          textAlign: 'center', 
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)' 
        }}
      >
        <Typography 
          variant="h6" 
          color="primary" 
          gutterBottom 
          sx={{ textTransform: 'uppercase', letterSpacing: '0.18em', mb: 4, fontWeight: 600, fontSize: '1.25rem' }}
        >
          Account Profile
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box 
              onClick={() => fileInputRef.current.click()}
              sx={{
                width: 120, height: 120, borderRadius: '50%', mx: 'auto', mb: 1,
                border: '2px dashed rgba(28, 25, 23, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                backgroundImage: previewUrl ? `url(${previewUrl})` : `url(${mongoUser.photoURL || '/images/default-avatar.png'})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: '#1C1917' },
                '&:hover .camera-overlay': { opacity: 1 }
              }}
            >
              <Box 
                className="camera-overlay"
                sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s ease'
                }}
              >
                <CameraAltIcon sx={{ color: '#fff', fontSize: '2rem' }} />
              </Box>
            </Box>
            
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            {fileError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {fileError}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: '#78716C', display: 'block', mt: 0.5 }}>
              Click avatar to change (Max 5MB)
            </Typography>
          </Box>

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            disabled
            size="small"
            InputLabelProps={{ style: { fontSize: '0.85rem' } }}
            inputProps={{ style: { fontSize: '0.9rem' } }}
          />

          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            size="small"
            InputLabelProps={{ style: { fontSize: '0.85rem' } }}
            inputProps={{ style: { fontSize: '0.9rem' } }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              size="small"
              InputLabelProps={{ style: { fontSize: '0.85rem' } }}
              inputProps={{ style: { fontSize: '0.9rem' } }}
            />
            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              size="small"
              InputLabelProps={{ style: { fontSize: '0.85rem' } }}
              inputProps={{ style: { fontSize: '0.9rem' } }}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ textAlign: 'left', mb: 1, color: '#44403C' }}>Change Password (Optional)</Typography>

          <FormControl fullWidth variant="outlined" size="small" margin="normal" error={formik.touched.password && Boolean(formik.errors.password)}>
            <InputLabel htmlFor="password" sx={{ fontSize: '0.85rem' }}>New Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ style: { fontSize: '0.9rem' } }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                    tabIndex={-1}
                  >
                    {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText>{formik.errors.password}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth variant="outlined" size="small" margin="normal" sx={{ mb: 3 }} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
            <InputLabel htmlFor="confirmPassword" sx={{ fontSize: '0.85rem' }}>Confirm New Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ style: { fontSize: '0.9rem' } }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
            )}
          </FormControl>

          {message && (
            <Alert 
              severity={message.includes('Error') ? 'error' : 'success'} 
              sx={{ mb: 3, borderRadius: 0, textAlign: 'left', fontSize: '0.85rem' }}
            >
              {message}
            </Alert>
          )}

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ mb: 2, py: 1.2, fontSize: '0.85rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </form>
      </Paper>
        </Grid>
        
        {/* Transaction History Column */}
        <Grid item xs={12} md={9}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, sm: 5 }, 
              border: '1px solid rgba(28, 25, 23, 0.08)',
              boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)',
              height: '100%'
            }}
          >
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom 
              sx={{ textTransform: 'uppercase', letterSpacing: '0.18em', mb: 4, fontWeight: 600, fontSize: '1.25rem' }}
            >
              Order History
            </Typography>

            <TableContainer sx={{ border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingOrders ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                        <CircularProgress sx={{ color: '#CA8A04' }} />
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5, color: '#78716C' }}>
                        No orders found. Start shopping!
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell sx={{ color: '#78716C' }}>
                          <CopyableId id={order._id} />
                        </TableCell>
                        <TableCell sx={{ color: '#78716C', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#1C1917' }}>
                          ₱{parseFloat(order.totalAmount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={(order.status || 'unknown').toUpperCase()} 
                            color={getStatusColor(order.status || 'unknown')} 
                            size="small" 
                            sx={{ fontSize: '0.7rem', letterSpacing: 1, height: 24 }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
