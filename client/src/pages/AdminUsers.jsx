import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Select, 
  MenuItem, CircularProgress, Tooltip, TablePagination
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoles, setUpdatingRoles] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    setUpdatingRoles(prev => ({ ...prev, [userId]: 'loading' }));

    try {
      const token = await currentUser.getIdToken();
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdatingRoles(prev => ({ ...prev, [userId]: 'success' }));
      setTimeout(() => {
        setUpdatingRoles(prev => ({ ...prev, [userId]: null }));
      }, 1500);
    } catch (error) {
      console.error("Error updating role", error);
      fetchUsers();
      Swal.fire('Error', 'Failed to update user role', 'error');
      setUpdatingRoles(prev => ({ ...prev, [userId]: null }));
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
          <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, fontSize: { xs: '2rem', sm: '2.5rem' }, color: '#1C1917' }}>
            User Management
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 600, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Display Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#78716C' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ color: '#78716C' }}>
                      <CopyableId id={user._id} />
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
                    <TableCell sx={{ color: '#44403C' }}>{user.username || <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#A8A29E' }}>Not set</Typography>}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Select
                          size="small"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          sx={{ minWidth: 120, fontSize: '0.875rem' }}
                          disabled={currentUser.email === user.email || updatingRoles[user._id] === 'loading'}
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                        {updatingRoles[user._id] === 'loading' && <CircularProgress size={16} sx={{ color: '#CA8A04' }} />}
                        {updatingRoles[user._id] === 'success' && <CheckCircleIcon sx={{ fontSize: 18, color: '#16a34a' }} />}
                      </Box>
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: '1px solid rgba(28, 25, 23, 0.08)' }}
        />
      </Paper>
    </Box>
  );
};

export default AdminUsers;
