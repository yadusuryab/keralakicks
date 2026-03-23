"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../cards/product-card";
import { Product } from "@/lib/queries/product";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="w-full aspect-[3/4] rounded bg-black/[0.05] overflow-hidden relative">
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          }}
        />
      </div>
      <div className="h-2.5 w-3/4 rounded bg-black/[0.05]" />
      <div className="h-2.5 w-1/3 rounded bg-black/[0.05]" />
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  products: Product[]
  title?: string
  desc?: string
  showViewAll?: boolean
  deskCols?: number
}

// ── Animation Variants ────────────────────────────────────────────────────
const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const fadeUpVars = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ── Component ─────────────────────────────────────────────────────────────────
function ProductsSection({
  products,
  title = "Explore",
  desc = "",
  showViewAll = false,
  deskCols = 4,
}: Props) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const colClass: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
  }

  return (
    <div
  
      className="py-6 px-3 sm:px-4"
    >
      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4 mb-5 px-1">
        <div>
          {/* Eyebrow label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="block w-4 h-px bg-primary/60" />
            <span className="text-[9px] tracking-[0.2em] uppercase text-primary/80 font-medium">
              {desc || 'Products'}
            </span>
          </div>

          {/* Title */}
          <h2
           
            className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
          >
            {title}
          </h2>
        </div>

        {/* View all link */}
        {showViewAll && (
          <div ><Link
              href="/products"
              className="inline-flex items-center gap-1.5
                text-[11px] font-medium tracking-[0.1em] uppercase
                text-muted-foreground hover:text-foreground
                border-b border-border hover:border-foreground pb-px
                transition-all duration-200"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Grid ── */}
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:gap-4 mb-6",
          colClass[deskCols] ?? 'md:grid-cols-4'
        )}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground py-16 tracking-wide">
            No products found.
          </p>
        ) : (
          products.map((prod) => (
            <div key={prod._id}>
              <ProductCard
                id={prod._id}
                name={prod.name}
                rating={prod.rating}
                imageUrl={prod.image}
                price={prod.price}
                salesPrice={prod.salesPrice}
              />
            </div>
          ))
        )}
      </div>

      {/* ── Bottom View All button ── */}
      {showViewAll && products.length > 0 && !loading && (
          <Link
            href="/products"
           
          >
          <Button className="w-full shadow-none text-muted-foreground" variant={'outline'} size={'lg'} >
          View more products
            <ArrowRight
              size={12}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Button>
          </Link>
      )}
    </div>
  )
}

export default ProductsSection