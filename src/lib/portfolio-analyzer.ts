
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

function calculateDiversificationScore(topHoldings: Holding[], sectorExposure: Exposure, regionExposure: Exposure, assetClassExposure: Exposure): number {
    let score = 100;

    // 1. Asset Class Diversification Penalty
    const hasBonds = (assetClassExposure.bonds || 0) > 5;
    if (!hasBonds && (assetClassExposure.stocks || 0) > 95) {
        score -= 25; // Heavier penalty for no asset class diversification
    }

    // 2. Regional Concentration Penalty
    const northAmericaExposure = regionExposure['North America'] || 0;
    if (northAmericaExposure > 90) {
        score -= (northAmericaExposure - 90) * 1.5; // Increased penalty for US-centric portfolios
    }
    
    // 3. Top Holdings Concentration Penalty
    const topHoldingConcentration = topHoldings.reduce((sum, h) => sum + h.weight, 0);
    if (topHoldingConcentration > 50) {
        score -= (topHoldingConcentration - 50) * 1.5;
    }
    if (topHoldings.length > 0 && topHoldings[0].weight > 10) {
        score -= (topHoldings[0].weight - 10) * 2; // Stronger penalty for a single dominant holding
    }

    // 4. Sector Concentration Penalty
    const topSector = Object.values(sectorExposure).sort((a, b) => b - a)[0] || 0;
    if (topSector > 35) {
        score -= (topSector - 35) * 1.2; // Slightly increased penalty
    }
    if (topSector > 50) {
        score -= (topSector - 50) * 1.5; // Heavy penalty for extreme sector concentration
    }

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

    // Asset Class recommendation
    const hasBonds = (assetClassExposure.bonds || 0) > 5;
    if (!hasBonds && (assetClassExposure.stocks || 0) > 95) {
        recommendations.push("Your portfolio is nearly 100% stocks. To reduce volatility, consider adding a bond allocation (e.g., BND or AGG) which typically performs differently from stocks.");
    }

    // Regional exposure recommendation
    const northAmericaExposure = regionExposure['North America'] || 0;
    if (northAmericaExposure > 85) {
        recommendations.push(`Your portfolio is heavily concentrated in North America (${northAmericaExposure.toFixed(0)}%). Consider increasing international exposure (e.g., VXUS, IXUS) to capture global growth and reduce regional risk.`);
    }

    // Sector exposure recommendation
    const topSector = Object.entries(sectorExposure).sort(([, a], [, b]) => b - a)[0];
    if (topSector && topSector[1] > 35) {
        recommendations.push(`You have a high concentration (${topSector[1].toFixed(0)}%) in the ${topSector[0]} sector. This makes your portfolio vulnerable to downturns in that specific area. Consider diversifying into other sectors.`);
    }

    // Top holding recommendation
    if (topHoldings.length > 0 && topHoldings[0].weight > 10) {
        recommendations.push(`Your largest holding, ${topHoldings[0].ticker}, makes up over ${topHoldings[0].weight.toFixed(0)}% of your portfolio. This level of concentration in a single company creates significant risk.`);
    }
    
    // Overlap recommendation
    const vtiInPortfolio = overlappingHoldings.some(o => o.heldIn.includes('VTI'));
    const vooInPortfolio = overlappingHoldings.some(o => o.heldIn.includes('VOO'));
    if (vtiInPortfolio && vooInPortfolio) {
        recommendations.push("Your portfolio includes both VTI and VOO. Since VOO (S&P 500) is already about 85% of VTI (Total US Market), holding both creates significant overlap and doesn't add much diversification. Consider choosing one or the other.");
    } else {
        const significantOverlap = overlappingHoldings.find(o => o.percentage > 3);
        if (significantOverlap) {
            recommendations.push(`There is significant overlap between your chosen ETFs. For example, ${significantOverlap.ticker} is found in multiple funds. This can make your portfolio less diversified than it appears.`);
        }
    }
    
    // Final general recommendation based on score
    if (recommendations.length === 0) {
        if (diversificationScore > 80) {
            recommendations.push("Excellent! Your portfolio shows strong diversification across different assets, sectors, and regions. Remember to review it periodically to ensure it still aligns with your goals.");
        } else {
            recommendations.push("Your portfolio is reasonably diversified. Keep an eye on your allocations to ensure they continue to meet your long-term goals.");
        }
    } else if (diversificationScore >= 75) {
        recommendations.push("Overall, this is a solid portfolio, but the suggestions above can help you fine-tune it for even better diversification.");
    }


    return recommendations;
}
