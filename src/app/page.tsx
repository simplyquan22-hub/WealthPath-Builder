
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Trash2, Info, Star, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { analyzePortfolio, PortfolioAnalysis } from "@/lib/portfolio-analyzer";
import { PortfolioAnalysisDisplay } from "@/components/portfolio-analysis";
import etfData from '@/lib/etf-data.json';
import { Badge } from "@/components/ui/badge";

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

const allAvailableTickers = [
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
    { value: 'SLV', label: 'iShares Silver Trust', category: 'alternatives', group: 'Commodatives & Hedges' },
    { value: 'PDBC', label: 'Invesco Optimum Yield Diversified Commodity Strategy No K-1 ETF', category: 'alternatives', group: 'Commodities & Hedges' },
    { value: 'DBC', label: 'Invesco DB Commodity Index Tracking Fund', category: 'alternatives', group: 'Commodities & Hedges' },
    
    // Real Estate
    { value: 'VNQ', label: 'Vanguard Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'SCHH', label: 'Schwab U.S. REIT ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'IYR', label: 'iShares U.S. Real Estate ETF', category: 'alternatives', group: 'Real Estate' },
    { value: 'XLRE', label: 'Real Estate Select Sector SPDR Fund', category: 'alternatives', group: 'Real Estate' },

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

const availableForAnalysis = Object.keys(etfData);
const availableTickers = allAvailableTickers.filter(t => availableForAnalysis.includes(t.value));


const uniqueTickers = Array.from(new Set(allAvailableTickers.map(t => t.value)))
  .map(value => {
    return allAvailableTickers.find(t => t.value === value)!;
  });


const tickerGroups = uniqueTickers.reduce((acc, ticker) => {
    const group = ticker.group || "Other";
    if (!acc[group]) {
        acc[group] = [];
    }
    acc[group].push(ticker);
    return acc;
}, {} as Record<string, typeof uniqueTickers>);




export type Allocation = {
  stocks: number;
  bonds: number;
  alternatives: number;
};

export type Ticker = {
  id: string;
  name: string;
  category: "stocks" | "bonds" | "alternatives";
  allocation: number;
};

const STORAGE_KEY = 'wealthpath-portfolio-state';

export default function PortfolioBuilder() {
  const router = useRouter();
  const [portfolioName, setPortfolioName] = React.useState("");
  const [allocation, setAllocation] = React.useState<Allocation>({ stocks: 60, bonds: 30, alternatives: 10 });
  const [selectedTickers, setSelectedTickers] = React.useState<Ticker[]>([]);
  const [comboboxOpen, setComboboxOpen] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<PortfolioAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
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
    // Clear analysis when portfolio changes
    setAnalysis(null);
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

  const handleAnalyzePortfolio = () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    // Simulate async operation
    setTimeout(() => {
        const analyzablePortfolio = selectedTickers.filter(t => availableForAnalysis.includes(t.id));
        const result = analyzePortfolio(analyzablePortfolio, selectedTickers);
        setAnalysis(result);
        setIsAnalyzing(false);
    }, 500);
  };

  const totalPortfolioAllocation = selectedTickers.reduce((sum, t) => sum + t.allocation, 0);
  const isAllocationInvalid = selectedTickers.length > 0 && totalPortfolioAllocation !== 100;

  const renderCategorySection = (category: keyof Allocation, title: string) => {
      const tickers = selectedTickers.filter(t => t.category === category);
      if (allocation[category] === 0 && tickers.length === 0) return null;

      const categoryTotalFromTickers = tickers.reduce((total, ticker) => total + ticker.allocation, 0);

      return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className={cn("font-semibold text-lg", categoryColors[category])}>{title}</h4>
                <div className="flex items-center gap-4">
                    <span className={cn("text-lg font-bold", categoryColors[category])}>{allocation[category]}% Target</span>
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
                        Add ETFs to this category to see allocation details.
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <main className="relative w-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            ETF Portfolio Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Design your custom ETF portfolio, analyze its diversification, and project its growth.
          </p>
        </div>
        <div className="space-y-8">
          <Card className={glassCardClasses}>
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <Info className="h-6 w-6" /> How to Use the ETF Portfolio Builder
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>
                    This tool helps you design a custom (ETF) practice portfolio. Follow these steps to create a portfolio. The analyzer is specifically designed to look up ETF data only to help you understand what you think you own vs what you truly own. ETF overlap is a common mistake investors make but this tool is designed for practice and learning purposes.
                </p>
                <ul className="space-y-3 list-decimal list-inside">
                    <li>
                        <strong className="text-foreground">Name Your Portfolio:</strong> Give your portfolio a descriptive name, like "My First Roth IRA" or "Aggressive Growth Plan."
                    </li>
                    <li>
                        <strong className="text-foreground">Choose a Template:</strong> Select a <span className="text-primary">beginner-friendly</span> template to get started. This will automatically load a recommended set of ETFs and their allocations.
                    </li>
                    <li>
                        <strong className="text-foreground">Adjust Asset Allocation:</strong> Fine-tune the percentage of your portfolio dedicated to each asset class (e.g., Stocks, Bonds) using the sliders. The total must equal 100%.
                    </li>
                    <li>
                        <strong className="text-foreground">Add or Remove ETFs:</strong> Customize the portfolio by searching for and adding new ETFs, or by removing ones you don't want.
                    </li>
                    <li>
                        <strong className="text-foreground">Allocate to ETFs:</strong> In the Portfolio Summary, assign a percentage to each ETF. The total allocation for all ETFs in your portfolio must equal 100%.
                    </li>
                    <li>
                        <strong className="text-foreground">Analyze Your Portfolio:</strong> Click the "Analyze Portfolio" button to get a detailed breakdown. The analyzer is specifically designed to look up data for the ETFs in this builder and may not work for all tickers.
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
              <CardTitle className="text-2xl font-headline">3. Adjust Asset Allocation</CardTitle>
              <p className="text-sm text-muted-foreground">Total Allocation: {allocation.stocks + allocation.bonds + allocation.alternatives}%</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className={cn("flex justify-between text-base", categoryColors.stocks)}><span>Stock ETFs</span><span>{allocation.stocks}%</span></Label>
                <Slider value={[allocation.stocks]} onValueChange={(v) => handleSingleSliderChange("stocks", v[0])} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label className={cn("flex justify-between text-base", categoryColors.bonds)}><span>Bond ETFs</span><span>{allocation.bonds}%</span></Label>
                <Slider value={[allocation.bonds]} onValueChange={(v) => handleSingleSliderChange("bonds", v[0])} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <Label className={cn("flex justify-between text-base", categoryColors.alternatives)}><span>Alternative ETFs (e.g., Gold, Real Estate)</span><span>{allocation.alternatives}%</span></Label>
                <Slider value={[allocation.alternatives]} onValueChange={(v) => handleSingleSliderChange("alternatives", v[0])} max={100} step={1} />
              </div>
            </CardContent>
          </Card>

          <Card className={glassCardClasses}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">4. Add ETFs</CardTitle>
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
                            Search and add an ETF...
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command
                          filter={(value, search) => {
                            const [label, ticker] = value.split('__');
                            const lowerSearch = search.toLowerCase();
                            if (label.toLowerCase().includes(lowerSearch) || ticker.toLowerCase().includes(lowerSearch)) {
                              return 1;
                            }
                            return 0;
                          }}
                        >
                            <CommandInput placeholder="Search ETF..." />
                            <CommandList>
                                <CommandEmpty>No ETF found.</CommandEmpty>
                                {Object.entries(tickerGroups).map(([group, tickers]) => (
                                    <CommandGroup key={group} heading={group}>
                                        {tickers.map(t => (
                                            <CommandItem
                                                key={t.value}
                                                value={`${t.label}__${t.value}`}
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
              <CardTitle className="text-2xl font-headline">5. ETF Portfolio Summary</CardTitle>
              {isAllocationInvalid && (
                  <p className="text-destructive text-sm pt-2">The total allocation for all ETFs must equal 100%. Current total: {totalPortfolioAllocation}%.</p>
              )}
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {renderCategorySection("stocks", "Stock ETFs")}
                    {renderCategorySection("bonds", "Bond ETFs")}
                    {renderCategorySection("alternatives", "Alternative ETFs")}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end text-right">
                <div className={cn("font-bold", totalPortfolioAllocation !== 100 ? "text-destructive" : "text-green-400")}>
                    Total Allocation: {totalPortfolioAllocation}%
                </div>
            </CardFooter>
          </Card>

            {analysis && (
                <PortfolioAnalysisDisplay analysis={analysis} />
            )}

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 ml-auto">
                <AnimatedButton onClick={handleAnalyzePortfolio} disabled={isAnalyzing || selectedTickers.length === 0 || totalPortfolioAllocation !== 100} className="w-full sm:w-auto">
                    <div className="flex items-center">
                        {isAnalyzing ? "Analyzing..." : "Analyze ETF Portfolio"}
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
        </div>
      </div>
    </main>
  );
}
