import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Select, 
  MenuItem, CircularProgress 
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, color: '#1C1917' }}>
          User Management
        </Typography>
        {/* No Add User button per design constraints (Firebase Auth flow handles registration) */}
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid rgba(28, 25, 23, 0.08)',
          boxShadow: '0 8px 32px rgba(28, 25, 23, 0.04)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress sx={{ color: '#CA8A04' }} />
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#F5F5F4' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Display Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Role</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#78716C' }}>
                      {user._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        component="img" 
                        src={user.photoURL} 
                        alt={user.displayName}
                        sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {user.displayName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        sx={{ minWidth: 120, fontSize: '0.875rem' }}
                        disabled={currentUser.email === user.email} // prevent changing own role
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(user._id)}
                        disabled={currentUser.email === user.email} // prevent self-deletion
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#78716C' }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminUsers;
