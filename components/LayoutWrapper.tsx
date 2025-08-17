// components/LayoutWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't render navbar/footer for admin routes (AdminWrapper handles this)
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {children}
      </div>
      {/* <Footer /> if you have one */}
    </>
  );
}