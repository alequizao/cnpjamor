import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import for GeistSans
import { GeistMono } from 'geist/font/mono'; // Corrected import for GeistMono
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans({ // Use the font object directly
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({ // Use the font object directly
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CNPJ Amor - Consulta de CNPJ',
  description: 'Consulte informações de CNPJ de forma rápida e com um toque de amor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
