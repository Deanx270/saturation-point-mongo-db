import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import {
  setCart,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  addToCartWithStockCheck,
  verifyCartStockThunk,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from '../redux/slices/cartSlice';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);

  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      if (savedCart) {
        try {
          dispatch(setCart(JSON.parse(savedCart)));
        } catch (err) {
          console.error('Failed to parse cart from localStorage', err);
          dispatch(setCart([]));
        }
      } else {
        dispatch(setCart([]));
      }
    } else {
      dispatch(setCart([]));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const resultAction = await dispatch(
        addToCartWithStockCheck({ product, quantity }),
      );
      if (addToCartWithStockCheck.fulfilled.match(resultAction)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add to cart', err);
      return false;
    }
  };

  const updateQuantity = (productId, quantity) => {
    dispatch(updateQuantityAction({ productId, quantity }));
  };

  const removeFromCart = (productId) => {
    dispatch(removeFromCartAction(productId));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const verifyCartStock = () => {
    dispatch(verifyCartStockThunk());
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    verifyCartStock,
    cartTotal,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
