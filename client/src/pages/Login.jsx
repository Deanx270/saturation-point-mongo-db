import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, Paper, Alert, IconButton, InputAdornment,
  FormControl, InputLabel, OutlinedInput, FormHelperText
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formatFirebaseError = (errorMsg) => {
    const msg = errorMsg.replace('Firebase: ', '').toLowerCase();
    if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return 'This email is already registered. Please sign in instead.';
    }
    return errorMsg.replace('Firebase: ', '');
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Email or Username is required.'),
      password: Yup.string().required('Password is required.'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setAuthError('');
      try {
        let loginEmail = values.identifier;

        // If it doesn't look like an email, assume it's a username and fetch the email from backend
        if (!loginEmail.includes('@')) {
          try {
            const res = await axios.get(`http://localhost:5000/api/users/email-by-username/${loginEmail}`);
            loginEmail = res.data.email;
          } catch (err) {
            throw new Error('Firebase: User not found with that username.');
          }
        }

        const cred = await login(loginEmail, values.password);
        
        if (!cred.user.emailVerified) {
          await logout();
          throw new Error('Firebase: Please verify your email address to login.');
        }

        navigate('/profile');
      } catch (err) {
        setAuthError(formatFirebaseError(err.message));
      }
      setLoading(false);
    },
  });

  const handleSocialLogin = async (providerFunc) => {
    setAuthError('');
    try {
      await providerFunc();
      navigate('/profile');
    } catch (err) {
      setAuthError(formatFirebaseError(err.message));
    }
  };

  useEffect(() => {
    if (authError) {
      setAuthError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.identifier, formik.values.password]);

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
          Sign in to continue to your account.
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth
            id="identifier"
            name="identifier"
            label="Email or Username"
            variant="outlined"
            margin="normal"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.identifier && Boolean(formik.errors.identifier)}
            helperText={formik.touched.identifier && formik.errors.identifier}
            size="small"
            InputLabelProps={{ style: { fontSize: '0.85rem' } }}
            inputProps={{ style: { fontSize: '0.9rem' } }}
          />
          <FormControl fullWidth variant="outlined" size="small" margin="normal" sx={{ mb: 3 }} error={formik.touched.password && Boolean(formik.errors.password)}>
            <InputLabel htmlFor="password" sx={{ fontSize: '0.85rem' }}>Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
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
            disabled={loading}
            sx={{ mb: 2, py: 1.2, fontSize: '0.85rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#44403C' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#1C1917', 
                textDecoration: 'underline', 
                fontWeight: 600,
                textUnderlineOffset: '2px'
              }}
            >
              Sign Up
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

export default Login;
