import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, Box, Typography, TextField, 
  Button, CircularProgress 
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CompleteProfileModal = ({ open }) => {
  const { currentUser, logout, mongoUser, setMongoUser } = useAuth();
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (file) {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        setFileError('Only image files are allowed. Defaulting to standard avatar.');
        setProfilePicture(null);
        setPreviewUrl(null);
        return;
      }
      
      if (!isValidSize) {
        setFileError('File is too large (max 5MB). Defaulting to standard avatar.');
        setProfilePicture(null);
        setPreviewUrl(null);
        return;
      }
      
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setUsernameError('');
    if (!username.trim()) {
      setUsernameError('Username is required.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Only letters, numbers, and underscores are allowed.');
      return;
    }

    setLoading(true);
    try {
      const usernameCheck = await axios.get(`http://localhost:5000/api/users/check-username?username=${username}`);
      if (!usernameCheck.data.available) {
        setUsernameError('Username is already taken.');
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('username', username);
      if (profilePicture) {
        formData.append('photo', profilePicture);
      }

      const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      // Update local state to dismiss the modal
      setMongoUser(res.data.user);
    } catch (err) {
      console.error(err);
      setUsernameError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    await logout();
  };

  // We enforce that this modal cannot be closed by clicking outside or pressing Escape
  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          p: 2, 
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
        } 
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, color: '#1C1917' }}>
          Complete Your Profile
        </Typography>
        <Typography variant="body2" sx={{ color: '#78716C', mt: 1 }}>
          Please choose a username to continue.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 1, overflowY: 'visible' }}>
        <Box sx={{ mb: 4, mt: 2, textAlign: 'center' }}>
          <Box 
            onClick={() => fileInputRef.current.click()}
            sx={{
              width: 100, height: 100, borderRadius: '50%', mx: 'auto', mb: 1,
              border: '2px dashed rgba(28, 25, 23, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              backgroundImage: previewUrl ? `url(${previewUrl})` : `url(${mongoUser?.photoURL}), url(/images/default-avatar.png)`,
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
              <CameraAltIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
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
            Profile Picture (Optional) • Max 5MB
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Choose a Username *"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={Boolean(usernameError)}
          helperText={usernameError}
          size="small"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleSave}
            disabled={loading}
            sx={{ 
              bgcolor: '#1C1917', 
              color: '#fff',
              '&:hover': { bgcolor: '#292524' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save & Continue'}
          </Button>
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={handleCancel}
            disabled={loading}
            sx={{ 
              color: '#44403C',
              borderColor: 'rgba(28, 25, 23, 0.2)',
              '&:hover': { borderColor: '#1C1917', bgcolor: 'transparent' }
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
