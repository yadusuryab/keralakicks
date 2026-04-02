'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Brand } from '@/components/types/brand';
import { Button } from '../ui/button';

interface BrandsGridProps {
  title?: string;
  subtitle?: string;
  showFeaturedOnly?: boolean;
  limit?: number;
}

export default function BrandsGrid({
  title = 'Shop by Brand',
  subtitle = 'Explore our shoes',
  showFeaturedOnly = false,
  limit,
}: BrandsGridProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Tracks the tapped card on mobile (touch devices don't fire hover)
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (!res.ok) throw new Error('Failed to fetch brands');
        const data: Brand[] = await res.json();
        let filtered = showFeaturedOnly ? data.filter((b) => b.featured) : data;
        if (limit) filtered = filtered.slice(0, limit);
        setBrands(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [showFeaturedOnly, limit]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [brands]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('article')?.offsetWidth ?? 260;
    el.scrollBy({ left: direction === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  };

  if (error) {
    return (
      <section className="w-full py-4 px-4">
        <p className="text-center text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-4" style={{ background: 'var(--background)' }}>

      {/* ── Section header ── */}
      <div className="max-w-7xl mx-auto mb-8 flex items-end justify-between gap-4">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3 h-3 fill-current" style={{ color: 'var(--sport-accent)' }} />
            <span
              className="text-[9px] font-black tracking-[0.35em] uppercase"
              style={{ color: 'var(--sport-accent)' }}
            >
              {subtitle}
            </span>
          </div>
          {/* Title */}
          <h2
            className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h2>
          {/* Accent underline */}
          <div
            className="mt-3 h-[3px] w-10"
            style={{ background: 'var(--sport-accent)' }}
          />
        </div>

        {/* Scroll arrows — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {(['left', 'right'] as const).map((dir) => {
            const active = dir === 'left' ? canScrollLeft : canScrollRight;
            return (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                disabled={!active}
                aria-label={`Scroll ${dir}`}
                className="w-9 h-9 flex items-center justify-center transition-all duration-200
                  disabled:opacity-20 disabled:pointer-events-none"
                style={{
                  border: '1px solid',
                  borderColor: active ? 'var(--sport-accent)' : 'var(--border)',
                  color: active ? 'var(--sport-accent)' : 'var(--muted-foreground)',
                  background: 'transparent',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  {dir === 'left'
                    ? <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M5 2l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable row ── */}
      <div className="relative max-w-7xl mx-auto">

        {/* Left / right mobile fade + arrow */}
        {(['left', 'right'] as const).map((dir) => {
          const active = dir === 'left' ? canScrollLeft : canScrollRight;
          return (
            <div
              key={dir}
              className={`md:hidden absolute ${dir === 'left' ? 'left-0' : 'right-0'} top-0 bottom-0 z-10
                flex items-center transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div
                className={`absolute ${dir}-0 top-0 bottom-0 w-12`}
                style={{
                  background: `linear-gradient(to ${dir === 'left' ? 'right' : 'left'}, var(--background), transparent)`,
                }}
              />
              <Button
                variant={'outline'}
                onClick={() => scroll(dir)}
                aria-label={`Scroll ${dir}`}
                className={`relative z-10 ${dir === 'left' ? 'ml-1' : 'mr-1'} w-8 h-8 flex items-center justify-center
                  transition-all duration-200 shadow-none`}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  {dir === 'left'
                    ? <path d="M9 2L5 7l4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M5 2l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  }
                </svg>
              </Button>
            </div>
          );
        })}

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide divide-x"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            borderTop: '3px solid var(--sport-accent)',
            borderBottom: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[220px] min-h-[200px] animate-pulse"
                  style={{ scrollSnapAlign: 'start', background: 'var(--muted)' }}
                />
              ))
            : brands.map((brand, idx) => {
                // A card is "highlighted" if hovered (desktop) OR tapped (mobile)
                const isHighlighted = hoveredId === brand._id || activeId === brand._id;
                const isDimmed = (hoveredId || activeId) && !isHighlighted;

                return (
                  <Link
                    key={brand._id}
                    href={`/products?brands=${brand.slug?.current}`}
                  >
                    <article
                      className="relative flex flex-col flex-shrink-0 w-[220px] p-5 transition-all duration-300 group cursor-pointer"
                      style={{
                        scrollSnapAlign: 'start',
                        background: isHighlighted ? 'var(--foreground)' : 'var(--card)',
                        opacity: isDimmed ? 0.45 : 1,
                        borderRight: idx < brands.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                      onMouseEnter={() => setHoveredId(brand._id)}
                      onMouseLeave={() => setHoveredId(null)}
                      // Mobile: toggle active on tap, clear on next tap elsewhere
                      onTouchStart={() =>
                        setActiveId((prev) => (prev === brand._id ? null : brand._id))
                      }
                    >
                      {/* Featured badge */}
                      {brand.featured && (
                        <span
                          className="absolute top-3 right-3 text-[8px] font-black tracking-[0.25em] uppercase px-2 py-0.5"
                          style={{
                            color: 'var(--foreground)',
                            background: 'var(--sport-accent)',
                          }}
                        >
                          Featured
                        </span>
                      )}

                      {/* Logo — fixed height so all logos are the same size */}
                      <div
                        className="relative w-full mb-5 bg-black rounded flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300"
                        style={{ height: '96px' }}
                      >
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.logoAlt || brand.name}
                            fill
                            className="object-contain p-3 transition-all duration-300"
                            style={{
                              filter: isHighlighted ? 'brightness(1.1)' : 'brightness(0.85)',
                            }}
                            sizes="220px"
                          />
                        ) : (
                          <span
                            className="text-xl font-black uppercase leading-none"
                            style={{ color: 'var(--sport-accent)' }}
                          >
                            {brand.name[0]}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 gap-1">
                        <h3
                          className="text-base font-black uppercase tracking-tight leading-snug transition-colors duration-300"
                          style={{
                            color: isHighlighted ? 'white' : 'var(--foreground)',
                          }}
                        >
                          {brand.name}
                        </h3>

                        {(brand.country || brand.establishedYear) && (
                          <p
                            className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {brand.country && <span>{brand.country}</span>}
                            {brand.country && brand.establishedYear && (
                              <span style={{ color: 'var(--border)' }}>·</span>
                            )}
                            {brand.establishedYear && <span>Est. {brand.establishedYear}</span>}
                          </p>
                        )}

                        {brand.description && (
                          <p
                            className="mt-1.5 text-[0.78rem] leading-relaxed line-clamp-2"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {brand.description}
                          </p>
                        )}

                        {/* Footer */}
                        <div
                          className="flex items-center justify-between mt-auto pt-4"
                          style={{ borderTop: '1px solid var(--border)' }}
                        >
                          {/*
                            Button text: always sport-accent,
                            but on highlighted card force white so it's readable on the dark bg
                          */}
                          <Button
                            variant={'ghost'}
                            className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] uppercase
                              transition-all duration-200 hover:gap-2.5"
                            style={{
                              color: isHighlighted ? 'white' : 'var(--sport-accent)',
                              // Ensure ghost hover bg doesn't hide text on dark card
                              backgroundColor: 'transparent',
                            }}
                          >
                            View Brand
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
                              className="transition-transform duration-200 group-hover:translate-x-0.5">
                              <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Button>

                          {brand.website && (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Visit website"
                              className="flex items-center justify-center w-7 h-7 transition-all duration-200"
                              style={{
                                border: '1px solid var(--border)',
                                color: isHighlighted ? 'white' : 'var(--muted-foreground)',
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--sport-accent)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--sport-accent)';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                (e.currentTarget as HTMLElement).style.color = isHighlighted ? 'white' : 'var(--muted-foreground)';
                              }}
                            >
                              <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                                <path
                                  d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8M8 1h4m0 0v4m0-4L5.5 7.5"
                                  stroke="currentColor" strokeWidth="1.4"
                                  strokeLinecap="round" strokeLinejoin="round"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
        </div>
      </div>

      {!loading && brands.length === 0 && (
        <p
          className="text-center text-sm py-16"
          style={{ color: 'var(--muted-foreground)' }}
        >
          No brands found.
        </p>
      )}
    </section>
  );
}