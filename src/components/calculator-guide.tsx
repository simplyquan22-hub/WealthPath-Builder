
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Calendar, Info, Repeat } from "lucide-react";

const glassCardClasses = "bg-background/50 backdrop-blur-xl border-t border-l border-r border-b border-white/10 shadow-xl shadow-black/10 bg-gradient-to-br from-white/5 via-transparent to-transparent";

export function CalculatorGuide() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Info className="h-6 w-6" /> How to Use This Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This tool is designed to give you a clear projection of your potential investment growth based on a few key inputs.
          </p>
          <ul className="space-y-3">
             <li>
              <strong>Initial Investment:</strong> The amount of money you are starting with.
            </li>
            <li>
              <strong>Contribution Amount & Frequency:</strong> The amount you plan to add and how often (e.g., weekly, monthly).
            </li>
            <li>
              <strong>Interest Rate (%):</strong> Your estimated annual return on investment. A common benchmark is the average historical return of the S&P 500, which is around 7-10%.
            </li>
            <li>
              <strong>Annual Fees (%):</strong> The yearly cost of managing your investments, like an ETF expense ratio. A low-cost index fund might have fees around 0.03%, while actively managed funds can be 1% or higher.
            </li>
             <li>
              <strong>Years:</strong> The number of years you plan to let your investment grow.
            </li>
            <li>
              <strong>Marginal Tax Rate (%):</strong> Your estimated combined federal and state income tax rate. This is used to calculate the after-tax value of a Traditional IRA.
            </li>
            <li>
              <strong>Account Type:</strong> The type of retirement account you are using. This choice has significant tax implications.
            </li>
            <li>
              <strong>Adjust for Inflation:</strong> When enabled, this projects the future value of your investment in today's dollars, giving you a clearer sense of its future purchasing power.
            </li>
             <li>
              <strong>Time Machine Slider:</strong> After calculating, use the slider to travel through time and see how your investment value changes year by year.
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <DollarSign className="h-6 w-6" /> Account Types Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-brand">Roth IRA</h4>
            <p className="text-muted-foreground">
              Contributions are made with <span className="text-foreground font-medium">after-tax</span> dollars. This means you pay taxes on the money before you invest it. The key benefit is that your qualified withdrawals in retirement are <span className="text-green-400 font-medium">100% tax-free</span>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-brand">Traditional IRA</h4>
            <p className="text-muted-foreground">
              Contributions are typically made with <span className="text-foreground font-medium">pre-tax</span> dollars, which may lower your taxable income for the year. However, you will pay income tax on all withdrawals in retirement. This calculator estimates the after-tax value based on your provided marginal rate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-brand">Kids Roth IRA</h4>
            <p className="text-muted-foreground">
              A custodial Roth IRA for minors. Contributions are made with <span className="text-foreground font-medium">after-tax</span> dollars from the child's earned income. Like a standard Roth IRA, qualified withdrawals in retirement are <span className="text-green-400 font-medium">tax-free</span>, giving them a huge head start on tax-free growth.
            </p>
          </div>
           <div>
            <h4 className="font-semibold text-lg text-brand">Kids Traditional IRA</h4>
            <p className="text-muted-foreground">
              A custodial Traditional IRA for minors with earned income. Contributions may be <span className="text-foreground font-medium">tax-deductible</span>. Taxes are paid on the money when it is withdrawn in retirement. This can be a good option if you expect the child to be in a lower tax bracket during their working years than in retirement.
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Disclaimer: This calculator is for illustrative purposes only and does not constitute financial advice. Consult with a financial professional for personalized advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
