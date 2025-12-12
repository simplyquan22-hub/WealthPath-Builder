
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioAnalysis } from '@/lib/portfolio-analyzer';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { Badge } from './ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { cn } from '@/lib/utils';

interface PortfolioAnalysisProps {
  analysis: PortfolioAnalysis;
}

const glassCardClasses = "border border-white/10 bg-card/50 backdrop-blur-sm shadow-[0_0_15px_2px_rgba(0,100,255,0.35)]";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#83a6ed', '#8dd1e1'];

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 75) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };
    return (
        <div className="flex flex-col items-center">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>{score}</div>
            <div className="text-sm text-muted-foreground">Diversification Score</div>
        </div>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2 bg-background/80 backdrop-blur-sm border-white/10">
          <p className="font-bold">{`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}</p>
        </Card>
      );
    }
    return null;
};

const CustomLegend = ({ data }: { data: { name: string; value: number }[] }) => (
    <ul className="space-y-2 text-sm">
        {data.map((entry, index) => (
            <li key={`item-${index}`} className="flex items-center gap-2">
                <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
            </li>
        ))}
    </ul>
);

const ExposureChart: React.FC<{ data: { name: string; value: number }[], title: string }> = ({ data, title }) => (
    <div className="flex flex-col">
        <h3 className="text-center font-semibold mb-4">{title}</h3>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Pie 
                            data={data} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            innerRadius={50}
                            fill="#8884d8"
                        >
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center">
                <CustomLegend data={data} />
            </div>
        </div>
    </div>
);


export const PortfolioAnalysisDisplay: React.FC<PortfolioAnalysisProps> = ({ analysis }) => {
  return (
    <Card className={glassCardClasses}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Portfolio Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex justify-center">
                <ScoreDisplay score={analysis.diversificationScore} />
            </div>
            <div className="md:col-span-2">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Info className="h-5 w-5"/> Recommendations</h3>
                <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            {analysis.diversificationScore >= 75 ? <CheckCircle className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0"/> : <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-400 flex-shrink-0"/>}
                            <span className="text-muted-foreground">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ExposureChart data={analysis.sectorExposure} title="Sector Exposure" />
            <ExposureChart data={analysis.regionExposure} title="Region Exposure" />
            <ExposureChart data={analysis.marketCapExposure} title="Market Cap Exposure" />
        </div>

        <div>
            <h3 className="font-semibold mb-2">Top 10 Holdings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {analysis.top10Holdings.map(holding => (
                    <div key={holding.ticker} className="bg-background/40 p-2 rounded-md text-center">
                        <div className="font-bold">{holding.ticker}</div>
                        <div className="text-sm text-primary">{holding.weight.toFixed(2)}%</div>
                    </div>
                ))}
            </div>
        </div>
        
        {analysis.overlappingHoldings.length > 0 && (
            <div>
                <h3 className="font-semibold mb-2">Holding Overlaps</h3>
                 <div className="max-h-60 overflow-y-auto pr-2">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-sm">
                            <TableRow>
                                <TableHead>Ticker</TableHead>
                                <TableHead>Portfolio %</TableHead>
                                <TableHead>Found In</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysis.overlappingHoldings.map(overlap => (
                                <TableRow key={overlap.ticker}>
                                    <TableCell className="font-medium">{overlap.ticker}</TableCell>
                                    <TableCell>{overlap.percentage.toFixed(2)}%</TableCell>
                                    <TableCell className="flex flex-wrap gap-1">
                                        {overlap.heldIn.map(etf => <Badge key={etf} variant="secondary">{etf}</Badge>)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
};
