import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function WishlistPage() {
  const { products, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  function handleRemove(product) {
    toggleWishlist(product.productId).catch(() => toast.error("Could not update wishlist"));
  }

  function handleAddToCart(product) {
    if (!product.isAvailable || product.stock <= 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Your wishlist is empty</h1>
        <p className="text-gray-500">Tap the heart on any product to save it here.</p>
        <Link to="/product" className="text-primary hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

      <div className="flex flex-col gap-4">
        {products.map((product) => {
          const unavailable = !product.isAvailable || product.stock <= 0;
          return (
            <div
              key={product.productId}
              className={`flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 ${
                unavailable ? "opacity-70" : ""
              }`}
            >
              <Link
                to={"/product/" + product.productId}
                className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
              >
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`object-cover w-full h-full ${unavailable ? "grayscale" : ""}`}
                  />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={"/product/" + product.productId} className="font-semibold text-gray-800 truncate hover:underline">
                  {product.name}
                </Link>
                <p className={`text-sm mt-1 ${unavailable ? "text-red-600 font-medium" : "text-gray-500"}`}>
                  {unavailable ? "No longer available" : `$${product.price.toFixed(2)}`}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={unavailable}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                  unavailable ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
                }`}
              >
                Add to Cart
              </button>

              <button
                onClick={() => handleRemove(product)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
