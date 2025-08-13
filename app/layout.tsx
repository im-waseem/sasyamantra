import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/app/admin/context/CartContext'; // ✅ make sure path is correct

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar /> {/* Navbar can now safely use useCart */}
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
