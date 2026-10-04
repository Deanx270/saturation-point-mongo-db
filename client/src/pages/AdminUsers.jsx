import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Select, 
  MenuItem, CircularProgress, Tooltip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = await currentUser.getIdToken();
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Role updated',
        showConfirmButton: false,
        timer: 3000
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating role", error);
      Swal.fire('Error', 'Failed to update user role', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete User?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9f1239',
      cancelButtonColor: '#78716C',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await currentUser.getIdToken();
          await axios.delete(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user", error);
          Swal.fire('Error!', 'Failed to delete user.', 'error');
        }
      }
    });
  };

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, fontSize: { xs: '2rem', sm: '2.5rem' }, color: '#1C1917' }}>
            User Management
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 600, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Display Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#78716C' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#78716C' }}>
                      <Tooltip title={`Copy ${user._id}`}>
                        <span 
                          onClick={() => {
                            navigator.clipboard.writeText(user._id);
                            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'ID copied!', showConfirmButton: false, timer: 2000, customClass: { popup: 'swal2-toast' } });
                          }}
                          style={{ cursor: 'pointer', borderBottom: '1px dotted #ccc', color: '#CA8A04', transition: 'color 0.2s ease' }}
                        >
                          {user._id.substring(0, 8)}...
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          component="img" 
                          src={user.photoURL || '/images/default-avatar.png'} 
                          alt={user.displayName}
                          sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <Typography variant="body2">{user.displayName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        sx={{ minWidth: 120, fontSize: '0.875rem' }}
                        disabled={currentUser.email === user.email}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        disabled={currentUser.email === user.email} 
                        onClick={() => handleDelete(user._id)} 
                        startIcon={<DeleteIcon sx={{ width: 16, height: 16 }} />} 
                        sx={{ color: '#991b1b', textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#7f1d1d' } }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminUsers;
