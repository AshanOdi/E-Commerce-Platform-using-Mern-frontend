import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// "loading" | "success" | "error"
export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your orders");
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setOrders(res.data);
        setStatus("success");
      })
      .catch(() => {
        // Never show the raw axios/network error to the customer.
        setStatus("error");
      });
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Something went wrong</h1>
        <p className="text-gray-500">Please try again in a moment.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">You have no orders yet</h1>
        <Link to="/product" className="text-blue-600 hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link
            key={order.orderId}
            to={"/my-orders/" + order.orderId}
            className="flex items-center justify-between bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div>
              <p className="font-mono font-semibold text-gray-800">{order.orderId}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()} · {order.products.length} item
                {order.products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">${order.total.toFixed(2)}</p>
              <p className="text-sm capitalize text-gray-500">{order.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
