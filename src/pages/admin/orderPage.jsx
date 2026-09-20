import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Shared status -> badge style. Kept in one place so the list and the
// detail page stay visually consistent.
export function statusBadgeClass(status) {
  const map = {
    pending: "bg-gray-200 text-gray-700",
    confirmed: "bg-primary/10 text-primary",
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
        <div className="w-[70px] h-[70px] border-[5px] border-muted border-t-primary rounded-full animate-spin"></div>
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
    <div className="w-full h-full overflow-y-auto p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
        Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>
                  <Link
                    to={"/admin/orders/" + order.orderId}
                    className="font-mono font-semibold text-primary hover:underline"
                  >
                    {order.orderId}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-foreground">{order.name}</div>
                  <div className="text-xs text-muted-foreground">{order.email}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
