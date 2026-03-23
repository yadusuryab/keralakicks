import Hero from "@/components/sections/hero";
import MarqueeStrip from "@/components/sections/marquee-strip";
import CategorySection from "@/components/sections/category";
import ProductsSection from "@/components/sections/products";
import PromoBanner from "@/components/sections/promo-banner";
import TrustBar from "@/components/sections/trust-bar";
import AboutTeaser from "@/components/sections/about-teaser";
import { getHomeProducts, getTrendingProducts } from "@/lib/queries/product";
import BrandsGrid from "@/components/sections/brand-grid";
import BrandsMarquee from "@/components/sections/brand-marquee";
import Link from "next/link";
import { Zap } from "lucide-react";
import OfferBanner from "@/components/cards/offer-banner";

export default async function Home() {
  const [homeProducts, trendingProducts] = await Promise.all([
    getHomeProducts(),
    getTrendingProducts(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1 ── Hero carousel */}
      <Hero />

      {/* 2 ── Scrolling promo ticker */}
      <MarqueeStrip />
      <BrandsMarquee />
       {/* ── BOGO Offer Banner ── */}
    <OfferBanner/>
      <BrandsGrid />

      {/* 3 ── Category grid */}
      <CategorySection />

      {/* 4 ── New arrivals product grid */}
      <ProductsSection
        products={homeProducts}
        title="New Arrivals"
        desc="Just landed"
        showViewAll={true}
        deskCols={4}
      />

     

      {/* 5 ── Full-width editorial promo banner */}
      <PromoBanner
        heading={"The New Collections\nIs Here."}
        subheading="Discover the latest drops — curated pieces built for you."
        ctaText="Shop the Collection"
        ctaHref="/products"
        imageUrl="/hero.avif"
        tag="SS '25"
      />

      {/* 6 ── Trending products grid */}
      <ProductsSection
        products={trendingProducts}
        title="Trending Now"
        desc="Most loved this week"
        showViewAll={true}
        deskCols={4}
      />

      {/* 7 ── Trust badges */}
      <TrustBar />

      {/* 8 ── Brand story teaser */}
      <AboutTeaser
        imageUrl="/1000493175.jpg.jpeg"
        heading={"Designed for you."}
        body="We believe fashion should feel effortless. Every piece is thoughtfully sourced — quality products, and a commitment to lasting style over passing trends."
        ctaText="Our Story"
        ctaHref="/about"
        stat1={{ value: "500+", label: "Premium Products" }}
        stat2={{ value: "2k+", label: "Happy customers" }}
        stat3={{ value: "4.8★", label: "Avg. rating" }}
      />
    </div>
  );
}