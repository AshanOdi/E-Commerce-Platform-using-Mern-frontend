import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, cartItemCount, cartTotal, removeFromCart, updateQuantity } = useCart();

  function handleCheckout() {
    navigate("/checkout");
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Your cart is empty</h1>
        <p className="text-gray-500">Add some products to get started.</p>
        <Link to="/product" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => {
          const lineTotal = item.price * item.quantity;
          return (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-800 truncate">{item.name}</h2>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 text-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
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
                  className="px-3 py-1 text-lg hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-semibold text-gray-800">
                ${lineTotal.toFixed(2)}
              </div>

              <button
                onClick={() => {
                  removeFromCart(item.productId);
                  toast.success(`${item.name} removed from cart`);
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-md p-6 flex flex-col items-end gap-2">
        <p className="text-gray-500">{cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart</p>
        <p className="text-2xl font-bold text-gray-800">Subtotal: ${cartTotal.toFixed(2)}</p>

        <div className="flex gap-4 mt-2">
          <Link
            to="/product"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleCheckout}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
