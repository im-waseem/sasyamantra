// app/hooks/useCart.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  maxQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
  applyDiscount: (code: string) => Promise<boolean>;
  discount: {
    code: string | null;
    amount: number;
    type: 'percentage' | 'fixed';
  };
  finalPrice: number;
}

// Action Types
type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: Omit<CartItem, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const initialDiscount: { code: string | null; amount: number; type: 'percentage' | 'fixed' } = {
  code: null,
  amount: 0,
  type: 'percentage',
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);

      let newItems: CartItem[];

      if (existingItemIndex !== -1) {
        // Update existing item
        newItems = state.items.map((cartItem, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              cartItem.quantity + quantity,
              item.maxQuantity || Infinity
            );
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      } else {
        // Add new item
        const newQuantity = Math.min(quantity, item.maxQuantity || Infinity);
        newItems = [...state.items, { ...item, quantity: newQuantity }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        error: null,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        error: null,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }

      const newItems = state.items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.min(quantity, item.maxQuantity || Infinity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        error: null,
      };
    }

    case 'CLEAR_CART':
      return {
        ...initialState,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'LOAD_CART': {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        isLoading: false,
        error: null,
      };
    }

    default:
      return state;
  }
}

// Context
const CartContext = createContext<CartContextType | null>(null);

// Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Provider Component
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [discount, setDiscount] = React.useState(initialDiscount);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('sasya-mantra-cart');
      const savedDiscount = localStorage.getItem('sasya-mantra-discount');
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }

      if (savedDiscount) {
        const parsedDiscount = JSON.parse(savedDiscount);
        setDiscount(parsedDiscount);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart data' });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sasya-mantra-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  // Save discount to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sasya-mantra-discount', JSON.stringify(discount));
    } catch (error) {
      console.error('Failed to save discount to localStorage:', error);
    }
  }, [discount]);

  // Calculate final price with discount
  const finalPrice = React.useMemo(() => {
    if (discount.amount === 0) return state.totalPrice;
    
    if (discount.type === 'percentage') {
      return state.totalPrice * (1 - discount.amount / 100);
    } else {
      return Math.max(0, state.totalPrice - discount.amount);
    }
  }, [state.totalPrice, discount]);

  // Actions
  const addItem = React.useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    try {
      dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
    } catch (error) {
      console.error('Failed to add item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    }
  }, []);

  const removeItem = React.useCallback((id: string) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    } catch (error) {
      console.error('Failed to remove item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    }
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    try {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' });
    }
  }, []);

  const clearCart = React.useCallback(() => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      setDiscount(initialDiscount);
      localStorage.removeItem('sasya-mantra-cart');
      localStorage.removeItem('sasya-mantra-discount');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    }
  }, []);

  const getItemQuantity = React.useCallback((id: string): number => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  }, [state.items]);

  const isItemInCart = React.useCallback((id: string): boolean => {
    return state.items.some(item => item.id === id);
  }, [state.items]);

  const applyDiscount = React.useCallback(async (code: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call to validate discount code
      // Replace this with your actual discount validation logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock discount codes for demonstration
      const discountCodes: Record<string, { amount: number; type: 'percentage' | 'fixed' }> = {
        'SAVE10': { amount: 10, type: 'percentage' },
        'SAVE50': { amount: 50, type: 'fixed' },
        'WELCOME20': { amount: 20, type: 'percentage' },
      };

      const discountData = discountCodes[code.toUpperCase()];
      
      if (discountData) {
        setDiscount({
          code: code.toUpperCase(),
          ...discountData,
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_ERROR', payload: null });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid discount code' });
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      console.error('Failed to apply discount:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to apply discount code' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  }, []);

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isItemInCart,
    applyDiscount,
    discount,
    finalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("useCart must be used within a CartProvider. Please wrap your component with <CartProvider>");
  }
  
  return context;
}

// Additional utility hooks
export function useCartItem(id: string) {
  const { getItemQuantity, isItemInCart, addItem, removeItem, updateQuantity } = useCart();
  
  return {
    quantity: getItemQuantity(id),
    isInCart: isItemInCart(id),
    addItem,
    removeItem: () => removeItem(id),
    updateQuantity: (quantity: number) => updateQuantity(id, quantity),
  };
}

// Export types for use in other components