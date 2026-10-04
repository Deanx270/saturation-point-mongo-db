import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Select, MenuItem, CircularProgress,
  Dialog, DialogTitle, DialogContent, Divider, Chip
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminTransactions = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = await currentUser.getIdToken();
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ toast: true, position: 'bottom-end', icon: 'success', title: 'Status updated', showConfirmButton: false, timer: 3000 });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status", error);
      Swal.fire('Error', 'Failed to update order status', 'error');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, color: '#1C1917' }}>
          Transaction Management
        </Typography>
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
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#F5F5F4' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif', color: '#1C1917' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order._id} 
                    hover 
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell onClick={() => setSelectedOrder(order)} sx={{ fontFamily: 'monospace', color: '#78716C' }}>
                      {order._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell onClick={() => setSelectedOrder(order)}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1C1917' }}>
                        {order.user?.displayName || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716C' }}>
                        {order.user?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell onClick={() => setSelectedOrder(order)} sx={{ color: '#78716C' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </TableCell>
                    <TableCell onClick={() => setSelectedOrder(order)} sx={{ fontWeight: 500, color: '#1C1917' }}>
                      ₱{parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{ 
                          minWidth: 120, 
                          fontSize: '0.875rem',
                          bgcolor: 'transparent',
                          '& .MuiSelect-select': { py: 0.5 }
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#78716C' }}>
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, bgcolor: '#F5F5F4' }}>
              <Box>
                <Typography variant="h5" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600 }}>
                  Transaction Details
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#78716C' }}>
                  ID: {selectedOrder._id}
                </Typography>
              </Box>
              <Chip label={selectedOrder.status.toUpperCase()} color={getStatusColor(selectedOrder.status)} size="small" />
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4, p: 3, bgcolor: '#F5F5F4', borderRadius: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1 }}>Customer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedOrder.user?.displayName}</Typography>
                  <Typography variant="body2" sx={{ color: '#78716C' }}>{selectedOrder.user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1 }}>Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                  <Typography variant="body2" sx={{ color: '#78716C' }}>{new Date(selectedOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1 }}>Payment</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedOrder.paymentMethod}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#78716C', textTransform: 'uppercase', letterSpacing: 1 }}>Total</Typography>
                  <Typography variant="h6" sx={{ color: '#CA8A04', fontWeight: 600 }}>₱{parseFloat(selectedOrder.totalAmount).toFixed(2)}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontFamily: '"Cormorant", serif', fontWeight: 600, mb: 2 }}>Order Items</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedOrder.orderItems.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, border: '1px solid #E7E5E4', borderRadius: 2 }}>
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
