import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (err) {
          console.error('Failed to parse cart from localStorage', err);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = async (product, quantity = 1) => {
    let latestStock = product.stock || 0;
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${product._id}`);
      if (res.data) {
        latestStock = res.data.stock;
      }
    } catch (err) {
      console.error("Failed to fetch latest stock", err);
    }

    let wasAdded = false;
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity < latestStock) {
        wasAdded = true;
      }
    } else {
      if (quantity > 0 && latestStock > 0) {
        wasAdded = true;
      }
    }

    if (wasAdded) {
      setCart(prevCart => {
        const prevExisting = prevCart.find(item => item._id === product._id);
        if (prevExisting) {
          return prevCart.map(item =>
            item._id === product._id
              ? { ...item, stock: latestStock, quantity: Math.min(latestStock, item.quantity + quantity) }
              : item
          );
        } else {
          return [...prevCart, { ...product, stock: latestStock, quantity: Math.min(latestStock, quantity) }];
        }
      });
    }
    return wasAdded;
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      if (quantity === 0) {
        return prevCart.filter(item => item._id !== productId);
      }
      return prevCart.map(item => {
        if (item._id === productId) {
          const newQty = quantity === '' ? '' : Math.min(item.stock || Infinity, quantity);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const verifyCartStock = async () => {
    if (cart.length === 0) return;
    try {
      // Fetch all products (or we could fetch specifically, but /api/products is easy)
      const res = await axios.get('http://localhost:5000/api/products');
      const products = res.data.products || res.data;
      
      setCart(prevCart => {
        let updated = false;
        const newCart = prevCart.map(item => {
          const latestProduct = products.find(p => p._id === item._id);
          if (latestProduct) {
            if (item.quantity > latestProduct.stock || item.stock !== latestProduct.stock) {
              updated = true;
              return { ...item, stock: latestProduct.stock, quantity: Math.min(latestProduct.stock, item.quantity) };
            }
          }
          return item;
        }).filter(item => item.quantity > 0);
        
        return updated || newCart.length !== prevCart.length ? newCart : prevCart;
      });
    } catch (error) {
      console.error("Failed to verify cart stock", error);
    }
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    verifyCartStock,
    cartTotal,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
