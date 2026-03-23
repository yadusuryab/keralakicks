'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Brand } from '../types/brand';

interface BrandsMarqueeProps {
  /** px/s scroll speed — default 40 */
  speed?: number;
  direction?: 'left' | 'right';
  label?: string;
  pauseOnHover?: boolean;
}

export default function BrandsMarquee({
  speed = 40,
  direction = 'left',
  label = '',
  pauseOnHover = true,
}: BrandsMarqueeProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    fetch('/api/brands')
      .then((r) => r.json())
      .then((data: Brand[]) => setBrands(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // RAF-based scroll for butter-smooth animation
  useEffect(() => {
    if (!brands.length) return;
    const track = trackRef.current;
    if (!track) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!pausedRef.current) {
        const delta = (speed * dt) / 1000;
        posRef.current += direction === 'left' ? -delta : delta;

        const half = track.scrollWidth / 2;
        if (direction === 'left' && posRef.current <= -half) posRef.current += half;
        if (direction === 'right' && posRef.current >= 0) posRef.current -= half;

        track.style.transform = `translateX(${posRef.current}px)`;
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [brands, speed, direction]);

  // Duplicate for seamless loop
  const items = [...brands, ...brands];

  return (
    <div className="w-full  py-10 overflow-hidden">
      {/* Label row */}
      {label && (
        <div className="flex items-center gap-5 px-8 mb-8 max-w-7xl mx-auto">
          <span className="flex-1 h-px bg-primary" />
          <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-neutral-600 whitespace-nowrap">
            {label}
          </span>
          <span className="flex-1 h-px bg-primary" />
        </div>
      )}

      {/* Marquee viewport */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => pauseOnHover && (pausedRef.current = true)}
        onMouseLeave={() => pauseOnHover && (pausedRef.current = false)}
      >
        {/* Fade masks */}
       
        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex items-center w-max"
          style={{ willChange: 'transform' }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-40 h-14 mx-px rounded bg-primary animate-pulse flex-shrink-0"
                />
              ))
            : items.map((brand, i) => (
                <div
                  key={`${brand._id}-${i}`}
                  title={brand.name}
                  className="flex items-center gap-3 px-7 py-3   flex-shrink-0 group cursor-default select-none hover:opacity-60 transition-opacity duration-200"
                >
                  {/* Logo */}
                  <div className="relative w-32 p-2 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-black border  flex items-center justify-center">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.logoAlt || brand.name}
                        fill
                        className="object-contain p-1 grayscale-[20%] brightness-75 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-300"
                        sizes="100px"
                      />
                    ) : (
                      <span className="font-serif text-base font-bold text-amber-500 leading-none">
                        {brand.name[0]}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  {/* <span className="text-[0.85rem] font-medium text-neutral-600 group-hover:text-neutral-400 whitespace-nowrap tracking-wide transition-colors duration-200">
                    {brand.name}
                  </span> */}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}