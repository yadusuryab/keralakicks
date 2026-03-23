import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

function OfferBanner() {
  return (
    <div className="px-4 py-6 max-w-7xl mx-auto w-full">
      <Link
        href="/offer"
        className="group relative flex items-center justify-between gap-4 overflow-hidden
       rounded px-6 py-5 sm:px-8 sm:py-6 transition-transform duration-200
        hover:scale-[0.995] active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(135deg, #0169FF 0%, #004099 40%, #9ec6ff 100%)",
        }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-700/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        {/* Left: text */}
        <div className="relative flex items-center gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/15 border border-blue-500/25
          rounded-xl flex items-center justify-center shrink-0"
          >
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 fill-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-blue-400 tracking-[0.12em] uppercase">
                Limited Offer
              </span>
            </div>
            <p className="text-white font-bold text-lg sm:text-xl leading-tight">
              Buy One,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                Get One Free
              </span>
            </p>
            <p className="text-white/70 text-xs sm:text-sm mt-0.5">
              Any 2 pairs for just{" "}
              <span className="text-white font-semibold">₹1,499</span>
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <Button size={'icon'} variant={'secondary'} className="shadow-none rounded-full">
    <ArrowRight/>
</Button>
      </Link>
    </div>
  );
}

export default OfferBanner;
