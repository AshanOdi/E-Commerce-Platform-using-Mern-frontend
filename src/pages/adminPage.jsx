import { Link, Routes, Route } from "react-router-dom";
import HomePage from "./home";
import AdminProductPage from "./admin/productPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/orderPage";
import AdminOrderDetailPage from "./admin/orderDetailPage";
import AdminUsersPage from "./admin/userPage";

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[300px] h-screen bg-blue-300 flex flex-col">
        <Link to="/admin/products">PRODUCT</Link>
        <Link to="/admin/users">USER</Link>
        <Link to="/admin/orders">ORDERS</Link>
        <Link to="/admin/reviews">REVIEW</Link>
      </div>
      <div className="h-full w-[calc(100%-300px)] bg-yellow-600">
        <Routes path="/*">
          <Route path="/" element={<h1>FUCK YOU</h1>}></Route>
          <Route path="/products" element={<AdminProductPage />}></Route>
          <Route path="/users" element={<AdminUsersPage />}></Route>
          <Route path="/orders" element={<AdminOrdersPage />}></Route>
          <Route path="/orders/:orderId" element={<AdminOrderDetailPage />}></Route>
          <Route path="/reviews" element={<h1>REVIEW PAGE</h1>}></Route>
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<EditProductPage />} />
        </Routes>
      </div>
    </div>
  );
}
