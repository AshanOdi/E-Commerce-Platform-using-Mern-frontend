import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// "form" | "submitting" | "error"
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, hasUnavailableItems, clearCart, refreshCart } = useCart();
  const { user } = useAuth(); // route is wrapped in <RequireAuth> — user is guaranteed here

  const [status, setStatus] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");

  // Safety net: Cart already blocks navigating here with unavailable items,
  // but a customer could still land on /checkout directly (back button,
  // bookmarked URL) with a cart that's gone stale since it was last checked.
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (hasUnavailableItems) {
      toast.error("Some items in your cart are no longer available. Please remove them first.");
      navigate("/cart");
      return;
    }

    const token = localStorage.getItem("token");
    const authHeader = { headers: { Authorization: "Bearer " + token } };
    setStatus("submitting");

    try {
      // 1. Create the order (status pending, paymentStatus unpaid).
      const orderRes = await axios.post(
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
        authHeader
      );
      const orderId = orderRes.data.order.orderId;
      clearCart();

      // 2. Start payment for it and hand off to the pay page. The order is
      // NOT considered paid until the payment webhook says so.
      try {
        const intentRes = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/payment/intent",
          { orderId },
          authHeader
        );
        navigate("/pay/" + intentRes.data.intentId);
      } catch {
        toast.error("Order created, but payment couldn't be started. You can pay from My Orders.");
        navigate("/my-orders/" + orderId);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Something went wrong placing your order.");
      setStatus("error");
    }
  }

  if (cartItems.length === 0 && status === "form") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <Button variant="link" asChild>
          <Link to="/product">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-4xl flex-col gap-10 px-4 py-8 md:flex-row">
      {/* Delivery details */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 md:w-1/2">
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Checkout</h1>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Delivery Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
          />
        </div>

        {status === "error" && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={status === "submitting"} className="mt-2 h-11 w-full">
          {status === "submitting" ? "Processing…" : "Continue to Payment"}
        </Button>
      </form>

      {/* Order summary (display only — server recalculates the real total) */}
      <Card className="h-fit w-full p-6 md:w-1/2">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>
        <div className="flex flex-col gap-3">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 font-bold text-foreground">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </Card>
    </div>
  );
}
