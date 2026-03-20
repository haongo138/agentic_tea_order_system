"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  readonly items: readonly CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { index: number } }
  | { type: "UPDATE_QUANTITY"; payload: { index: number; quantity: number } }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return { items: state.items.filter((_, i) => i !== action.payload.index) };
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item, i) =>
          i === action.payload.index
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    case "CLEAR":
      return { items: [] };
  }
}

interface CartContextValue {
  readonly items: readonly CartItem[];
  readonly totalItems: number;
  readonly totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((index: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { index } });
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { index, quantity } });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
