import { Link } from "react-router-dom";

const footerLinks = [
  { to: "/product", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/concierge", label: "AI Concierge" },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:justify-between md:px-8">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.png" alt="Store logo" className="h-6 w-6 rounded-full object-cover" />
          <span className="font-heading font-semibold text-foreground">Skincare &amp; Beauty Shop</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <p>&copy; {new Date().getFullYear()} Skincare &amp; Beauty Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}
