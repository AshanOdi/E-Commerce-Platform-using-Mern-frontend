import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cart";

// Reads localStorage once, synchronously, as React's initial state. Wrapped
// in try/catch: malformed JSON (or a browser blocking storage entirely)
// must never crash app startup — worst case, the customer starts with an
// empty cart instead of a broken page.
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Every time cartItems changes, mirror it to localStorage. This is the
  // ONE place persistence happens — none of the functions below write to
  // storage directly, so there's no way for state and storage to drift.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage full / blocked (private browsing, etc.) — degrade silently,
      // the cart still works for this session, it just won't survive reload.
    }
  }, [cartItems]);

  function addToCart(product, quantity = 1) {
    if (!product.isAvailable || product.stock <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);

      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: newQuantity, price: product.price, stock: product.stock }
            : item
        );
      }

      const initialQuantity = Math.min(Math.max(quantity, 1), product.stock);
      return [
        ...prev,
        {
          productId: product.productId,
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          price: product.price,
          labelledPrice: product.labelledPrice,
          quantity: initialQuantity,
          stock: product.stock,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId, quantity) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  // Derived, not stored: recomputed from cartItems on every render, so they
  // can never disagree with the line items themselves (see Step 9).
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
