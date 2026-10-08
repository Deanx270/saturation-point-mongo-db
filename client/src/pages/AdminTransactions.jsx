import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Select, MenuItem, CircularProgress,
  Dialog, DialogTitle, DialogContent, Divider, Chip, Tooltip, Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import Swal from 'sweetalert2';
import CopyableId from '../components/CopyableId';

const AdminTransactions = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const handleStatusChangeClick = (newStatus) => {
    if (newStatus !== selectedOrder.status) {
      setPendingStatusUpdate(newStatus);
    } else {
      setPendingStatusUpdate(null);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatusUpdate || !selectedOrder) return;
    const orderId = selectedOrder._id;
    const newStatus = pendingStatusUpdate;
    
    setPendingStatusUpdate(null);
    
    try {
      const token = await currentUser.getIdToken();
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      
      setUpdateFeedback({ type: 'success', message: 'Status updated successfully' });
      setTimeout(() => setUpdateFeedback(null), 3000);
    } catch (error) {
      console.error("Error updating order status", error);
      fetchOrders();
      setUpdateFeedback({ type: 'error', message: 'Failed to update status' });
      setTimeout(() => setUpdateFeedback(null), 3000);
    }
  };

  const handleTableStatusChange = async (orderId, newStatus) => {
    const originalStatus = orders.find(o => o._id === orderId).status;
    if (newStatus === originalStatus) return;
    
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      const token = await currentUser.getIdToken();
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: 'success',
        title: '<span style="font-family: \'Lora\', serif;">Status Updated</span>',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'premium-swal-popup' }
      });
    } catch (error) {
      console.error("Error updating order status", error);
      fetchOrders();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update order status'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
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
            Transaction Management
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 600, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
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
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#78716C' }}>
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow 
                    key={order._id} 
                    hover
                    onClick={() => setSelectedOrder(order)}
                    sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ color: '#78716C' }}>
                      <CopyableId id={order._id} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1917' }}>
                        {order.user?.displayName || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716C' }}>
                        {order.user?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#78716C' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#1C1917' }}>
                      ₱{parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleTableStatusChange(order._id, e.target.value)}
                        disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        sx={{ 
                          minWidth: 120, 
                          fontSize: '0.875rem',
                          bgcolor: 'transparent',
                          '& .MuiSelect-select': { py: 0.5 }
                        }}
                      >
                        <MenuItem value="pending" disabled={order.status !== 'pending'}>Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered" disabled={order.status === 'pending'}>Delivered</MenuItem>
                        <MenuItem value="cancelled" disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled'}>Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        onClick={() => setSelectedOrder(order)} 
                        startIcon={<VisibilityIcon sx={{ width: 16, height: 16 }} />} 
                        sx={{ color: '#1C1917', textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', color: '#292524' } }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Transaction Details Modal */}
      <Dialog 
        open={Boolean(selectedOrder)} 
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ p: 4, pb: 3, borderBottom: '1px solid #E7E5E4' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                    Transaction Details
                    <Chip label={selectedOrder.status.toUpperCase()} color={getStatusColor(selectedOrder.status)} size="small" sx={{ fontSize: '0.7rem', letterSpacing: 1, height: 24 }} />
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#78716C' }}>Order ID:</Typography>
                    <CopyableId id={selectedOrder._id} full={true} />
                  </Box>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 4, bgcolor: '#FAFAFA' }}>
              {/* Info Grid - Matching old system strictly */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4, p: 3, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E7E5E4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Customer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedOrder.user?.displayName}</Typography>
                  <Typography variant="caption" sx={{ color: '#78716C' }}>{selectedOrder.user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Date & Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Payment Method</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedOrder.paymentMethod}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>Total Amount</Typography>
                  <Typography variant="h6" sx={{ color: '#CA8A04', fontWeight: 600 }}>₱{parseFloat(selectedOrder.totalAmount).toFixed(2)}</Typography>
                </Box>
              </Box>

              {/* Status Update Box - Restored from old system */}
              <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1.5, p: { xs: 2, sm: 3 }, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E7E5E4', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Update Order Status</Typography>
                  <Select
                    size="small"
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChangeClick(e.target.value)}
                    disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                    sx={{ minWidth: 150, fontSize: '0.875rem' }}
                  >
                    <MenuItem value="pending" disabled={selectedOrder.status !== 'pending'}>Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered" disabled={selectedOrder.status === 'pending'}>Delivered</MenuItem>
                    <MenuItem value="cancelled" disabled={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}>Cancelled</MenuItem>
                  </Select>
                </Box>
                
                {pendingStatusUpdate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px dashed #E7E5E4' }}>
                    <Typography variant="body2" sx={{ color: '#78716C' }}>
                      Change status to <strong>{pendingStatusUpdate}</strong>?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" onClick={() => setPendingStatusUpdate(null)} sx={{ color: '#1C1917', borderColor: '#E7E5E4', textTransform: 'none' }}>Cancel</Button>
                      <Button size="small" variant="contained" onClick={confirmStatusChange} sx={{ bgcolor: '#1C1917', textTransform: 'none' }}>Confirm</Button>
                    </Box>
                  </Box>
                )}
                
                {updateFeedback && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1.5, borderTop: '1px dashed #E7E5E4' }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: updateFeedback.type === 'success' ? '#16a34a' : '#dc2626' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: updateFeedback.type === 'success' ? '#16a34a' : '#dc2626' }}>
                      {updateFeedback.message}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="h6" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, mb: 2 }}>Order Items</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedOrder.orderItems.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, bgcolor: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 2 }}>
                    <Box 
                      component="img" 
                      src={item.image || '/images/default-avatar.png'} 
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} 
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                      <Typography variant="body2" sx={{ color: '#78716C' }}>Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>₱{(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminTransactions;
