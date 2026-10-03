import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Typography, Button, Paper, Box, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, IconButton, Alert, CircularProgress, Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductFormModal = ({ open, onClose, fetchProducts, editingId, productData }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formImages, setFormImages] = useState([]);
  const [fileError, setFileError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: { name: '', description: '', price: '', category: '', stock: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required.'),
      description: Yup.string().required('Description is required.'),
      price: Yup.number().positive('Price must be positive').required('Price is required.'),
      category: Yup.string().required('Category is required.'),
      stock: Yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required.')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg('');
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('category', values.category);
        formData.append('stock', values.stock);
        
        const imageOrder = [];
        formImages.forEach(img => {
          if (img.type === 'existing') {
            imageOrder.push(img.url);
          } else {
            imageOrder.push('new');
            formData.append('images', img.file);
          }
        });
        formData.append('imageOrder', JSON.stringify(imageOrder));

        const token = await currentUser.getIdToken();
        if (editingId) {
          await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          Swal.fire('Success!', 'Product updated successfully.', 'success');
        } else {
          await axios.post('http://localhost:5000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          Swal.fire('Success!', 'Product created successfully.', 'success');
        }
        
        onClose();
        fetchProducts();
      } catch (error) {
        console.error("Error saving product", error);
        setErrorMsg(error.response?.data?.message || "Failed to save product.");
      }
      setLoading(false);
    }
  });

  useEffect(() => {
    if (open) {
      if (productData) {
        formik.setValues({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          category: productData.category || '',
          stock: productData.stock || ''
        });
        if (productData.images && productData.images.length > 0) {
          setFormImages(productData.images.map(url => ({ type: 'existing', url })));
        } else {
          setFormImages([]);
        }
      } else {
        formik.resetForm();
        setFormImages([]);
      }
      setErrorMsg('');
      setFileError('');
      setDraggedIndex(null);
    }
  }, [open, productData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileError('');
    
    if (formImages.length + files.length > 5) {
      setFileError('You can only upload a maximum of 5 images.');
      return;
    }

    const validNewImages = [];
    let hasError = false;

    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType || !isValidSize) {
        hasError = true;
      } else {
        validNewImages.push({ type: 'new', file, url: URL.createObjectURL(file) });
      }
    });

    if (hasError) {
      setFileError('Some files were rejected. Only images under 5MB are allowed.');
    }

    setFormImages(prev => [...prev, ...validNewImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setFormImages(prev => prev.filter((_, index) => index !== indexToRemove));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Image removed. Save to apply.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragEnter = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setFormImages(prev => {
      const newArr = [...prev];
      const draggedItem = newArr[draggedIndex];
      newArr.splice(draggedIndex, 1);
      newArr.splice(targetIndex, 0, draggedItem);
      return newArr;
    });
    setDraggedIndex(targetIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const setAsMain = (e, index) => {
    e.stopPropagation();
    if (index === 0) return;
    setFormImages(prev => {
      const newArr = [...prev];
      const item = newArr[index];
      newArr.splice(index, 1);
      newArr.unshift(item);
      return newArr;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
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

            {formImages.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {formImages.map((img, index) => (
                  <Box 
                    key={img.url} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    sx={{ 
                      position: 'relative', width: 90, height: 90, cursor: 'grab', '&:active': { cursor: 'grabbing' },
                      '&:hover .set-main-btn': { opacity: 1 },
                      opacity: draggedIndex === index ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box 
                      component="img"
                      src={img.url}
                      alt={`preview-${index}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1, border: index === 0 ? '2px solid #CA8A04' : '1px solid rgba(28, 25, 23, 0.1)' }}
                    />
                    
                    {/* Main Image Overlay */}
                    {index === 0 ? (
                      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(202, 138, 4, 0.9)', color: '#fff', fontSize: '0.6rem', textAlign: 'center', py: 0.5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, pointerEvents: 'none' }}>
                        MAIN
                      </Box>
                    ) : (
                      <Box 
                        className="set-main-btn"
                        onClick={(e) => setAsMain(e, index)}
                        sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0, 0, 0, 0.7)', color: '#fff', fontSize: '0.6rem', textAlign: 'center', py: 0.5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, opacity: 0, transition: 'opacity 0.2s', '&:hover': { bgcolor: 'rgba(202, 138, 4, 0.9)' }, cursor: 'pointer' }}
                      >
                        SET MAIN
                      </Box>
                    )}

                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      sx={{ 
                        position: 'absolute', top: -8, right: -8, bgcolor: '#e11d48', color: '#fff',
                        width: 22, height: 22, '&:hover': { bgcolor: '#be123c' }, boxShadow: 1
                      }}
                    >
                      <AddIcon sx={{ fontSize: 16, transform: 'rotate(45deg)' }} />
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
          <Button onClick={onClose} sx={{ color: '#44403C', textTransform: 'none' }}>
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
  );
};


const AdminProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [productData, setProductData] = useState(null);
  
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
    setProductData(product);
    setOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setProductData(null);
    setOpen(true);
  };

  const columns = [
    { 
      field: 'images', 
      headerName: 'Image', 
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value && params.value.length > 0 ? 
          <img src={params.value[0]} alt="prod" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '4px' }} /> : 
          <Box sx={{ height: 40, width: 40, bgcolor: '#f5f5f4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: '#a8a29e', fontSize: '0.6rem' }}>No img</Typography>
          </Box>}
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
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', height: '100%' }}>
          <Button 
            size="small" 
            onClick={() => handleEditClick(params.row)} 
            startIcon={<EditIcon sx={{ width: 16, height: 16 }} />}
            sx={{ 
              color: '#CA8A04', 
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': { bgcolor: 'transparent', color: '#a16207' }
            }}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            onClick={() => handleSingleDelete(params.id)} 
            startIcon={<DeleteIcon sx={{ width: 16, height: 16 }} />}
            sx={{ 
              color: '#991b1b', 
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              '&:hover': { bgcolor: 'transparent', color: '#7f1d1d' }
            }}
          >
            Delete
          </Button>
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
              onClick={handleAddClick}
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
            rowHeight={64}
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

      <ProductFormModal 
        open={open} 
        onClose={() => setOpen(false)} 
        fetchProducts={fetchProducts}
        editingId={editingId}
        productData={productData}
      />
    </Container>
  );
};

export default AdminProducts;
