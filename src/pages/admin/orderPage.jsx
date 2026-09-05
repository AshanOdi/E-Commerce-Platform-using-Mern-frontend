import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Shared status -> badge style. Kept in one place so the list and the
// detail page stay visually consistent.
export function statusBadgeClass(status) {
  const map = {
    pending: "bg-gray-200 text-gray-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-200 text-gray-700";
}

// "loading" | "success" | "error"
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/order/all", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setOrders(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold text-gray-700">Could not load orders</h1>
        <p className="text-gray-500">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Date</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">
                  <Link
                    to={"/admin/orders/" + order.orderId}
                    className="font-mono font-semibold text-blue-600 hover:underline"
                  >
                    {order.orderId}
                  </Link>
                </td>
                <td className="py-3">
                  <div className="text-gray-800">{order.name}</div>
                  <div className="text-gray-400 text-xs">{order.email}</div>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-3 font-medium text-gray-800">${order.total.toFixed(2)}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
