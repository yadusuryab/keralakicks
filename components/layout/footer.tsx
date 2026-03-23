"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, ArrowUpRight, Zap } from "lucide-react";
import Brand from "../utils/brand";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch(() => {});
  }, []);

  const dynamicCategories = categories.slice(0, 5).map((c) => ({
    label: c.name || "Category",
    href: `/products?category=${c.slug?.current || c.slug || "category"}`,
  }));

  const fallbackCategories = [
    { label: "Watches",  href: "/products?category=watches" },
    { label: "Footwear", href: "/products?category=footwears" },
  ];

  const shopCategories = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories;

  const links = {
    help:    [{ label: "Contact Us", href: "/contact" }],
    company: [{ label: "About Us",   href: "/about"   }],
    legal: [
      { label: "Privacy Policy",    href: "/privacy-policy" },
      { label: "Terms & Conditions",href: "/terms" },
      { label: "Cookies",           href: "/cookies" },
    ],
    social: {
      instagram: process.env.NEXT_PUBLIC_INSTA    || "#",
      whatsapp:  process.env.NEXT_PUBLIC_WHATSAPP || "#",
    },
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Store";

  return (
    <>
      <style>{`
        /* Marquee */
        @keyframes footerMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .f-marquee {
          display: inline-flex;
          animation: footerMarquee 28s linear infinite;
          white-space: nowrap;
        }
        .f-marquee:hover { animation-play-state: paused; }

        /* Footer nav links */
        .f-link {
          position: relative;
          display: inline-block;
          color: rgba(255,255,255,0.35);
          font-size: 11.5px;
          letter-spacing: 0.03em;
          text-decoration: none;
          transition: color 0.2s;
        }
        .f-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--sport-accent, #0169ff);
          transition: width 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .f-link:hover { color: white; }
        .f-link:hover::after { width: 100%; }

        /* Section label */
        .f-label {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 800;
          color: rgba(255,255,255,0.2);
          margin-bottom: 14px;
          display: block;
        }

        /* Big wordmark at bottom */
        @keyframes maskReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .wordmark-line {
          font-size: clamp(48px, 14vw, 140px);
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.12);
          user-select: none;
          white-space: nowrap;
        }
      `}</style>

      <footer style={{ background: "var(--foreground, #0a0a0a)" }}>

        {/* ── Accent top bar ── */}
        <div className="h-[3px]" style={{ background: "var(--sport-accent, #0169ff)" }} />

        {/* ── Marquee strip ── */}
        <div className="overflow-hidden border-b select-none py-2.5"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="f-marquee">
            {[
              "Free shipping over ₹999",
              "New arrivals every Friday",
              "Easy 30-day returns",
              "Premium collections, curated for you",
              "Secure checkout · 100% safe",
              "Free shipping over ₹999",
              "New arrivals every Friday",
              "Easy 30-day returns",
              "Premium collections, curated for you",
              "Secure checkout · 100% safe",
            ].map((t, i) => (
              <React.Fragment key={i}>
                <span className="text-[9px] tracking-[0.25em] uppercase font-black"
                  style={{ color: "rgba(255,255,255,0.22)", paddingLeft: "4px", paddingRight: "4px" }}>
                  {t}
                </span>
                <Zap className="w-2.5 h-2.5 fill-current mx-5 inline-block align-middle"
                  style={{ color: "var(--sport-accent, #0169ff)", opacity: 0.6 }} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10">

          {/* ── Top row: Brand + tagline + social ── */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-14 pb-14"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

            <div className="max-w-sm">
              {/* Logo */}
              <Link href="/" className="block mb-5 w-fit hover:opacity-80 transition-opacity">
                <Brand className="h-7 w-auto brightness-0 invert opacity-80" />
              </Link>

              <p className="text-[12px] leading-relaxed mb-6"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Handpicked fashion, curated for the modern wardrobe. Quality pieces built to last.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { href: links.social.instagram, icon: <Instagram size={14} strokeWidth={1.5} />, label: "Instagram" },
                  { href: links.social.whatsapp,  icon: <MessageCircle size={14} strokeWidth={1.5} />, label: "WhatsApp" },
                ].map((s) => (
                  <Link key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center transition-all duration-200 group"
                    style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--sport-accent, #0169ff)";
                      (e.currentTarget as HTMLElement).style.color = "var(--sport-accent, #0169ff)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
                    }}
                  >
                    {s.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Offer CTA — right side */}
            <Link
              href="/offer"
              className="group relative flex flex-col gap-2 px-6 py-5 overflow-hidden transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                maxWidth: "280px",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--sport-accent, #0169ff)";
                (e.currentTarget as HTMLElement).style.background = "rgba(232,255,59,0.04)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              }}
            >
              {/* Accent corner */}
              <div className="absolute top-0 left-0 w-6 h-6"
                style={{ background: "var(--sport-accent, #0169ff)", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />

              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 fill-current" style={{ color: "var(--sport-accent, #0169ff)" }} />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase"
                  style={{ color: "var(--sport-accent, #0169ff)" }}>
                  Limited Offer
                </span>
              </div>
              <p className="font-black uppercase tracking-tight leading-tight text-white text-base">
                Buy One,{" "}
                <span style={{ color: "var(--sport-accent, #0169ff)" }}>Get One Free</span>
              </p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Any 2 pairs for just <span className="font-bold text-white">₹1,499</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold uppercase tracking-wide"
                style={{ color: "var(--sport-accent, #0169ff)" }}>
                Shop now
                <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </div>

          {/* ── Link columns ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">

            {/* Help */}
            <div>
              <span className="f-label">Help</span>
              <ul className="space-y-3">
                {links.help.map((l) => (
                  <li key={l.href}><Link href={l.href} className="f-link">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <span className="f-label">Company</span>
              <ul className="space-y-3">
                {links.company.map((l) => (
                  <li key={l.href}><Link href={l.href} className="f-link">{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Shop */}
            <div>
              <span className="f-label">Shop</span>
              <ul className="space-y-3">
                {shopCategories.map((l) => (
                  <li key={l.href}><Link href={l.href} className="f-link">{l.label}</Link></li>
                ))}
                <li><Link href="/products" className="f-link">All Products</Link></li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <span className="f-label">Follow</span>
              <ul className="space-y-3">
                {[
                  { label: "Instagram", href: links.social.instagram },
                  { label: "WhatsApp",  href: links.social.whatsapp  },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} target="_blank" rel="noopener noreferrer"
                      className="f-link inline-flex items-center gap-1 group">
                      {l.label}
                      <ArrowUpRight size={10}
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Big editorial wordmark ── */}
          <div className="mb-10 -mx-2 overflow-hidden select-none">
            <p className="wordmark-line px-2">{appName}</p>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>

            {/* Copyright */}
            <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.2)" }}>
              © {currentYear} {appName}. All rights reserved.
            </p>

            {/* Legal links */}
            <nav className="flex items-center gap-5 flex-wrap justify-center">
              {links.legal.map((l) => (
                <Link key={l.href} href={l.href} className="f-link" style={{ fontSize: "11px" }}>
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Made by */}
            <Link
              href="https://instagram.com/getshopigo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold tracking-wide transition-colors duration-200 group"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--sport-accent, #0169ff)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"}
            >
              Made with ♥ by{" "}
              <span className="italic underline underline-offset-2">Shopigo</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export { Footer };