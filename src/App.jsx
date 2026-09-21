import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/home";
import AdminPage from "./pages/adminPage";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { RequireAdmin } from "./components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      {/* AuthProvider needs useNavigate() (for logout / expired-session
          redirects), so it must live INSIDE BrowserRouter — unlike
          CartProvider above, which doesn't need router access. */}
      <AuthProvider>
      <WishlistProvider>
      <div>
        <Toaster position="top-right" />
        <Routes path="/*">
          <Route path="/admin/*" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
          <Route path="/*" element={<HomePage/>} />
        </Routes>
      </div>
      </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
