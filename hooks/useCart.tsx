// app/hooks/useCart.tsx
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

// --------------------
// Types
// --------------------
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  maxQuantity?: number;
}

export interface Discount {
  code: string | null;
  amount: number;
  type: "percentage" | "fixed";
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isItemInCart: (id: string) => boolean;
  applyDiscount: (code: string) => Promise<boolean>;
  discount: Discount;
  finalPrice: number;
}

// --------------------
// Action Types
// --------------------
type CartAction =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_CART"; payload: CartItem[] };

// --------------------
// Initial State
// --------------------
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

const initialDiscount: Discount = {
  code: null,
  amount: 0,
  type: "percentage",
};

// --------------------
// Reducer
// --------------------
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);

      let newItems: CartItem[];

      if (existingItemIndex !== -1) {
        newItems = state.items.map((cartItem, idx) => {
          if (idx === existingItemIndex) {
            const newQuantity = Math.min(
              cartItem.quantity + quantity,
              item.maxQuantity ?? Infinity
            );
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });
      } else {
        newItems = [...state.items, { ...item, quantity: Math.min(quantity, item.maxQuantity ?? Infinity) }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        error: null,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((i) => i.id !== action.payload.id);
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        error: null,
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.maxQuantity ?? Infinity) } : item
      );

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        error: null,
      };
    }

    case "CLEAR_CART":
      return { ...initialState };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "LOAD_CART": {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        isLoading: false,
        error: null,
      };
    }

    default:
      return state;
  }
}

// --------------------
// Context
// --------------------
const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

// --------------------
// Provider Component
// --------------------
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [discount, setDiscount] = React.useState<Discount>(initialDiscount);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sasya-mantra-cart");
      const savedDiscount = localStorage.getItem("sasya-mantra-discount");

      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
      if (savedDiscount) {
        setDiscount(JSON.parse(savedDiscount));
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart data" });
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("sasya-mantra-cart", JSON.stringify(state.items));
  }, [state.items]);

  // Save discount
  useEffect(() => {
    localStorage.setItem("sasya-mantra-discount", JSON.stringify(discount));
  }, [discount]);

  // Final price
  const finalPrice = useMemo(() => {
    if (!discount.amount) return state.totalPrice;
    return discount.type === "percentage"
      ? state.totalPrice * (1 - discount.amount / 100)
      : Math.max(0, state.totalPrice - discount.amount);
  }, [state.totalPrice, discount]);

  // --------------------
  // Actions
  // --------------------
  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      dispatch({ type: "ADD_ITEM", payload: { item, quantity } });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    setDiscount(initialDiscount);
    localStorage.removeItem("sasya-mantra-cart");
    localStorage.removeItem("sasya-mantra-discount");
  }, []);

  const getItemQuantity = useCallback(
    (id: string) => state.items.find((i) => i.id === id)?.quantity ?? 0,
    [state.items]
  );

  const isItemInCart = useCallback(
    (id: string) => state.items.some((i) => i.id === id),
    [state.items]
  );

  const applyDiscount = useCallback(async (code: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // mock API

      const discountCodes: Record<string, Discount> = {
        SAVE10: { amount: 10, type: "percentage", code: "SAVE10" },
        SAVE50: { amount: 50, type: "fixed", code: "SAVE50" },
        WELCOME20: { amount: 20, type: "percentage", code: "WELCOME20" },
      };

      const found = discountCodes[code.toUpperCase()];
      if (found) {
        setDiscount(found);
        dispatch({ type: "SET_ERROR", payload: null });
        return true;
      } else {
        dispatch({ type: "SET_ERROR", payload: "Invalid discount code" });
        return false;
      }
    } catch (err) {
      console.error("Discount error:", err);
      dispatch({ type: "SET_ERROR", payload: "Failed to apply discount" });
      return false;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// --------------------
// Custom Hooks
// --------------------
export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function useCartItem(id: string) {
  const { getItemQuantity, isItemInCart, addItem, removeItem, updateQuantity } = useCart();
  return {
    quantity: getItemQuantity(id),
    isInCart: isItemInCart(id),
    addItem,
    removeItem: () => removeItem(id),
    updateQuantity: (q: number) => updateQuantity(id, q),
  };
}
