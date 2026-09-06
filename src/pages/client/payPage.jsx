import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

// "loading" | "ready" | "processing" | "succeeded" | "failed" | "notfound" | "error"
export default function PayPage() {
  const { intentId } = useParams();
  const [phase, setPhase] = useState("loading");
  const [amount, setAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const pollRef = useRef(null);

  const authHeader = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
  const statusUrl =
    import.meta.env.VITE_BACKEND_URL + "/api/payment/intent/" + intentId + "/status";

  // Map an intent status to a page phase.
  function applyStatus(s) {
    if (s === "requires_payment") setPhase("ready");
    else if (s === "processing") setPhase("processing");
    else if (s === "succeeded") setPhase("succeeded");
    else if (s === "failed") setPhase("failed");
  }

  useEffect(() => {
    axios
      .get(statusUrl, authHeader)
      .then((res) => {
        setAmount(res.data.amount);
        setOrderId(res.data.orderId);
        applyStatus(res.data.status);
      })
      .catch((err) => {
        setPhase(err.response?.status === 404 ? "notfound" : "error");
      });
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentId]);

  function startPolling() {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await axios.get(statusUrl, authHeader);
        if (res.data.status === "succeeded" || res.data.status === "failed") {
          clearInterval(pollRef.current);
          applyStatus(res.data.status);
        }
      } catch {
        clearInterval(pollRef.current);
        setPhase("error");
      }
    }, 1000);
  }

  async function pay(outcome) {
    setPhase("processing");
    try {
      // In a real integration this happens on the gateway's hosted page.
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/payment/mock/charge",
        { intentId, outcome },
        authHeader
      );
      // The backend already ran the webhook synchronously, but poll anyway
      // — this is how a real async gateway is handled.
      startPolling();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not process payment");
      setPhase("ready");
    }
  }

  const box = "w-full max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-md p-8 text-center";

  if (phase === "loading") {
    return (
      <div className="w-full flex justify-center py-24">
        <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (phase === "notfound") {
    return (
      <div className={box}>
        <h1 className="text-xl font-semibold text-gray-800">Payment not found</h1>
        <Link to="/product" className="text-blue-600 hover:underline mt-3 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className={box}>
        <h1 className="text-xl font-semibold text-gray-800">Something went wrong</h1>
        <p className="text-gray-500 mt-1">Please try again in a moment.</p>
      </div>
    );
  }

  if (phase === "succeeded") {
    return (
      <div className={box}>
        <h1 className="text-2xl font-bold text-green-700">Payment successful</h1>
        <p className="text-gray-600 mt-2">
          Order <span className="font-mono font-semibold">{orderId}</span> is confirmed.
        </p>
        <div className="flex gap-4 justify-center mt-4">
          <Link to={"/my-orders/" + orderId} className="text-blue-600 hover:underline">
            View order
          </Link>
          <Link to="/product" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className={box}>
        <h1 className="text-2xl font-bold text-red-700">Payment failed</h1>
        <p className="text-gray-600 mt-2">
          Order <span className="font-mono font-semibold">{orderId}</span> was cancelled and the
          items returned to stock.
        </p>
        <Link to="/product" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  // ready | processing
  return (
    <div className={box}>
      <p className="text-sm text-gray-500">Amount due</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">
        {amount.toLocaleString()} <span className="text-lg font-normal text-gray-500">LKR</span>
      </p>
      <p className="text-xs text-gray-400 mt-3">
        Mock gateway — no card details are collected or stored.
      </p>

      {phase === "processing" ? (
        <p className="mt-6 text-gray-600">Processing payment…</p>
      ) : (
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => pay("success")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
          >
            Pay Now
          </button>
          <button
            onClick={() => pay("failure")}
            className="text-sm text-red-600 hover:underline"
          >
            Simulate a failed payment
          </button>
        </div>
      )}
    </div>
  );
}
