"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PromoBannerProps = {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  tag?: string;
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function PromoBanner({
  heading = "The New Season\nIs Here.",
  subheading = "Discover the latest drops — curated pieces built for the modern wardrobe.",
  ctaText = "Shop the Collection",
  ctaHref = "/products",
  imageUrl = "/hero.avif",
  tag = "SS '25",
}: PromoBannerProps) {
  const { ref, visible } = useReveal();

  return (
    <section ref={ref} className="px-3 sm:px-4 py-4">
      <div className="relative w-full rounded-2xl overflow-hidden bg-black
        aspect-[4/5] sm:aspect-[16/9]">

        {/* Background image with Ken Burns */}
        <Image
          src={imageUrl}
          alt="Promo banner"
          fill
          className="object-cover"
          style={{
            transform: visible ? "scale(1.04)" : "scale(1.1)",
            transition: `transform ${visible ? "8s" : "0s"} cubic-bezier(0.25,0.46,0.45,0.94)`,
          }}
          priority
        />

        {/* Dark overlay — slightly lighter top, darker bottom */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-black/10" />

        {/* Season tag — top right */}
        <div
          className="absolute top-5 right-5 sm:top-7 sm:right-7"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.1s",
          }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium
            text-white/60 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {tag}
          </span>
        </div>

        {/* Content — bottom left */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14">

          {/* Heading — line by line stagger */}
          <h2
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white
              tracking-tight leading-[1.05] mb-3 sm:mb-4 max-w-lg whitespace-pre-line"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}
          >
            {heading}
          </h2>

          {/* Subheading */}
          <p
            className="text-sm sm:text-base text-white/65 mb-6 sm:mb-8 max-w-sm leading-relaxed"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s",
            }}
          >
            {subheading}
          </p>

          {/* CTA */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.42s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.42s",
            }}
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2
                px-5 py-2.5 rounded-full bg-white text-black
                text-[11px] font-semibold tracking-[0.1em] uppercase
                hover:bg-white/90 hover:gap-3
                transition-all duration-200 group"
            >
              {ctaText}
              <ArrowUpRight
                size={13}
                className="group-hover:rotate-12 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>

        {/* Decorative vertical rule — desktop only */}
        <div
          className="hidden md:block absolute right-[38%] top-[15%] bottom-[15%]
            w-px bg-white/10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "top",
            transition: "opacity 0.8s ease 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s",
          }}
        />
      </div>
    </section>
  );
}