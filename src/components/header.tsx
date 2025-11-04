
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, BarChart, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Risk Quiz', icon: FileQuestion },
  { href: '/portfolio-builder', label: 'Portfolio Builder', icon: Sheet },
  { href: '/calculator', label: 'Calculator', icon: BarChart },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="hsl(var(--primary))" />
            <path d="M12 12L22 7" stroke="hsl(var(--background))" strokeWidth="1.5" />
            <path d="M12 12V22" stroke="hsl(var(--background))" strokeWidth="1.5" />
            <path d="M12 12L2 7" stroke="hsl(var(--background))" strokeWidth="1.5" />
            <path d="M2 17L7 14.5" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <path d="M22 17L17 14.5" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          </svg>
          <span className="font-bold font-headline text-lg">WealthPath</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
