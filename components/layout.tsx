import './globals.css';
import AuthGuard from '@/components/AuthGuard';
import UserMenu from '@/components/UserMenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <header className="flex justify-between items-center p-4 bg-white shadow">
            <h1 className="text-xl font-bold">Sasya Mantra</h1>
            <UserMenu />
          </header>
          <main>{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
