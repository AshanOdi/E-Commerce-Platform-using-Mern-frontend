import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

// Unlike CartContext, wishlist state is NOT persisted to localStorage — it's
// server-backed (Phase 14's /api/user/wishlist), the same way orders and
// reviews are. There's nothing to keep for a guest: the heart toggle simply
// asks them to log in first.
export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [productIds, setProductIds] = useState([]); // just IDs, for fast isWishlisted() checks
  const [products, setProducts] = useState([]); // full docs, for the wishlist page

  const refreshWishlist = useCallback(() => {
    if (!isAuthenticated) {
      setProductIds([]);
      setProducts([]);
      return Promise.resolve();
    }
    const authHeader = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
    return axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/user/wishlist", authHeader)
      .then((res) => {
        setProducts(res.data);
        setProductIds(res.data.map((p) => p.productId));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Re-syncs on login/logout — logging out clears it (via the branch above),
  // logging in as a different user fetches THEIR wishlist, not the previous one.
  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  function isWishlisted(productId) {
    return productIds.includes(productId);
  }

  async function toggleWishlist(productId) {
    const authHeader = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
    const currentlyIn = productIds.includes(productId);

    // Optimistic flip so the heart icon responds instantly; reverted below
    // if the request actually fails.
    setProductIds((prev) =>
      currentlyIn ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    try {
      if (currentlyIn) {
        await axios.delete(
          import.meta.env.VITE_BACKEND_URL + "/api/user/wishlist/" + productId,
          authHeader
        );
      } else {
        await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/wishlist/" + productId,
          null,
          authHeader
        );
      }
      // Refetch full product docs too, so the wishlist page (if open/next
      // visited) reflects the change — not just the productIds fast-path.
      refreshWishlist();
    } catch {
      setProductIds((prev) =>
        currentlyIn ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      throw new Error("Could not update wishlist");
    }
  }

  return (
    <WishlistContext.Provider
      value={{ products, isWishlisted, toggleWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
