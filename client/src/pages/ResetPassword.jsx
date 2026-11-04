import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode') || searchParams.get('code');

  const [verifying, setVerifying] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [codeError, setCodeError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!oobCode) {
      setCodeError('No password reset code found in the link. Please request a new link from the sign-in page.');
      setVerifying(false);
      return;
    }

    const checkCode = async () => {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setVerifiedEmail(email);
      } catch (err) {
        setCodeError('This password reset link is invalid or has expired. Please request a new link.');
      } finally {
        setVerifying(false);
      }
    };

    checkCode();
  }, [oobCode]);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters.')
        .required('New password is required.'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
        .required('Please confirm your new password.'),
    }),
    onSubmit: async (values) => {
      setSubmitLoading(true);
      setSubmitError('');
      try {
        await confirmPasswordReset(auth, oobCode, values.password);
        setSubmitSuccess(true);
      } catch (err) {
        setSubmitError(err?.message || 'Failed to update password. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    },
  });

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
        <Box sx={{ mb: 2 }}>
          <LockResetIcon sx={{ fontSize: '2.5rem', color: '#CA8A04' }} />
        </Box>

        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            mb: 1.5,
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          Reset Password
        </Typography>

        {verifying ? (
          <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={32} sx={{ color: '#CA8A04' }} />
            <Typography variant="body2" color="textSecondary">
              Verifying your reset link...
            </Typography>
          </Box>
        ) : codeError ? (
          <Box sx={{ py: 2 }}>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {codeError}
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{
                height: '44px',
                fontWeight: 600,
              }}
            >
              Return to Sign In
            </Button>
          </Box>
        ) : submitSuccess ? (
          <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: '3rem', color: '#16A34A' }} />
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 600,
                color: '#1C1917',
              }}
            >
              Password Updated Successfully
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Your password has been changed. You can now use your new password to sign in.
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{
                height: '44px',
                fontWeight: 600,
              }}
            >
              Sign In with New Password
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 3, fontSize: '0.9rem' }}
            >
              Enter a new password for <strong>{verifiedEmail}</strong>.
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
                id="password"
                name="password"
                label="New Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                size="small"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {submitError && (
                <Alert severity="error" sx={{ textAlign: 'left', fontSize: '0.85rem' }}>
                  {submitError}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitLoading}
                sx={{
                  height: '44px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  mt: 1,
                }}
              >
                {submitLoading ? 'Updating Password...' : 'Reset Password'}
              </Button>

              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{
                  color: '#78716C',
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  '&:hover': {
                    color: '#1C1917',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Back to Sign In
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
