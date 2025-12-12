
import etfData from './etf-data.json';
import { Ticker } from '@/components/portfolio-builder';

// Type definitions
type etfData = typeof etfData;
type EtfKey = keyof typeof etfData;

interface Holding {
    ticker: string;
    weight: number;
}

interface Exposure {
    [key: string]: number;
}

export interface PortfolioAnalysis {
    diversificationScore: number;
    top10Holdings: Holding[];
    overlappingHoldings: { ticker: string; percentage: number; heldIn: string[] }[];
    sectorExposure: { name: string; value: number }[];
    regionExposure: { name: string; value: number }[];
    marketCapExposure: { name: string; value: number }[];
    recommendations: string[];
}

// Main analysis function
export function analyzePortfolio(portfolio: Ticker[]): PortfolioAnalysis {
    const totalPortfolioAllocation = portfolio.reduce((sum, t) => sum + t.allocation, 0);
    
    if (totalPortfolioAllocation === 0) {
        // Return a default or empty analysis if there's no allocation
        return {
            diversificationScore: 0,
            top10Holdings: [],
            overlappingHoldings: [],
            sectorExposure: [],
            regionExposure: [],
            marketCapExposure: [],
            recommendations: ["Your portfolio is empty. Add some tickers and allocate percentages to get an analysis."]
        };
    }

    const allHoldings: { [ticker: string]: { percentage: number; heldIn: string[] } } = {};
    const sectorExposure: Exposure = {};
    const regionExposure: Exposure = {};
    const marketCapExposure: Exposure = {};
    const assetClassExposure: Exposure = { "stocks": 0, "bonds": 0, "alternatives": 0 };

    for (const asset of portfolio) {
        const data = etfData[asset.id as EtfKey];
        if (!data) continue;

        const assetWeightInPortfolio = asset.allocation / totalPortfolioAllocation;

        // Aggregate Asset Class
        const assetClass = asset.category;
        if(assetClassExposure[assetClass] !== undefined) {
            assetClassExposure[assetClass] += assetWeightInPortfolio * 100;
        }

        // Aggregate Holdings
        data.topHoldings.forEach(holding => {
            const holdingWeightInPortfolio = (holding.weight / 100) * assetWeightInPortfolio;
            if (!allHoldings[holding.ticker]) {
                allHoldings[holding.ticker] = { percentage: 0, heldIn: [] };
            }
            allHoldings[holding.ticker].percentage += holdingWeightInPortfolio * 100;
            if (!allHoldings[holding.ticker].heldIn.includes(asset.id)) {
                allHoldings[holding.ticker].heldIn.push(asset.id);
            }
        });

        // Aggregate Exposures
        const aggregateExposure = (exposureMap: Exposure, exposureArray: { [key: string]: any, weight: number }[], keyName: string) => {
            exposureArray.forEach(exp => {
                const weightInPortfolio = (exp.weight / 100) * assetWeightInPortfolio;
                if (!exposureMap[exp[keyName]]) {
                    exposureMap[exp[keyName]] = 0;
                }
                exposureMap[exp[keyName]] += weightInPortfolio * 100;
            });
        };
        
        aggregateExposure(sectorExposure, data.sectorExposure, 'sector');
        aggregateExposure(regionExposure, data.regionExposure, 'region');
        aggregateExposure(marketCapExposure, data.marketCapExposure, 'cap');
    }

    // Process aggregated data
    const top10Holdings = Object.entries(allHoldings)
        .sort(([, a], [, b]) => b.percentage - a.percentage)
        .slice(0, 10)
        .map(([ticker, data]) => ({ ticker, weight: data.percentage }));

    const overlappingHoldings = Object.entries(allHoldings)
        .filter(([, data]) => data.heldIn.length > 1)
        .map(([ticker, data]) => ({ ticker, percentage: data.percentage, heldIn: data.heldIn }))
        .sort((a, b) => b.percentage - a.percentage);

    const formatExposure = (exposure: Exposure) => Object.entries(exposure)
        .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
        .sort((a, b) => b.value - a.value);

    // Calculate diversification score
    const diversificationScore = calculateDiversificationScore(top10Holdings, sectorExposure, regionExposure, assetClassExposure);

    // Generate recommendations
    const recommendations = generateRecommendations(diversificationScore, sectorExposure, regionExposure, top10Holdings, overlappingHoldings, assetClassExposure);

    return {
        diversificationScore,
        top10Holdings,
        overlappingHoldings,
        sectorExposure: formatExposure(sectorExposure),
        regionExposure: formatExposure(regionExposure),
        marketCapExposure: formatExposure(marketCapExposure),
        recommendations
    };
}

