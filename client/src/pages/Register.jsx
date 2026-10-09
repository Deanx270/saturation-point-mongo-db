import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, Paper, Alert, IconButton, InputAdornment,
  FormControl, InputLabel, OutlinedInput, FormHelperText
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AddIcon from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const { signup, loginWithGoogle, loginWithFacebook, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [fileError, setFileError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameCheckError, setUsernameCheckError] = useState('');
  const fileInputRef = useRef(null);

  const formatFirebaseError = (errorMsg) => {
    const msg = errorMsg.replace('Firebase: ', '').toLowerCase();
    if (msg.includes('auth/email-already-in-use')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (msg.includes('auth/weak-password')) {
      return 'Password is too weak. Please use at least 6 characters.';
    }
    if (msg.includes('network error')) {
      return 'Failed to connect to the server. Please check your internet connection.';
    }
    return errorMsg.replace('Firebase: ', '');
  };

  const handleSocialLogin = async (providerFunc) => {
    setAuthError('');
    try {
      await providerFunc();
      navigate('/profile');
    } catch (err) {
      setAuthError(formatFirebaseError(err.message));
    }
  };

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePicture: null
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(50, 'Must be 50 characters or less').required('First Name is required.'),
      lastName: Yup.string().max(50, 'Must be 50 characters or less').required('Last Name is required.'),
      username: Yup.string().min(3, 'Must be at least 3 characters').matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores').required('Username is required.'),
      email: Yup.string().email('Please enter a valid email address.').required('Email address is required.'),
      password: Yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required.')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setAuthError('');
      try {
        const usernameCheck = await axios.get(`http://localhost:5000/api/users/check-username?username=${values.username}`);
        if (!usernameCheck.data.available) {
          formik.setFieldError('username', 'Username is already taken.');
          setLoading(false);
          return;
        }

        const userCredential = await signup(values.email, values.password);
        const token = await userCredential.user.getIdToken();

        const formData = new FormData();
        formData.append('displayName', `${values.firstName} ${values.lastName}`);
        formData.append('username', values.username);
        if (values.profilePicture) {
          formData.append('photo', values.profilePicture);
        }

        await new Promise(r => setTimeout(r, 1000));
        
        await axios.put('http://localhost:5000/api/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        await axios.post('http://localhost:5000/api/users/send-verification', {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName
        });

        await logout();

        Swal.fire({
          icon: 'success',
          title: '<span style="font-family: \'Lora\', serif;">Registration successful!</span>',
          html: 'Please check your email to verify your account.',
          confirmButtonColor: '#1C1917',
          customClass: { popup: 'premium-swal-popup' }
        });

        navigate('/login');
      } catch (err) {
        setAuthError(formatFirebaseError(err.message));
      }
      setLoading(false);
    },
  });

  const checkUsername = useCallback(async (val) => {
    if (!val || val.length < 3 || !/^[a-zA-Z0-9_]+$/.test(val)) {
      setUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/users/check-username?username=${val}`);
      setUsernameAvailable(res.data.available);
      if (!res.data.available) {
        setUsernameCheckError('Username is already taken.');
      } else {
        setUsernameCheckError('');
      }
    } catch (err) {
      console.error(err);
    }
    setIsCheckingUsername(false);
  }, []);

  useEffect(() => {
    setUsernameAvailable(false);
    setUsernameCheckError('');
    
    const val = formik.values.username;
    if (!val || val.length < 3 || !/^[a-zA-Z0-9_]+$/.test(val)) return;

    const handler = setTimeout(() => {
      checkUsername(val);
    }, 500);

    return () => clearTimeout(handler);
  }, [formik.values.username, checkUsername]);

  const handleDynamicChange = (e) => {
    formik.handleChange(e);
    const { name, value } = e.target;
    if (value.length > 0 && formik.errors[name]?.includes('required')) {
      formik.setFieldError(name, '');
    } else if (value.length === 0 && formik.touched[name]) {
      const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password'
      };
      formik.setFieldError(name, `${labels[name] || 'Field'} is required.`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (file) {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        setFileError('Only JPEG, PNG, and WEBP images are allowed. GIFs are not supported.');
        formik.setFieldValue('profilePicture', null);
        setPreviewUrl(null);
        return;
      }
      
      if (!isValidSize) {
        setFileError('File is too large (max 5MB). Defaulting to standard avatar.');
        formik.setFieldValue('profilePicture', null);
        setPreviewUrl(null);
        return;
      }
      
      // Valid file
      formik.setFieldValue('profilePicture', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          textAlign: 'center', 
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)'
        }}
      >
        <Typography 
          variant="h6" 
          color="primary" 
          gutterBottom 
          sx={{ textTransform: 'uppercase', letterSpacing: '0.18em', mb: 2, fontWeight: 600, fontSize: '1.25rem' }}
        >
          The Saturation Point
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontSize: '0.85rem' }}>
          Create an account to begin.
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formik.values.firstName}
              onChange={handleDynamicChange}
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
              onChange={handleDynamicChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              size="small"
              InputLabelProps={{ style: { fontSize: '0.85rem' } }}
              inputProps={{ style: { fontSize: '0.9rem' } }}
            />
          </Box>

          <Box sx={{ mt: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem', color: '#44403C' }}>
              Profile Picture (Optional) <Typography component="span" sx={{ fontSize: '0.75rem', color: '#78716C' }}>(Max 5MB)</Typography>
            </Typography>
            <Box 
              onClick={() => fileInputRef.current.click()}
              sx={{
                width: 75, height: 75, borderRadius: '50%', mx: 'auto',
                border: '2px dashed rgba(28, 25, 23, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
                backgroundImage: previewUrl ? `url(${previewUrl})` : 'url(/default-avatar.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: '#1C1917' }
              }}
            >
              <Box sx={{
                position: 'absolute', bottom: 0, right: 0, 
                bgcolor: '#CA8A04', color: '#fff', width: 21, height: 21, 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <AddIcon sx={{ fontSize: 14 }} />
              </Box>
            </Box>
            <Typography 
              variant="caption" 
              onClick={() => fileInputRef.current.click()}
              sx={{ color: '#44403C', mt: 1, display: 'block', cursor: 'pointer', '&:hover': { color: '#1C1917' } }}
            >
              Upload Photo
            </Typography>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {fileError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {fileError}
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            variant="outlined"
            margin="normal"
            value={formik.values.username}
            onChange={handleDynamicChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.username && formik.errors.username) || Boolean(usernameCheckError)}
            helperText={(formik.touched.username && formik.errors.username) || usernameCheckError}
            size="small"
            InputLabelProps={{ style: { fontSize: '0.85rem' } }}
            inputProps={{ style: { fontSize: '0.9rem' } }}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={formik.values.email}
            onChange={handleDynamicChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            size="small"
            InputLabelProps={{ style: { fontSize: '0.85rem' } }}
            inputProps={{ style: { fontSize: '0.9rem' } }}
          />

          <FormControl fullWidth variant="outlined" size="small" margin="normal" error={formik.touched.password && Boolean(formik.errors.password)}>
            <InputLabel htmlFor="password" sx={{ fontSize: '0.85rem' }}>Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={handleDynamicChange}
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
            <InputLabel htmlFor="confirmPassword" sx={{ fontSize: '0.85rem' }}>Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={handleDynamicChange}
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
          
          {authError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0, textAlign: 'left', fontSize: '0.85rem' }}>
              {authError}
            </Alert>
          )}

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            size="medium"
            disabled={loading || isCheckingUsername || Boolean(usernameCheckError) || !usernameAvailable || formik.values.username.length < 3}
            sx={{ mb: 2, py: 1.2, fontSize: '0.85rem' }}
          >
            {loading || isCheckingUsername ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#44403C' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#1C1917', 
                textDecoration: 'underline', 
                fontWeight: 600,
                textUnderlineOffset: '2px'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(28, 25, 23, 0.1)' }} />
          <Typography variant="caption" sx={{ mx: 2, color: '#44403C', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Or</Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(28, 25, 23, 0.1)' }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<GoogleIcon sx={{ fontSize: '1.2rem' }} />}
            onClick={() => handleSocialLogin(loginWithGoogle)}
            sx={{ borderColor: 'rgba(28, 25, 23, 0.2)', color: '#1C1917', '&:hover': { borderColor: '#1C1917', backgroundColor: 'transparent' }, py: 1, fontSize: '0.8rem' }}
          >
            Continue with Google
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<FacebookIcon sx={{ fontSize: '1.2rem' }} />}
            onClick={() => handleSocialLogin(loginWithFacebook)}
            sx={{ borderColor: 'rgba(28, 25, 23, 0.2)', color: '#1C1917', '&:hover': { borderColor: '#1C1917', backgroundColor: 'transparent' }, py: 1, fontSize: '0.8rem' }}
          >
            Continue with Facebook
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
