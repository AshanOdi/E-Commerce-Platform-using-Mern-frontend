import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.productId);
  const [imageFailed, setImageFailed] = useState(false);

  function handleAddToCart(e) {
    e.stopPropagation(); // don't also trigger the card's own navigate()
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  function handleToggleWishlist(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to save items to your wishlist");
      return;
    }
    toggleWishlist(product.productId).catch(() => toast.error("Could not update wishlist"));
  }

  const onSale = product.labelledPrice && product.labelledPrice > product.price;

  return (
    <Card
      onClick={() => navigate("/product/" + product.productId)}
      className="w-[280px] gap-0 overflow-hidden p-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        {onSale && (
          <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground shadow">
            Sale
          </Badge>
        )}

        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 shadow transition-transform hover:scale-110"
        >
          {wishlisted ? (
            <FaHeart className="text-primary" size={16} />
          ) : (
            <FaRegHeart className="text-muted-foreground" size={16} />
          )}
        </button>

        {product.images && product.images.length > 0 && !imageFailed ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff size={28} strokeWidth={1.5} />
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 px-4 pt-4">
        <h2 className="truncate font-heading text-base font-semibold text-foreground">
          {product.name}
        </h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-2 flex items-baseline gap-2">
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.labelledPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
        </div>

        <p
          className={cn(
            "text-xs font-medium",
            product.isAvailable ? "text-emerald-600" : "text-destructive"
          )}
        >
          {product.isAvailable ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-3">
        <Button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className="w-full"
        >
          {product.isAvailable ? "Add to Cart" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
