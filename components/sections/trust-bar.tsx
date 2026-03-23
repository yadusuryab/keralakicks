"use client";

import React, { useEffect, useRef, useState } from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders paid online",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Hassle-free returns for damaged or defective items.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "100% protected payments",
  },
  {
    icon: Headphones,
    title: "24h Support",
    desc: "We're here when you need us",
  },
];

export default function TrustBar() {
  const { ref, visible } = useReveal();

  return (
    <section
      ref={ref}
      className="px-3 sm:px-4 py-2"
    >
      <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/[0.06] rounded overflow-hidden">
          {badges.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-2.5
                bg-white/80 px-4 py-6 sm:py-8 group
                hover:bg-black/[0.02] transition-colors duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s,
                             transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
              }}
            >
              {/* Icon circle */}
              <div
                className="w-10 h-10 rounded-full border border-black/10
                  flex items-center justify-center
                  group-hover:border-black/25 group-hover:scale-110
                  transition-all duration-300"
              >
                <Icon
                  size={17}
                  strokeWidth={1.5}
                  className="text-black/60 group-hover:text-black transition-colors duration-200"
                />
              </div>

              {/* Text */}
              <div>
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-black mb-0.5">
                  {title}
                </p>
                <p className="text-[10.5px] text-black/40 leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}