'use client'

import React, { useEffect, useRef, useState } from 'react'
import CategoryCard from '../cards/category-card'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

export type Category = {
  name: string
  image: string
  slug: string
  productCount?: number
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[200px] sm:w-[240px] h-[280px] sm:h-[320px]
      rounded-xl overflow-hidden bg-neutral-100 relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]
        bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

// ── CategorySection ───────────────────────────────────────────────────────────
function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Fetch
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data')
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed')
        setCategories([
          { name: 'Men',        image: '/category-men.avif',        slug: 'men' },
          { name: 'Women',      image: '/category-women.avif',      slug: 'women' },
          { name: 'Accessories',image: '/category-accessories.avif',slug: 'accessories' },
          { name: 'Footwear',   image: '/category-footwear.avif',   slug: 'footwear' },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Intersection observer — trigger entrance animation
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Scroll progress
  const updateProgress = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
  }

  // Drag-to-scroll
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft
    dragScrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current)
  }
  const stopDrag = () => {
    isDragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const delay = (i: number) => `${i * 80}ms`

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section ref={sectionRef} className="relative py-8 overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-end justify-between gap-4 mb-6 px-4 sm:px-6">
          <div>
            <div
              className="flex items-center gap-2 mb-1.5"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <span className="block w-5 h-px bg-black/30" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-black/40 font-mono">
                Collections
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.55s ease 0.08s, transform 0.55s ease 0.08s',
              }}
            >
              Explore collections.
            </h2>
          </div>

          <a
            href="/products"
            className="flex items-center gap-1 text-[11px] font-medium tracking-[0.12em] uppercase
              text-neutral-400 hover:text-neutral-900
              border-b border-neutral-200 hover:border-neutral-900 pb-px
              transition-all duration-300 whitespace-nowrap"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.15s, color 0.3s, border-color 0.3s',
            }}
          >
            View all <ArrowUpRight size={11} />
          </a>
        </div>

        {/* ── Scroll track ── */}
        <div
          ref={scrollRef}
          className="cat-scroll flex gap-3 overflow-x-auto px-4 sm:px-6 pb-1 cursor-grab select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onScroll={updateProgress}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : categories.length > 0
              ? categories.map((cat, i) => (
                <div
                  key={cat.slug}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 0.55s ease ${delay(i)}, transform 0.55s ease ${delay(i)}`,
                  }}
                >
                  <CategoryCard {...cat} />
                </div>
              ))
              : (
                <p className="text-sm text-neutral-400 py-12 w-full text-center">
                  No categories available
                </p>
              )
          }
          {/* End spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* ── Right fade mask ── */}
        <div className="absolute top-0 right-0 bottom-0 w-16 pointer-events-none z-10
          bg-gradient-to-l from-white to-transparent" />

        {/* ── Progress bar ── */}
        {categories.length > 1 && (
          <div className="flex justify-center mt-5 px-4">
            <div className="relative h-px w-20 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-neutral-900 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Dev error notice */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="mx-4 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-xs">Using fallback: {error}</p>
          </div>
        )}
      </section>
    </>
  )
}

export default CategorySection