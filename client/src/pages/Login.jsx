import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const {
    login,
    loginWithGoogle,
    loginWithFacebook,
    fetchMongoProfile,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const hasTyped = useRef({ identifier: false, password: false });

  const formatFirebaseError = (errorMsg) => {
    if (!errorMsg) return 'An unexpected error occurred. Please try again.';
    const raw = String(errorMsg);
    const msg = raw.replace('Firebase: ', '').toLowerCase();
    if (
      msg.includes('auth/invalid-credential') ||
      msg.includes('auth/wrong-password') ||
      msg.includes('auth/user-not-found')
    ) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return 'This email is already registered. Please sign in instead.';
    }
    if (msg.includes('auth/account-exists-with-different-credential')) {
      return 'An account already exists with this email address using another sign-in method. Please sign in with that method instead.';
    }
    if (msg.includes('auth/popup-closed-by-user')) {
      return 'The sign-in popup was closed before completion.';
    }
    if (msg.includes('auth/operation-not-allowed')) {
      return 'Facebook login is not enabled in Firebase Console. Please verify under Authentication > Sign-in method.';
    }
    return raw.replace('Firebase: ', '');
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

        if (!loginEmail.includes('@')) {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/users/email-by-username/${loginEmail}`,
            );
            loginEmail = res.data.email;
          } catch (err) {
            throw new Error('Firebase: User not found with that username.');
          }
        }

        const cred = await login(loginEmail, values.password);

        if (!cred.user.emailVerified) {
          await logout();
          throw new Error(
            'Firebase: Please verify your email address to login.',
          );
        }

        const profile = await fetchMongoProfile(cred.user);
        if (profile && !profile.username) {
          navigate('/complete-profile');
        } else if (profile?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      } catch (err) {
        setAuthError(formatFirebaseError(err?.message || err));
      }
      setLoading(false);
    },
  });

  const handleInputChange = (e) => {
    const { name } = e.target;
    if (name) {
      hasTyped.current[name] = true;
    }
    formik.handleChange(e);
  };

  const shouldShowError = (field) => {
    if (formik.submitCount > 0) {
      return Boolean(formik.errors[field]);
    }
    if (!hasTyped.current[field]) {
      return false;
    }
    return Boolean(formik.touched[field] && formik.errors[field]);
  };

  const handleSocialLogin = async (providerFunc) => {
    setAuthError('');
    setLoading(true);
    try {
      const cred = await providerFunc();
      const profile = await fetchMongoProfile(cred.user);
      if (profile && !profile.username) {
        navigate('/complete-profile');
      } else if (profile?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error('Social login error details:', err);
      setAuthError(formatFirebaseError(err?.message || err?.code || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authError) {
      setAuthError('');
    }
  }, [formik.values.identifier, formik.values.password]);

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: { xs: '100%', sm: 480 },
        mt: { xs: 4, sm: 8 },
        mb: 8,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)',
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            mb: 1.5,
            fontWeight: 600,
            fontSize: '1.35rem',
            whiteSpace: 'nowrap',
          }}
        >
          The Saturation Point
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 4, fontSize: '0.95rem' }}
        >
          Sign in to continue to your account.
        </Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            fullWidth
            size="small"
            id="identifier"
            name="identifier"
            label="Email or Username"
            variant="outlined"
            value={formik.values.identifier}
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            error={shouldShowError('identifier')}
            helperText={
              shouldShowError('identifier') ? formik.errors.identifier : ''
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '44px',
              },
            }}
            slotProps={{
              inputLabel: { sx: { fontSize: '0.95rem' } },
              htmlInput: { sx: { fontSize: '0.95rem' } },
              formHelperText: { sx: { fontSize: '0.8rem' } },
            }}
          />
          <TextField
            fullWidth
            size="small"
            id="password"
            name="password"
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            error={shouldShowError('password')}
            helperText={
              shouldShowError('password') ? formik.errors.password : ''
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '44px',
              },
            }}
            slotProps={{
              inputLabel: { sx: { fontSize: '0.95rem' } },
              htmlInput: { sx: { fontSize: '0.95rem' } },
              formHelperText: { sx: { fontSize: '0.8rem' } },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <Visibility sx={{ fontSize: '1.25rem' }} />
                      ) : (
                        <VisibilityOff sx={{ fontSize: '1.25rem' }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {authError && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 0,
                textAlign: 'left',
                fontSize: '0.9rem',
              }}
            >
              {authError}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              height: '44px',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontSize: '0.85rem', color: '#44403C' }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#1C1917',
                textDecoration: 'underline',
                fontWeight: 600,
                textUnderlineOffset: '3px',
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Box
            sx={{
              flex: 1,
              height: '1px',
              bgcolor: 'rgba(28, 25, 23, 0.1)',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              mx: 2,
              color: '#44403C',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            Or
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: '1px',
              bgcolor: 'rgba(28, 25, 23, 0.1)',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="outlined"
            disabled={loading}
            startIcon={<GoogleIcon sx={{ fontSize: '1.35rem' }} />}
            onClick={() => handleSocialLogin(loginWithGoogle)}
            sx={{
              height: '44px',
              borderColor: 'rgba(28, 25, 23, 0.2)',
              color: '#1C1917',
              '&:hover': {
                borderColor: '#1C1917',
                backgroundColor: 'transparent',
              },
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            Continue with Google
          </Button>
          <Button
            variant="outlined"
            disabled={loading}
            startIcon={<FacebookIcon sx={{ fontSize: '1.35rem' }} />}
            onClick={() => handleSocialLogin(loginWithFacebook)}
            sx={{
              height: '44px',
              borderColor: 'rgba(28, 25, 23, 0.2)',
              color: '#1C1917',
              '&:hover': {
                borderColor: '#1C1917',
                backgroundColor: 'transparent',
              },
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            Continue with Facebook
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
