import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-transparent text-foreground py-8 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center md:text-left space-y-4 md:space-y-0 mb-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold font-headline">WealthPath</h3>
            <p className="text-sm text-muted-foreground">“A Journey Uniquely Yours”</p>
          </div>
          <div className="flex-1 text-center">
            <Link href="mailto:info@mywealthpath.org" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact Us : info@mywealthpath.org
            </Link>
          </div>
          <div className="flex-1" />
        </div>
        <div className="text-sm text-muted-foreground pt-4 border-t border-white/10 mt-4">
          <p>&copy; 2026 WealthPath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
