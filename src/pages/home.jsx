import Header from "../components/header";
import Footer from "../components/footer";
import {Routes , Route} from "react-router-dom";
import LoginPage from "./login";
import RegisterPage from "./register";
import ProductPage from "./client/productPage";
import ProductDetailPage from "./client/productDetailPage";
import CartPage from "./client/cartPage";
import CheckoutPage from "./client/checkoutPage";
import MyOrdersPage from "./client/myOrdersPage";
import OrderDetailPage from "./client/orderDetailPage";
import PayPage from "./client/payPage";
import LandingPage from "./client/landingPage";
import AboutPage from "./client/aboutPage";
import ContactPage from "./client/contactPage";
import ConciergePage from "./client/conciergePage";
import ProfilePage from "./client/profilePage";
import WishlistPage from "./client/wishlistPage";
import { RequireAuth } from "../components/ProtectedRoute";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header />
      {/* min-h (not a fixed h) so short pages still fill the viewport below
          the header, but taller pages can grow naturally instead of the
          Footer overlapping their tail end. */}
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center">
        <Routes path="/*">
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/product/:productId" element={<ProductDetailPage/>} />
          {/* Cart works for guests too (Phase 2 design decision) — not gated */}
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage/></RequireAuth>} />
          <Route path="/pay/:intentId" element={<RequireAuth><PayPage/></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage/></RequireAuth>} />
          <Route path="/wishlist" element={<RequireAuth><WishlistPage/></RequireAuth>} />
          <Route path="/my-orders" element={<RequireAuth><MyOrdersPage/></RequireAuth>} />
          <Route path="/my-orders/:orderId" element={<RequireAuth><OrderDetailPage/></RequireAuth>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/concierge" element={<ConciergePage/>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
          
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
