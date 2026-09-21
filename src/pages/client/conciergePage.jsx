import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";
import { useCart } from "../../context/CartContext";

// "idle" | "loading" | "success" | "error"
export default function ConciergePage() {
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("idle");
  const [reply, setReply] = useState(null); // { message, products }
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Tell us what you're looking for first");
      return;
    }

    setStatus("loading");
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/recommend", {
        message: message.trim(),
        budget: budget ? Number(budget) : undefined,
      });
      setReply(res.data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "The concierge is temporarily unavailable. Please try again."
      );
      setStatus("error");
    }
  }

  function handleAddAllToCart() {
    reply.products.forEach((product) => addToCart(product, 1));
    toast.success("Added all recommendations to your cart");
  }

  return (
    <div className="w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">AI Beauty & Style Concierge</h1>
      <p className="text-muted-foreground mb-6">
        Tell us what you're shopping for — an occasion, a budget, a style — and we'll suggest
        real products from our catalog. This is a shopping tool, not medical or skincare advice.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-card rounded-2xl shadow-md p-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">What are you looking for?</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. I need a skincare bundle for a party, something elegant."
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 w-48">
          <span className="text-sm font-medium text-foreground">Budget (optional)</span>
          <input
            type="number"
            min="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 2500"
            className="border border-border bg-background text-foreground rounded-lg px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 w-full sm:w-auto self-start px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:bg-muted-foreground text-primary-foreground disabled:text-white font-medium transition-colors"
        >
          {status === "loading" ? "Thinking…" : "Get Recommendations"}
        </button>

        {status === "error" && (
          <p className="text-red-600 text-sm bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}
      </form>

      {status === "success" && reply && (
        <div className="mt-8">
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/30 rounded-2xl p-4 text-foreground">
            {reply.message}
          </div>

          {reply.products.length > 0 && (
            <>
              <div className="flex justify-between items-center mt-6 mb-2">
                <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
                <button
                  onClick={handleAddAllToCart}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
                >
                  Add All to Cart
                </button>
              </div>
              <div className="flex flex-wrap">
                {reply.products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
