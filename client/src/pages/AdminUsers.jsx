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
  CircularProgress,
  TextField,
  InputAdornment,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
        u.role?.toLowerCase().includes(term) ||
        (u.status || 'active').toLowerCase().includes(term),
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

  const handleToggleStatus = async (user) => {
    if (user.role === 'admin') {
      Swal.fire('Prohibited', 'Admin accounts cannot be disabled.', 'warning');
      return;
    }

    const isDisabling = user.status !== 'disabled';
    const actionText = isDisabling ? 'disable' : 'enable';
    const newStatus = isDisabling ? 'disabled' : 'active';

    Swal.fire({
      title: `${isDisabling ? 'Disable' : 'Enable'} User Account?`,
      text: isDisabling
        ? 'This user will immediately be logged out and prevented from accessing the store.'
        : 'This user will be permitted to log in and use the store again.',
      icon: isDisabling ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isDisabling ? '#d97706' : '#16a34a',
      cancelButtonColor: '#78716C',
      confirmButtonText: `Yes, ${actionText} user!`,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          const token = await currentUser.getIdToken();
          await axios.put(
            `${API_BASE_URL}/api/users/${user._id}/status`,
            { status: newStatus },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setUsers((prev) =>
            prev.map((u) =>
              u._id === user._id ? { ...u, status: newStatus } : u,
            ),
          );
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            error.response?.data?.message || 'Failed to update user status.',
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Success',
          `User account has been ${isDisabling ? 'disabled' : 'enabled'}.`,
          'success',
        );
      }
    });
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
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          const token = await currentUser.getIdToken();
          await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            error.response?.data?.message || 'Failed to delete user.',
          );
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
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
                <TableCell sx={{ fontWeight: 600, width: '9%' }} sortDirection={orderBy === '_id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === '_id'}
                    direction={orderBy === '_id' ? order : 'asc'}
                    onClick={() => handleRequestSort('_id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '18%' }} sortDirection={orderBy === 'displayName' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'displayName'}
                    direction={orderBy === 'displayName' ? order : 'asc'}
                    onClick={() => handleRequestSort('displayName')}
                  >
                    Display Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '13%' }} sortDirection={orderBy === 'username' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'username'}
                    direction={orderBy === 'username' ? order : 'asc'}
                    onClick={() => handleRequestSort('username')}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }} sortDirection={orderBy === 'email' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '11%' }} sortDirection={orderBy === 'role' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'role'}
                    direction={orderBy === 'role' ? order : 'asc'}
                    onClick={() => handleRequestSort('role')}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '10%' }} sortDirection={orderBy === 'status' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '19%', minWidth: 170 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
                        <Chip
                          label={user.role === 'admin' ? 'Admin' : 'Customer'}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            bgcolor:
                              user.role === 'admin'
                                ? '#1C1917'
                                : '#F5F5F4',
                            color:
                              user.role === 'admin'
                                ? '#FACC15'
                                : '#57534E',
                            border: `1px solid ${
                              user.role === 'admin'
                                ? '#1C1917'
                                : '#E7E5E4'
                            }`,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 'disabled' ? 'Disabled' : 'Active'}
                          size="small"
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            bgcolor:
                              user.status === 'disabled'
                                ? 'rgba(225, 29, 72, 0.1)'
                                : 'rgba(22, 163, 74, 0.1)',
                            color:
                              user.status === 'disabled'
                                ? '#e11d48'
                                : '#16a34a',
                            border: `1px solid ${
                              user.status === 'disabled'
                                ? 'rgba(225, 29, 72, 0.25)'
                                : 'rgba(22, 163, 74, 0.25)'
                            }`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap', width: '19%', minWidth: 170 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {user.role !== 'admin' && (
                            <Button
                              size="small"
                              onClick={() => handleToggleStatus(user)}
                              startIcon={
                                user.status === 'disabled' ? (
                                  <LockOpenIcon sx={{ width: 16, height: 16 }} />
                                ) : (
                                  <BlockIcon sx={{ width: 16, height: 16 }} />
                                )
                              }
                              sx={{
                                color:
                                  user.status === 'disabled'
                                    ? '#16a34a'
                                    : '#d97706',
                                textTransform: 'none',
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': {
                                  bgcolor: 'transparent',
                                  color:
                                    user.status === 'disabled'
                                      ? '#15803d'
                                      : '#b45309',
                                },
                              }}
                            >
                              {user.status === 'disabled' ? 'Enable' : 'Disable'}
                            </Button>
                          )}
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
                        </Box>
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
