import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
        return [];
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    let wasAdded = false;
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      const maxStock = product.stock || existingItem.stock || Infinity;
      if (existingItem.quantity < maxStock) {
        wasAdded = true;
      }
    } else {
      if (quantity > 0 && (product.stock === undefined || product.stock > 0)) {
        wasAdded = true;
      }
    }

    if (wasAdded) {
      setCart(prevCart => {
        const prevExisting = prevCart.find(item => item._id === product._id);
        if (prevExisting) {
          const maxStock = product.stock || prevExisting.stock || Infinity;
          return prevCart.map(item =>
            item._id === product._id
              ? { ...item, stock: product.stock, quantity: Math.min(maxStock, item.quantity + quantity) }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: Math.min(product.stock || Infinity, quantity) }];
        }
      });
    }
    return wasAdded;
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item._id !== productId);
      }
      return prevCart.map(item =>
        item._id === productId ? { ...item, quantity: Math.min(item.stock || Infinity, quantity) } : item
      );
    });
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
    cartTotal,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
