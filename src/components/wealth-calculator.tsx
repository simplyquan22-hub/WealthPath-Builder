"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Landmark,
  Repeat,
  Percent,
  CalendarClock,
  Briefcase,
  TrendingUp,
  PiggyBank,
  ArrowRight,
  Scale
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconInput } from "@/components/icon-input";
import { InvestmentChart } from "@/components/investment-chart";
import { AnnualBreakdown } from "@/components/annual-breakdown";

const formSchema = z.object({
  initialInvestment: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Value must be positive."),
  monthlyContribution: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Value must be positive."),
  interestRate: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Rate must be positive.").max(100, "Rate cannot exceed 100."),
  marginalTaxRate: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Rate must be positive.").max(100, "Rate cannot exceed 100."),
  years: z.coerce.number({invalid_type_error: "Please enter a number."}).int().min(1, "Must be at least 1 year.").max(100, "Cannot exceed 100 years."),
  accountType: z.enum(["roth", "traditional"]),
});

type FormData = z.infer<typeof formSchema>;

export interface InvestmentData {
  year: number;
  totalInvestment: number;
  projectedValue: number;
  totalReturns: number;
  annualContributions: number;
  annualReturns: number;
}

const glassCardClasses = "bg-background/50 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/10";

export function WealthCalculator() {
  const [data, setData] = React.useState<InvestmentData[] | null>(null);
  const [submittedValues, setSubmittedValues] = React.useState<FormData | null>(null);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: 10000,
      monthlyContribution: 500,
      interestRate: 7,
      marginalTaxRate: 25,
      years: 30,
      accountType: "roth",
    },
  });

  function onSubmit(values: FormData) {
    const generatedData = generateInvestmentData(values);
    setData(generatedData);
    setSubmittedValues(values);
  }

  const generateInvestmentData = (inputs: FormData): InvestmentData[] => {
    const { initialInvestment, monthlyContribution, interestRate, years, accountType, marginalTaxRate } = inputs;
    const monthlyRate = interestRate / 100 / 12;
    const taxRate = marginalTaxRate / 100;
    const result: InvestmentData[] = [];
    let lastYearEndValue = initialInvestment;

    const calculateTaxes = (value: number, totalInvestment: number) => {
      if (accountType === 'traditional') {
        const gains = value - totalInvestment;
        // Assuming contributions are pre-tax and entire withdrawal is taxed. A simplification.
        if (value > totalInvestment) {
             return value * (1 - taxRate);
        }
      }
      return value;
    }

    result.push({
      year: 0,
      totalInvestment: initialInvestment,
      projectedValue: initialInvestment,
      totalReturns: 0,
      annualContributions: 0,
      annualReturns: 0,
    });

    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const fvInitial = initialInvestment * Math.pow(1 + monthlyRate, months);
      const fvContributions = monthlyContribution > 0 ? monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : 0;
      
      const preTaxValue = fvInitial + fvContributions;
      const totalInvestment = initialInvestment + (monthlyContribution * months);

      const projectedValue = calculateTaxes(preTaxValue, totalInvestment);

      const annualContributions = monthlyContribution * 12;
      const lastYearTotalInvestment = initialInvestment + (monthlyContribution * (months - 12));
      const lastYearPreTaxValue = lastYearEndValue > 0 ? (fvInitial / Math.pow(1 + monthlyRate, 12)) + (fvContributions - annualContributions * ((Math.pow(1+monthlyRate, 12)-1)/monthlyRate) ) / Math.pow(1+monthlyRate,12) : 0;
      const lastYearProjectedValue = calculateTaxes(lastYearPreTaxValue, lastYearTotalInvestment);


      const annualReturns = projectedValue - lastYearProjectedValue - annualContributions;
      const totalReturns = projectedValue - totalInvestment;


      result.push({
        year,
        totalInvestment,
        projectedValue,
        totalReturns,
        annualContributions,
        annualReturns,
      });

      lastYearEndValue = preTaxValue;
    }
    return result;
  };
  
  const finalData = data ? data[data.length - 1] : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const getAccountTypeName = (type: string | undefined) => {
    if (!type) return "";
    switch (type) {
      case "roth":
        return "Roth IRA";
      case "traditional":
        return "Traditional IRA";
      default:
        return "";
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className={`lg:col-span-1 ${glassCardClasses}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Investment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Investment</FormLabel>
                    <FormControl>
                      <IconInput icon={<Landmark />} type="number" placeholder="10,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Contribution</FormLabel>
                    <FormControl>
                      <IconInput icon={<Repeat />} type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <IconInput icon={<Percent />} type="number" placeholder="7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="years"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years</FormLabel>
                      <FormControl>
                        <IconInput icon={<CalendarClock />} type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="marginalTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marginal Tax Rate (%)</FormLabel>
                      <FormControl>
                        <IconInput icon={<Scale />} type="number" placeholder="25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base md:text-sm">
                           <Briefcase className="mr-2 h-4 w-4" />
                           <SelectValue placeholder="Select an account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="roth">Roth IRA</SelectItem>
                        <SelectItem value="traditional">Traditional IRA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg">
                Calculate
                <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2">
      {data && finalData ? (
        <Card className={glassCardClasses}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              {`Projected Growth for ${getAccountTypeName(submittedValues?.accountType)}`}
            </CardTitle>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
                <div className="rounded-lg p-4 bg-background/40">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><TrendingUp className="h-4 w-4"/> Future Value</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(finalData.projectedValue)}</p>
                </div>
                <div className="rounded-lg p-4 bg-background/40">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><PiggyBank className="h-4 w-4"/> Total Invested</p>
                  <p className="text-2xl font-bold">{formatCurrency(finalData.totalInvestment)}</p>
                </div>
                <div className="rounded-lg p-4 bg-background/40">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><TrendingUp className="h-4 w-4 text-green-400"/> Total Returns</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(finalData.totalReturns)}</p>
                </div>
              </div>
          </CardHeader>
          <CardContent>
            <InvestmentChart data={data} />
            <AnnualBreakdown data={data.slice(1)} />
          </CardContent>
        </Card>
      ) : (
         <Card className={`flex flex-col items-center justify-center text-center p-8 lg:p-16 min-h-[300px] lg:min-h-[600px] ${glassCardClasses}`}>
            <div className="p-4 bg-primary/20 rounded-full mb-4">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-headline">Your financial projection awaits.</h3>
            <p className="text-muted-foreground mt-2">Fill out the form to visualize your investment journey.</p>
          </Card>
      )}
      </div>
    </div>
  );
}

    