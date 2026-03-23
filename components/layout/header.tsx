"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, X, ArrowRight, Zap } from "lucide-react";
import Brand from "../utils/brand";

const NAV = [
  { name: "Home", href: "/" },
  { name: "Track Order", href: "/track-order" },
  { name: "Policies", href: "/terms" },
];

const HERO_THRESHOLD = 80;

// ─── Animated Hamburger ───────────────────────────────────────────────────────
function Hamburger({
  open,
  onClick,
  white,
}: {
  open: boolean;
  onClick: () => void;
  white: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px]
        rounded-none transition-colors duration-200 shrink-0 group"
    >
      {/* Top bar */}
      <span
        className={`block h-[2px] rounded-none transition-all duration-300 origin-center
          ${white ? "bg-white" : "bg-neutral-900"}
          ${open ? "w-5 rotate-45 translate-y-[3.5px]" : "w-5"}`}
      />
      {/* Corner accent (decorative) */}
      {!open && (
        <span
          className={`absolute top-2 right-2 w-1 h-1 transition-all duration-200
            ${white ? "bg-primary" : "bg-primary"}`}
        />
      )}
      {/* Bottom bar */}
      <span
        className={`block h-[2px] rounded-none transition-all duration-300 origin-center
          ${white ? "bg-white" : "bg-neutral-900"}
          ${open ? "w-5 -rotate-45 -translate-y-[3px]" : "w-3 self-start ml-[10px]"}`}
      />
    </button>
  );
}

