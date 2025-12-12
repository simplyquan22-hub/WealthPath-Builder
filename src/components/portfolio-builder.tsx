
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Trash2, Info, Star, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "./ui/animated-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const glassCardClasses = "border border-white/10 bg-card/50 backdrop-blur-sm shadow-[0_0_15px_2px_rgba(0,100,255,0.35)]";

type TickerTemplate = {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "alternatives";
  allocation: number;
};

const templates: Record<string, { allocation: Allocation; tickers: TickerTemplate[] }> = {
  "simple-beginner": {
    allocation: { stocks: 100, bonds: 0, alternatives: 0 },
    tickers: [
      { id: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'stocks', allocation: 80 },
      { id: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'stocks', allocation: 20 },
    ],
  },
  "advanced-beginner": {
    allocation: { stocks: 80, bonds: 20, alternatives: 0 },
    tickers: [
      { id: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'stocks', allocation: 60 },
      { id: 'VXUS', name: 'Vanguard Total International Stock ETF', category: 'stocks', allocation: 20 },
      { id: 'BND', name: 'Vanguard Total Bond Market ETF', category: 'bonds', allocation: 20 },
    ],
  },
  aggressive: {
    allocation: { stocks: 100, bonds: 0, alternatives: 0 },
    tickers: [
      { id: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'stocks', allocation: 70 },
      { id: 'QQQ', name: 'Invesco QQQ Trust', category: 'stocks', allocation: 30 },
    ],
  },
};


const categoryColors = {
    stocks: "text-blue-400",
    bonds: "text-green-400",
    alternatives: "text-purple-400",
};

const categoryBgColors = {
    stocks: "bg-blue-900/20",
    bonds: "bg-green-900/20",
    alternatives: "bg-purple-900/20",
};

const categoryHexColors: Record<string, string[]> = {
  stocks: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
  bonds: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0"],
  alternatives: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
}

