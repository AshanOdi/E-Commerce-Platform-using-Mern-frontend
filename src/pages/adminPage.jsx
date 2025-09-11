import { Link, Routes, Route } from "react-router-dom";
import HomePage from "./home";
import AdminProductPage from "./admin/adminProductPage";

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex flex-row">
      <div className="w-[300px] h-screen bg-blue-300 flex flex-col">
        <Link to="/admin/products">PRODUCT</Link>
        <Link to="/admin/users">USER</Link>
        <Link to="/admin/orders">ODERS</Link>
        <Link to="/admin/reviews">REVIEW</Link>
      </div>
      <div className="h-full w-[calc(100%-300px)] bg-yellow-600">
        <Routes path="/*">
          <Route path="/" element={<h1>FUCK YOU</h1>}></Route>
          <Route path="/products" element={<AdminProductPage />}></Route>
          <Route path="/users" element={<h1>USER PAGE</h1>}></Route>
          <Route path="/orders" element={<h1>ORDER PAGE</h1>}></Route>
          <Route path="/reviews" element={<h1>REVIEW PAGE</h1>}></Route>
        </Routes>
      </div>
    </div>
  );
}
