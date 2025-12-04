
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-transparent text-foreground py-8 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold font-headline">WealthPath</h3>
            <p className="text-sm text-muted-foreground">“A Journey Uniquely Yours”</p>
          </div>
          <div className="text-center">
            <Link href="mailto:info@mywealthpath.org" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact Us : info@mywealthpath.org
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">&copy; 2026 WealthPath. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
