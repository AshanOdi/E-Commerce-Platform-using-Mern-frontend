import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { decodeTokenPayload, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

// Reads localStorage once, synchronously, as React's initial state — same
// lazy-init pattern as CartContext. A token that's already expired (by its
// own exp claim) is treated as "not logged in" immediately, without
// waiting for a request to fail first.
function loadUserFromStorage() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }
  return decodeTokenPayload(token);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(loadUserFromStorage);

  function login(token) {
    localStorage.setItem("token", token);
    setUser(decodeTokenPayload(token));
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    // No explicit navigate() here on purpose: if the user is currently on
    // a protected page, RequireAuth's own reactive <Navigate> (triggered
    // by isAuthenticated flipping to false) already sends them to /login —
    // calling navigate() here too raced against it (two navigations
    // triggered by the same state change) and could win unpredictably.
    // On an unprotected page (browsing products, etc.), simply staying put
    // as a now-logged-out visitor is normal, expected behavior.
  }

  // Global expired/invalid-session handling: any request that carried an
  // Authorization header and came back 401 means the token is no longer
  // good (expired, tampered, or the account changed) — clean up client
  // state and send the user to log in again, instead of leaving a dead
  // token sitting in localStorage indefinitely.
  //
  // Checking "did THIS request send a token" (not "is there a token in
  // storage") matters: a wrong-password login attempt also returns 401,
  // never carries an Authorization header, and must NOT trigger this —
  // that's the login page's own inline error handling.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const hadAuthHeader = !!error.config?.headers?.Authorization;
        if (error.response?.status === 401 && hadAuthHeader) {
          localStorage.removeItem("token");
          setUser(null);
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptorId);
  }, [navigate]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
