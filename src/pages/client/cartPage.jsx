import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartItemCount,
    cartTotal,
    hasUnavailableItems,
    removeFromCart,
    updateQuantity,
    refreshCart,
  } = useCart();
  const [checkingAvailability, setCheckingAvailability] = useState(true);

  // Re-validate every line item against the live catalog as soon as the
  // cart is opened — cartItems is a localStorage snapshot that can go
  // stale (price/stock/availability changes) between visits.
  useEffect(() => {
    refreshCart().finally(() => setCheckingAvailability(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCheckout() {
    navigate("/checkout");
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some products to get started.</p>
        <Button variant="link" asChild>
          <Link to="/product">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Your Cart</h1>
      {checkingAvailability && (
        <p className="mb-4 text-sm text-muted-foreground">Checking availability…</p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {cartItems.map((item) => {
          if (item.unavailable) {
            return (
              <Card
                key={item.productId}
                className="flex-row items-center gap-4 bg-muted/40 p-4 opacity-70"
              >
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover grayscale" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No Image</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-foreground/70">{item.name}</h2>
                  <p className="text-sm font-medium text-destructive">No longer available</p>
                </div>

                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    removeFromCart(item.productId);
                    toast.success(`${item.name} removed from cart`);
                  }}
                >
                  Remove
                </Button>
              </Card>
            );
          }

          const lineTotal = item.price * item.quantity;
          return (
            <Card key={item.productId} className="flex-row items-center gap-4 p-4">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Image</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-foreground">{item.name}</h2>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center overflow-hidden rounded-lg border">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 text-lg hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => {
                    if (item.quantity >= item.stock) {
                      toast.error(`Only ${item.stock} in stock`);
                      return;
                    }
                    updateQuantity(item.productId, item.quantity + 1);
                  }}
                  disabled={item.quantity >= item.stock}
                  className="px-3 py-1 text-lg hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-semibold text-foreground">
                ${lineTotal.toFixed(2)}
              </div>

              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  removeFromCart(item.productId);
                  toast.success(`${item.name} removed from cart`);
                }}
              >
                Remove
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 flex flex-col items-end gap-2 p-6">
        <p className="text-muted-foreground">
          {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart
        </p>
        <p className="text-2xl font-bold text-foreground">Subtotal: ${cartTotal.toFixed(2)}</p>
        {hasUnavailableItems && (
          <p className="text-sm text-destructive">Remove unavailable items to continue to checkout</p>
        )}

        <div className="mt-2 flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/product">Continue Shopping</Link>
          </Button>
          <Button onClick={handleCheckout} disabled={hasUnavailableItems}>
            Proceed to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
}
