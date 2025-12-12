
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
    
    // Normalize portfolio allocations if they don't sum to 100 for a category
    const normalizedPortfolio = portfolio.map(p => {
        const categoryTotal = portfolio
            .filter(t => t.category === p.category)
            .reduce((sum, t) => sum + t.allocation, 0);
        return {
            ...p,
            normalizedAllocation: categoryTotal > 0 ? (p.allocation / categoryTotal) * 100 : 0
        };
    });

    const allHoldings: { [ticker: string]: { percentage: number; heldIn: string[] } } = {};
    const sectorExposure: Exposure = {};
    const regionExposure: Exposure = {};
    const marketCapExposure: Exposure = {};

    for (const asset of normalizedPortfolio) {
        const data = etfData[asset.id as EtfKey];
        if (!data) continue;

        const assetWeightInPortfolio = asset.allocation / totalPortfolioAllocation;

        // Aggregate Holdings
        data.topHoldings.forEach(holding => {
            const holdingWeightInPortfolio = holding.weight * assetWeightInPortfolio;
            if (!allHoldings[holding.ticker]) {
                allHoldings[holding.ticker] = { percentage: 0, heldIn: [] };
            }
            allHoldings[holding.ticker].percentage += holdingWeightInPortfolio;
            if (!allHoldings[holding.ticker].heldIn.includes(asset.id)) {
                allHoldings[holding.ticker].heldIn.push(asset.id);
            }
        });

        // Aggregate Exposures
        const aggregateExposure = (exposureMap: Exposure, exposureArray: { [key: string]: any, weight: number }[], keyName: string) => {
            exposureArray.forEach(exp => {
                const weightInPortfolio = exp.weight * assetWeightInPortfolio;
                if (!exposureMap[exp[keyName]]) {
                    exposureMap[exp[keyName]] = 0;
                }
                exposureMap[exp[keyName]] += weightInPortfolio;
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
    const diversificationScore = calculateDiversificationScore(top10Holdings, sectorExposure);

    // Generate recommendations
    const recommendations = generateRecommendations(diversificationScore, sectorExposure, top10Holdings);

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
function calculateDiversificationScore(topHoldings: Holding[], sectorExposure: Exposure): number {
    let score = 100;
    
    // Penalty for over-concentration in top holdings
    const topHoldingConcentration = topHoldings.reduce((sum, h) => sum + h.weight, 0);
    if (topHoldingConcentration > 50) score -= (topHoldingConcentration - 50) * 0.5;
    if (topHoldings.length > 0 && topHoldings[0].weight > 10) score -= (topHoldings[0].weight - 10);

    // Penalty for sector concentration
    const topSector = Object.values(sectorExposure).sort((a,b) => b-a)[0] || 0;
    if (topSector > 40) score -= (topSector - 40);
    if (topSector > 60) score -= (topSector - 60);

    return Math.max(0, Math.round(score));
}

function generateRecommendations(
    diversificationScore: number, 
    sectorExposure: Exposure, 
    topHoldings: Holding[]
): string[] {
    const recommendations: string[] = [];

    if (diversificationScore < 50) {
        recommendations.push("Your portfolio is highly concentrated. Consider diversifying across more assets or sectors to reduce risk.");
    } else if (diversificationScore < 75) {
        recommendations.push("Your portfolio is moderately concentrated. Look for opportunities to add assets in underrepresented sectors.");
    }

    const topSector = Object.entries(sectorExposure).sort(([, a], [, b]) => b - a)[0];
    if (topSector && topSector[1] > 40) {
        recommendations.push(`You have a high concentration (${topSector[1].toFixed(1)}%) in the ${topSector[0]} sector. Consider diversifying into other areas like Healthcare, Industrials, or Financials to balance your portfolio.`);
    }

    if (topHoldings.length > 0 && topHoldings[0].weight > 10) {
        recommendations.push(`Your largest holding, ${topHoldings[0].ticker}, makes up a significant portion of your portfolio. This concentration increases risk. Ensure you are comfortable with this level of exposure.`);
    }
    
    if (recommendations.length === 0) {
        recommendations.push("Your portfolio shows a good level of diversification. Keep your long-term goals in mind and review your holdings periodically.");
    }

    return recommendations;
}
