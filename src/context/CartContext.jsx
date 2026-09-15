import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
          unavailable: false,
        },
      ];
    });
  }

  // Cart items are a localStorage SNAPSHOT taken at add-to-cart time — price,
  // stock and isAvailable can all drift after that (another customer buys
  // the last unit, an admin marks it unavailable, a product gets deleted
  // entirely). This re-checks every line item against the live catalog and
  // patches the snapshot back into sync, instead of letting the customer
  // reach checkout with stale data and only find out when the order 400s.
  // Called on mount by both CartPage and CheckoutPage.
  async function refreshCart() {
    if (cartItems.length === 0) return;

    const results = await Promise.all(
      cartItems.map((item) =>
        axios
          .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + item.productId)
          .then((res) => ({ productId: item.productId, product: res.data }))
          .catch(() => ({ productId: item.productId, product: null }))
      )
    );

    const removedNames = [];
    const reducedNames = [];

    setCartItems((prev) => {
      const next = [];
      for (const item of prev) {
        const result = results.find((r) => r.productId === item.productId);
        const product = result ? result.product : undefined;

        // undefined means this item wasn't part of the batch just checked
        // (shouldn't happen, but keep it as-is rather than drop it) —
        // null means the lookup ran and genuinely found nothing (deleted).
        if (product === null) {
          removedNames.push(item.name);
          continue;
        }
        if (product === undefined) {
          next.push(item);
          continue;
        }

        const unavailable = !product.isAvailable || product.stock <= 0;
        let quantity = item.quantity;
        if (!unavailable && quantity > product.stock) {
          quantity = product.stock;
          reducedNames.push(item.name);
        }

        next.push({
          ...item,
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          price: product.price,
          labelledPrice: product.labelledPrice,
          stock: product.stock,
          quantity,
          unavailable,
        });
      }
      return next;
    });

    if (removedNames.length > 0) {
      toast.error(
        `${removedNames.join(", ")} ${removedNames.length > 1 ? "are" : "is"} no longer sold and ${
          removedNames.length > 1 ? "were" : "was"
        } removed from your cart`
      );
    }
    if (reducedNames.length > 0) {
      toast.error(`Quantity reduced for ${reducedNames.join(", ")} due to limited stock`);
    }
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
  // Items flagged unavailable (by refreshCart) can't actually be bought, so
  // they're excluded from both the header badge count and the subtotal —
  // they still show up in the cart list itself so the customer can remove them.
  const cartItemCount = cartItems.reduce(
    (sum, item) => (item.unavailable ? sum : sum + item.quantity),
    0
  );
  const cartTotal = cartItems.reduce(
    (sum, item) => (item.unavailable ? sum : sum + item.price * item.quantity),
    0
  );
  const hasUnavailableItems = cartItems.some((item) => item.unavailable);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        cartTotal,
        hasUnavailableItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
