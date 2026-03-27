"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, X, Check, ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  image: string;
  images?: Array<{ _type: string; url?: string; videoUrl?: string; poster?: string }>;
  salesPrice: number;
  sizes?: string[];
  colours?: string[];
  colors?: string[];
  brand?: { name: string; slug: string; logo?: string } | string;
};

// Normalise: API may return "colors" or "colours"
const getColors = (p: Product): string[] => p.colours ?? p.colors ?? [];


type OfferItem = {
  _id: string; name: string; image: string; salesPrice: number;
  size: string | null; color: string | null; cartQty: number;
};

// ─── Brand Filter Bar ─────────────────────────────────────────────────────────
function BrandFilterBar({ brands, active, onChange }: {
  brands: string[]; active: string; onChange: (b: string) => void;
}) {
  if (brands.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
      {["All", ...brands].map((b) => {
        const isActive = b === active;
        return (
          <button key={b} onClick={() => onChange(b)}
            className="shrink-0 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-150 whitespace-nowrap rounded-full"
            style={{
              background: isActive ? "#22c55e" : "rgba(255,255,255,0.06)",
              color: isActive ? "white" : "rgba(255,255,255,0.4)",
              border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isActive ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
            }}>
            {b}
          </button>
        );
      })}
    </div>
  );
}

