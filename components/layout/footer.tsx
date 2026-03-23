"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, ArrowUpRight } from "lucide-react";
import Brand from "../utils/brand";

function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = React.useState<any[]>([]);

  // Fetch categories
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
    { label: "Watches", href: "/products?category=watches" },
    { label: "Footwear", href: "/products?category=footwears" },
  ];

  const shopCategories = dynamicCategories.length > 0 ? dynamicCategories : fallbackCategories;

  const links = {
    help: [
      { label: "Contact Us", href: "/contact" },
    ],
    company: [
      { label: "About Us", href: "/about" },
     
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
    social: {
      instagram: process.env.NEXT_PUBLIC_INSTA || "#",
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "#",
    },
  };

  return (
    <>
      <style>{`
        @keyframes footerMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .footer-marquee {
          display: inline-flex;
          animation: footerMarquee 22s linear infinite;
          white-space: nowrap;
        }
        .footer-marquee:hover { animation-play-state: paused; }

        .footer-link {
          position: relative;
          display: inline-block;
          color: rgba(0,0,0,0.45);
          font-size: 12px;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: black;
          transition: width 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .footer-link:hover { color: black; }
        .footer-link:hover::after { width: 100%; }
      `}</style>

      <footer className="bg-white border-t border-black/[0.07]">

        {/* ── Marquee strip ── */}
        <div className="border-b border-black/[0.06] py-2.5 overflow-hidden select-none">
          <div className="footer-marquee">
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
                <span className="text-[10px] tracking-[0.18em] uppercase font-medium text-black/40 px-1">
                  {t}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-black/15 mx-5 align-middle" />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">

          {/* Top row: Logo + tagline | Newsletter */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-14 pb-14 border-b border-black/[0.07]">

            {/* Brand side */}
            <div className="max-w-xs">
              <Link href="/" className="block mb-4 brightness-0 opacity-80 hover:opacity-100 transition-opacity w-fit">
                <Brand className="h-8 w-auto" />
              </Link>
              <p className="text-[12.5px] text-black/45 leading-relaxed mb-5">
                Handpicked fashion, curated for the modern wardrobe. Quality pieces built to last.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <Link
                  href={links.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/12
                    flex items-center justify-center
                    text-black/40 hover:text-black hover:border-black/30 hover:bg-black/[0.03]
                    transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={14} strokeWidth={1.5} />
                </Link>
                <Link
                  href={links.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-black/12
                    flex items-center justify-center
                    text-black/40 hover:text-black hover:border-black/30 hover:bg-black/[0.03]
                    transition-all duration-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Newsletter */}
         
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-14">

            {/* Help */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black mb-4">
                Help
              </h4>
              <ul className="space-y-2.5">
                {links.help.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {links.company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black mb-4">
                Shop
              </h4>
              <ul className="space-y-2.5">
                {shopCategories.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/products" className="footer-link">All products</Link>
                </li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black mb-4">
                Follow
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href={links.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link inline-flex items-center gap-1 group"
                  >
                    Instagram
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                        transition-all duration-200"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    href={links.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link inline-flex items-center gap-1 group"
                  >
                    WhatsApp
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                        transition-all duration-200"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4
            pt-6 border-t border-black/[0.07]">

            {/* Copyright */}
            <p className="text-[11px] text-black/30 tracking-wide">
              © {currentYear} {process.env.NEXT_PUBLIC_APP_NAME || "Store"}. All rights reserved.
            </p>

            {/* Legal links */}
            <nav className="flex items-center gap-5 flex-wrap justify-center">
              {links.legal.map((l) => (
                <Link key={l.href} href={l.href} className="footer-link text-[11px]">
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Made by */}
            <Link
              href="https://instagram.com/getshopigo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold tracking-tight transition-colors duration-200"
            >
              Made with ♥ by <span className="italic underline">Shopigo</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export { Footer };