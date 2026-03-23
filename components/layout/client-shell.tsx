"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isOffer = pathname?.startsWith("/offer");

  // Hide footer on admin OR offer pages
  const hideFooter = isAdmin || isOffer;

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}