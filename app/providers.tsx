"use client";

import { CartProvider } from "./context/CartContext";
import AdminWrapper from "@/components/AdminLayoutWrapper";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <AdminWrapper>
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
      </AdminWrapper>
    </CartProvider>
  );
}
