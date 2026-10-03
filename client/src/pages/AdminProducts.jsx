import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Typography, Button, Paper, Box, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, IconButton, Alert, CircularProgress, Tooltip
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // File upload state
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Delete Products?',
      text: `Are you sure you want to delete ${selectedIds.length} product(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9f1239',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const token = await currentUser.getIdToken();
      await axios.post('http://localhost:5000/api/products/bulk-delete', { ids: selectedIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setSelectedIds([]);
      Swal.fire('Deleted!', 'Products have been deleted.', 'success');
    } catch (error) {
      console.error("Error bulk deleting", error);
      Swal.fire('Error!', 'Failed to delete. Make sure you are an admin.', 'error');
    }
  };

  const handleSingleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9f1239',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const token = await currentUser.getIdToken();
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    } catch (error) {
      console.error("Error deleting product", error);
      Swal.fire('Error!', 'Failed to delete product.', 'error');
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    formik.setValues({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
    
    if (product.images && product.images.length > 0) {
      // Setup previews for existing images
      // We don't have File objects for these, so we just show them
      setPreviewUrls([...product.images]);
      // But we can't put them in the 'images' array because they aren't Files
      // The backend expects us to either skip existing images or just upload new ones
      // For now, we'll keep the UI state clean
    } else {
      setPreviewUrls([]);
    }
    
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required.'),
      description: Yup.string().required('Description is required.'),
      price: Yup.number().positive('Price must be positive').required('Price is required.'),
      category: Yup.string().required('Category is required.'),
      stock: Yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required.')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setErrorMsg('');
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('category', values.category);
        formData.append('stock', values.stock);
        
        images.forEach((img) => {
          formData.append('images', img);
        });

        const token = await currentUser.getIdToken();
        if (editingId) {
          await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Success!', 'Product updated successfully.', 'success');
        } else {
          await axios.post('http://localhost:5000/api/products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Success!', 'Product created successfully.', 'success');
        }
        
        handleCloseModal(resetForm);
        fetchProducts();
      } catch (error) {
        console.error("Error saving product", error);
        setErrorMsg(error.response?.data?.message || "Failed to save product.");
      }
      setLoading(false);
    }
  });

  const handleCloseModal = (resetForm = formik.resetForm) => {
    setOpen(false);
    resetForm();
    setImages([]);
    setPreviewUrls([]);
    setErrorMsg('');
    setFileError('');
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');
    
    if (images.length + files.length > 5) {
      setFileError('You can only upload a maximum of 5 images.');
      return;
    }

    const validFiles = [];
    const validUrls = [];
    let hasError = false;

    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType || !isValidSize) {
        hasError = true;
      } else {
        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      }
    });

    if (hasError) {
      setFileError('Some files were rejected. Only images under 5MB are allowed.');
    }

    setImages(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...validUrls]);
    
    // Reset file input so same files can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(previewUrls.filter((_, index) => index !== indexToRemove));
  };

  const columns = [
    { 
      field: 'images', 
      headerName: 'Image', 
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        params.value && params.value.length > 0 ? 
        <img src={params.value[0]} alt="prod" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '4px' }} /> : 
        <Box sx={{ height: 40, width: 40, bgcolor: '#f5f5f4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ color: '#a8a29e', fontSize: '0.6rem' }}>No img</Typography>
        </Box>
      )
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      renderCell: (params) => `₱${parseFloat(params.value).toFixed(2)}`
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Tooltip title="Edit Product">
            <IconButton size="small" onClick={() => handleEditClick(params.row)} sx={{ color: '#0284c7', bgcolor: 'rgba(2, 132, 199, 0.1)', '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.2)' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Product">
            <IconButton size="small" onClick={() => handleSingleDelete(params.id)} sx={{ color: '#e11d48', bgcolor: 'rgba(225, 29, 72, 0.1)', '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.2)' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
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
            Product Management
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              sx={{ textTransform: 'none', px: 3, mr: 2 }}
            >
              Bulk Delete ({selectedIds.length})
            </Button>
            <Button 
              variant="contained" 
              onClick={() => { setEditingId(null); setOpen(true); }}
              startIcon={<AddIcon />}
              sx={{ bgcolor: '#1C1917', '&:hover': { bgcolor: '#292524' }, textTransform: 'none', px: 3 }}
            >
              Add Product
            </Button>
          </Box>
        </Box>

        <Box sx={{ height: 600, width: '100%', '& .MuiDataGrid-root': { border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 } }}>
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={fetchLoading}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedIds(newSelection);
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#FAF9F6',
                borderBottom: '1px solid rgba(28, 25, 23, 0.08)',
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 600,
                color: '#44403C'
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid rgba(28, 25, 23, 0.04)'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Product Modal */}
      <Dialog open={open} onClose={() => handleCloseModal()} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, fontSize: '1.5rem', pb: 1 }}>
          {editingId ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit} noValidate>
          <DialogContent dividers sx={{ pt: 3 }}>
            <TextField 
              fullWidth 
              id="name"
              name="name"
              label="Product Name" 
              size="small"
              margin="normal" 
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField 
                fullWidth 
                id="price"
                name="price"
                label="Price (₱)" 
                type="number"
                size="small"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField 
                fullWidth 
                id="stock"
                name="stock"
                label="Stock" 
                type="number"
                size="small"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Box>

            <TextField 
              fullWidth 
              id="category"
              name="category"
              label="Category" 
              size="small"
              margin="normal" 
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              sx={{ mb: 2 }}
            />

            <TextField 
              fullWidth 
              id="description"
              name="description"
              label="Description" 
              multiline 
              rows={3} 
              size="small"
              margin="normal" 
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={{ mb: 3 }}
            />
            
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: '#44403C', fontWeight: 500 }}>
                Product Images (Max 5, 5MB each)
              </Typography>
              
              <Box 
                onClick={() => fileInputRef.current.click()}
                sx={{
                  border: '2px dashed rgba(28, 25, 23, 0.2)',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'rgba(250, 249, 246, 0.5)',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#CA8A04', bgcolor: 'rgba(202, 138, 4, 0.04)' },
                  mb: 2
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: '#CA8A04', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#44403C' }}>
                  <strong>Click to upload</strong> or drag and drop
                </Typography>
                <Typography variant="caption" sx={{ color: '#78716C' }}>
                  SVG, PNG, JPG or WEBP
                </Typography>
              </Box>

              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
              
              {fileError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
                  {fileError}
                </Typography>
              )}

              {previewUrls.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {previewUrls.map((url, index) => (
                    <Box key={index} sx={{ position: 'relative', width: 80, height: 80 }}>
                      <Box 
                        component="img"
                        src={url}
                        alt={`preview-${index}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(28, 25, 23, 0.1)' }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        sx={{ 
                          position: 'absolute', top: -8, right: -8, bgcolor: '#e11d48', color: '#fff',
                          width: 20, height: 20, '&:hover': { bgcolor: '#be123c' }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 14, transform: 'rotate(45deg)' }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 1 }}>
                {errorMsg}
              </Alert>
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => handleCloseModal()} sx={{ color: '#44403C', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#1C1917', '&:hover': { bgcolor: '#292524' }, textTransform: 'none', px: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminProducts;
