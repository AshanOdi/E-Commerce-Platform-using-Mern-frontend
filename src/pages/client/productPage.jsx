import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// "loading" | "success" | "error"
export default function ProductPage() {
  // Filter/sort/page state lives in the URL — the listing is shareable,
  // bookmarkable and back-button friendly (same principle as ProductDetailPage).
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [status, setStatus] = useState("loading");

  // Local input mirror so typing feels instant; committed to the URL (debounced).
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const currentSearch = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "name_asc";
  const page = parseInt(searchParams.get("page"), 10) || 1;

  // Debounce the search box into the URL. The guard is evaluated on every
  // render (fresh values), not inside the timer, so a cleared search never
  // schedules a write.
  useEffect(() => {
    if (searchInput === currentSearch) return;
    const t = setTimeout(() => {
      updateParams({ search: searchInput || null, page: null });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, currentSearch]);

  // Fetch whenever any URL param changes.
  useEffect(() => {
    setStatus("loading");
    const qs = new URLSearchParams();
    if (currentSearch) qs.set("search", currentSearch);
    if (minPrice) qs.set("minPrice", minPrice);
    if (maxPrice) qs.set("maxPrice", maxPrice);
    if (sort) qs.set("sort", sort);
    qs.set("page", page);
    qs.set("limit", "12");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product?" + qs.toString())
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [currentSearch, minPrice, maxPrice, sort, page]);

  // Merge changes into the URL; a null/empty value clears that param.
  // Uses the functional updater so it always merges into the CURRENT
  // params, never a stale closure snapshot (which caused "Clear filters"
  // to be partially undone by a late-firing debounce).
  function updateParams(changes) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(changes)) {
          if (v === null || v === "") next.delete(k);
          else next.set(k, v);
        }
        return next;
      },
      { replace: true }
    );
  }

  return (
    <div className="w-full max-w-6xl px-4 py-6">
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="search" className="text-xs text-muted-foreground">
            Search
          </Label>
          <Input
            id="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Product name..."
            className="w-56"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
            Min price
          </Label>
          <Input
            id="minPrice"
            type="number"
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value || null, page: null })}
            className="w-28"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
            Max price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null, page: null })}
            className="w-28"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Sort</Label>
          <Select value={sort} onValueChange={(v) => updateParams({ sort: v, page: null })}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A–Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z–A)</SelectItem>
              <SelectItem value="price_asc">Price (low → high)</SelectItem>
              <SelectItem value="price_desc">Price (high → low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(currentSearch || minPrice || maxPrice || sort !== "name_asc") && (
          <Button
            variant="link"
            className="pb-2"
            onClick={() => {
              setSearchInput("");
              setSearchParams({}, { replace: true });
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Results */}
      {status === "loading" && (
        <div className="flex flex-wrap justify-center gap-5 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-[280px] rounded-xl" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="w-full py-16 text-center text-muted-foreground">
          Something went wrong loading products. Please try again.
        </div>
      )}

      {status === "success" && products.length === 0 && (
        <div className="w-full py-16 text-center text-muted-foreground">
          No products match your search.
        </div>
      )}

      {status === "success" && products.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center gap-5">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => updateParams({ page: page - 1 })}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} product
              {pagination.total !== 1 ? "s" : ""}
            </span>
            <Button
              variant="outline"
              disabled={page >= pagination.totalPages}
              onClick={() => updateParams({ page: page + 1 })}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
