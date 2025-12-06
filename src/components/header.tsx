
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Risk Quiz', description: 'Find your investment style.', emoji: '🤔' },
  { href: '/portfolio-builder', label: 'Portfolio Builder', description: 'Design your perfect portfolio.', emoji: '🏗️' },
  { href: '/calculator', label: 'Calculator', description: 'Project your financial future.', emoji: '🧮' },
  { href: 'https://mywealthpath.org', label: 'WealthPath\'s Main Page', description: 'Visit our homepage.', emoji: '🏠', external: true },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">WealthPath</span>
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
              <SheetHeader className="text-center">
                <SheetTitle>WealthPath Menu</SheetTitle>
                <Separator className="bg-primary h-[2px] mx-auto w-1/2" />
              </SheetHeader>
              <div className="flex flex-col space-y-4 pt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      passHref
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      <Button
                        variant={pathname === link.href ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-4"
                      >
                        <div className="flex items-center gap-4">
                           <span className="text-2xl">{link.emoji}</span>
                           <div className="flex flex-col">
                                <span className="text-base font-semibold">{link.label}</span>
                                <span className="text-sm font-normal text-muted-foreground">{link.description}</span>
                           </div>
                        </div>
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
