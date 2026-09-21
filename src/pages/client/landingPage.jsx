import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaStar, FaTag } from "react-icons/fa";
import ProductCard from "../../components/productCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

const values = [
  {
    icon: FaTag,
    title: "Honest Pricing",
    body: "What you see is what you pay — no hidden markups.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Checkout",
    body: "Your order and payment details are handled securely, every time.",
  },
  {
    icon: FaStar,
    title: "Real Reviews",
    body: "Ratings and reviews come only from real customers.",
  },
];

function ProductGridSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-[280px] rounded-xl" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product?limit=8&sort=name_asc")
      .then((res) => {
        const products = res.data.products;
        setFeatured(products.slice(0, 4));
        setOnSale(products.filter((p) => p.labelledPrice > p.price).slice(0, 3));
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="flex w-full flex-col items-center">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950/40 dark:via-background dark:to-purple-950/40 px-4 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(219,39,119,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_40%)]"
        />
        <div className="relative">
          <Badge
            variant="secondary"
            className="mb-4 h-auto whitespace-normal border border-primary/20 bg-card/70 px-3 py-1 text-primary"
          >
            New in — Spring skincare edit
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Skincare &amp; Beauty,{" "}
            <AnimatedGradientText colorFrom="#db2777" colorTo="#a855f7" className="font-bold">
              Simplified
            </AnimatedGradientText>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Carefully chosen products for your everyday routine — hydrating, gentle, and honestly
            priced.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild className="h-11 px-8 text-base">
              <Link to="/product">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-8 text-base">
              <Link to="/concierge">Ask the AI Concierge</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="w-full max-w-6xl px-4 py-16" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="mb-6 font-heading text-2xl font-bold text-foreground">
          Featured Products
        </h2>
        {status === "loading" && <ProductGridSkeleton />}
        {status === "error" && (
          <p className="text-muted-foreground">Couldn't load products right now.</p>
        )}
        {status === "success" && (
          <div className="flex flex-wrap justify-center gap-5">
            {featured.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* On sale */}
      {onSale.length > 0 && (
        <section className="w-full max-w-6xl px-4 py-16" aria-labelledby="sale-heading">
          <h2 id="sale-heading" className="mb-6 font-heading text-2xl font-bold text-foreground">
            On Sale
          </h2>
          <div className="flex flex-wrap justify-center gap-5">
            {onSale.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Value proposition */}
      <section className="w-full bg-muted/40 px-4 py-16" aria-labelledby="values-heading">
        <h2 id="values-heading" className="sr-only">
          Why shop with us
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-center md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <value.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Concierge teaser */}
      <section className="w-full max-w-3xl px-4 py-16 text-center">
        <Badge className="mb-3 bg-primary/10 text-primary" variant="secondary">
          Live now
        </Badge>
        <h2 className="font-heading text-xl font-bold text-foreground">
          AI Beauty &amp; Style Concierge
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tell us your budget and occasion, and get a product bundle picked just for you.
        </p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/concierge">Try it now →</Link>
        </Button>
      </section>
    </main>
  );
}
