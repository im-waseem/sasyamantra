import './globals.css';
import { ReactNode } from "react";
import LayoutWrapper from '@/components/LayoutWrapper';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // We will pass children to LayoutWrapper
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
