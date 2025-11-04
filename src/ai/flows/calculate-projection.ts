'use server';
/**
 * @fileOverview A backend flow to calculate investment projections.
 *
 * - calculateProjection - A function that calculates the future value of an investment based on a starting balance, monthly contributions, annual return rate, and duration.
 * - ProjectionInputSchema - The input type for the calculateProjection function.
 * - ProjectionOutputSchema - The return type for the calculateProjection function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ProjectionInputSchema = z.object({
  startingBalance: z.number().describe('The initial amount of money.'),
  monthlyContribution: z
    .number()
    .describe('The amount of money contributed each month.'),
  annualReturnPercent: z
    .number()
    .describe('The estimated annual return on investment, as a percentage.'),
  years: z
    .number()
    .describe('The number of years the investment will grow.'),
});
export type ProjectionInput = z.infer<typeof ProjectionInputSchema>;

export const ProjectionOutputSchema = z.object({
  futureValue: z
    .number()
    .describe(
      'The total projected value of the investment.'
    ),
  futureValueStartingOnly: z
    .number()
    .describe(
      'The projected future value of only the initial starting balance.'
    ),
  futureValueContributionsOnly: z
    .number()
    .describe(
      'The projected future value of only the monthly contributions.'
    ),
});
export type ProjectionOutput = z.infer<typeof ProjectionOutputSchema>;

async function calculateProjectionFlow(
  input: ProjectionInput
): Promise<ProjectionOutput> {
  const {
    startingBalance,
    monthlyContribution,
    annualReturnPercent,
    years,
  } = input;

  const r = annualReturnPercent / 100;
  const n = years * 12;

  const fvStart = startingBalance * (1 + r) ** years;
  
  let fvContrib = 0;
  if (r > 0) {
    const monthlyR = r / 12;
    fvContrib =
      monthlyContribution *
      ((((1 + monthlyR) ** n) - 1) / monthlyR);
  } else {
    // If rate is 0, future value of contributions is just total contributions
    fvContrib = monthlyContribution * n;
  }


  return {
    futureValue: fvStart + fvContrib,
    futureValueStartingOnly: fvStart,
    futureValueContributionsOnly: fvContrib,
  };
}

export const calculateProjection = ai.defineFlow(
  {
    name: 'calculateProjection',
    inputSchema: ProjectionInputSchema,
    outputSchema: ProjectionOutputSchema,
  },
  calculateProjectionFlow
);