// ─── Sneak Peek Sheet ─────────────────────────────────────────────────────────
function SneakPeekSheet({ product, onProceed, onClose }: {
  product: Product;
  onProceed: (color: string | null) => void;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const allImages: string[] = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((m) => {
      if (m._type === "image" && m.url) allImages.push(m.url);
      else if (m._type === "video" && m.poster) allImages.push(m.poster);
    });
  }
  if (allImages.length === 0) allImages.push(product.image);

  const hasColors = getColors(product).length > 0;
  const canProceed = !hasColors || selectedColor;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white overflow-y-auto"
        style={{ borderRadius: "24px 24px 0 0", animation: "sheetUp 0.38s cubic-bezier(0.32,0.72,0,1) both", maxHeight: "92dvh" }}>
        <div className="flex justify-center pt-3 pb-0 sticky top-0 bg-white z-10 border-b border-neutral-50">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>
        <button onClick={onClose}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center z-20 hover:bg-neutral-200 transition-colors">
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Image gallery */}
        <div className="relative mx-4 mt-4 overflow-hidden bg-neutral-100" style={{ aspectRatio: "1/1", borderRadius: "16px" }}>
          <img key={activeImg} src={allImages[activeImg]} alt={product.name}
            className="w-full h-full object-cover" style={{ animation: "fadeIn 0.18s ease both" }} />
          {/* FREE badge */}
          <div className="absolute top-3 left-3 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 2px 8px rgba(34,197,94,0.4)" }}>
            FREE
          </div>
          {allImages.length > 1 && (
            <>
              <button onClick={() => setActiveImg((p) => (p - 1 + allImages.length) % allImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
                <ChevronLeft className="w-4 h-4 text-neutral-700" />
              </button>
              <button onClick={() => setActiveImg((p) => (p + 1) % allImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
                <ChevronRight className="w-4 h-4 text-neutral-700" />
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className="transition-all duration-200"
                    style={{ width: i === activeImg ? "18px" : "6px", height: "6px", borderRadius: "3px",
                      background: i === activeImg ? "#22c55e" : "rgba(255,255,255,0.6)" }} />
                ))}
              </div>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex gap-2 px-4 mt-3 overflow-x-auto scrollbar-hide">
            {allImages.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className="shrink-0 w-14 h-14 overflow-hidden transition-all duration-150"
                style={{ borderRadius: "10px", outline: i === activeImg ? "2px solid #22c55e" : "2px solid transparent", opacity: i === activeImg ? 1 : 0.5 }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="px-4 mt-4">
          <p className="text-[13px] font-semibold text-neutral-900 leading-snug">{product.name}</p>
          <p className="text-[11px] mt-0.5">
            <span className="line-through text-neutral-400">₹{product.salesPrice}</span>{" "}
            <span className="text-green-600 font-bold">Free</span>
          </p>
        </div>

        {hasColors && (
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Colour</p>
              {!selectedColor && <p className="text-[10px] text-green-500/70">Required →</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {getColors(product).map((c) => (
                <button key={c} onClick={() => setSelectedColor(c)}
                  className="px-3.5 py-1.5 text-xs font-medium border transition-all duration-150 hover:scale-105"
                  style={{
                    borderRadius: "8px",
                    background: selectedColor === c ? "#22c55e" : "white",
                    color: selectedColor === c ? "white" : "#4b5563",
                    borderColor: selectedColor === c ? "#22c55e" : "#e5e7eb",
                    boxShadow: selectedColor === c ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pb-8 pt-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 text-xs font-semibold text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors"
            style={{ borderRadius: "12px" }}>
            Cancel
          </button>
          <button onClick={() => canProceed && onProceed(selectedColor)} disabled={!canProceed}
            className="flex-[2] py-3 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              borderRadius: "12px",
              background: canProceed ? "#22c55e" : "#d1d5db",
              boxShadow: canProceed ? "0 4px 20px rgba(34,197,94,0.35)" : "none",
            }}>
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            Select free pair
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Size Popup ───────────────────────────────────────────────────────────────
function SizePopup({ product, preselectedColor, onConfirm, onClose }: {
  product: Product; preselectedColor: string | null;
  onConfirm: (size: string | null, color: string | null) => void;
  onClose: () => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const needsSize = product.sizes && product.sizes.length > 0;
  const canConfirm = !needsSize || size;

  useEffect(() => {
    if (!needsSize) { onConfirm(null, preselectedColor); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, []);

  if (!needsSize) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 pt-5 pb-10"
        style={{ borderRadius: "24px 24px 0 0", animation: "sheetUp 0.35s cubic-bezier(0.32,0.72,0,1) both" }}>
        <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
          <div className="relative shrink-0">
            <img src={product.image} alt={product.name}
              className="w-12 h-12 object-cover border border-neutral-100" style={{ borderRadius: "10px" }} />
            <span className="absolute -top-1 -left-1 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}>FREE</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-900 truncate">{product.name}</p>
            {preselectedColor && (
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Colour: <span className="font-medium text-green-600">{preselectedColor}</span>
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
            <X className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2.5">Select Size</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {product.sizes!.map((s) => (
            <button key={s} onClick={() => setSize(s)}
              className="relative px-3.5 py-1.5 text-xs font-medium border transition-all hover:scale-105"
              style={{
                borderRadius: "8px",
                background: size === s ? "#22c55e" : "white",
                color: size === s ? "white" : "#4b5563",
                borderColor: size === s ? "#22c55e" : "#e5e7eb",
                boxShadow: size === s ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
              }}>
              {s}
              {size === s && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-green-500">
                  <Check className="w-2 h-2 text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
        {!size && <p className="text-[10px] mb-4 text-green-500/70">Select a size to continue →</p>}

        <button onClick={() => canConfirm && onConfirm(size, preselectedColor)} disabled={!canConfirm}
          className="w-full py-3 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            borderRadius: "12px",
            background: canConfirm ? "#22c55e" : "#d1d5db",
            boxShadow: canConfirm ? "0 4px 20px rgba(34,197,94,0.35)" : "none",
          }}>
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
  const [sneakProduct, setSneakProduct]   = useState<Product | null>(null);
  const [sizeProduct, setSizeProduct]     = useState<Product | null>(null);
  const [pendingColor, setPendingColor]   = useState<string | null>(null);
  const [activeBrand, setActiveBrand]     = useState("All");
  const router = useRouter();

  useEffect(() => {
    const first = localStorage.getItem("offerFirst");
    if (!first) { router.replace("/offer"); return; }
    setFirstPick(JSON.parse(first));
    fetch("/api/product?buyOneGetOne=true&limit=100")
      .then((r) => r.json())
      .then((json) => { if (json.success) setProducts(json.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const brands = Array.from(new Set(
    products.map((p) => typeof p.brand === "object" ? p.brand?.name : p.brand as string).filter(Boolean)
  )).sort() as string[];

  const filteredProducts = activeBrand === "All"
    ? products
    : products.filter((p) => (typeof p.brand === "object" ? p.brand?.name : p.brand) === activeBrand);

  const handleCardTap = (product: Product) => {
    setSelected(product._id);
    setSelectedSize(null);
    setSelectedColor(null);
    setSneakProduct(product);
  };

  const handleSneakPeekProceed = (color: string | null) => {
    setSneakProduct(null);
    const product = products.find((p) => p._id === selected);
    if (!product) return;
    const needsSize = product.sizes && product.sizes.length > 0;
    if (needsSize) { setPendingColor(color); setSizeProduct(product); }
    else { setSelectedColor(color); setSelectedSize(null); }
  };

  const handleSizeConfirm = (size: string | null, color: string | null) => {
    setSelectedSize(size); setSelectedColor(color);
    setSizeProduct(null); setPendingColor(null);
  };

  const handleCheckout = () => {
    if (!selected || !firstPick) return;
    const product = products.find((p) => p._id === selected);
    if (!product) return;
    if ((product.sizes?.length ?? 0) > 0 && !selectedSize)  return;
    if (getColors(product).length > 0 && !selectedColor) return;
    const secondPick: OfferItem = {
      _id: product._id, name: product.name, image: product.image,
      salesPrice: product.salesPrice, size: selectedSize, color: selectedColor, cartQty: 1,
    };
    localStorage.setItem("offerCart", JSON.stringify([firstPick, secondPick]));
    router.push("/checkout?offer=true");
  };

  const selectedProduct = products.find((p) => p._id === selected);
  const canProceed = selected &&
    (!(selectedProduct?.sizes?.length ?? 0) || selectedSize) &&
    (!getColors(selectedProduct ?? {} as Product).length || selectedColor);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .offer-root{font-family:'DM Sans',sans-serif}.offer-title{font-family:'Syne',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse-ring-green{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5)}70%{box-shadow:0 0 0 12px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .product-card{animation:fadeUp 0.35s ease both}
        .product-card:nth-child(1){animation-delay:.04s}.product-card:nth-child(2){animation-delay:.08s}
        .product-card:nth-child(3){animation-delay:.12s}.product-card:nth-child(4){animation-delay:.16s}
        .product-card:nth-child(5){animation-delay:.20s}.product-card:nth-child(6){animation-delay:.24s}
        .product-card:nth-child(7){animation-delay:.28s}.product-card:nth-child(8){animation-delay:.32s}
        .selected-card{animation:pulse-ring-green 1.6s ease infinite}
        .shimmer{background:linear-gradient(90deg,#1c1917 25%,#292524 50%,#1c1917 75%);background-size:200% 100%;animation:shimmer 1.4s infinite}
        .free-badge{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 2px 8px rgba(34,197,94,0.4)}
        .scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      <div className="offer-root min-h-screen bg-[#0c0a09]">

        {/* Banner */}
        <div className="relative overflow-hidden border-b border-white/5"
          style={{ background: "radial-gradient(ellipse at 70% 0%, #002a10 0%, #0c0a09 60%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 100%, #001a0a 0%, transparent 55%)" }} />
          <div className="relative max-w-6xl mx-auto px-5 py-8 lg:py-10">
            <button onClick={() => router.push("/offer")}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs mb-5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Change first pair
            </button>
            <div className="flex items-center gap-2 sm:gap-3 mb-5 flex-wrap">
              {[
                {n:"✓",label:"First Pair",done:true,active:false},
                {n:"2",label:"Pick Free Pair",done:false,active:true},
                {n:"3",label:"Checkout",done:false,active:false},
              ].map((step,i)=>(
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold px-3.5 py-1.5 rounded-full"
                    style={step.active?{background:"rgba(34,197,94,0.12)",borderColor:"rgba(34,197,94,0.3)",border:"1px solid",color:"#4ade80"}
                      :{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.25)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={(step.done||step.active)?{background:"#22c55e",color:"white"}:{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.25)"}}>
                      {step.n}
                    </span>
                    {step.label}
                  </div>
                  {i<2&&<div className="w-4 h-px bg-white/12 hidden sm:block"/>}
                </div>
              ))}
            </div>
            <h1 className="offer-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-1.5 leading-tight">
              Pick your{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #4ade80, #22c55e)" }}>free pair</span>
            </h1>
            <p className="text-white/35 text-xs">The second one's on us — choose anything you like</p>
          </div>
        </div>

        {/* First pick strip */}
        {firstPick && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="flex items-center gap-3 border border-white/8 rounded-xl px-3.5 py-2.5"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="w-[18px] h-[18px] bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                  <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <img src={firstPick.image} alt={firstPick.name}
                className="w-8 h-8 object-cover rounded-lg border border-white/10 shrink-0"/>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-medium truncate">{firstPick.name}</p>
                <div className="flex gap-3 mt-0.5">
                  {firstPick.size&&<span className="text-white/30 text-[10px]">Size: {firstPick.size}</span>}
                  {firstPick.color&&<span className="text-white/30 text-[10px]">{firstPick.color}</span>}
                </div>
              </div>
              <span className="text-white/20 text-[10px] shrink-0">Pair 1</span>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-5 pb-28">
          {!loading && brands.length > 0 && (
            <div className="mb-5"><BrandFilterBar brands={brands} active={activeBrand} onChange={setActiveBrand}/></div>
          )}
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.12em] mb-4">
            {loading?"Loading…":`${filteredProducts.length} products${activeBrand!=="All"?` · ${activeBrand}`:""} · all FREE`}
          </p>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({length:10}).map((_,i)=>(<div key={i} className="rounded-2xl overflow-hidden aspect-square shimmer"/>))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => {
                const isSelected = selected === product._id;
                const brandName = typeof product.brand==="object"?product.brand?.name:product.brand;
                const imgCount = product.images?.filter(m=>m._type==="image"||m._type==="video").length??0;
                return (
                  <button key={product._id} onClick={()=>handleCardTap(product)}
                    className={`product-card group relative rounded-2xl overflow-hidden text-left transition-all duration-200 focus:outline-none
                      ${isSelected?"selected-card ring-2 ring-green-500 scale-[0.97]":"hover:scale-[0.97] hover:ring-1 hover:ring-white/15"}`}>
                    <div className="aspect-square overflow-hidden bg-[#1c1917]">
                      <img src={product.image} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    </div>
                    {/* FREE badge */}
                    <div className="free-badge absolute top-2 left-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">FREE</div>
                    {/* Photo count */}
                    {imgCount > 1 && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/55 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                        <span className="text-[8px] text-white/70 font-medium">{imgCount}</span>
                        <svg className="w-2.5 h-2.5 text-white/60" viewBox="0 0 12 12" fill="none">
                          <rect x="1" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M4 3V2a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{background:"rgba(34,197,94,0.15)"}}>
                        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/50">
                          <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4">
                            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-2.5 pt-5">
                      {brandName&&<p className="text-[8px] font-bold uppercase tracking-widest mb-0.5" style={{color:"rgba(34,197,94,0.8)"}}>{brandName}</p>}
                      <p className="text-white text-[10px] font-medium truncate leading-snug">{product.name}</p>
                      <p className="text-[9px] mt-0.5 line-through" style={{color:"rgba(74,222,128,0.5)"}}>₹{product.salesPrice}</p>
                      {isSelected&&(selectedSize||selectedColor)&&(
                        <p className="text-[9px] font-semibold mt-0.5 text-green-400">
                          {[selectedSize,selectedColor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0c0a09]/95 backdrop-blur-md border-t border-white/5 px-4 py-3.5 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className={`text-xs font-medium transition-colors ${selected?"text-white":"text-white/25"}`}>
                {selected?<><span className="text-green-400 mr-1">✓</span>Both pairs ready!</>:"Tap a product above"}
              </p>
              <p className="text-white/20 text-[10px] mt-0.5">Total: <span className="font-semibold text-green-400">₹1,499</span></p>
            </div>
            <button onClick={handleCheckout} disabled={!canProceed}
              className="flex items-center gap-2 text-white font-semibold text-xs px-5 py-2.5 rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.97] whitespace-nowrap"
              style={{background:"#22c55e",boxShadow:canProceed?"0 4px 20px rgba(34,197,94,0.35)":"none"}}>
              Go to Checkout <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </div>
        </div>

        {sneakProduct && (
          <SneakPeekSheet product={sneakProduct} onProceed={handleSneakPeekProceed}
            onClose={()=>{setSneakProduct(null);setSelected(null);}}/>
        )}
        {sizeProduct && (
          <SizePopup product={sizeProduct} preselectedColor={pendingColor}
            onConfirm={handleSizeConfirm}
            onClose={()=>{setSizeProduct(null);setPendingColor(null);setSelected(null);}}/>
        )}
      </div>
    </>
  );
}