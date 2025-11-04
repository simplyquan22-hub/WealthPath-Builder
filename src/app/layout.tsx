import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import './globals.css';

export const metadata: Metadata = {
  title: 'WealthPath Calculator',
  description: 'Project your investment growth with the WealthPath compound interest calculator.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
