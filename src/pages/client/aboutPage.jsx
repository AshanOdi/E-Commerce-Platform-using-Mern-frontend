export default function AboutPage() {
  return (
    <main className="w-full max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-6">About Us</h1>

      <section className="mb-8" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="text-xl font-semibold text-foreground mb-2">
          Our Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We believe good skincare and beauty products shouldn't be complicated or overpriced.
          Every item in our catalog is chosen for what it actually does — not for how loudly it's
          marketed — and priced honestly from the start.
        </p>
      </section>

      <section className="mb-8" aria-labelledby="approach-heading">
        <h2 id="approach-heading" className="text-xl font-semibold text-foreground mb-2">
          How We Choose Products
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We keep the catalog small on purpose. Rather than listing everything available, we
          focus on products that work well for everyday routines — hydrating, gentle formulas
          that suit a range of skin types and budgets.
        </p>
      </section>

      <section aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-xl font-semibold text-foreground mb-2">
          Reviews You Can Trust
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Every review on our product pages comes from a real registered customer, and purchases
          are marked as verified when we can confirm the order. No reviews are bought, edited, or
          removed for being critical.
        </p>
      </section>
    </main>
  );
}
