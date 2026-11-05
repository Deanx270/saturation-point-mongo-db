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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import CloseIcon from '@mui/icons-material/Close';
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
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotSentTo, setForgotSentTo] = useState('');
  const hasTyped = useRef({ identifier: false, password: false });

  const handleForgotPasswordSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your email or username.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await axios.post(`${API_BASE_URL}/api/users/forgot-password`, {
        identifier: forgotIdentifier.trim(),
      });
      setForgotSentTo(forgotIdentifier.trim());
      setForgotSuccess(true);
    } catch (err) {
      setForgotError(
        err?.response?.data?.message ||
          'Failed to send password reset email. Please verify your email or username.',
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCloseForgot = () => {
    setForgotOpen(false);
    setForgotIdentifier('');
    setForgotError('');
    setForgotSuccess(false);
    setForgotSentTo('');
  };

  const formatFirebaseError = (errorMsg) => {
    if (!errorMsg) return 'An unexpected error occurred. Please try again.';
    const raw = String(errorMsg);
    const msg = raw.replace('Firebase: ', '').toLowerCase();
    if (
      msg.includes('auth/invalid-credential') ||
      msg.includes('auth/invalid-login-credentials') ||
      msg.includes('auth/wrong-password') ||
      msg.includes('auth/user-not-found') ||
      msg.includes('auth/invalid-email')
    ) {
      return 'Invalid email, username, or password. Please try again.';
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
    if (msg.includes('auth/user-disabled')) {
      return 'Your account has been disabled by an administrator. Please contact support.';
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
        let loginEmail = values.identifier.trim();

        if (!loginEmail.includes('@')) {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/users/email-by-username/${loginEmail}`,
            );
            loginEmail = res.data.email;
          } catch (err) {
            await new Promise((resolve) => setTimeout(resolve, 350));
            throw new Error('Firebase: auth/invalid-credential');
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
        if (!profile || profile.status === 'disabled') {
          await logout();
          throw new Error(
            'Your account has been disabled by an administrator. Please contact support.',
          );
        }
        if (profile && !profile.username) {
          navigate('/complete-profile', { replace: true });
        } else if (profile?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
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
      const profile = await fetchMongoProfile(
        cred.user,
        cred.user?._socialEmail,
      );
      if (!profile || profile.status === 'disabled') {
        await logout();
        throw new Error(
          'Your account has been disabled by an administrator. Please contact support.',
        );
      }
      if (profile && !profile.username) {
        navigate('/complete-profile', { replace: true });
      } else if (profile?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/profile', { replace: true });
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mb: 0.5 }}>
            <Button
              variant="text"
              onClick={() => {
                setForgotOpen(true);
                setForgotSuccess(false);
                setForgotError('');
                setForgotIdentifier('');
              }}
              sx={{
                p: 0,
                minWidth: 'auto',
                fontSize: '0.85rem',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 500,
                color: '#78716C',
                textTransform: 'none',
                '&:hover': {
                  color: '#CA8A04',
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                },
              }}
            >
              Forgot password?
            </Button>
          </Box>

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

      <Dialog
        open={forgotOpen}
        onClose={handleCloseForgot}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            p: 1.5,
            border: '1px solid rgba(28, 25, 23, 0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailOutlinedIcon sx={{ color: '#CA8A04', fontSize: '1.4rem' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Lora", serif',
                fontWeight: 600,
                fontSize: '1.15rem',
                color: '#1C1917',
              }}
            >
              Reset Password
            </Typography>
          </Box>
          <IconButton onClick={handleCloseForgot} size="small" sx={{ color: '#78716C' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: forgotSuccess ? 0.5 : 2 }}>
          {forgotSuccess ? (
            <Box sx={{ pt: 0.5, pb: 0, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 1.5, textAlign: 'left', fontSize: '0.9rem' }}>
                If an account matches <strong>{forgotSentTo}</strong>, a password reset link has been sent to your inbox.
              </Alert>
              <Typography
                variant="body2"
                sx={{
                  color: '#78716C',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  mb: 1,
                }}
              >
                Follow the link in the email to define your new password. You may safely close this window.
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleForgotPasswordSubmit} sx={{ mt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#78716C',
                  fontSize: '0.875rem',
                  mb: 2.5,
                  lineHeight: 1.5,
                }}
              >
                Enter the email address or username associated with your account. We will send you a link to reset your password.
              </Typography>

              <TextField
                fullWidth
                size="small"
                label="Email or Username"
                variant="outlined"
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                autoFocus
                disabled={forgotLoading}
                sx={{
                  mb: forgotError ? 2 : 0,
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                  },
                }}
              />

              {forgotError && (
                <Alert severity="error" sx={{ mt: 1.5, textAlign: 'left', fontSize: '0.85rem' }}>
                  {forgotError}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 0.5 }}>
          {forgotSuccess ? (
            <Button
              onClick={handleCloseForgot}
              fullWidth
              variant="contained"
              sx={{
                height: '40px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Done
            </Button>
          ) : (
            <Box sx={{ display: 'flex', width: '100%', gap: 1.5 }}>
              <Button
                onClick={handleCloseForgot}
                variant="outlined"
                fullWidth
                disabled={forgotLoading}
                sx={{
                  height: '40px',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  borderColor: '#D6D3D1',
                  color: '#57534E',
                  '&:hover': {
                    borderColor: '#A8A29E',
                    backgroundColor: '#F5F5F4',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleForgotPasswordSubmit}
                variant="contained"
                fullWidth
                disabled={forgotLoading}
                sx={{
                  height: '40px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                }}
              >
                {forgotLoading ? (
                  <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
