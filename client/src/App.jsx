import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLayout from './components/AdminLayout';
import AdminProducts from './pages/AdminProducts';
import AdminTransactions from './pages/AdminTransactions';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminBrands from './pages/AdminBrands';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

import ErrorPage from './pages/ErrorPage';
import CompleteProfile from './pages/CompleteProfile';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser || !currentUser.emailVerified) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser, mongoUser } = useAuth();
  
  if (!currentUser || !currentUser.emailVerified) return <Navigate to="/login" />;
  if (mongoUser && mongoUser.role !== 'admin') return <Navigate to="/403" />;
  
  return children;
};

function App() {
  const { currentUser, mongoUser } = useAuth();
  
  const needsProfileCompletion = currentUser && currentUser.emailVerified && mongoUser && !mongoUser.username;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {needsProfileCompletion ? (
          <Routes>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="*" element={<Navigate to="/complete-profile" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              currentUser && currentUser.emailVerified ? <Navigate to="/profile" /> : <Login />
            } />
            <Route path="/register" element={
              currentUser && currentUser.emailVerified ? <Navigate to="/profile" /> : <Register />
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/complete-profile" element={<Navigate to="/profile" />} />
            <Route path="/403" element={<ErrorPage code={403} />} />
            <Route path="*" element={<ErrorPage code={404} />} />
            
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="transactions" element={<AdminTransactions />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            } />
          </Routes>
        )}
      </Box>
      <Footer />
    </Box>
  );
}

export default App;
