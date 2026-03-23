"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, X, Check } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  image: string;
  salesPrice: number;
  sizes?: string[];
  colours?: string[];
};

// ─── Variant Popup ────────────────────────────────────────────────────────────
function VariantPopup({
  product,
  onConfirm,
  onClose,
}: {
  product: Product;
  onConfirm: (size: string | null, color: string | null) => void;
  onClose: () => void;
}) {
  const [size, setSize]   = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const needsSize  = product.sizes   && product.sizes.length   > 0;
  const needsColor = product.colours && product.colours.length > 0;
  const canConfirm = (!needsSize || size) && (!needsColor || color);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-4 pt-5 pb-10 safe-area-bottom"
        style={{ animation: "sheetUp 0.35s cubic-bezier(0.32,0.72,0,1) both" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

        {/* Product row */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-14 shrink-0 object-cover rounded-xl border border-neutral-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{product.name}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">₹{product.salesPrice} · Customise your pair</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>

        {/* Size */}
        {needsSize && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2.5">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`relative option-btn px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${size === s
                      ? "text-white border-[#0169ff] shadow-md"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                  style={size === s ? { background: "#0169ff", boxShadow: "0 4px 12px rgba(1,105,255,0.3)" } : {}}
                >
                  {s}
                  {size === s && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: "#0169ff" }}>
                      <Check className="w-2 h-2 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!size && (
              <p className="text-[10px] text-blue-400/70 mt-2">Select a size to continue →</p>
            )}
          </div>
        )}

        {/* Colour */}
        {needsColor && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2.5">Colour</p>
            <div className="flex flex-wrap gap-2">
              {product.colours!.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`option-btn px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${color === c
                      ? "text-white border-[#0169ff]"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                  style={color === c ? { background: "#0169ff", boxShadow: "0 4px 12px rgba(1,105,255,0.3)" } : {}}
                >
                  {c}
                </button>
              ))}
            </div>
            {!color && (
              <p className="text-[10px] text-blue-400/70 mt-2">Select a colour to continue →</p>
            )}
          </div>
        )}

        {/* Confirm */}
        <button
          onClick={() => canConfirm && onConfirm(size, color)}
          disabled={!canConfirm}
          className="w-full py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2
            transition-all active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
          style={canConfirm ? { background: "#0169ff", boxShadow: "0 4px 20px rgba(1,105,255,0.35)" } : { background: "#d1d5db" }}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          Confirm Selection
        </button>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OfferPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [selected, setSelected]           = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [popupProduct, setPopupProduct]   = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("offerCart");
    localStorage.removeItem("offerFirst");
    fetch("/api/product?limit=100")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProducts(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = (product: Product) => {
    const hasVariants =
      (product.sizes   && product.sizes.length   > 0) ||
      (product.colours && product.colours.length > 0);

    setSelected(product._id);
    setSelectedSize(null);
    setSelectedColor(null);

    if (hasVariants) setPopupProduct(product);
    else             setPopupProduct(null);
  };

  const handleVariantConfirm = (size: string | null, color: string | null) => {
    setSelectedSize(size);
    setSelectedColor(color);
    setPopupProduct(null);
  };

  const handleNext = () => {
    if (!selected) return;
    const product = products.find((p) => p._id === selected);
    if (!product) return;
    const needsSize  = product.sizes   && product.sizes.length   > 0;
    const needsColor = product.colours && product.colours.length > 0;
    if (needsSize  && !selectedSize)  return;
    if (needsColor && !selectedColor) return;

    localStorage.setItem("offerFirst", JSON.stringify({
      _id: product._id,
      name: product.name,
      image: product.image,
      salesPrice: product.salesPrice,
      size: selectedSize,
      color: selectedColor,
      cartQty: 1,
    }));
    router.push("/offer/second");
  };

  const selectedProduct = products.find((p) => p._id === selected);
  const needsSize  = selectedProduct?.sizes   && selectedProduct.sizes.length   > 0;
  const needsColor = selectedProduct?.colours && selectedProduct.colours.length > 0;
  const canProceed = selected &&
    (!needsSize  || selectedSize)  &&
    (!needsColor || selectedColor);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .offer-root  { font-family: 'DM Sans', sans-serif; }
        .offer-title { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(1,105,255,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(1,105,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(1,105,255,0); }
        }
        @keyframes shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }
        @keyframes sheetUp {
          from { transform:translateY(100%); }
          to   { transform:translateY(0); }
        }

        .product-card { animation: fadeUp 0.35s ease both; }
        .product-card:nth-child(1) { animation-delay:0.04s }
        .product-card:nth-child(2) { animation-delay:0.08s }
        .product-card:nth-child(3) { animation-delay:0.12s }
        .product-card:nth-child(4) { animation-delay:0.16s }
        .product-card:nth-child(5) { animation-delay:0.20s }
        .product-card:nth-child(6) { animation-delay:0.24s }
        .product-card:nth-child(7) { animation-delay:0.28s }
        .product-card:nth-child(8) { animation-delay:0.32s }

        .selected-card { animation: pulse-ring 1.6s ease infinite; }

        .shimmer {
          background: linear-gradient(90deg,#1c1917 25%,#292524 50%,#1c1917 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .option-btn { transition: all 0.15s ease; }
        .option-btn:hover { transform: scale(1.06); }
      `}</style>

      <div className="offer-root min-h-screen bg-[#0c0a09]">

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden border-b border-white/5"
          style={{ background: "radial-gradient(ellipse at 30% 0%, #001a4d 0%, #0c0a09 60%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 100%, #000d26 0%, transparent 60%)" }}
          />

          <div className="relative max-w-6xl mx-auto px-5 py-8 lg:py-10 text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 border rounded-full px-3.5 py-1.5 mb-5"
              style={{ background: "rgba(1,105,255,0.1)", borderColor: "rgba(1,105,255,0.25)" }}
            >
              <Zap className="w-3 h-3 fill-current" style={{ color: "#0169ff" }} />
              <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: "#0169ff" }}>
                Limited Time Offer
              </span>
            </div>

            {/* Title — slightly smaller than original */}
            <h1 className="offer-title text-xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-[1.05]">
              Buy One,{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #0169ff, #93c5fd, #0169ff)" }}
              >
                Get One Free
              </span>
            </h1>
            <p className="text-white/40 text-sm mb-6">
              Any 2 pairs for just{" "}
              <span className="text-white font-bold">₹1,499</span>
            </p>

            {/* Progress steps */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {[
                { n: "1", label: "Pick First Pair", active: true  },
                { n: "2", label: "Pick Free Pair",  active: false },
                { n: "3", label: "Checkout",        active: false },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-bold px-3.5 py-1.5 rounded-full transition-all
                      ${step.active ? "text-white" : "text-white/25 border border-white/8"}`}
                    style={
                      step.active
                        ? { background: "#0169ff", boxShadow: "0 4px 16px rgba(1,105,255,0.35)" }
                        : { background: "rgba(255,255,255,0.05)" }
                    }
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black
                        ${step.active ? "bg-white" : "bg-white/10 text-white/30"}`}
                      style={step.active ? { color: "#0169ff" } : {}}
                    >
                      {step.n}
                    </span>
                    {step.label}
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-white/15 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-6xl mx-auto px-4 py-6 pb-28">
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.12em] mb-4">
            {loading ? "Loading products…" : `${products.length} products · tap to select`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-square shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map((product) => {
                const isSelected = selected === product._id;
                return (
                  <button
                    key={product._id}
                    onClick={() => handleSelect(product)}
                    className={`product-card group relative rounded-2xl overflow-hidden text-left
                      transition-all duration-200 focus:outline-none
                      ${isSelected
                        ? "selected-card scale-[0.97]"
                        : "hover:scale-[0.97] hover:ring-1 hover:ring-white/15"}`}
                    style={isSelected ? { outline: "2px solid #0169ff" } : {}}
                  >
                    <div className="aspect-square overflow-hidden bg-[#1c1917]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Selected overlay */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(1,105,255,0.15)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: "#0169ff", boxShadow: "0 4px 20px rgba(1,105,255,0.5)" }}
                        >
                          <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
                            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Name + price */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2.5 pt-5">
                      <p className="text-white text-[10px] font-medium truncate leading-snug">{product.name}</p>
                      <p className="text-white/35 text-[9px] mt-0.5">₹{product.salesPrice}</p>
                      {isSelected && (selectedSize || selectedColor) && (
                        <p className="text-[9px] font-semibold mt-0.5" style={{ color: "#93c5fd" }}>
                          {[selectedSize, selectedColor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sticky bottom CTA ── */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0c0a09]/95 backdrop-blur-md border-t border-white/5 px-4 py-3.5 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className={`text-xs font-medium transition-colors ${selected ? "text-white" : "text-white/25"}`}>
                {selected ? (
                  <>
                    <span style={{ color: "#0169ff" }} className="mr-1">✓</span>
                    First pair selected
                  </>
                ) : (
                  "Tap a product above"
                )}
              </p>
              <p className="text-white/20 text-[10px] mt-0.5">
                Both pairs:{" "}
                <span className="font-semibold" style={{ color: "#0169ff" }}>₹1,499 total</span>
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 text-white font-semibold text-xs px-5 py-2.5 rounded-xl
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
              style={{
                background: "#0169ff",
                boxShadow: canProceed ? "0 4px 20px rgba(1,105,255,0.35)" : "none",
              }}
            >
              Next: Free Pair
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Variant popup ── */}
        {popupProduct && (
          <VariantPopup
            product={popupProduct}
            onConfirm={handleVariantConfirm}
            onClose={() => {
              setPopupProduct(null);
              setSelected(null);
            }}
          />
        )}

      </div>
    </>
  );
}