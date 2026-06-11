import type {Metadata} from 'next';
import { Kantumruy_Pro, Inter } from 'next/font/google';
import './globals.css';

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  variable: '--font-kantumruy',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SecureAttend - HR & Payroll',
  description: 'A multi-tenant employee attendance + HR/payroll system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${kantumruy.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-kantumruy bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        {children}
      </body>
    </html>
  );
}
