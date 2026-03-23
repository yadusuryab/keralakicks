// app/checkout/page.tsx
"use client";

import { AlertCircle, ChevronDown, ChevronUp, Lock, Shield, Truck, MessageCircle, Tag } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validations";
import Link from "next/link";

type CartItem = {
  _id: string;
  name: string;
  salesPrice: number;
  cartQty: number;
  size?: string | null;
  color?: string | null;
  image: string;
};

type FormData = z.infer<typeof checkoutSchema>;

function Field({
  label, id, error, children,
}: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[#6b7280]">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full h-10 px-3 text-sm border rounded-md bg-white outline-none
   transition-all duration-150 text-[#111827] placeholder:text-[#d1d5db]
   focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10
   ${err ? "border-red-400 bg-red-50/30" : "border-[#e5e7eb] hover:border-[#9ca3af]"}`;

const OFFER_PRICE = 1499;
// Add NEXT_PUBLIC_WHATSAPP_NUMBER to your .env.local (country code + number, no +)
// e.g. NEXT_PUBLIC_WHATSAPP_NUMBER=919400123456
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_PHONE ?? "";

function CheckoutInner() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOffer, setIsOffer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const offerFlag = searchParams.get("offer") === "true";
    setIsOffer(offerFlag);

    if (offerFlag) {
      const offerCart = JSON.parse(localStorage.getItem("offerCart") || "[]");
      setCart(offerCart);
    } else {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }
  }, [searchParams]);

  // ── Pricing ──
  const rawSubtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const subtotal    = isOffer ? OFFER_PRICE : rawSubtotal;
  const shipping    = isOffer ? 0 : paymentMethod === "online" ? 0 : 100;
  const total       = subtotal + shipping;

  const deliveryTime = isOffer || paymentMethod === "online"
    ? "Kerala: 2–3 days · Outside Kerala: 6–7 days"
    : "Delivery in 7 days";

  // ── Build WhatsApp message ──
  const buildMessage = (data: FormData) => {
    const lines: string[] = [];
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "kerala_kicks";

    lines.push(`🛍️ *New Order — ${appName}*`);
    lines.push(`━━━━━━━━━━━━━━━━━`);

    if (isOffer) {
      lines.push(`🎁 *BOGO OFFER — Buy 1 Get 1 Free*`);
    }

    lines.push(`\n📦 *Products:*`);
    cart.forEach((item, i) => {
      const label = isOffer && i === 1 ? " (FREE)" : "";
      lines.push(`${i + 1}. ${item.name}${label} × ${item.cartQty}`);
      if (item.size)  lines.push(`   Size: ${item.size}`);
      if (item.color) lines.push(`   Colour: ${item.color}`);
      if (!isOffer)   lines.push(`   ₹${item.salesPrice * item.cartQty}`);
    });

    lines.push(`\n💰 *Order Total:*`);
    if (isOffer) {
      lines.push(`Offer price: ₹1,499 (Free shipping)`);
    } else {
      lines.push(`Subtotal: ₹${rawSubtotal}`);
      if (shipping > 0) lines.push(`Shipping/COD: ₹${shipping}`);
      lines.push(`*Total: ₹${total}*`);
      lines.push(`Payment: ${paymentMethod === "online" ? "Online (UPI)" : "Cash on Delivery"}`);
    }

    lines.push(`\n👤 *Customer:*`);
    lines.push(`Name: ${data.customerName}`);
    lines.push(`Phone: ${data.phoneNumber}`);
    if (data.alternatePhone) lines.push(`Alt: ${data.alternatePhone}`);
    if (data.instagramId)    lines.push(`Instagram: ${data.instagramId}`);

    lines.push(`\n📍 *Address:*`);
    lines.push(data.address);
    lines.push(`${data.district}, ${data.state} — ${data.pincode}`);
    if (data.landmark) lines.push(`Landmark: ${data.landmark}`);

    lines.push(`\n━━━━━━━━━━━━━━━━━`);

    return encodeURIComponent(lines.join("\n"));
  };

  const handleOrder = (data: FormData) => {
    const msg = buildMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    // Clean up localStorage
    localStorage.removeItem(isOffer ? "offerCart" : "cart");
    if (isOffer) localStorage.removeItem("offerFirst");

    window.open(url, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="w-7 h-7">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#111827] mb-1">Your cart is empty</h2>
          <p className="text-sm text-[#6b7280] mb-5">Add some products before checking out</p>
          <button onClick={() => router.push("/products")}
            className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .checkout-root { font-family: 'DM Sans', sans-serif; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.25s ease both; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="checkout-root min-h-screen bg-[#f3f4f6]">

        {/* ── Top bar ── */}
        <div className="bg-white border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1e3a5f] rounded flex items-center justify-center">
              <span className="text-white text-[9px] font-bold tracking-wider">W</span>
            </div>
            <span className="text-xs font-semibold text-[#374151]">
              {process.env.NEXT_PUBLIC_APP_NAME || "kerala_kicks"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isOffer && (
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                <Tag className="w-3 h-3 text-orange-500" />
                <span className="text-[11px] font-semibold text-orange-600">BOGO — ₹1,499</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#22c55e]" />
              <span className="text-[11px] font-medium text-[#6b7280]">Secure Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto lg:flex lg:min-h-[calc(100vh-45px)]">

          {/* ══ LEFT — dark order summary ══ */}
          <div className="bg-primary lg:w-[380px] lg:min-h-full lg:shrink-0">

            {/* Mobile toggle */}
            <button
              className="lg:hidden w-full flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] text-white"
              onClick={() => setSummaryOpen(o => !o)}
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-white/50">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span className="text-sm font-medium">
                  {summaryOpen ? "Hide" : "Show"} order summary
                </span>
                {summaryOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
              </div>
              <span className="text-base font-semibold">₹{total}</span>
            </button>

            <div className={`${summaryOpen ? "slide-down" : "hidden"} lg:block p-5 lg:p-8 lg:sticky lg:top-0`}>

              {/* Offer badge */}
              {isOffer && (
                <div className="mb-5 flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3.5 py-3">
                  <Tag className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <p className="text-orange-400 text-xs font-bold">Buy 1 Get 1 Free</p>
                    <p className="text-white/35 text-[11px] mt-0.5">Special offer price applied</p>
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img src={item.image} alt={item.name}
                        className="w-14 h-14 object-cover rounded-md border border-white/10" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#475569]
                        text-white text-[10px] font-semibold flex items-center justify-center">
                        {item.cartQty}
                      </span>
                      {/* FREE badge on second offer item */}
                      {isOffer && idx === 1 && (
                        <span className="absolute -bottom-1.5 -left-1.5 bg-orange-500 text-white
                          text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none">
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/90 truncate leading-snug">{item.name}</p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {item.size  && <span className="text-[10px] text-white/40 bg-white/[0.07] px-2 py-0.5 rounded">Size: {item.size}</span>}
                        {item.color && <span className="text-[10px] text-white/40 bg-white/[0.07] px-2 py-0.5 rounded">{item.color}</span>}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {isOffer && idx === 1 ? (
                        <>
                          <span className="text-[11px] text-white/25 line-through block">₹{item.salesPrice}</span>
                          <span className="text-xs font-bold text-orange-400">FREE</span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-white/85">₹{item.salesPrice * item.cartQty}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.08] mb-4" />

              {/* Totals */}
              <div className="space-y-2.5 text-sm">
                {isOffer ? (
                  <>
                    <div className="flex justify-between text-white/45">
                      <span>Original value</span>
                      <span className="line-through text-white/25">₹{rawSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-white/45">
                      <span>Shipping</span>
                      <span className="text-[#22c55e] font-medium">Free</span>
                    </div>
                    <div className="border-t border-white/[0.08] pt-2.5 flex justify-between">
                      <span className="font-semibold text-white">Offer Price</span>
                      <span className="font-bold text-lg text-orange-400">₹1,499</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-white/45">
                      <span>Subtotal</span>
                      <span className="text-white/70">₹{rawSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-white/45">
                      <span>{paymentMethod === "online" ? "Shipping" : "COD charges"}</span>
                      <span className={shipping === 0 ? "text-[#22c55e] font-medium" : "text-white/70"}>
                        {shipping === 0 ? "Free" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="border-t border-white/[0.08] pt-2.5 flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-bold text-lg text-white">₹{total}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 flex items-start gap-2 text-white/35 text-xs">
                <Truck className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{deliveryTime}</span>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/25 text-[11px]">
                  <Shield className="w-3.5 h-3.5" /><span>Secure</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/25 text-[11px]">
                  <Lock className="w-3.5 h-3.5" /><span>SSL encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT — form ══ */}
          <div className="flex-1 bg-white lg:border-l lg:border-[#e5e7eb]">

            {/* WhatsApp info banner */}
            <div className="px-5 lg:px-10 pt-6">
              <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3">
                <MessageCircle className="w-5 h-5 text-[#16a34a] shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#15803d]">Order via WhatsApp</p>
                  <p className="text-xs text-[#166534]/70 mt-0.5">
                    Fill in your details below — we'll open WhatsApp with your order pre-filled.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 lg:px-10 py-7">
              <form onSubmit={handleSubmit(handleOrder)} className="max-w-md space-y-7">

                {/* ── Shipping info ── */}
                <div>
                  <h2 className="text-base font-semibold text-[#111827] mb-5">Shipping Information</h2>
                  <div className="space-y-4">

                    <Field label="Full Name *" id="customerName" error={errors.customerName?.message}>
                      <input id="customerName" {...register("customerName")}
                        placeholder="Arjun Menon" className={inputCls(errors.customerName?.message)} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Phone *" id="phoneNumber" error={errors.phoneNumber?.message}>
                        <input id="phoneNumber" {...register("phoneNumber")}
                          placeholder="9400941277" className={inputCls(errors.phoneNumber?.message)} />
                      </Field>
                      <Field label="Alternate Phone" id="alternatePhone">
                        <input id="alternatePhone" {...register("alternatePhone")}
                          placeholder="Optional" className={inputCls()} />
                      </Field>
                    </div>

                    <Field label="Instagram ID" id="instagramId">
                      <input id="instagramId" {...register("instagramId")}
                        placeholder="@username" className={inputCls()} />
                    </Field>

                    <Field label="Full Address *" id="address" error={errors.address?.message}>
                      <textarea id="address" {...register("address")} rows={3}
                        placeholder="House no., Building, Street, Area…"
                        className={`${inputCls(errors.address?.message)} !h-auto py-2 resize-none`} />
                    </Field>

                    <div className="grid grid-cols-3 gap-3">
                      <Field label="District *" id="district" error={errors.district?.message}>
                        <input id="district" {...register("district")}
                          placeholder="Kannur" className={inputCls(errors.district?.message)} />
                      </Field>
                      <Field label="State *" id="state" error={errors.state?.message}>
                        <input id="state" {...register("state")}
                          placeholder="Kerala" className={inputCls(errors.state?.message)} />
                      </Field>
                      <Field label="Pincode *" id="pincode" error={errors.pincode?.message}>
                        <input id="pincode" {...register("pincode")}
                          placeholder="670001" className={inputCls(errors.pincode?.message)} />
                      </Field>
                    </div>

                    <Field label="Landmark" id="landmark">
                      <input id="landmark" {...register("landmark")}
                        placeholder="Near school, temple…" className={inputCls()} />
                    </Field>
                  </div>
                </div>

                <div className="border-t border-[#f3f4f6]" />

                {/* ── Payment method (only for normal orders) ── */}
                {!isOffer ? (
                  <div>
                    <h2 className="text-base font-semibold text-[#111827] mb-4">Payment Method</h2>
                    <div className="space-y-3">
                      {/* Online */}
                      <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                        transition-all duration-150 select-none
                        ${paymentMethod === "online"
                          ? "border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]"
                          : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}>
                        <input type="radio" name="payment" value="online"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          className="mt-0.5 accent-[#2563eb]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Online Payment</span>
                            <span className="text-xs font-semibold text-[#22c55e] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                              FREE shipping
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">Pay via UPI / cards</p>
                        </div>
                      </label>

                      {/* COD */}
                      <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer
                        transition-all duration-150 select-none
                        ${paymentMethod === "cod"
                          ? "border-[#2563eb] bg-[#eff6ff] ring-1 ring-[#2563eb]"
                          : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}>
                        <input type="radio" name="payment" value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="mt-0.5 accent-[#2563eb]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#111827]">Cash on Delivery</span>
                            <span className="text-xs font-semibold text-[#f59e0b] bg-[#fffbeb] px-2 py-0.5 rounded-full">
                              +₹100 extra
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-0.5">₹100 advance + rest on delivery</p>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* Offer: fixed price banner */
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3.5">
                    <Tag className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Offer Price: ₹1,499 — Free shipping</p>
                      <p className="text-xs text-orange-500/80 mt-0.5">Payment details shared via WhatsApp</p>
                    </div>
                  </div>
                )}

                {/* Policy notice */}
                <div className="flex items-start gap-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#92400e] leading-relaxed">
                    By proceeding you agree to our{" "}
                    <Link href="/terms" target="_blank" className="font-semibold underline hover:text-[#78350f]">
                      return policy
                    </Link>
                    . All sales are final unless specified.
                  </p>
                </div>

                {/* ── WhatsApp CTA ── */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#25D366] text-white font-semibold text-sm rounded-xl
                    hover:bg-[#20bd5a] active:scale-[0.98] transition-all duration-150
                    flex items-center justify-center gap-2
                    shadow-[0_4px_16px_rgba(37,211,102,0.4)]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Place Order via WhatsApp →
                </button>

                <p className="text-center text-xs text-[#9ca3af] -mt-3">
                  You'll be redirected to WhatsApp to confirm with us
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}