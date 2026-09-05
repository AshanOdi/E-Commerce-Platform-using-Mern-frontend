import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

// "loading" | "success" | "not-found" | "error"
export default function ProductDetailPage() {
  const { productId } = useParams(); // URL is the source of truth, not router state
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setStatus("loading");
    setActiveImage(0);
    setQuantity(1);

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product/" + productId)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setStatus("not-found");
        } else {
          // Never show the raw axios/network error to the customer.
          setStatus("error");
        }
      });
  }, [productId]);

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
        <h1 className="text-2xl font-semibold text-gray-700">Product not found</h1>
        <p className="text-gray-500">This product may have been removed or is no longer available.</p>
        <Link to="/product" className="text-blue-600 hover:underline">
          Back to all products
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Something went wrong</h1>
        <p className="text-gray-500">Please try again in a moment.</p>
        <Link to="/product" className="text-blue-600 hover:underline">
          Back to all products
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasDiscount = product.labelledPrice && product.labelledPrice > product.price;

  function changeQuantity(delta) {
    setQuantity((q) => {
      const next = q + delta;
      const max = product.stock > 0 ? product.stock : 1;
      if (next < 1) return 1;
      if (next > max) return max;
      return next;
    });
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="w-full max-w-5xl px-4 py-8 flex flex-col md:flex-row gap-10">
      {/* Image gallery */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-gray-500 text-sm">No Image</div>
          )}
        </div>

        {images.length > 1 && (
          <div className="w-full flex gap-2 mt-3 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${
                  index === activeImage ? "border-blue-600" : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
        {product.altNames && product.altNames.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">{product.altNames.join(", ")}</p>
        )}

        <p className="text-gray-600 mt-4">{product.description}</p>

        <div className="mt-6 flex items-center gap-3">
          {hasDiscount && (
            <span className="text-lg text-gray-400 line-through">
              ${product.labelledPrice.toFixed(2)}
            </span>
          )}
          <span className="text-3xl font-bold text-red-600">${product.price.toFixed(2)}</span>
        </div>

        <p className={`mt-2 text-sm font-medium ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
          {product.isAvailable ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>

        {product.isAvailable && (
          <div className="mt-6 flex items-center gap-4">
            <span className="text-gray-700 font-medium">Quantity</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => changeQuantity(-1)}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => changeQuantity(1)}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className={`mt-8 w-full md:w-auto px-8 py-3 rounded-lg text-white font-medium transition-colors ${
            product.isAvailable
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {product.isAvailable ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