// Helper functions
function calculateDiversificationScore(topHoldings: Holding[], sectorExposure: Exposure, regionExposure: Exposure, assetClassExposure: Exposure): number {
    let score = 100;
    
    // Penalty for lack of asset class diversification (e.g., all stocks)
    if (assetClassExposure.stocks > 95 && assetClassExposure.bonds < 5) {
        score -= 15; // Significant penalty for not having a mix of asset classes
    }

    // Penalty for regional concentration
    const northAmericaExposure = regionExposure['North America'] || 0;
    if (northAmericaExposure > 90) {
        score -= (northAmericaExposure - 90) * 0.5; // Penalty for being too US-centric
    }

    // Penalty for over-concentration in top holdings
    const topHoldingConcentration = topHoldings.reduce((sum, h) => sum + h.weight, 0);
    if (topHoldingConcentration > 40) score -= (topHoldingConcentration - 40);
    if (topHoldings.length > 0 && topHoldings[0].weight > 7) score -= (topHoldings[0].weight - 7) * 2;

    // Penalty for sector concentration
    const topSector = Object.values(sectorExposure).sort((a,b) => b-a)[0] || 0;
    if (topSector > 30) score -= (topSector - 30);
    if (topSector > 50) score -= (topSector - 50);

    return Math.max(0, Math.round(score));
}

function generateRecommendations(
    diversificationScore: number, 
    sectorExposure: Exposure, 
    regionExposure: Exposure,
    topHoldings: Holding[],
    overlappingHoldings: { ticker: string; percentage: number; heldIn: string[] }[],
    assetClassExposure: Exposure
): string[] {
    const recommendations: string[] = [];

    // General diversification comment
    if (diversificationScore < 50) {
        recommendations.push("Your portfolio is highly concentrated. Consider diversifying across more assets, sectors, and regions to reduce risk.");
    } else if (diversificationScore < 75) {
        recommendations.push("Your portfolio has moderate concentration. Look for opportunities to add assets in underrepresented areas to improve diversification.");
    }

    // Asset Class recommendation
    if (assetClassExposure.stocks > 95 && assetClassExposure.bonds < 5) {
        recommendations.push("Your portfolio is almost entirely in stocks. Adding bonds (e.g., BND, AGG) can provide stability and reduce volatility during stock market downturns.");
    }

    // Regional exposure recommendation
    const northAmericaExposure = regionExposure['North America'] || 0;
    if (northAmericaExposure > 90) {
        recommendations.push(`Your portfolio is heavily weighted towards North America (${northAmericaExposure.toFixed(1)}%). Consider increasing international exposure (e.g., VXUS, VEA) to diversify geographically.`);
    }

    // Sector exposure recommendation
    const topSector = Object.entries(sectorExposure).sort(([, a], [, b]) => b - a)[0];
    if (topSector && topSector[1] > 35) {
        recommendations.push(`You have a high concentration (${topSector[1].toFixed(1)}%) in the ${topSector[0]} sector. Diversifying into other sectors could lower your risk.`);
    }

    // Top holding recommendation
    if (topHoldings.length > 0 && topHoldings[0].weight > 10) {
        recommendations.push(`Your largest holding, ${topHoldings[0].ticker}, makes up over ${topHoldings[0].weight.toFixed(1)}% of your portfolio. This creates significant single-stock risk.`);
    }

    // Overlap recommendation
    const significantOverlap = overlappingHoldings.find(o => o.percentage > 3);
    if (significantOverlap) {
        recommendations.push(`There is significant overlap between your chosen ETFs, such as holding ${significantOverlap.ticker} in multiple funds. This might make your portfolio less diversified than it appears. For example, VTI and VOO have a very high correlation.`);
    }
    
    if (recommendations.length === 0 && diversificationScore > 75) {
        recommendations.push("Your portfolio shows a good level of diversification across different assets, sectors, and regions. Keep your long-term goals in mind and review your holdings periodically.");
    } else if (recommendations.length === 0) {
        recommendations.push("Review your allocations to ensure they align with your long-term investment strategy and risk tolerance.");
    }

    return recommendations;
}
