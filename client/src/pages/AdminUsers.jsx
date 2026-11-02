import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip,
  TextField,
  InputAdornment,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoles, setUpdatingRoles] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('displayName');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u._id?.toLowerCase().includes(term) ||
        u.displayName?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term),
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    if (!orderBy) return list;
    return list.sort((a, b) => {
      const aVal = (a[orderBy] || '').toString().toLowerCase();
      const bVal = (b[orderBy] || '').toString().toLowerCase();
      if (order === 'asc') {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });
  }, [filteredUsers, orderBy, order]);

  useEffect(() => {
    if (page > 0 && sortedUsers.length > 0 && page * rowsPerPage >= sortedUsers.length) {
      setPage(0);
    }
  }, [sortedUsers.length, page, rowsPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
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
    setUsers(
      users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
    );
    setUpdatingRoles((prev) => ({ ...prev, [userId]: 'loading' }));

    try {
      const token = await currentUser.getIdToken();
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUpdatingRoles((prev) => ({ ...prev, [userId]: 'success' }));
      setTimeout(() => {
        setUpdatingRoles((prev) => ({ ...prev, [userId]: null }));
      }, 1500);
    } catch (error) {
      console.error('Error updating role', error);
      fetchUsers();
      Swal.fire('Error', 'Failed to update user role', 'error');
      setUpdatingRoles((prev) => ({ ...prev, [userId]: null }));
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9f1239',
      cancelButtonColor: '#78716C',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await currentUser.getIdToken();
          await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
        } catch (error) {
          console.error('Error deleting user', error);
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
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Lora", serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              color: '#1C1917',
            }}
          >
            User Management
          </Typography>
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#78716C', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 260 },
              '& .MuiOutlinedInput-root': {
                height: 48,
                borderRadius: 1,
                fontSize: '0.875rem',
                bgcolor: '#FFFFFF',
              },
            }}
          />
        </Box>

        <TableContainer
          sx={{
            border: '1px solid rgba(28, 25, 23, 0.08)',
            borderRadius: 1,
            overflowX: 'auto',
          }}
        >
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead
              sx={{
                bgcolor: '#FAF9F6',
                '& .MuiTableCell-head': { bgcolor: '#FAF9F6' },
                '& .MuiTableSortLabel-root': { color: '#1C1917' },
                '& .MuiTableSortLabel-root.Mui-active': { color: '#1C1917' },
                '& .MuiTableSortLabel-icon': { color: '#1C1917 !important' },
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '18%' }} sortDirection={orderBy === '_id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === '_id'}
                    direction={orderBy === '_id' ? order : 'asc'}
                    onClick={() => handleRequestSort('_id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }} sortDirection={orderBy === 'displayName' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'displayName'}
                    direction={orderBy === 'displayName' ? order : 'asc'}
                    onClick={() => handleRequestSort('displayName')}
                  >
                    Display Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '16%' }} sortDirection={orderBy === 'username' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'username'}
                    direction={orderBy === 'username' ? order : 'asc'}
                    onClick={() => handleRequestSort('username')}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '22%' }} sortDirection={orderBy === 'email' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '12%' }} sortDirection={orderBy === 'role' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'role'}
                    direction={orderBy === 'role' ? order : 'asc'}
                    onClick={() => handleRequestSort('role')}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 5, color: '#78716C' }}
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell sx={{ color: '#78716C' }}>
                        <CopyableId id={user._id} />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={user.photoURL || '/images/default-avatar.png'}
                            alt={user.displayName}
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.displayName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#44403C',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.username || (
                          <Typography
                            variant="caption"
                            sx={{
                              fontStyle: 'italic',
                              color: '#A8A29E',
                            }}
                          >
                            Not set
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Select
                            size="small"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user._id, e.target.value)
                            }
                            sx={{
                              minWidth: 120,
                              fontSize: '0.875rem',
                            }}
                            disabled={
                              currentUser.email === user.email ||
                              updatingRoles[user._id] === 'loading'
                            }
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                          {updatingRoles[user._id] === 'loading' && (
                            <CircularProgress
                              size={16}
                              sx={{
                                color: '#CA8A04',
                              }}
                            />
                          )}
                          {updatingRoles[user._id] === 'success' && (
                            <CheckCircleIcon
                              sx={{
                                fontSize: 18,
                                color: '#16a34a',
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Button
                          size="small"
                          disabled={currentUser.email === user.email}
                          onClick={() => handleDelete(user._id)}
                          startIcon={
                            <DeleteIcon
                              sx={{
                                width: 16,
                                height: 16,
                              }}
                            />
                          }
                          sx={{
                            color: '#991b1b',
                            textTransform: 'none',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              bgcolor: 'transparent',
                              color: '#7f1d1d',
                            },
                          }}
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
          count={sortedUsers.length}
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
