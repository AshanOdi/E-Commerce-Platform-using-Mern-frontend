import { FaTag, FaShieldAlt, FaStar } from "react-icons/fa";

// Same three highlights, same copy, as the landing page's feature strip —
// reused verbatim (not reworded) so the messaging is consistent wherever a
// visitor sees it, not just coincidentally similar.
const highlights = [
  { icon: FaTag, title: "Honest Pricing", body: "What you see is what you pay — no hidden markups." },
  { icon: FaShieldAlt, title: "Secure Checkout", body: "Your order and payment details are handled securely, every time." },
  { icon: FaStar, title: "Real Reviews", body: "Ratings and reviews come only from real customers." },
];

// A crafted gradient/illustration panel, not a photo — there's no reliable
// real photo asset to use here (the app's previous image host, Supabase
// Storage, is currently a dead project; see the memory notes on that), and
// hardcoding a guessed external image URL would just risk repeating the
// exact same "image silently goes dark" failure. This is CSS/SVG only, so
// it can never 404 or depend on any third party being up.
export default function AuthSidePanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-10 text-white lg:flex">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex items-center gap-2">
        <img src="/logo-icon.png" alt="" className="h-9 w-9 rounded-full object-cover" />
        <span className="font-heading text-lg font-semibold">Skincare &amp; Beauty Shop</span>
      </div>

      <div className="relative">
        <h2 className="font-heading text-3xl font-bold leading-tight">
          Skincare &amp; Beauty,
          <br />
          Simplified
        </h2>
        <p className="mt-3 max-w-sm text-white/80">
          Carefully chosen products for your everyday routine — hydrating, gentle, and honestly
          priced.
        </p>
      </div>

      <div className="relative flex flex-col gap-4">
        {highlights.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
              <item.icon size={14} />
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-white/70">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
