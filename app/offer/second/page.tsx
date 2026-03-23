"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X, Check } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  image: string;
  salesPrice: number;
  sizes?: string[];
  colours?: string[];
};

type OfferItem = {
  _id: string;
  name: string;
  image: string;
  salesPrice: number;
  size: string | null;
  color: string | null;
  cartQty: number;
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-4 pt-5 pb-10 safe-area-bottom"
        style={{ animation: "sheetUp 0.35s cubic-bezier(0.32,0.72,0,1) both" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

        {/* Product row */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <div className="relative shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-xl border border-neutral-100"
            />
            {/* FREE badge on thumbnail */}
            <span className="absolute -top-1.5 -left-1.5 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 2px 6px rgba(34,197,94,0.4)" }}>
              FREE
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{product.name}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              <span className="line-through">₹{product.salesPrice}</span>
              {" "}· <span className="text-green-600 font-bold">Free with your order</span>
            </p>
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`relative option-btn px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${size === s
                      ? "text-white border-green-500"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                  style={size === s ? { background: "#22c55e", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" } : {}}
                >
                  {s}
                  {size === s && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-green-500">
                      <Check className="w-2 h-2 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!size && (
              <p className="text-[10px] text-green-500/70 mt-2">Select a size to continue →</p>
            )}
          </div>
        )}

        {/* Colour */}
        {needsColor && (
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Colour</p>
            <div className="flex flex-wrap gap-2">
              {product.colours!.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`option-btn px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${color === c
                      ? "text-white border-green-500"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                  style={color === c ? { background: "#22c55e", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" } : {}}
                >
                  {c}
                </button>
              ))}
            </div>
            {!color && (
              <p className="text-[10px] text-green-500/70 mt-2">Select a colour to continue →</p>
            )}
          </div>
        )}

        {/* Confirm */}
        <button
          onClick={() => canConfirm && onConfirm(size, color)}
          disabled={!canConfirm}
          className="w-full py-3 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2
            transition-all active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
          style={
            canConfirm
              ? { background: "#22c55e", boxShadow: "0 4px 20px rgba(34,197,94,0.35)" }
              : { background: "#d1d5db" }
          }
        >
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          Confirm Free Pair
        </button>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OfferSecondPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [firstPick, setFirstPick]         = useState<OfferItem | null>(null);
  const [selected, setSelected]           = useState<string | null>(null);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [popupProduct, setPopupProduct]   = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const first = localStorage.getItem("offerFirst");
    if (!first) { router.replace("/offer"); return; }
    setFirstPick(JSON.parse(first));

    fetch("/api/product?limit=100")
      .then((r) => r.json())
      .then((json) => { if (json.success) setProducts(json.data); setLoading(false); })
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

  const handleCheckout = () => {
    if (!selected || !firstPick) return;
    const product = products.find((p) => p._id === selected);
    if (!product) return;

    const needsSize  = product.sizes   && product.sizes.length   > 0;
    const needsColor = product.colours && product.colours.length > 0;
    if (needsSize  && !selectedSize)  return;
    if (needsColor && !selectedColor) return;

    const secondPick: OfferItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      salesPrice: product.salesPrice,
      size: selectedSize,
      color: selectedColor,
      cartQty: 1,
    };

    localStorage.setItem("offerCart", JSON.stringify([firstPick, secondPick]));
    router.push("/checkout?offer=true");
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
        @keyframes pulse-ring-green {
          0%   { box-shadow:0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow:0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow:0 0 0 0 rgba(34,197,94,0); }
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

        .selected-card { animation: pulse-ring-green 1.6s ease infinite; }

        .shimmer {
          background: linear-gradient(90deg,#1c1917 25%,#292524 50%,#1c1917 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .option-btn { transition: all 0.15s ease; }
        .option-btn:hover { transform: scale(1.06); }
        .free-badge {
          background: linear-gradient(135deg,#22c55e,#16a34a);
          box-shadow: 0 2px 8px rgba(34,197,94,0.4);
        }
      `}</style>

      <div className="offer-root min-h-screen bg-[#0c0a09]">

        {/* ── Banner ── */}
        <div
          className="relative overflow-hidden border-b border-white/5"
          style={{ background: "radial-gradient(ellipse at 70% 0%, #002a10 0%, #0c0a09 60%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 100%, #001a0a 0%, transparent 55%)" }}
          />

          <div className="relative max-w-6xl mx-auto px-5 py-8 lg:py-10">
            <button
              onClick={() => router.push("/offer")}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change first pair
            </button>

            {/* Progress steps */}
            <div className="flex items-center gap-2 sm:gap-3 mb-5 flex-wrap">
              {[
                { n: "✓", label: "First Pair",     done: true,  active: false },
                { n: "2", label: "Pick Free Pair",  done: false, active: true  },
                { n: "3", label: "Checkout",        done: false, active: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex items-center gap-2 text-[10px] font-bold px-3.5 py-1.5 rounded-full
                      ${step.done
                        ? "bg-white/5 text-white/30 border border-white/8"
                        : step.active
                          ? "border text-green-400"
                          : "bg-white/5 text-white/20 border border-white/8"}`}
                    style={step.active ? { background: "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.3)" } : {}}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black
                        ${step.done || step.active ? "bg-green-500 text-white" : "bg-white/10 text-white/25"}`}
                    >
                      {step.n}
                    </span>
                    {step.label}
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-white/12 hidden sm:block" />}
                </div>
              ))}
            </div>

            {/* Title */}
            <h1 className="offer-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-1.5 leading-tight">
              Pick your{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #4ade80, #22c55e)" }}
              >
                free pair
              </span>
            </h1>
            <p className="text-white/35 text-xs">The second one's on us — choose anything you like</p>
          </div>
        </div>

        {/* ── First pick preview strip ── */}
        {firstPick && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="flex items-center gap-3 border border-white/8 rounded-xl px-3.5 py-2.5"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="w-4.5 h-4.5 bg-green-500 rounded-full flex items-center justify-center shrink-0"
                style={{ width: "18px", height: "18px" }}>
                <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                  <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <img src={firstPick.image} alt={firstPick.name}
                className="w-8 h-8 object-cover rounded-lg border border-white/10 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-medium truncate">{firstPick.name}</p>
                <div className="flex gap-3 mt-0.5">
                  {firstPick.size  && <span className="text-white/30 text-[10px]">Size: {firstPick.size}</span>}
                  {firstPick.color && <span className="text-white/30 text-[10px]">{firstPick.color}</span>}
                </div>
              </div>
              <span className="text-white/20 text-[10px] shrink-0">Pair 1</span>
            </div>
          </div>
        )}

        {/* ── Product Grid ── */}
        <div className="max-w-6xl mx-auto px-4 py-5 pb-28">
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.12em] mb-4">
            {loading ? "Loading…" : `${products.length} products · all FREE with your first pair`}
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
                        ? "selected-card ring-2 ring-green-500 scale-[0.97]"
                        : "hover:scale-[0.97] hover:ring-1 hover:ring-white/15"}`}
                  >
                    <div className="aspect-square overflow-hidden bg-[#1c1917]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* FREE badge */}
                    <div className="free-badge absolute top-2 left-2 text-white text-[9px] font-black
                      px-2 py-0.5 rounded-full tracking-wider uppercase">
                      FREE
                    </div>

                    {/* Selected overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(34,197,94,0.15)" }}>
                        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/50">
                          <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
                            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Name + price */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2.5 pt-5">
                      <p className="text-white text-[10px] font-medium truncate leading-snug">{product.name}</p>
                      <p className="text-[9px] mt-0.5 line-through" style={{ color: "rgba(74,222,128,0.5)" }}>
                        ₹{product.salesPrice}
                      </p>
                      {isSelected && (selectedSize || selectedColor) && (
                        <p className="text-[9px] font-semibold mt-0.5 text-green-400">
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
                  <><span className="text-green-400 mr-1">✓</span>Both pairs ready!</>
                ) : (
                  "Tap a product above"
                )}
              </p>
              <p className="text-white/20 text-[10px] mt-0.5">
                Total:{" "}
                <span className="font-semibold text-green-400">₹1,499</span>
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!canProceed}
              className="flex items-center gap-2 text-white font-semibold text-xs px-5 py-2.5 rounded-xl
                disabled:opacity-20 disabled:cursor-not-allowed
                transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
              style={{
                background: "#22c55e",
                boxShadow: canProceed ? "0 4px 20px rgba(34,197,94,0.35)" : "none",
              }}
            >
              Go to Checkout
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