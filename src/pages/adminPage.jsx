import { Link, NavLink, Routes, Route, Navigate } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaClipboardList, FaStar, FaArrowLeft } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import AdminProductPage from "./admin/productPage";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/editProductPage";
import AdminOrdersPage from "./admin/orderPage";
import AdminOrderDetailPage from "./admin/orderDetailPage";
import AdminUsersPage from "./admin/userPage";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/users", label: "Users", icon: FaUsers },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/admin/reviews", label: "Reviews", icon: FaStar },
];

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-full flex-row bg-muted/30">
      <div className="flex h-screen w-64 shrink-0 flex-col border-r bg-background">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <img src="/logo-icon.png" alt="Store logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-heading text-sm font-semibold text-foreground">Admin</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                )
              }
            >
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <FaArrowLeft size={13} />
            Back to store
          </Link>
        </div>
      </div>

      <div className="h-full flex-1 overflow-y-auto">
        <Routes path="/*">
          <Route path="/" element={<Navigate to="/admin/products" replace />}></Route>
          <Route path="/products" element={<AdminProductPage />}></Route>
          <Route path="/users" element={<AdminUsersPage />}></Route>
          <Route path="/orders" element={<AdminOrdersPage />}></Route>
          <Route path="/orders/:orderId" element={<AdminOrderDetailPage />}></Route>
          <Route
            path="/reviews"
            element={
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
                <h1 className="font-heading text-xl font-semibold text-foreground">
                  Review moderation
                </h1>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Not built yet — customer reviews are visible on each product page but there's no
                  moderation UI here.
                </p>
              </div>
            }
          ></Route>
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<EditProductPage />} />
        </Routes>
      </div>
    </div>
  );
}
