
"use client";

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from './ui/card';

interface AllocationChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2 bg-background/80 backdrop-blur-sm border-white/10">
          <p className="font-bold">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </Card>
      );
    }
    return null;
  };

export function AllocationChart({ data, colors }: AllocationChartProps) {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        if (percent === 0) return null;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (!data || data.every(d => d.value === 0)) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Add tickers and allocate percentages to see a visual breakdown.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
            >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
            </Pie>
        </PieChart>
        </ResponsiveContainer>
    );
}
