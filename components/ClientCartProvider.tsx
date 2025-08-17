// app/components/ClientCartProvider.tsx
'use client';

// import { CartProvider } from "@/context/CartContext";
import { CartProvider } from "@/app/hooks/useCart";
import { ReactNode, useEffect, useState } from "react";

interface ClientCartProviderProps {
  children: ReactNode;
}

export default function ClientCartProvider({ children }: ClientCartProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a loading state or the children without cart context during SSR
    return <>{children}</>;
  }

  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}