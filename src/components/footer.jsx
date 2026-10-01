import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const footerLinks = [
  { to: "/product", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/concierge", label: "AI Concierge" },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="POP Cosmetics" className="h-6 w-auto object-contain" />
              <span className="font-heading font-semibold text-foreground">POP Cosmetics</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Carefully chosen skincare &amp; beauty products for your everyday routine.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/AshanOdi/E-Commerce-Platform-using-Mern-frontend"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              className="transition-colors hover:text-foreground"
            >
              <FaGithub size={16} />
            </a>
          </nav>
        </div>

        <div className="my-6 border-t" />

        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>Demo project — payments and products are simulated, not real.</p>
          <p>&copy; {new Date().getFullYear()} POP Cosmetics · Built by Ashan Odithya</p>
        </div>
      </div>
    </footer>
  );
}
