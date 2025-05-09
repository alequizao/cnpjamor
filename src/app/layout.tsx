
import type {Metadata} from 'next';
// Imports are correct as per Geist documentation (named imports)
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// The 'GeistSans' and 'GeistMono' imported are objects, not functions.
// We don't need to call them. We use their '.variable' property directly.
// The following lines, which caused the TypeError, are removed:
// const geistSans = GeistSans({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });
// const geistMono = GeistMono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

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
    // Use GeistSans.variable and GeistMono.variable directly.
    // These properties contain the CSS variable names (e.g., "--font-sans").
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/*
        The `font-sans` class on body will utilize the CSS variable defined by GeistSans.variable.
        The geist-font package is designed so that GeistSans.variable often corresponds to
        a standard variable name like '--font-sans', which Tailwind's `font-sans` utility
        then picks up by default.
      */}
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