const availableTickers = [
    // CORE U.S. MARKET ETFs
    { value: 'VTI', label: 'Vanguard Total Stock Market', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'ITOT', label: 'iShares Core S&P Total U.S. Stock Market', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'SCHB', label: 'Schwab U.S. Broad Market ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'VOO', label: 'Vanguard S&P 500 ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'SPY', label: 'SPDR S&P 500 ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'IVV', label: 'iShares Core S&P 500 ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'SPLG', label: 'SPDR Portfolio S&P 500 ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'SPYG', label: 'SPDR S&P 500 Growth ETF', category: 'stocks', group: 'Core U.S. Market' },
    { value: 'SPYV', label: 'SPDR S&P 500 Value ETF', category: 'stocks', group: 'Core U.S. Market' },

    // U.S. GROWTH ETFs
    { value: 'QQQ', label: 'Invesco QQQ Trust', category: 'stocks', group: 'U.S. Growth' },
    { value: 'QQQM', label: 'Invesco NASDAQ 100 ETF', category: 'stocks', group: 'U.S. Growth' },
    { value: 'VUG', label: 'Vanguard Growth ETF', category: 'stocks', group: 'U.S. Growth' },
    { value: 'SCHG', label: 'Schwab U.S. Large-Cap Growth ETF', category: 'stocks', group: 'U.S. Growth' },
    { value: 'IWF', label: 'iShares Russell 1000 Growth ETF', category: 'stocks', group: 'U.S. Growth' },

    // U.S. VALUE ETFs
    { value: 'VTV', label: 'Vanguard Value ETF', category: 'stocks', group: 'U.S. Value' },
    { value: 'SCHV', label: 'Schwab U.S. Large-Cap Value ETF', category: 'stocks', group: 'U.S. Value' },
    { value: 'IWD', label: 'iShares Russell 1000 Value ETF', category: 'stocks', group: 'U.S. Value' },
    { value: 'VBR', label: 'Vanguard Small-Cap Value ETF', category: 'stocks', group: 'U.S. Value' },
    { value: 'VOE', label: 'Vanguard Mid-Cap Value ETF', category: 'stocks', group: 'U.S. Value' },

    // U.S. MID-CAP ETFs
    { value: 'VO', label: 'Vanguard Mid-Cap ETF', category: 'stocks', group: 'U.S. Mid-Cap' },
    { value: 'IJH', label: 'iShares Core S&P Mid-Cap ETF', category: 'stocks', group: 'U.S. Mid-Cap' },
    { value: 'MDY', label: 'SPDR S&P Midcap 400 ETF', category: 'stocks', group: 'U.S. Mid-Cap' },

    // U.S. SMALL-CAP ETFs
    { value: 'VB', label: 'Vanguard Small-Cap ETF', category: 'stocks', group: 'U.S. Small-Cap' },
    { value: 'IJR', label: 'iShares Core S&P Small-Cap ETF', category: 'stocks', group: 'U.S. Small-Cap' },
    { value: 'SCHA', label: 'Schwab U.S. Small-Cap ETF', category: 'stocks', group: 'U.S. Small-Cap' },
    { value: 'IWM', label: 'iShares Russell 2000 ETF', category: 'stocks', group: 'U.S. Small-Cap' },
    { value: 'VTWO', label: 'Vanguard Russell 2000 ETF', category: 'stocks', group: 'U.S. Small-Cap' },

    // FACTOR ETFs
    { value: 'AVUV', label: 'Avantis U.S. Small Cap Value ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'AVUS', label: 'Avantis U.S. Equity ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'VFQY', label: 'Vanguard U.S. Quality Factor ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'VFMF', label: 'Vanguard U.S. Multifactor ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'IJS', label: 'iShares S&P Small-Cap 600 Value ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'QUAL', label: 'iShares MSCI USA Quality Factor ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'MTUM', label: 'iShares MSCI USA Momentum Factor ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'USMV', label: 'iShares MSCI USA Min Vol Factor ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'RPV', label: 'Invesco S&P 500 Pure Value ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'RPG', label: 'Invesco S&P 500 Pure Growth ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'AVDV', label: 'Avantis International Small Cap Value ETF', category: 'stocks', group: 'Factor ETFs' },
    { value: 'AVES', label: 'Avantis Emerging Markets Equity ETF', category: 'stocks', group: 'Factor ETFs' },

    // DIVIDEND ETFs
    { value: 'SCHD', label: 'Schwab U.S. Dividend Equity ETF', category: 'stocks', group: 'Dividend ETFs' },
    { value: 'VYM', label: 'Vanguard High Dividend Yield ETF', category: 'stocks', group: 'Dividend ETFs' },
    { value: 'DGRO', label: 'iShares Core Dividend Growth ETF', category: 'stocks', group: 'Dividend ETFs' },
    { value: 'SDY', label: 'SPDR S&P Dividend ETF', category: 'stocks', group: 'Dividend ETFs' },
    { value: 'NOBL', label: 'ProShares S&P 500 Dividend Aristocrats ETF', category: 'stocks', group: 'Dividend ETFs' },

    // TOTAL WORLD / GLOBAL ETFs
    { value: 'VT', label: 'Vanguard Total World Stock ETF', category: 'stocks', group: 'Global ETFs' },
    { value: 'ACWI', label: 'iShares MSCI ACWI ETF', category: 'stocks', group: 'Global ETFs' },
    { value: 'URTH', label: 'iShares MSCI World ETF', category: 'stocks', group: 'Global ETFs' },

    // INTERNATIONAL ETFs
    { value: 'VEA', label: 'Vanguard FTSE Developed Markets ETF', category: 'stocks', group: 'International' },
    { value: 'IEFA', label: 'iShares Core MSCI EAFE ETF', category: 'stocks', group: 'International' },
    { value: 'SCHF', label: 'Schwab International Equity ETF', category: 'stocks', group: 'International' },
    { value: 'SPDW', label: 'SPDR Portfolio Developed World ex-US ETF', category: 'stocks', group: 'International' },
    { value: 'VWO', label: 'Vanguard FTSE Emerging Markets ETF', category: 'stocks', group: 'International' },
    { value: 'IEMG', label: 'iShares Core MSCI Emerging Markets ETF', category: 'stocks', group: 'International' },
    { value: 'SCHE', label: 'Schwab Emerging Markets Equity ETF', category: 'stocks', group: 'International' },
    { value: 'EMXC', label: 'iShares MSCI Emerging Markets ex China ETF', category: 'stocks', group: 'International' },
    { value: 'VXUS', label: 'Vanguard Total International Stock ETF', category: 'stocks', group: 'International' },
    { value: 'IXUS', label: 'iShares Core MSCI Total International Stock ETF', category: 'stocks', group: 'International' },
    
    // SECTOR ETFs
    { value: 'VGT', label: 'Vanguard Information Technology ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'FTEC', label: 'Fidelity MSCI Information Tech ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VFH', label: 'Vanguard Financials ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VHT', label: 'Vanguard Health Care ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VDE', label: 'Vanguard Energy ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VIS', label: 'Vanguard Industrials ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VCR', label: 'Vanguard Consumer Discretionary ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VDC', label: 'Vanguard Consumer Staples ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VPU', label: 'Vanguard Utilities ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'VOX', label: 'Vanguard Communication Services ETF', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLK', label: 'Technology Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLF', label: 'Financial Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLV', label: 'Health Care Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLE', label: 'Energy Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLI', label: 'Industrial Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLY', label: 'Consumer Discretionary Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLP', label: 'Consumer Staples Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLU', label: 'Utilities Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },
    { value: 'XLC', label: 'Communication Services Select Sector SPDR Fund', category: 'stocks', group: 'Sector ETFs' },

    // BOND ETFs
    { value: 'BND', label: 'Vanguard Total Bond Market ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'AGG', label: 'iShares Core U.S. Aggregate Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'VGSH', label: 'Vanguard Short-Term Treasury ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'VGIT', label: 'Vanguard Intermediate-Term Treasury ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'VGLT', label: 'Vanguard Long-Term Treasury ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'SHY', label: 'iShares 1-3 Year Treasury Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'TLT', label: 'iShares 20+ Year Treasury Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'VTIP', label: 'Vanguard Short-Term Inflation-Protected Securities ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'TIP', label: 'iShares TIPS Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'LQD', label: 'iShares iBoxx $ Investment Grade Corporate Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'VCIT', label: 'Vanguard Intermediate-Term Corporate Bond ETF', category: 'bonds', group: 'Bond ETFs' },
    { value: 'HYG', label: 'iShares iBoxx $ High Yield Corporate Bond ETF', category: 'bonds', group: 'Bond ETFs' },

    // COMMODITIES & HEDGES
    { value: 'GLD', label: 'SPDR Gold Shares', category: 'alternatives', group: 'Commodities & Hedges' },
    { value: 'IAU', label: 'iShares Gold Trust', category: 'alternatives', group: 'Commodities & Hedges' },
    { value: 'SLV', label: 'iShares Silver Trust', category: 'alternatives', group: 'Commodities & Hedges' },
    { value: 'PDBC', label: 'Invesco Optimum Yield Diversified Commodity Strategy No K-1 ETF', category: 'alternatives', group: 'Commodities & Hedges' },
    { value: 'DBC', label: 'Invesco DB Commodity Index Tracking Fund', category: 'alternatives', group: 'Commodities & Hedges' },

    // THEME ETFs
    { value: 'ARKK', label: 'ARK Innovation ETF', category: 'stocks', group: 'Theme ETFs' },
    { value: 'ARKG', label: 'ARK Genomic Revolution ETF', category: 'stocks', group: 'Theme ETFs' },
    { value: 'BOTZ', label: 'Global X Robotics & Artificial Intelligence ETF', category: 'stocks', group: 'Theme ETFs' },
    { value: 'CIBR', label: 'First Trust NASDAQ Cybersecurity ETF', category: 'stocks', group: 'Theme ETFs' },
    { value: 'TAN', label: 'Invesco Solar ETF', category: 'stocks', group: 'Theme ETFs' },
    { value: 'PBW', label: 'Invesco WilderHill Clean Energy ETF', category: 'stocks', group: 'Theme ETFs' },

    // Individual Stocks
    { value: 'AAPL', label: 'Apple Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'MSFT', label: 'Microsoft Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'GOOGL', label: 'Alphabet Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'AMZN', label: 'Amazon.com Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'NVDA', label: 'NVIDIA Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'META', label: 'Meta Platforms Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'TSLA', label: 'Tesla Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'JPM', label: 'JPMorgan Chase & Co.', category: 'stocks', group: 'Stocks' },
    { value: 'UNH', label: 'UnitedHealth Group', category: 'stocks', group: 'Stocks' },
    { value: 'XOM', label: 'Exxon Mobil Corp.', category: 'stocks', group: 'Stocks' },
    { value: 'V', label: 'Visa Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'PG', label: 'Procter & Gamble', category: 'stocks', group: 'Stocks' },
    { value: 'JNJ', label: 'Johnson & Johnson', category: 'stocks', group: 'Stocks' },
    { value: 'NKE', label: 'Nike Inc.', category: 'stocks', group: 'Stocks' },
    { value: 'DIS', label: 'Walt Disney Co.', category: 'stocks', group: 'Stocks' },

    // Vanguard Mutual Funds
    { value: 'VTSAX', label: 'Vanguard Total Stock Market Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VFIAX', label: 'Vanguard 500 Index Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VSMAX', label: 'Vanguard Small-Cap Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VIMAX', label: 'Vanguard Mid-Cap Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VVIAX', label: 'Vanguard Value Index Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VIGAX', label: 'Vanguard Growth Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VINIX', label: 'Vanguard Institutional Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VFWAX', label: 'Vanguard FTSE All-World ex-US Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VTMGX', label: 'Vanguard Developed Markets Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VEMAX', label: 'Vanguard Emerging Markets Stock Index Fund', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VBTLX', label: 'Vanguard Total Bond Market Index Fund', category: 'bonds', group: 'Vanguard Mutual Funds' },
    { value: 'VTABX', label: 'Vanguard Total International Bond Index Fund', category: 'bonds', group: 'Vanguard Mutual Funds' },
    { value: 'VWIAX', label: 'Vanguard Wellington Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VWENX', label: 'Vanguard Wellington Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VGHAX', label: 'Vanguard Health Care Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },
    { value: 'VGSIX', label: 'Vanguard Real Estate Index Fund Admiral Shares', category: 'alternatives', group: 'Vanguard Mutual Funds' },
    { value: 'VFSTX', label: 'Vanguard Short-Term Investment-Grade Fund', category: 'bonds', group: 'Vanguard Mutual Funds' },
    { value: 'VMMXX', label: 'Vanguard Prime Money Market Fund', category: 'bonds', group: 'Vanguard Mutual Funds' },
    { value: 'VWAHX', label: 'Vanguard High-Yield Corporate Fund Admiral Shares', category: 'bonds', group: 'Vanguard Mutual Funds' },
    { value: 'VWUSX', label: 'Vanguard U.S. Growth Fund Admiral Shares', category: 'stocks', group: 'Vanguard Mutual Funds' },

    // Fidelity Mutual Funds
    { value: 'FSKAX', label: 'Fidelity Total Market Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FXAIX', label: 'Fidelity 500 Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FZROX', label: 'Fidelity ZERO Total Market Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FZILX', label: 'Fidelity ZERO International Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FSMDX', label: 'Fidelity Mid Cap Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FSSNX', label: 'Fidelity Small Cap Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FISVX', label: 'Fidelity Small Cap Value Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },
    { value: 'FLCOX', label: 'Fidelity Corporate Bond Fund', category: 'bonds', group: 'Fidelity Mutual Funds' },
    { value: 'FIPDX', label: 'Fidelity Inflation-Protected Bond Index Fund', category: 'bonds', group: 'Fidelity Mutual Funds' },
    { value: 'FNILX', label: 'Fidelity ZERO Large Cap Index Fund', category: 'stocks', group: 'Fidelity Mutual Funds' },

    // Schwab Mutual Funds
    { value: 'SWTSX', label: 'Schwab Total Stock Market Index', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWPPX', label: 'Schwab S&P 500 Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWISX', label: 'Schwab International Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWAGX', label: 'Schwab U.S. Aggregate Bond Index Fund', category: 'bonds', group: 'Schwab Mutual Funds' },
    { value: 'SWLGX', label: 'Schwab U.S. Large-Cap Growth Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWLVX', label: 'Schwab U.S. Large-Cap Value Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWRSX', label: 'Schwab Global Real Estate Fund', category: 'alternatives', group: 'Schwab Mutual Funds' },
    { value: 'SWEMX', label: 'Schwab Emerging Markets Equity ETF', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWTIX', label: 'Schwab Treasury Inflation Protected Securities Index', category: 'bonds', group: 'Schwab Mutual Funds' },
    { value: 'SWMIX', label: 'Schwab U.S. Mid-Cap Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWSMX', label: 'Schwab Small-Cap Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWOBX', label: 'Schwab Short-Term Bond Index Fund', category: 'bonds', group: 'Schwab Mutual Funds' },
    { value: 'SWYMX', label: 'Schwab Municipal Bond Fund', category: 'bonds', group: 'Schwab Mutual Funds' },
    { value: 'SWCRX', label: 'Schwab Commodity Index Fund', category: 'alternatives', group: 'Schwab Mutual Funds' },
    { value: 'SWPSX', label: 'Schwab U.S. Dividend Equity ETF', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWPRX', label: 'Schwab International Bond Fund', category: 'bonds', group: 'Schwab Mutual Funds' },
    { value: 'SWCAX', label: 'Schwab Aggressive Allocation Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWBGX', label: 'Schwab Balanced Index Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWERX', label: 'Schwab Emerging Markets Equity Fund', category: 'stocks', group: 'Schwab Mutual Funds' },
    { value: 'SWDRX', label: 'Schwab Developed International Value Fund', category: 'stocks', group: 'Schwab Mutual Funds' },

    // Real Estate
    { value: 'VNQ', label: 'Vanguard Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'SCHH', label: 'Schwab U.S. REIT ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'IYR', label: 'iShares U.S. Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'XLRE', label: 'Real Estate Select Sector SPDR Fund', category: 'alternatives', group: 'Real Estate' },
    { value: 'O', label: 'Realty Income Corp.', category: 'alternatives', group: 'Real Estate' },
    { value: 'AMT', label: 'American Tower Corp.', category: 'alternatives', group: 'Real Estate' },
    { value: 'PLD', label: 'Prologis Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'SPG', label: 'Simon Property Group', category: 'alternatives', group: 'Real Estate' },
    { value: 'CCI', label: 'Crown Castle Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'PSA', label: 'Public Storage', category: 'alternatives', group: 'Real Estate' },
    { value: 'EQR', label: 'Equity Residential', category: 'alternatives', group: 'Real Estate' },
    { value: 'WELL', label: 'Welltower Inc.', category: 'alternatives', group: 'Real Estate' },
    { value: 'AVB', label: 'AvalonBay Communities', category: 'alternatives', group: 'Real Estate' },
    { value: 'NLY', label: 'Annaly Capital Management', category: 'alternatives', group: 'Real Estate' },
    { value: 'STAG', label: 'STAG Industrial Inc.', category: 'alternatives', group: 'Real Estate' },

    // Crypto
    { value: 'BTC-USD', label: 'Bitcoin', category: 'alternatives', group: 'Crypto' },
    { value: 'ETH-USD', label: 'Ethereum', category: 'alternatives', group: 'Crypto' },
    { value: 'SOL-USD', label: 'Solana', category: 'alternatives', group: 'Crypto' },
    { value: 'ADA-USD', label: 'Cardano', category: 'alternatives', group: 'Crypto' },
    { value: 'AVAX-USD', label: 'Avalanche', category: 'alternatives', group: 'Crypto' },
    { value: 'XRP-USD', label: 'Ripple', category: 'alternatives', group: 'Crypto' },
    { value: 'DOGE-USD', label: 'Dogecoin', category: 'alternatives', group: 'Crypto' },
    { value: 'DOT-USD', label: 'Polkadot', category: 'alternatives', group: 'Crypto' },
    { value: 'LTC-USD', label: 'Litecoin', category: 'alternatives', group: 'Crypto' },
    { value: 'LINK-USD', label: 'Chainlink', category: 'alternatives', group: 'Crypto' },
    { value: 'MATIC-USD', label: 'Polygon', category: 'alternatives', group: 'Crypto' },
    { value: 'TRX-USD', label: 'TRON', category: 'alternatives', group: 'Crypto' },
    { value: 'BCH-USD', label: 'Bitcoin Cash', category: 'alternatives', group: 'Crypto' },
    { value: 'NEAR-USD', label: 'Near Protocol', category: 'alternatives', group: 'Crypto' },
    { value: 'ICP-USD', label: 'Internet Computer', category: 'alternatives', group: 'Crypto' },
];

const uniqueTickers = Array.from(new Set(availableTickers.map(t => t.value)))
  .map(value => {
    return availableTickers.find(t => t.value === value)!;
  });


const tickerGroups = uniqueTickers.reduce((acc, ticker) => {
    const group = ticker.group || "Other";
    if (!acc[group]) {
        acc[group] = [];
    }
    acc[group].push(ticker);
    return acc;
}, {} as Record<string, typeof uniqueTickers>);


type Allocation = {
  stocks: number;
  bonds: number;
  alternatives: number;
};

type Ticker = {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "alternatives";
  allocation: number;
};

const STORAGE_KEY = 'wealthpath-portfolio-state';

export function PortfolioBuilder() {
  const router = useRouter();
  const [portfolioName, setPortfolioName] = React.useState("");
  const [allocation, setAllocation] = React.useState<Allocation>({ stocks: 60, bonds: 30, alternatives: 10 });
  const [selectedTickers, setSelectedTickers] = React.useState<Ticker[]>([]);
  const [comboboxOpen, setComboboxOpen] = React.useState(false);
  const allocationRef = React.useRef<HTMLDivElement>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const { portfolioName, allocation, selectedTickers } = JSON.parse(savedState);
            if (portfolioName) setPortfolioName(portfolioName);
            if (allocation) setAllocation(allocation);
            if (selectedTickers) setSelectedTickers(selectedTickers);
        }
    } catch (error) {
        console.error("Failed to parse portfolio state from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    try {
        const stateToSave = JSON.stringify({ portfolioName, allocation, selectedTickers });
        localStorage.setItem(STORAGE_KEY, stateToSave);
    } catch (error) {
        console.error("Failed to save portfolio state to localStorage", error);
    }
  }, [portfolioName, allocation, selectedTickers]);


  const handleTemplateSelect = (templateKey: "simple-beginner" | "advanced-beginner" | "aggressive") => {
    const selectedTemplate = templates[templateKey];
    setAllocation(selectedTemplate.allocation);
    setSelectedTickers(selectedTemplate.tickers);
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCustomTemplate = () => {
    setAllocation({ stocks: 60, bonds: 30, alternatives: 10 });
    setSelectedTickers([]);
    setPortfolioName("My Custom Portfolio");
    allocationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSingleSliderChange = (name: keyof Allocation, value: number) => {
    const oldValue = allocation[name];
    const diff = value - oldValue;
    let newAllocation = { ...allocation, [name]: value };

    const otherKeys = (Object.keys(allocation) as (keyof Allocation)[]).filter(k => k !== name);

    let firstKey = otherKeys[0];
    let secondKey = otherKeys[1];
    let total = newAllocation.stocks + newAllocation.bonds + newAllocation.alternatives;
    
    if (total > 100) {
        const excess = total - 100;
        if(newAllocation[firstKey] >= excess) {
            newAllocation[firstKey] -= excess;
        } else {
            const remaining = excess - newAllocation[firstKey];
            newAllocation[firstKey] = 0;
            newAllocation[secondKey] -= remaining;
        }
    } else if (total < 100) {
        const deficit = 100 - total;
         if(newAllocation[firstKey] + deficit <= 100) {
            newAllocation[firstKey] += deficit;
        } else {
            const remaining = (newAllocation[firstKey] + deficit) - 100;
            newAllocation[firstKey] = 100;
            newAllocation[secondKey] += remaining;
        }
    }


    setAllocation({
      stocks: Math.round(newAllocation.stocks),
      bonds: Math.round(newAllocation.bonds),
      alternatives: Math.round(newAllocation.alternatives),
    });
};


  const handleAddTicker = (tickerValue: string) => {
    const tickerData = uniqueTickers.find(t => t.value === tickerValue);
    if (tickerData && !selectedTickers.find(t => t.id === tickerData.value)) {
      setSelectedTickers(prev => [
        ...prev,
        { id: tickerData.value, name: tickerData.label, category: tickerData.category as any, allocation: 0 }
      ]);
    }
    setComboboxOpen(false);
  };

  const handleRemoveTicker = (tickerId: string) => {
    setSelectedTickers(prev => prev.filter(t => t.id !== tickerId));
  };
  
  const handleTickerAllocationChange = (tickerId: string, newAllocation: number) => {
    setSelectedTickers(prev => prev.map(t => t.id === tickerId ? { ...t, allocation: newAllocation } : t));
  };

  const getCategoryTickers = (category: keyof Allocation) => selectedTickers.filter(t => t.category === category);
  
  const getCategoryTotalAllocation = (category: keyof Allocation) => {
    return getCategoryTickers(category).reduce((total, ticker) => total + ticker.allocation, 0);
  };

  const renderCategorySection = (category: keyof Allocation, title: string) => {
      const tickers = getCategoryTickers(category);
      const totalAllocation = getCategoryTotalAllocation(category);

      return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className={cn("font-semibold text-lg", categoryColors[category])}>{title}</h4>
                <div className="flex items-center gap-4">
                    <span className={cn("text-sm", totalAllocation > 100 ? "text-destructive" : "text-muted-foreground")}>
                        Total: {totalAllocation}%
                    </span>
                    <span className={cn("text-lg font-bold", categoryColors[category])}>{allocation[category]}%</span>
                </div>
            </div>
             <div className="space-y-2">
                {tickers.length > 0 ? tickers.map(t => (
                    <div key={t.id} className={cn("flex items-center justify-between p-2 rounded-md gap-2", categoryBgColors[category])}>
                        <span className="flex-1 truncate text-sm">{t.id}</span>
                        <div className="flex items-center gap-2">
                          <Input 
                              type="number" 
                              value={t.allocation}
                              onChange={(e) => handleTickerAllocationChange(t.id, parseInt(e.target.value) || 0)}
                              className="w-20 h-8 text-right"
                              max={100}
                              min={0}
                          />
                          <span className="text-muted-foreground">%</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTicker(t.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4 rounded-md bg-background/20">
                        Add tickers to this category to see allocation details.
                    </div>
                )}
            </div>
        </div>
      );
  }


  return (
    <div className="space-y-8">
      <Card className={glassCardClasses}>
        <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Info className="h-6 w-6" /> <span>How to Use the Portfolio Builder</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>
                This tool helps you design a custom investment portfolio. Follow these steps to create a portfolio that aligns with your financial goals and risk tolerance.
            </p>
            <ul className="space-y-3 list-decimal list-inside">
                <li>
                    <strong className="text-foreground">Name Your Portfolio:</strong> Give your portfolio a descriptive name, like "My First Roth IRA" or "Aggressive Growth Plan."
                </li>
                <li>
                    <strong className="text-foreground">Choose a Template:</strong> Select a <span className="text-primary">beginner-friendly</span> template to get started. This will automatically load a recommended set of ETFs and their allocations.
                </li>
                <li>
                    <strong className="text-foreground">Adjust Allocation:</strong> Fine-tune the percentage of your portfolio dedicated to each asset class using the sliders. The total must equal 100%.
                </li>
                <li>
                    <strong className="text-foreground">Add or Remove Tickers:</strong> Customize the portfolio by adding new stocks, ETFs, or funds, or by removing ones you don't want.
                </li>
                <li>
                    <strong className="text-foreground">Allocate to Tickers:</strong> In the Portfolio Summary, assign a percentage to each ticker within its category. The total for each category must equal 100%.
                </li>
                <li>
                    <strong className="text-foreground">Project Growth:</strong> Once you're done, click "<span className="text-primary">Project My Growth</span>" to see how your custom portfolio could perform over time in the calculator.
                </li>
            </ul>
        </CardContent>
      </Card>

      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">1. Name Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="My First Roth IRA Portfolio"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="h-12 text-base md:text-sm"
          />
        </CardContent>
      </Card>

      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">2. Choose a Template</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedButton onClick={() => handleTemplateSelect("simple-beginner")}>⭐ Super Simple Beginner</AnimatedButton>
          <AnimatedButton onClick={() => handleTemplateSelect("advanced-beginner")}>⭐ Slightly Advanced</AnimatedButton>
          <AnimatedButton onClick={() => handleTemplateSelect("aggressive")}>⭐ Aggressive</AnimatedButton>
          <AnimatedButton onClick={handleCustomTemplate}>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" /> Custom
            </div>
          </AnimatedButton>
        </CardContent>
      </Card>

      <Card className={glassCardClasses} ref={allocationRef}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">3. Adjust Allocation</CardTitle>
           <p className="text-sm text-muted-foreground">Total Allocation: {allocation.stocks + allocation.bonds + allocation.alternatives}%</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className={cn("flex justify-between text-base", categoryColors.stocks)}><span>Stocks</span><span>{allocation.stocks}%</span></Label>
            <Slider value={[allocation.stocks]} onValueChange={(v) => handleSingleSliderChange("stocks", v[0])} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className={cn("flex justify-between text-base", categoryColors.bonds)}><span>Bonds</span><span>{allocation.bonds}%</span></Label>
            <Slider value={[allocation.bonds]} onValueChange={(v) => handleSingleSliderChange("bonds", v[0])} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label className={cn("flex justify-between text-base", categoryColors.alternatives)}><span>Alternatives</span><span>{allocation.alternatives}%</span></Label>
            <Slider value={[allocation.alternatives]} onValueChange={(v) => handleSingleSliderChange("alternatives", v[0])} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

       <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">4. Add Tickers</CardTitle>
        </CardHeader>
        <CardContent>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between h-12 text-base md:text-sm"
                    >
                        Search and add a ticker...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search ticker..." />
                        <CommandList>
                            <CommandEmpty>No ticker found.</CommandEmpty>
                            {Object.entries(tickerGroups).map(([group, tickers]) => (
                                <CommandGroup key={group} heading={group}>
                                    {tickers.map(t => (
                                        <CommandItem
                                            key={t.value}
                                            value={`${t.label} (${t.value})`}
                                            onSelect={() => handleAddTicker(t.value)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={cn("w-2 h-2 rounded-full", t.category === 'stocks' ? 'bg-blue-500' : t.category === 'bonds' ? 'bg-green-500' : 'bg-purple-500')} />
                                                <span>{t.label} ({t.value})</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </CardContent>
      </Card>
      
      <Card className={glassCardClasses} ref={summaryRef}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">5. Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-8">
                {renderCategorySection("stocks", "Stocks")}
                {renderCategorySection("bonds", "Bonds")}
                {renderCategorySection("alternatives", "Alternatives")}
            </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
         <AnimatedButton onClick={() => router.back()} >
            <div className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </div>
        </AnimatedButton>
        <AnimatedButton onClick={() => router.push("/calculator")} className="w-full sm:w-auto">
          <div className="flex items-center">
            Project My Growth
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </AnimatedButton>
      </div>
    </div>
  );
}
