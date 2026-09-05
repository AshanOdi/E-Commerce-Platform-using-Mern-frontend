import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

// "form" | "submitting" | "success" | "error"
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth(); // route is wrapped in <RequireAuth> — user is guaranteed here

  const [status, setStatus] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(((user.firstName || "") + " " + (user.lastName || "")).trim());
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("token");
    setStatus("submitting");

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/order",
        {
          name,
          address,
          phone,
          // Only productId + quantity are sent — price/total are never
          // client-supplied. The backend re-fetches and re-prices every
          // item itself; whatever it returns is the only real total.
          products: cartItems.map((item) => ({
            productId: item.productId,
            Qty: item.quantity,
          })),
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      setConfirmedOrder(response.data.order);
      clearCart();
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong placing your order.");
      setStatus("error");
    }
  }

  if (status === "success" && confirmedOrder) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3 text-center px-4">
        <h1 className="text-2xl font-semibold text-gray-800">Order placed!</h1>
        <p className="text-gray-600">
          Order <span className="font-mono font-semibold">{confirmedOrder.orderId}</span> has
          been created.
        </p>
        <p className="text-xl font-bold text-gray-800">
          Total: ${confirmedOrder.total.toFixed(2)}
        </p>
        <div className="flex gap-4 mt-2">
          <Link to={"/my-orders/" + confirmedOrder.orderId} className="text-blue-600 hover:underline">
            View order
          </Link>
          <Link to="/product" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && status === "form") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Your cart is empty</h1>
        <Link to="/product" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8 flex flex-col md:flex-row gap-10">
      {/* Delivery details */}
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h1>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input value={email} disabled className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-500" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Delivery Address</span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </label>

        {status === "error" && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {status === "submitting" ? "Placing order..." : "Place Order"}
        </button>
      </form>

      {/* Order summary (display only — server recalculates the real total) */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md p-6 h-fit">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
        <div className="flex flex-col gap-3">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-800">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
