import Header from "../components/header";
import {Routes , Route} from "react-router-dom";
import ProductPage from "./client/productPage";
import ProductDetailPage from "./client/productDetailPage";
import CartPage from "./client/cartPage";
import CheckoutPage from "./client/checkoutPage";
import MyOrdersPage from "./client/myOrdersPage";
import OrderDetailPage from "./client/orderDetailPage";
import PayPage from "./client/payPage";
import { RequireAuth } from "../components/ProtectedRoute";

export default function HomePage() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <Header />
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center overflow-y-auto">
        <Routes path="/*">
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/product" element={<ProductPage/>} />
          <Route path="/product/:productId" element={<ProductDetailPage/>} />
          {/* Cart works for guests too (Phase 2 design decision) — not gated */}
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage/></RequireAuth>} />
          <Route path="/pay/:intentId" element={<RequireAuth><PayPage/></RequireAuth>} />
          <Route path="/my-orders" element={<RequireAuth><MyOrdersPage/></RequireAuth>} />
          <Route path="/my-orders/:orderId" element={<RequireAuth><OrderDetailPage/></RequireAuth>} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
          
        </Routes>
      </div>

    </div>
  );
}
