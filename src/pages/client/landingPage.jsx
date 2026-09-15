import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/productCard";

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product?limit=8&sort=name_asc")
      .then((res) => {
        const products = res.data.products;
        setFeatured(products.slice(0, 4));
        setOnSale(products.filter((p) => p.labelledPrice > p.price).slice(0, 3));
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="w-full flex flex-col items-center">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Skincare & Beauty, Simplified
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Carefully chosen products for your everyday routine — hydrating, gentle, and honestly
          priced.
        </p>
        <Link
          to="/product"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured products */}
      <section className="w-full max-w-6xl px-4 py-16" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-2xl font-bold text-gray-800 mb-6">
          Featured Products
        </h2>
        {status === "loading" && <p className="text-gray-500">Loading…</p>}
        {status === "error" && <p className="text-gray-500">Couldn’t load products right now.</p>}
        {status === "success" && (
          <div className="flex flex-wrap justify-center gap-2">
            {featured.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* On sale */}
      {onSale.length > 0 && (
        <section className="w-full max-w-6xl px-4 py-16" aria-labelledby="sale-heading">
          <h2 id="sale-heading" className="text-2xl font-bold text-gray-800 mb-6">
            On Sale
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {onSale.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Value proposition */}
      <section className="w-full bg-gray-50 py-16 px-4" aria-labelledby="values-heading">
        <h2 id="values-heading" className="sr-only">
          Why shop with us
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Honest Pricing</h3>
            <p className="text-gray-600 text-sm mt-2">
              What you see is what you pay — no hidden markups.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Secure Checkout</h3>
            <p className="text-gray-600 text-sm mt-2">
              Your order and payment details are handled securely, every time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Real Reviews</h3>
            <p className="text-gray-600 text-sm mt-2">
              Ratings and reviews come only from real customers.
            </p>
          </div>
        </div>
      </section>

      {/* AI Concierge teaser — not live yet */}
      <section className="w-full max-w-3xl px-4 py-16 text-center">
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Coming soon
        </span>
        <h2 className="text-xl font-bold text-gray-800">AI Beauty & Style Concierge</h2>
        <p className="text-gray-600 mt-2">
          Tell us your budget and occasion, and get a product bundle picked just for you.
        </p>
      </section>
    </main>
  );
}
