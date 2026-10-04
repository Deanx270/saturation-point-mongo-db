import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminCategories = () => {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
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
        await axios.put(`http://localhost:5000/api/categories/${editingId}`, { name, description }, config);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Category updated', showConfirmButton: false, timer: 3000 });
      } else {
        await axios.post('http://localhost:5000/api/categories', { name, description }, config);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Category added', showConfirmButton: false, timer: 3000 });
      }
      setOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category", error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete Category?',
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
          await axios.delete(`http://localhost:5000/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          fetchCategories();
        } catch (error) {
          console.error("Error deleting category", error);
          Swal.fire('Error!', 'Failed to delete category.', 'error');
        }
      }
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, color: '#1C1917' }}>
          Category Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenAdd}
          sx={{ 
            bgcolor: '#1C1917', 
            color: 'white',
            textTransform: 'none',
            fontFamily: '"Montserrat", sans-serif',
            '&:hover': { bgcolor: '#292524' }
          }}
        >
          Add Category
        </Button>
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
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id} hover>
                    <TableCell sx={{ fontWeight: 500, color: '#1C1917' }}>{category.name}</TableCell>
                    <TableCell sx={{ color: '#78716C' }}>{category.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenEdit(category)} sx={{ color: '#CA8A04' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(category._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#78716C' }}>
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, fontSize: '1.5rem' }}>
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
          <Button onClick={() => setOpen(false)} sx={{ color: '#78716C', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            sx={{ bgcolor: '#1C1917', color: 'white', textTransform: 'none', '&:hover': { bgcolor: '#292524' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategories;
