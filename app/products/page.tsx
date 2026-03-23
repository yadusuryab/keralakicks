"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/queries/product";
import { Filter, X, Search, SlidersHorizontal, ChevronDown, Star, Zap, TrendingUp } from "lucide-react";
import ProductsSection from "@/components/sections/products";
import { Filters } from "@/components/product/filters";

// ─── Sort options ─────────────────────────────────────────────────────────────
const sortOptions = [
  { value: "newest",     label: "Newest first",        icon: <Zap className="w-4 h-4" /> },
  { value: "price_asc",  label: "Price: low to high",  icon: <TrendingUp className="w-4 h-4" /> },
  { value: "price_desc", label: "Price: high to low",  icon: <TrendingUp className="w-4 h-4 rotate-180" /> },
  { value: "rating",     label: "Top rated",           icon: <Star className="w-4 h-4" /> },
];

// ─── Active filter chip ───────────────────────────────────────────────────────
function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black tracking-wide uppercase"
      style={{
        background: "var(--foreground)",
        color: "var(--sport-accent)",
        border: "1px solid var(--sport-accent)",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 flex items-center justify-center transition-opacity hover:opacity-70"
        style={{ color: "var(--sport-accent)" }}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  );
}

// ─── Sort bottom sheet (mobile) ───────────────────────────────────────────────
function SortSheet({
  open, onClose, value, onChange,
}: {
  open: boolean; onClose: () => void; value: string; onChange: (v: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-5 pb-10"
            style={{ background: "var(--background)", borderTop: "3px solid var(--sport-accent)" }}
          >
            {/* Handle */}
            <div className="w-8 h-[3px] mx-auto mb-6"
              style={{ background: "var(--sport-accent)" }} />

            <div className="flex items-center gap-2 mb-5 px-1">
              <Zap className="w-3 h-3 fill-current" style={{ color: "var(--sport-accent)" }} />
              <p className="text-[9px] font-black tracking-[0.35em] uppercase"
                style={{ color: "var(--sport-accent)" }}>
                Sort by
              </p>
            </div>

            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-black uppercase tracking-wide transition-all"
                  style={{
                    background: value === opt.value ? "var(--foreground)" : "transparent",
                    color: value === opt.value ? "var(--sport-accent)" : "var(--muted-foreground)",
                    borderLeft: value === opt.value ? "3px solid var(--sport-accent)" : "3px solid transparent",
                  }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                  {value === opt.value && (
                    <span className="ml-auto font-black" style={{ color: "var(--sport-accent)" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sticky mobile search/filter bar ─────────────────────────────────────────
function StickySearchBar({
  value, onChange, filterCount, onOpenFilters, sort, onOpenSort,
}: {
  value: string; onChange: (v: string) => void;
  filterCount: number; onOpenFilters: () => void;
  sort: string; onOpenSort: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="sticky top-0 z-30 px-4 py-3"
      style={{
        background: "rgba(var(--background), 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        boxShadow: focused ? `0 0 0 1px var(--sport-accent)` : undefined,
      }}
    >
      {/* Search input */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 transition-all duration-200"
        style={{
          background: "var(--muted)",
          border: `2px solid ${focused ? "var(--sport-accent)" : "transparent"}`,
        }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products…"
          className="flex-1 bg-transparent text-sm outline-none min-w-0 font-medium"
          style={{ color: "var(--foreground)" }}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => onChange("")}
              className="w-5 h-5 flex items-center justify-center shrink-0"
              style={{ background: "var(--muted-foreground)", color: "var(--background)" }}
            >
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Controls row */}
      <div className="flex gap-2 mt-2.5">
        <button
          onClick={onOpenFilters}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95"
          style={{
            background: filterCount > 0 ? "var(--sport-accent)" : "var(--muted)",
            color: filterCount > 0 ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {filterCount > 0 && (
            <span
              className="w-4 h-4 text-[10px] font-black flex items-center justify-center"
              style={{ background: "var(--foreground)", color: "var(--sport-accent)" }}
            >
              {filterCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSort}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
          {sortOptions.find((s) => s.value === sort)?.label.split(":")[0] || "Sort"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ProductsPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts]               = useState<Product[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [categories, setCategories]           = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen]               = useState(false);

  const [availableFilters, setAvailableFilters] = useState({
    sizes:       [] as string[],
    colors:      [] as string[],
    features:    [] as string[],
    brands:      [] as string[],
    brandCounts: {} as Record<string, number>,
    maxPrice:    0,
  });

  const [filters, setFilters] = useState({
    q:         searchParams.get("q")        || "",
    minPrice:  parseInt(searchParams.get("minPrice") || "0"),
    maxPrice:  parseInt(searchParams.get("maxPrice") || "50000"),
    category:  searchParams.get("category") || "",
    sort:      searchParams.get("sort")     || "newest",
    page:      parseInt(searchParams.get("page") || "1"),
    limit:     12,
    sizes:     searchParams.get("sizes")?.split(",").filter(Boolean)    || [],
    colors:    searchParams.get("colors")?.split(",").filter(Boolean)   || [],
    features:  searchParams.get("features")?.split(",").filter(Boolean) || [],
    brands:    searchParams.get("brands")?.split(",").filter(Boolean)   || [],
    rating:    searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : 0,
    featured:  searchParams.get("featured") === "true",
    inStock:   searchParams.get("inStock")  !== "false",
    onSale:    searchParams.get("onSale")   === "true",
  });

  const [pagination, setPagination] = useState({ total: 0, hasNextPage: false });

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.q)                       p.set("q",        filters.q);
    if (filters.minPrice > 0)            p.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 50000)        p.set("maxPrice", filters.maxPrice.toString());
    if (filters.category)                p.set("category", filters.category);
    if (filters.sort !== "newest")       p.set("sort",     filters.sort);
    if (filters.page > 1)                p.set("page",     filters.page.toString());
    if (filters.sizes.length)            p.set("sizes",    filters.sizes.join(","));
    if (filters.colors.length)           p.set("colors",   filters.colors.join(","));
    if (filters.features.length)         p.set("features", filters.features.join(","));
    if (filters.brands.length)           p.set("brands",   filters.brands.join(","));
    if (filters.rating > 0)              p.set("rating",   filters.rating.toString());
    if (filters.featured)                p.set("featured", "true");
    if (!filters.inStock)                p.set("inStock",  "false");
    if (filters.onSale)                  p.set("onSale",   "true");
    router.replace(`/products?${p.toString()}`, { scroll: false });
  }, [filters, router]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const p = new URLSearchParams();
      if (filters.q)          p.append("q",          filters.q);
      p.append("minPrice",    filters.minPrice.toString());
      p.append("maxPrice",    filters.maxPrice.toString());
      if (filters.category)   p.append("category",   filters.category);
      p.append("sort",        filters.sort);
      p.append("page",        filters.page.toString());
      p.append("limit",       filters.limit.toString());
      if (filters.sizes.length)    p.append("sizes",    filters.sizes.join(","));
      if (filters.colors.length)   p.append("colors",   filters.colors.join(","));
      if (filters.features.length) p.append("features", filters.features.join(","));
      if (filters.brands.length)   p.append("brands",   filters.brands.join(","));
      if (filters.rating > 0)      p.append("minRating", filters.rating.toString());
      if (filters.featured)        p.append("featured",  "true");
      if (!filters.inStock)        p.append("excludeSoldOut", "true");
      if (filters.onSale)          p.append("onSale",    "true");

      const res  = await fetch(`/api/product?${p.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setPagination({ total: data.pagination.total, hasNextPage: data.pagination.hasNextPage });

        if (data.data.length > 0) {
          const sizes    = new Set<string>();
          const colors   = new Set<string>();
          const features = new Set<string>();
          const brands   = new Set<string>();
          const brandCounts: Record<string, number> = {};
          let maxPrice = 0;

          data.data.forEach((product: any) => {
            product.sizes?.forEach((s: string) => sizes.add(s));
            product.colors?.forEach((c: string) => colors.add(c));
            product.features?.forEach((f: string) => features.add(f));

            // Brand comes from the resolved reference now
            const brandName = product.brand?.name || product.brand;
            const brandSlug = product.brand?.slug  || brandName;
            if (brandSlug) {
              brands.add(brandSlug);
              brandCounts[brandSlug] = (brandCounts[brandSlug] || 0) + 1;
            }

            const price = product.salesPrice || product.price || 0;
            if (price > maxPrice) maxPrice = price;
          });

          setAvailableFilters({
            sizes:       Array.from(sizes).sort(),
            colors:      Array.from(colors).sort(),
            features:    Array.from(features).sort(),
            brands:      Array.from(brands).sort(),
            brandCounts,
            maxPrice:    Math.ceil(maxPrice / 1000) * 1000,
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters]);

  // ── Filter helpers ────────────────────────────────────────────────────────
  const handleFilterChange = (key: string, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const handleArrayFilterChange :any= (type: "sizes" | "colors" | "features" | "brands", value: string) =>
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((i: string) => i !== value)
        : [...prev[type], value],
      page: 1,
    }));

  const handlePriceChange = (value: [number, number]) =>
    setFilters((prev) => ({ ...prev, minPrice: value[0], maxPrice: value[1], page: 1 }));

  const handleToggleFilter:any = (key: "featured" | "inStock" | "onSale") =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key], page: 1 }));

  const clearAllFilters = () =>
    setFilters({
      q: "", minPrice: 0, maxPrice: 50000, category: "", sort: "newest",
      page: 1, limit: 12, sizes: [], colors: [], features: [], brands: [],
      rating: 0, featured: false, inStock: true, onSale: false,
    });

  const getActiveFilterCount = () => {
    let n = 0;
    if (filters.minPrice > 0)      n++;
    if (filters.maxPrice < 50000)  n++;
    if (filters.category)          n++;
    if (filters.sizes.length)      n++;
    if (filters.colors.length)     n++;
    if (filters.features.length)   n++;
    if (filters.brands.length)     n++;
    if (filters.rating > 0)        n++;
    if (filters.featured)          n++;
    if (!filters.inStock)          n++;
    if (filters.onSale)            n++;
    return n;
  };

  const handlePageChange = (p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = getActiveFilterCount();

  // ── Active chips ──────────────────────────────────────────────────────────
  const activeChips: Array<{ label: string; onRemove: () => void }> = [
    ...(filters.category ? [{
      label: categories.find((c) => c.slug === filters.category)?.name || filters.category,
      onRemove: () => handleFilterChange("category", ""),
    }] : []),
    ...filters.brands.map((b) => ({ label: b, onRemove: () => handleArrayFilterChange("brands", b) })),
    ...filters.sizes.map((s)  => ({ label: s, onRemove: () => handleArrayFilterChange("sizes",  s) })),
    ...filters.colors.map((c) => ({ label: c, onRemove: () => handleArrayFilterChange("colors", c) })),
    ...(filters.rating > 0  ? [{ label: `${filters.rating}★+`, onRemove: () => handleFilterChange("rating", 0) }] : []),
    ...(filters.onSale      ? [{ label: "On sale",   onRemove: () => handleToggleFilter("onSale") }]   : []),
    ...(filters.featured    ? [{ label: "Featured",  onRemove: () => handleToggleFilter("featured") }] : []),
    ...(!filters.inStock    ? [{ label: "All stock", onRemove: () => handleToggleFilter("inStock") }]   : []),
  ];

  const totalPages = Math.ceil(pagination.total / filters.limit);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Mobile sticky bar ── */}
      <div className="md:hidden">
        <StickySearchBar
          value={filters.q}
          onChange={(v) => handleFilterChange("q", v)}
          filterCount={activeFilterCount}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          sort={filters.sort}
          onOpenSort={() => setSortOpen(true)}
        />
      </div>

      {/* ── Desktop header ── */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 pt-8 pb-0">
        {/* Accent bar */}
        <div className="h-[3px] w-10 mb-6" style={{ background: "var(--sport-accent)" }} />

        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3 fill-current" style={{ color: "var(--sport-accent)" }} />
              <span className="text-[9px] font-black tracking-[0.35em] uppercase"
                style={{ color: "var(--sport-accent)" }}>
                Collection
              </span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none"
              style={{ color: "var(--foreground)" }}>
              {filters.category
                ? categories.find((c) => c.slug === filters.category)?.name
                : "All Products"}
            </h1>
            {pagination.total > 0 && (
              <p className="text-xs font-bold tracking-widest uppercase mt-1"
                style={{ color: "var(--muted-foreground)" }}>
                {pagination.total} items
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--muted-foreground)" }} />
              <input
                placeholder="Search…"
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                className="pl-9 w-60 py-2 pr-4 text-sm font-medium outline-none transition-all"
                style={{
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              />
            </div>

            {/* Desktop sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-2 outline-none cursor-pointer transition-all"
              style={{
                background: "var(--muted)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 md:max-w-[1440px] md:mx-auto md:px-6 py-3 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-2 w-max items-center">
              <motion.button
                layout onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all shrink-0"
                style={{
                  border: "1px solid var(--foreground)",
                  color: "var(--foreground)",
                  background: "transparent",
                }}
              >
                <X className="w-3 h-3" /> Clear all
              </motion.button>
              {activeChips.map((chip, i) => (
                <Chip key={i} label={chip.label} onRemove={chip.onRemove} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            {/* Sidebar label */}
            <div className="flex items-center gap-2 mb-5 pb-3"
              style={{ borderBottom: "2px solid var(--sport-accent)" }}>
              <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: "var(--sport-accent)" }} />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase"
                style={{ color: "var(--foreground)" }}>
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[9px]"
                    style={{ background: "var(--sport-accent)", color: "var(--foreground)" }}>
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </div>
            <Filters
              filters={filters}
              availableFilters={availableFilters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onArrayFilterChange={handleArrayFilterChange}
              onPriceChange={handlePriceChange}
              onToggleFilter={handleToggleFilter}
              onClearAll={clearAllFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
          </aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            {/* Mobile result count */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <p className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: "var(--muted-foreground)" }}>
                {loading ? "Loading…" : `${pagination.total} products`}
              </p>
            </div>

            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-4"
                  style={{ background: "var(--muted)", border: "2px solid var(--destructive)" }}>
                  <X className="w-5 h-5" style={{ color: "var(--destructive)" }} />
                </div>
                <p className="font-black uppercase tracking-wide text-sm"
                  style={{ color: "var(--foreground)" }}>
                  Something went wrong
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-5 px-5 py-2.5 text-[10px] font-black tracking-[0.25em] uppercase transition-all hover:opacity-80"
                  style={{ background: "var(--sport-accent)", color: "var(--foreground)" }}
                >
                  Try again
                </button>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${filters.page}-${filters.sort}-${filters.q}`}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  >
                    <ProductsSection
                      products={products}
                      deskCols={3}
                      title={
                        filters.category
                          ? `${categories.find((c) => c.slug === filters.category)?.name} Collection`
                          : "All Products"
                      }
                      desc={filters.q ? `Results for "${filters.q}"` : "Discover our complete collection"}
                      showViewAll={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* ── Pagination ── */}
                {pagination.total > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-1.5 mt-12 pb-6"
                  >
                    {/* Prev */}
                    <button
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                      className="w-9 h-9 flex items-center justify-center text-sm font-bold
                        disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-95"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      ‹
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum = filters.page <= 3
                        ? i + 1
                        : filters.page >= totalPages - 2
                          ? totalPages - 4 + i
                          : filters.page - 2 + i;
                      const isActive = filters.page === pageNum;
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-9 h-9 text-sm font-black transition-all active:scale-95"
                          style={{
                            background: isActive ? "var(--sport-accent)" : "transparent",
                            color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                            border: isActive ? "none" : "1px solid var(--border)",
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next */}
                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(filters.page + 1)}
                      className="w-9 h-9 flex items-center justify-center text-sm font-bold
                        disabled:opacity-25 disabled:pointer-events-none transition-all active:scale-95"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      ›
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile filter sheet ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto overscroll-contain md:hidden"
              style={{ background: "var(--background)" }}
            >
              {/* Sheet header */}
              <div
                className="sticky top-0 px-5 py-4 flex items-center justify-between"
                style={{
                  background: "var(--background)",
                  borderBottom: "3px solid var(--sport-accent)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 fill-current" style={{ color: "var(--sport-accent)" }} />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase"
                    style={{ color: "var(--foreground)" }}>
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black"
                      style={{ background: "var(--sport-accent)", color: "var(--foreground)" }}>
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-black tracking-wide uppercase transition-colors"
                      style={{ color: "var(--sport-accent)" }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ background: "var(--muted)", color: "var(--foreground)" }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <Filters
                  filters={filters}
                  availableFilters={availableFilters}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onArrayFilterChange={handleArrayFilterChange}
                  onPriceChange={handlePriceChange}
                  onToggleFilter={handleToggleFilter}
                  onClearAll={clearAllFilters}
                  getActiveFilterCount={getActiveFilterCount}
                  isMobile={true}
                  onCloseMobile={() => setMobileFiltersOpen(false)}
                />
              </div>

              {/* Apply button */}
              <div
                className="sticky bottom-0 p-4"
                style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
              >
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3.5 text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
                  style={{ background: "var(--sport-accent)", color: "var(--foreground)" }}
                >
                  Show {pagination.total} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sort bottom sheet ── */}
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={filters.sort}
        onChange={(v) => handleFilterChange("sort", v)}
      />
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Mobile bar skeleton */}
      <div className="sticky top-0 z-30 px-4 py-3 md:hidden"
        style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
        <div className="h-10 animate-pulse" style={{ background: "var(--muted)" }} />
        <div className="flex gap-2 mt-2.5">
          <div className="flex-1 h-9 animate-pulse" style={{ background: "var(--muted)" }} />
          <div className="flex-1 h-9 animate-pulse" style={{ background: "var(--muted)" }} />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse"
              style={{ background: "var(--muted)", animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProductsPageComponent />
    </Suspense>
  );
}