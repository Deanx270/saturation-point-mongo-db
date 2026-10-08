import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  TextField,
  Button
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default to current month
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const defaultEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders for analytics", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  // 1. Monthly sales charts. all months on the chart label. line chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize array with all 12 months with 0 sales
    const data = months.map(month => ({ name: month, Sales: 0 }));
    
    // Current year (or could be dynamic, let's use current year for the chart)
    const currentYear = new Date().getFullYear();

    orders.forEach(order => {
      // Only count completed/paid orders usually, but we will count any non-cancelled order
      if (order.status !== 'cancelled') {
        const orderDate = new Date(order.createdAt);
        if (orderDate.getFullYear() === currentYear) {
          const monthIndex = orderDate.getMonth();
          data[monthIndex].Sales += order.totalAmount;
        }
      }
    });
    
    return data;
  }, [orders]);

  // 2. Sales charts with date range filter
  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Group sales by day
    const dailySalesMap = {};
    
    // Pre-fill all days in range to ensure chart connects properly
    let currDate = new Date(start);
    while (currDate <= end) {
      const dateStr = currDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailySalesMap[dateStr] = 0;
      currDate.setDate(currDate.getDate() + 1);
    }

    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= start && orderDate <= end) {
          const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (dailySalesMap[dateStr] !== undefined) {
            dailySalesMap[dateStr] += order.totalAmount;
          }
        }
      }
    });
    
    return Object.keys(dailySalesMap).map(date => ({
      name: date,
      Sales: dailySalesMap[date]
    }));
  }, [orders, startDate, endDate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#1C1917' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* Monthly Sales Chart */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, color: '#1C1917', mb: 1 }}>
              Monthly Sales ({new Date().getFullYear()})
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716C', mb: 4 }}>
              Overview of revenue across all 12 months.
            </Typography>
            
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="name" stroke="#78716C" />
                  <YAxis stroke="#78716C" tickFormatter={(value) => `₱${value}`} />
                  <Tooltip 
                    formatter={(value) => [`₱${value.toLocaleString()}`, 'Sales']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Sales" 
                    stroke="#1C1917" 
                    strokeWidth={3}
                    dot={{ fill: '#CA8A04', r: 6, strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#CA8A04' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Date Range Filtered Sales Chart */}
        <Box>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid rgba(28, 25, 23, 0.08)', borderRadius: 2 }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 600, color: '#1C1917', mb: 1 }}>
                  Custom Range Sales Report
                </Typography>
                <Typography variant="body2" sx={{ color: '#78716C' }}>
                  Filter revenue by selecting a specific date range.
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#44403C', fontWeight: 500 }}>Start:</Typography>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="small"
                    sx={{ width: 180 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#44403C', fontWeight: 500 }}>End:</Typography>
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="small"
                    sx={{ width: 180 }}
                  />
                </Box>
              </Box>
            </Box>
            
            {!startDate || !endDate ? (
              <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#F5F5F4', borderRadius: 2 }}>
                <Typography sx={{ color: '#A8A29E' }}>Please select a start and end date to view the chart.</Typography>
              </Box>
            ) : filteredData.length === 0 ? (
              <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#F5F5F4', borderRadius: 2 }}>
                <Typography sx={{ color: '#A8A29E' }}>No sales data for the selected date range.</Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis dataKey="name" stroke="#78716C" />
                    <YAxis stroke="#78716C" tickFormatter={(value) => `₱${value}`} />
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString()}`, 'Sales']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: 'rgba(28, 25, 23, 0.05)' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="Sales" 
                      fill="#CA8A04" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Box>
        
    </Box>
  );
};

export default AdminDashboard;
