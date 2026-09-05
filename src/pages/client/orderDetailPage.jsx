import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

// "loading" | "success" | "not-found" | "error"
export default function OrderDetailPage() {
  const { orderId } = useParams(); // URL is the source of truth, same principle as ProductDetailPage
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to view your orders");
      navigate("/login");
      return;
    }

    setStatus("loading");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setOrder(res.data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setStatus("not-found");
        } else {
          setStatus("error");
        }
      });
  }, [orderId, navigate]);

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Order not found</h1>
        <Link to="/my-orders" className="text-blue-600 hover:underline">
          Back to my orders
        </Link>
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

  return (
    <div className="w-full max-w-3xl px-4 py-8">
      <Link to="/my-orders" className="text-blue-600 hover:underline text-sm">
        ← Back to my orders
      </Link>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800 font-mono">{order.orderId}</h1>
            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
          </div>
          <span className="capitalize bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {order.status}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Delivery Address:</span> {order.address}
          </p>
          <p>
            <span className="font-medium text-gray-800">Phone:</span> {order.phone}
          </p>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-3">
          {order.products.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.productInfo.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-800">
                ${(item.productInfo.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
