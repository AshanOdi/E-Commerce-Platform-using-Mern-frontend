import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ImageOff } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductReviews from "../../components/productReviews";

function GalleryImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}>
        <ImageOff size={20} strokeWidth={1.5} />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />;
}

// "loading" | "success" | "not-found" | "error"
export default function ProductDetailPage() {
  const { productId } = useParams(); // URL is the source of truth, not router state
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
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
        <div className="w-[70px] h-[70px] border-[5px] border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Product not found</h1>
        <p className="text-muted-foreground">This product may have been removed or is no longer available.</p>
        <Link to="/product" className="text-primary hover:underline">
          Back to all products
        </Link>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">Please try again in a moment.</p>
        <Link to="/product" className="text-primary hover:underline">
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

  function handleToggleWishlist() {
    if (!isAuthenticated) {
      toast.error("Please log in to save items to your wishlist");
      return;
    }
    toggleWishlist(product.productId).catch(() => toast.error("Could not update wishlist"));
  }

  return (
    <div className="w-full max-w-5xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10">
      {/* Image gallery */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
          {images.length > 0 ? (
            <GalleryImage
              key={images[activeImage]}
              src={images[activeImage]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No Image</div>
          )}
        </div>

        {images.length > 1 && (
          <div className="w-full flex gap-2 mt-3 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  index === activeImage ? "border-primary" : "border-transparent"
                }`}
              >
                <GalleryImage
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted(product.productId) ? "Remove from wishlist" : "Add to wishlist"}
            className="w-10 h-10 flex-shrink-0 rounded-full bg-muted shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isWishlisted(product.productId) ? (
              <FaHeart className="text-red-500" size={18} />
            ) : (
              <FaRegHeart className="text-muted-foreground" size={18} />
            )}
          </button>
        </div>
        {product.altNames && product.altNames.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">{product.altNames.join(", ")}</p>
        )}

        <p className="text-muted-foreground mt-4">{product.description}</p>

        <div className="mt-6 flex items-center gap-3">
          {hasDiscount && (
            <span className="text-lg text-muted-foreground line-through">
              ${product.labelledPrice.toFixed(2)}
            </span>
          )}
          <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>

        <p className={`mt-2 text-sm font-medium ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
          {product.isAvailable ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>

        {product.isAvailable && (
          <div className="mt-6 flex items-center gap-4">
            <span className="text-foreground font-medium">Quantity</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => changeQuantity(-1)}
                className="px-3 py-1 text-lg hover:bg-muted"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => changeQuantity(1)}
                className="px-3 py-1 text-lg hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className={`mt-8 w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-colors ${
            product.isAvailable
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted-foreground text-white cursor-not-allowed"
          }`}
        >
          {product.isAvailable ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
      </div>

      <ProductReviews productId={product.productId} />
    </div>
  );
}
