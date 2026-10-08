import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Tooltip, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminBrands = () => {
  const { currentUser } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/brands');
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    setDescription(brand.description);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return Swal.fire('Error', 'Name is required', 'error');

    try {
      const token = await currentUser.getIdToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/brands/${editingId}`, { name, description }, config);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Brand updated', showConfirmButton: false, timer: 3000 });
      } else {
        await axios.post('http://localhost:5000/api/brands', { name, description }, config);
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Brand added', showConfirmButton: false, timer: 3000 });
      }
      setOpen(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand", error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save brand', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete Brand?',
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
          await axios.delete(`http://localhost:5000/api/brands/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
          fetchBrands();
        } catch (error) {
          console.error("Error deleting brand", error);
          Swal.fire('Error!', 'Failed to delete brand.', 'error');
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
            Brand Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAdd}
            sx={{ bgcolor: '#1C1917', '&:hover': { bgcolor: '#292524' }, textTransform: 'none', px: 3 }}
          >
            Add Brand
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 600, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <CircularProgress sx={{ color: '#CA8A04' }} />
                  </TableCell>
                </TableRow>
              ) : brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5, color: '#78716C' }}>
                    No brands found.
                  </TableCell>
                </TableRow>
              ) : (
                brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((brand) => (
                  <TableRow key={brand._id} hover>
                    <TableCell sx={{ color: '#78716C' }}>
                      <CopyableId id={brand._id} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#1C1917' }}>{brand.name}</TableCell>
                    <TableCell sx={{ color: '#78716C' }}>{brand.description || '-'}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button 
                          size="small" 
                          onClick={() => handleOpenEdit(brand)} 
                          startIcon={<EditIcon sx={{ width: 16, height: 16 }} />} 
                          sx={{ color: '#CA8A04', textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#a16207' } }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          onClick={() => handleDelete(brand._id)} 
                          startIcon={<DeleteIcon sx={{ width: 16, height: 16 }} />} 
                          sx={{ color: '#991b1b', textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#7f1d1d' } }}
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
          count={brands.length}
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

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Lora", serif', fontWeight: 600, fontSize: '1.5rem' }}>
          {editingId ? 'Edit Brand' : 'Add Brand'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Brand Name"
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

export default AdminBrands;
