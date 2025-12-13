
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Building2, Calculator, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'ETF Portfolio Builder', icon: <Building2 className="h-5 w-5" /> },
  { href: '/calculator', label: 'Calculator', icon: <Calculator className="h-5 w-5" /> },
  { href: 'https://mywealthpath.org', label: "WealthPath's Main Page", icon: <Home className="h-5 w-5" />, external: true },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/my-logo.png" 
            alt="WealthPath Logo" 
            width={42} 
            height={42} 
            className="[filter:drop-shadow(0_0_8px_hsl(var(--brand)))]"
          />
          <span className="font-bold font-headline text-lg [text-shadow:0_0_8px_hsl(var(--brand)))]">WealthPath</span>
        </Link>
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left">
                <SheetTitle>WealthPath Menu</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      passHref
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-base gap-3 transition-colors duration-200",
                          "hover:bg-brand/20 hover:text-brand",
                          pathname === link.href && !link.external 
                            ? "bg-brand/10 text-brand font-semibold" 
                            : ""
                        )}
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
