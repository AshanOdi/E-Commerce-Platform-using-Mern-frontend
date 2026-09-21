import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaRegHeart, FaBars } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/product", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/concierge", label: "AI Concierge" },
];

function NavItem({ to, label, end, onNavigate, className }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
          isActive && "text-primary",
          className
        )
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { products: wishlistProducts } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` : "";

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:px-8">
      <img
        src="/logo-icon.png"
        alt="Store logo"
        className="h-11 w-11 shrink-0 cursor-pointer rounded-full object-cover"
        onClick={() => navigate("/")}
      />

      <nav className="ml-2 hidden flex-1 items-center gap-1 md:flex">
        {navLinks.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-1 md:hidden" aria-label="Open menu">
            <FaBars size={18} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onNavigate={() => setMenuOpen(false)}
                className="text-base"
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </Button>

        {isAuthenticated && (
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/wishlist" aria-label="Wishlist">
              <FaRegHeart size={17} />
              {wishlistProducts.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                  {wishlistProducts.length}
                </Badge>
              )}
            </Link>
          </Button>
        )}

        <Button variant="ghost" size="icon" asChild className="relative">
          <Link to="/cart" aria-label="Cart">
            <FaShoppingCart size={17} />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {cartItemCount}
              </Badge>
            )}
          </Link>
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image} alt={user.firstName} />
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Hi, {user.firstName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-orders">My Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="ml-1 flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
