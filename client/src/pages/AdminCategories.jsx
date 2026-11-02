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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  CircularProgress,
  Tooltip,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminCategories = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c._id?.toLowerCase().includes(term) ||
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term),
    );
  }, [categories, searchTerm]);

  const sortedCategories = useMemo(() => {
    const list = [...filteredCategories];
    if (!orderBy) return list;
    return list.sort((a, b) => {
      const aVal = (a[orderBy] || '').toString().toLowerCase();
      const bVal = (b[orderBy] || '').toString().toLowerCase();
      if (order === 'asc') {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });
  }, [filteredCategories, orderBy, order]);

  useEffect(() => {
    if (page > 0 && sortedCategories.length > 0 && page * rowsPerPage >= sortedCategories.length) {
      setPage(0);
    }
  }, [sortedCategories.length, page, rowsPerPage]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Swal.fire('Error', 'Name is required', 'error');

    try {
      const token = await currentUser.getIdToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/categories/${editingId}`,
          { name, description },
          config,
        );
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Category updated',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/categories`,
          { name, description },
          config,
        );
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Category added',
          showConfirmButton: false,
          timer: 3000,
        });
      }
      setOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category', error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Failed to save category',
        'error',
      );
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete Category?',
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
          await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          fetchCategories();
        } catch (error) {
          console.error('Error deleting category', error);
          Swal.fire('Error!', 'Failed to delete category.', 'error');
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
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
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
            Category Management
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <TextField
              placeholder="Search categories..."
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{
                bgcolor: '#1C1917',
                '&:hover': { bgcolor: '#292524' },
                textTransform: 'none',
                px: 3,
                height: 48,
              }}
            >
              Add Category
            </Button>
          </Box>
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
                <TableCell sx={{ fontWeight: 600, width: '20%' }} sortDirection={orderBy === '_id' ? order : false}>
                  <TableSortLabel
                    active={orderBy === '_id'}
                    direction={orderBy === '_id' ? order : 'asc'}
                    onClick={() => handleRequestSort('_id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '26%' }} sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '38%' }} sortDirection={orderBy === 'description' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'asc'}
                    onClick={() => handleRequestSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: '16%' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : sortedCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 5, color: '#78716C' }}
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell sx={{ color: '#78716C' }}>
                        <CopyableId id={category._id} />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          color: '#1C1917',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#78716C',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.description || '-'}
                      </TableCell>
                      <TableCell sx={{ width: '16%', whiteSpace: 'nowrap' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() => handleOpenEdit(category)}
                            startIcon={
                              <EditIcon
                                sx={{
                                  width: 16,
                                  height: 16,
                                }}
                              />
                            }
                            sx={{
                              color: '#CA8A04',
                              textTransform: 'none',
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': {
                                bgcolor: 'transparent',
                                color: '#a16207',
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleDelete(category._id)}
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
          count={sortedCategories.length}
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: '"Lora", serif',
            fontWeight: 600,
            fontSize: '1.5rem',
          }}
        >
          {editingId ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: '#78716C', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: '#1C1917',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#292524' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategories;