// ─── Animated Nav Link with sporty underline ─────────────────────────────────
function NavLink({
  href,
  active,
  isOverHero,
  children,
}: {
  href: string;
  active: boolean;
  isOverHero: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-1.5 text-[10px] font-black tracking-[0.18em] uppercase
        no-underline transition-colors duration-200 group
        ${isOverHero
          ? active ? "text-primary" : "text-white/60 hover:text-white"
          : active ? "text-neutral-950" : "text-neutral-400 hover:text-neutral-950"
        }`}
    >
      {children}
      {/* Sporty underline */}
      <span
        className={`absolute bottom-0 left-3 h-[2px] bg-primary transition-all duration-300
          ${active ? "w-[calc(100%-24px)]" : "w-0 group-hover:w-[calc(100%-24px)]"}`}
      />
    </Link>
  );
}

// ─── Icon Button ─────────────────────────────────────────────────────────────
function IconBtn({
  onClick,
  href,
  label,
  isOverHero,
  children,
}: {
  onClick?: () => void;
  href?: string;
  label: string;
  isOverHero: boolean;
  children: React.ReactNode;
}) {
  const cls = `relative w-10 h-10 flex items-center justify-center
    transition-all duration-200 group
    ${isOverHero
      ? "text-white/70 hover:text-primary"
      : "text-neutral-500 hover:text-neutral-950"
    }`;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={cls}>
        {children}
        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0
          bg-primary transition-all duration-200 group-hover:w-4`} />
      </Link>
    );
  }
  return (
    <button onClick={onClick} aria-label={label} className={cls}>
      {children}
      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0
        bg-primary transition-all duration-200 group-hover:w-4`} />
    </button>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHomePage = pathname === "/";
  const isOverHero = isHomePage && !scrolled && !menuOpen && !searchOpen;

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > HERO_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* ── Search overlay ──────────────────────────────────────────────── */}
      <div
        aria-hidden={!searchOpen}
        onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        className={`fixed inset-0 z-[60] flex flex-col justify-start
          bg-neutral-950/97 backdrop-blur-xl transition-all duration-250 ease-out
          ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-primary" />

        <div
          className={`w-full max-w-2xl mx-auto px-6 pt-24 transition-all duration-300
            ${searchOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-3 h-3 text-primary fill-primary" />
            <p className="text-[9px] font-black tracking-[0.4em] uppercase text-primary">
              Search
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="search"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-[clamp(24px,6vw,44px)] font-black
                text-white placeholder:text-neutral-700 uppercase tracking-tight
                border-0 border-b-2 border-neutral-800 focus:border-primary
                outline-none pb-4 pr-12
                transition-colors duration-200"
            />
            <button
              type="submit"
              aria-label="Search"
              className={`absolute right-0 bottom-4 flex items-center justify-center
                w-9 h-9 transition-all duration-200
                ${query.trim()
                  ? "text-primary hover:scale-110"
                  : "text-neutral-700 pointer-events-none"}`}
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </form>

          <p className="mt-5 text-[9px] tracking-[0.25em] uppercase text-neutral-600 hidden sm:block">
            Press Enter to search · Esc to close
          </p>
        </div>

        <button
          onClick={() => setSearchOpen(false)}
          aria-label="Close search"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center
            text-neutral-500 hover:text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* ── Mobile full-screen menu ──────────────────────────────────────── */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[55] flex flex-col bg-neutral-950
          transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-2"}`}
      >
        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-primary" />

        <div className="flex items-center justify-between px-4 h-[60px] shrink-0">
          <Hamburger open={menuOpen} onClick={() => setMenuOpen(false)} white={true} />
          <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
            <Brand className="h-6 w-auto brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-0.5">
            <button
              onClick={openSearch}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-primary transition-colors"
            >
              <Search className="w-[17px] h-[17px]" strokeWidth={2} />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-neutral-800" />

        <nav className="flex-1 flex flex-col justify-center px-6 gap-0">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between group
                py-5 border-b border-neutral-800/60 last:border-0
                transition-all duration-200 no-underline`}
              style={{ transitionDelay: menuOpen ? `${i * 40}ms` : "0ms" }}
            >
              <span
                className={`text-[clamp(30px,9vw,56px)] font-black tracking-tighter leading-none uppercase
                  transition-all duration-300
                  ${pathname === item.href ? "text-primary" : "text-neutral-600 group-hover:text-white"}
                  ${menuOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
                style={{ transitionDelay: menuOpen ? `${i * 55 + 80}ms` : "0ms" }}
              >
                {item.name}
              </span>
              <ArrowRight
                className={`w-5 h-5 shrink-0 transition-all duration-200
                  opacity-0 group-hover:opacity-100 group-hover:translate-x-1
                  ${pathname === item.href ? "text-primary" : "text-neutral-400"}`}
                strokeWidth={2.5}
              />
            </Link>
          ))}
        </nav>

        {/* Footer band */}
        <div className="px-6 pb-8 pt-4 shrink-0 flex items-center gap-2 border-t border-neutral-800">
          <Zap className="w-3 h-3 text-primary fill-primary shrink-0" />
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-500">
            Free shipping on orders paid online
          </p>
        </div>
      </div>

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-400
          ${scrolled || !isHomePage
            ? "h-[56px] bg-neutral-950/96 backdrop-blur-xl"
            : "h-[64px] bg-transparent"
          }`}
      >
        {/* ── Accent top bar (always visible when solid) */}
        <div
          className={`absolute top-0 inset-x-0 h-[3px] bg-primary
            transition-opacity duration-500
            ${scrolled || !isHomePage ? "opacity-100" : "opacity-0"}`}
        />

        {/* Hero gradient */}
        {isOverHero && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
            }}
          />
        )}

        <div className="relative h-full max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-10">
          <div className="h-full grid grid-cols-[1fr_auto_1fr] items-center">

            {/* LEFT */}
            <div className="flex items-center">
              {/* Mobile hamburger */}
              <div className="md:hidden">
                <Hamburger
                  open={menuOpen}
                  onClick={() => setMenuOpen((p) => !p)}
                  white={isOverHero || scrolled || !isHomePage}
                />
              </div>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center" aria-label="Main">
                {NAV.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    active={pathname === item.href}
                    isOverHero={isOverHero}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* CENTER – logo */}
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center justify-center transition-opacity duration-200 hover:opacity-75"
            >
              <Brand
                className={`w-auto transition-all duration-300
                  ${scrolled ? "h-5 md:h-5" : "h-6 md:h-7"}
                  ${isOverHero ? "brightness-0 invert" : scrolled || !isHomePage ? "brightness-0 invert" : ""}`}
              />
            </Link>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-0.5">
              <IconBtn onClick={openSearch} label="Search" isOverHero={isOverHero || scrolled || !isHomePage}>
                <Search
                  className={`transition-all duration-300 ${scrolled ? "w-[16px] h-[16px]" : "w-[17px] h-[17px]"}`}
                  strokeWidth={2}
                />
              </IconBtn>

              <IconBtn href="/cart" label="Shopping cart" isOverHero={isOverHero || scrolled || !isHomePage}>
                <ShoppingBag
                  className={`transition-all duration-300 ${scrolled ? "w-[16px] h-[16px]" : "w-[17px] h-[17px]"}`}
                  strokeWidth={2}
                />
              </IconBtn>
            </div>

          </div>
        </div>

        {/* ── Bottom rule (visible when scrolled/solid) */}
        <div
          className={`absolute bottom-0 inset-x-0 h-px bg-neutral-800
            transition-opacity duration-400
            ${scrolled || !isHomePage ? "opacity-100" : "opacity-0"}`}
        />
      </header>

      {/* Spacer for non-home pages */}
      {!isHomePage && (
        <div className="h-[56px]" aria-hidden="true" />
      )}
    </>
  );
}