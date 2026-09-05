import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/productCard";

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
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Search</label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Product name..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-56"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Min price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value || null, page: null })}
            className="border border-gray-300 rounded-lg px-3 py-2 w-28"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Max price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null, page: null })}
            className="border border-gray-300 rounded-lg px-3 py-2 w-28"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: null })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="name_asc">Name (A–Z)</option>
            <option value="name_desc">Name (Z–A)</option>
            <option value="price_asc">Price (low → high)</option>
            <option value="price_desc">Price (high → low)</option>
          </select>
        </div>
        {(currentSearch || minPrice || maxPrice || sort !== "name_asc") && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearchParams({}, { replace: true });
            }}
            className="text-sm text-blue-600 hover:underline pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {status === "loading" && (
        <div className="w-full flex justify-center py-16">
          <div className="w-[70px] h-[70px] border-[5px] border-gray-500 border-t-blue-900 rounded-full animate-spin"></div>
        </div>
      )}

      {status === "error" && (
        <div className="w-full text-center py-16 text-gray-600">
          Something went wrong loading products. Please try again.
        </div>
      )}

      {status === "success" && products.length === 0 && (
        <div className="w-full text-center py-16 text-gray-500">
          No products match your search.
        </div>
      )}

      {status === "success" && products.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => updateParams({ page: page - 1 })}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} product
              {pagination.total !== 1 ? "s" : ""}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => updateParams({ page: page + 1 })}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
