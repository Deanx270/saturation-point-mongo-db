import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Typography, Box, Paper, Button, CircularProgress, 
  Rating, TextField, Divider, Avatar, IconButton, Alert, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Track existing review and purchases
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      const found = res.data;
      setProduct(found);
      if (found && found.images && found.images.length > 0) {
        setMainImage(found.images[0]);
      }
      
      if (currentUser && found) {
        // Check if user is admin via token
        const tokenResult = await currentUser.getIdTokenResult();
        // Since we don't store role in custom claims yet, we can check email
        if (currentUser.email === 'admin@admin.com') {
          setIsAdmin(true);
        }

        // Check if user has already reviewed
        const userReview = found.reviews.find(r => r.name === currentUser.displayName || r.name === currentUser.email);
        // Better check would be user ID, but we only have firebase UID on frontend right now.
        // Let's rely on the backend to tell us by doing a dry-run check or we can map it via an API.
        // For this MP3 requirement, we'll populate formik if they already reviewed based on name match for simplicity.
        if (userReview) {
          setHasReviewed(true);
          formik.setValues({
            rating: userReview.rating,
            comment: userReview.comment
          });
        }
        
        // Fetch orders to check if they purchased it
        try {
          const token = await currentUser.getIdToken();
          const ordersRes = await axios.get(`http://localhost:5000/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const orders = ordersRes.data;
          const purchased = orders.some(order => 
            order.status === 'completed' && order.orderItems.some(item => item.product === id)
          );
          setHasPurchased(purchased);
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
      }
    } catch (error) {
      console.error('Error fetching product', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id, currentUser]);

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      rating: 0,
      comment: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number().min(1, 'Please provide a rating').required('Rating is required'),
      comment: Yup.string().required('Please write a review comment')
    }),
    onSubmit: async (values, { resetForm }) => {
      setReviewLoading(true);
      try {
        const token = await currentUser.getIdToken();
        await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
          rating: values.rating,
          comment: values.comment,
          name: currentUser.displayName || currentUser.email
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: hasReviewed ? 'Review updated!' : 'Review added!',
          showConfirmButton: false,
          timer: 3000
        });
        
        setHasReviewed(true);
        setIsEditingReview(false);
        fetchProduct(); // Refresh reviews
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to submit review', 'error');
      }
      setReviewLoading(false);
    }
  });

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: "Are you sure you want to remove this review?",
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
      await axios.delete(`http://localhost:5000/api/products/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Deleted!', 'Review has been deleted.', 'success');
      fetchProduct();
    } catch (error) {
      Swal.fire('Error', 'Failed to delete review.', 'error');
    }
  };

  const handlePrevImage = () => {
    if (!product || !product.images) return;
    const currentIndex = product.images.indexOf(mainImage);
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setMainImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!product || !product.images) return;
    const currentIndex = product.images.indexOf(mainImage);
    const nextIndex = (currentIndex + 1) % product.images.length;
    setMainImage(product.images[nextIndex]);
  };

  const scrollToReviews = () => {
    const section = document.getElementById('reviews-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{ color: '#CA8A04' }} /></Box>;
  if (!product) return <Container><Typography sx={{ mt: 5 }}>Product not found</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 8 }, mb: 8 }}>
      <Button component={Link} to="/catalog" sx={{ mb: 4, color: '#78716C', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}>
        &larr; Back to Products
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, mb: 10 }}>
        {/* Product Images Area */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ width: '100%', height: { xs: 300, md: 500 }, bgcolor: '#fff', mb: 2, position: 'relative' }}>
            {mainImage ? (
              <>
                <Box component="img" src={mainImage} sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 4, boxSizing: 'border-box' }} />
                {product.images && product.images.length > 1 && (
                  <>
                    <IconButton 
                      onClick={handlePrevImage}
                      sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton 
                      onClick={handleNextImage}
                      sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
              </>
            ) : (
              <Box component="img" src="/images/default-avatar.png" sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 4, boxSizing: 'border-box' }} />
            )}
          </Box>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {product.images.map((img, idx) => (
                <Box 
                  key={idx} 
                  component="img" 
                  src={img} 
                  onClick={() => setMainImage(img)}
                  sx={{ 
                    width: 80, height: 80, objectFit: 'cover', cursor: 'pointer',
                    border: mainImage === img ? '2px solid #CA8A04' : '1px solid transparent',
                    opacity: mainImage === img ? 1 : 0.6,
                    '&:hover': { opacity: 1 }
                  }} 
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Product Info Area */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.category}
          </Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mt: 1, mb: 2, color: '#1C1917' }}>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1C1917', fontFamily: '"Montserrat", sans-serif' }}>
              ₱{parseFloat(product.price).toFixed(2)}
            </Typography>
            <Box 
              onClick={scrollToReviews} 
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover *': { color: '#1C1917' } }}
            >
              <Rating value={product.rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" sx={{ color: '#78716C', textDecoration: 'underline' }}>({product.numReviews} reviews)</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ color: '#44403C', lineHeight: 1.8, mb: 4, whiteSpace: 'pre-line' }}>
            {product.description}
          </Typography>
          <Typography variant="body2" sx={{ color: product.stock > 0 ? '#15803d' : '#9f1239', fontWeight: 500, mb: 4 }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {product.stock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(28, 25, 23, 0.2)', borderRadius: 1 }}>
                <IconButton 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  sx={{ borderRadius: 0 }}
                >
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>-</Typography>
                </IconButton>
                <Typography sx={{ px: 2, minWidth: '40px', textAlign: 'center', fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}>
                  {quantity}
                </Typography>
                <IconButton 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  sx={{ borderRadius: 0 }}
                >
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>+</Typography>
                </IconButton>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              fullWidth 
              disabled={product.stock === 0}
              onClick={() => {
                const productToAdd = {
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  photos: product.images,
                  stock: product.stock
                };
                addToCart(productToAdd, quantity);
                Swal.fire({
                  icon: 'success',
                  title: 'Added to Cart',
                  showConfirmButton: false,
                  timer: 1500,
                  toast: true,
                  position: 'bottom-end',
                  customClass: { popup: 'swal2-toast' }
                });
              }}
              sx={{ bgcolor: '#1C1917', '&:hover': { bgcolor: '#292524' }, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Reviews Section */}
      <Box id="reviews-section" sx={{ borderTop: '1px solid rgba(28, 25, 23, 0.08)', pt: 4, mt: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mb: 4, color: '#1C1917' }}>
          Customer Reviews
        </Typography>

        {/* Write a Review Form */}
        {currentUser ? (
          hasPurchased ? (
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: '#FAF9F6', borderRadius: 2, mb: 4, border: '1px solid rgba(28, 25, 23, 0.04)' }}>
              {hasReviewed && !isEditingReview ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ color: '#44403C' }}>You have already reviewed this product.</Typography>
                  <Button 
                    onClick={() => setIsEditingReview(true)} 
                    startIcon={<EditIcon />}
                    sx={{ color: '#CA8A04', textTransform: 'none', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}
                  >
                    Edit your review
                  </Button>
                </Box>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Lora", serif' }}>
                    {hasReviewed ? 'Update your review' : 'Write a review'}
                  </Typography>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography component="legend" variant="body2" sx={{ color: '#44403C', fontWeight: 500 }}>Your Rating:</Typography>
                    <Rating
                      name="rating"
                      value={formik.values.rating}
                      onChange={(event, newValue) => formik.setFieldValue('rating', newValue)}
                      size="large"
                    />
                    {formik.errors.rating && (
                      <Typography variant="caption" color="error">{formik.errors.rating}</Typography>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    id="comment"
                    name="comment"
                    placeholder="Share your thoughts about this product..."
                    multiline
                    rows={4}
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.comment)}
                    helperText={formik.errors.comment}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={reviewLoading}
                      sx={{ bgcolor: '#CA8A04', '&:hover': { bgcolor: '#a16207' }, textTransform: 'none', px: 4 }}
                    >
                      {reviewLoading ? <CircularProgress size={24} color="inherit" /> : (hasReviewed ? 'Update Review' : 'Submit Review')}
                    </Button>
                    {hasReviewed && isEditingReview && (
                      <Button onClick={() => setIsEditingReview(false)} sx={{ color: '#78716C', textTransform: 'none' }}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </form>
              )}
            </Paper>
          ) : (
            <Alert severity="info" sx={{ mb: 4, bgcolor: '#FAF9F6', color: '#44403C', '& .MuiAlert-icon': { color: '#CA8A04' } }}>
              You must purchase this item and complete the order before you can write a review.
            </Alert>
          )
        ) : (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 1 }}>
            Please <Link to="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>log in</Link> to write a review.
          </Alert>
        )}

        {/* Display Reviews */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.reviews.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#78716C' }}>No reviews yet. Be the first to review!</Typography>
          ) : (
            product.reviews.map(review => (
              <Box key={review._id} sx={{ pb: 4, borderBottom: '1px solid rgba(28, 25, 23, 0.04)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1C1917', width: 40, height: 40 }}>
                      {review.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1C1917' }}>{review.name}</Typography>
                      <Rating value={review.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                  
                  {isAdmin && (
                    <Tooltip title="Delete Review (Admin)">
                      <IconButton onClick={() => handleDeleteReview(review._id)} size="small" sx={{ color: '#9f1239' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body1" sx={{ color: '#44403C', whiteSpace: 'pre-line' }}>
                  {review.comment}
                </Typography>
                <Typography variant="caption" sx={{ color: '#a8a29e', display: 'block', mt: 2 }}>
                  {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetails;
