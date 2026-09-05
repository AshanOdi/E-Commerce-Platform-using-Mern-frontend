import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

// Redirecting via useEffect (after render commits) rather than returning
// <Navigate> directly during render avoids triggering a router state
// update WHILE another component (e.g. Header, reacting to the same auth
// state change) is still mid-render — that combination is what produced
// React's "Cannot update a component while rendering a different
// component" warning during testing.

// Authentication: must be logged in (any role). Replaces the copy-pasted
// "check token in a useEffect, redirect if missing" pattern that used to
// live separately inside checkoutPage/myOrdersPage/orderDetailPage.
export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;
  return children;
}

// Authorization: must be logged in AND an admin. Mirrors the backend's
// requireAuth/requireAdmin split (Phase 0) on the frontend: 401-equivalent
// (not logged in -> /login) vs 403-equivalent (logged in, wrong role -> home).
export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      navigate("/login", { replace: true });
    } else if (!isAdmin) {
      toast.error("You are not authorized to view this page");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) return null;
  return children;
}
