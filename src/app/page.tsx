"use client"; // Required for useState and event handlers

import { useState } from 'react';
import { CnpjForm } from '@/components/cnpj-form';
import { CnpjDisplay } from '@/components/cnpj-display';
import FloatingHearts from '@/components/floating-hearts';
import type { CnpjInfo } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [cnpjData, setCnpjData] = useState<CnpjInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCnpjDataFetched = (data: CnpjInfo | null, errorMessage?: string) => {
    setCnpjData(data);
    setError(errorMessage || null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <FloatingHearts />
      
      <main className="z-10 w-full max-w-lg mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            CNPJ Amor
            <span role="img" aria-label="heart emoji" className="ml-2">💖</span>
          </h1>
          <p className="mt-2 text-lg text-foreground/80">
            Consulte informações de CNPJ com um toque de carinho!
          </p>
        </header>

        <Card className="w-full shadow-2xl rounded-2xl">
          <CardContent className="p-6 sm:p-8">
            <CnpjForm onCnpjDataFetched={handleCnpjDataFetched} />
          </CardContent>
        </Card>

        {cnpjData && !error && (
          <div className="w-full animate-in fade-in duration-500">
            <CnpjDisplay data={cnpjData} />
          </div>
        )}
        
        {error && !cnpjData && (
          <Card className="w-full shadow-lg rounded-xl border-destructive bg-destructive/10">
            <CardContent className="p-6 text-center">
              <p className="text-destructive-foreground [--destructive-foreground:hsl(var(--destructive))] font-semibold">{error}</p>
            </CardContent>
          </Card>
        )}
      </main>
      
      <footer className="z-10 mt-12 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} CNPJ Amor. Feito com <HeartIcon className="inline h-4 w-4 text-primary" /> para você.</p>
      </footer>
    </div>
  );
}

// Simple inline heart icon for the footer
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
