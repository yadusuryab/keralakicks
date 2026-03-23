"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type AboutTeaserProps = {
  imageUrl?: string;
  tag?: string;
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
  stat1?: { value: string; label: string };
  stat2?: { value: string; label: string };
  stat3?: { value: string; label: string };
};

export default function AboutTeaser({
  imageUrl = "/hero.avif",
  tag = "Our Story",
  heading = "Designed for the\nmodern wardrobe.",
  body = "We believe fashion should feel effortless. Every piece in our collection is thoughtfully sourced — quality fabrics, considered cuts, and a commitment to lasting style over passing trends.",
  ctaText = "Learn more",
  ctaHref = "/about",
  stat1 = { value: "500+", label: "Curated styles" },
  stat2 = { value: "30k+", label: "Happy customers" },
  stat3 = { value: "4.9★", label: "Avg. rating" },
}: AboutTeaserProps) {
  const { ref, visible } = useReveal();

  return (
    <section ref={ref} className="px-3 sm:px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden">

        {/* ── Left: Image ── */}
        <div
          className="relative aspect-[4/5] bg-primary md:aspect-auto md:min-h-[480px] rounded-2xl overflow-hidden bg-gray-100"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          <Image
            src={imageUrl}
            alt="About our brand"
            fill
            className="object-cover"
            style={{
              transform: visible ? "scale(1.04)" : "scale(1.1)",
              transition: `transform ${visible ? "7s" : "0s"} cubic-bezier(0.25,0.46,0.45,0.94)`,
            }}
          />
          {/* Subtle dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* ── Right: Content ── */}
        <div
          className="flex flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 bg-[#f8f7f5] rounded-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(20px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s",
          }}
        >
          {/* Tag */}
          <div className="flex items-center gap-2 mb-5">
            <span className="block w-6 h-px bg-black/30" />
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium text-black/40">
              {tag}
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-black
              tracking-tight leading-[1.1] mb-5 whitespace-pre-line"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.28s",
            }}
          >
            {heading}
          </h2>

          {/* Body */}
          <p
            className="text-sm text-black/50 leading-relaxed mb-8 max-w-sm"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.36s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.36s",
            }}
          >
            {body}
          </p>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-2 mb-8 pb-8 border-b border-black/[0.08]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.44s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.44s",
            }}
          >
            {[stat1, stat2, stat3].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[9.5px] tracking-[0.1em] uppercase text-black/35 font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.52s",
            }}
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1.5
                text-[11px] font-semibold tracking-[0.12em] uppercase text-black
                border-b border-black/20 hover:border-black pb-px
                hover:gap-2.5 transition-all duration-200 group"
            >
              {ctaText}
              <ArrowUpRight
                size={13}
                className="group-hover:rotate-12 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}