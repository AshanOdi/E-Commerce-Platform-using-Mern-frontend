import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { statusBadgeClass } from "./orderPage";

// Mirrors the backend state machine (orderController.js) for UX only —
// the backend re-validates every transition regardless.
const NEXT_STATUSES = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

// "loading" | "success" | "not-found" | "error"
export default function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setStatus("loading");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order/all/" + orderId, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setOrder(res.data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) setStatus("not-found");
        else setStatus("error");
      });
  }, [orderId]);

  async function changeStatus(newStatus) {
    const token = localStorage.getItem("token");
    setUpdating(true);
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BACKEND_URL + "/api/order/" + orderId + "/status",
        { status: newStatus },
        { headers: { Authorization: "Bearer " + token } }
      );
      setOrder(res.data.order);
      toast.success(`Order marked "${newStatus}"`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdating(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-700">Order not found</h1>
        <Link to="/admin/orders" className="text-blue-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-700">Something went wrong</h1>
        <Link to="/admin/orders" className="text-blue-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const nextOptions = NEXT_STATUSES[order.status] || [];

  return (
    <div className="w-full h-full bg-white overflow-y-auto p-6">
      <Link to="/admin/orders" className="text-blue-600 hover:underline text-sm">
        ← Back to orders
      </Link>

      <div className="mt-4 max-w-2xl">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800 font-mono">{order.orderId}</h1>
            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusBadgeClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p><span className="font-medium text-gray-800">Customer:</span> {order.name} ({order.email})</p>
          <p><span className="font-medium text-gray-800">Phone:</span> {order.phone}</p>
          <p><span className="font-medium text-gray-800">Address:</span> {order.address}</p>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-2">
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

        <div className="border-t border-gray-200 mt-6 pt-4">
          <h2 className="font-semibold text-gray-800 mb-2">Update status</h2>
          {nextOptions.length === 0 ? (
            <p className="text-sm text-gray-500">
              This order is <span className="capitalize font-medium">{order.status}</span> — no further changes.
            </p>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {nextOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(s)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-lg text-white font-medium capitalize transition-colors disabled:opacity-50 ${
                    s === "cancelled"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {s === "cancelled" ? "Cancel order" : "Mark " + s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
