export default function ProductCard({ product }) {
  return (
    <div className="w-[300px] h-[400px] bg-white rounded-2xl shadow-lg m-3 flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="h-1/2 w-full overflow-hidden flex items-center justify-center bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-500 text-sm">No Image</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold text-gray-600 truncate">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price + Availability */}
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            {product.labelledPrice && product.labelledPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.labelledPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold text-red-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p
            className={`text-sm mt-1 ${
              product.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.isAvailable
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </p>
        </div>

        {/* Action Button */}
        <button
          disabled={!product.isAvailable}
          className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition-colors ${
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
