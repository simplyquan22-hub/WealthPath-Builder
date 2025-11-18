
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "./ui/animated-button";
import Link from "next/link";
import { CustomRadio } from "./ui/custom-radio";


const glassCardClasses = "bg-background/50 backdrop-blur-xl border-t border-l border-r border-b border-white/10 shadow-xl shadow-black/10 bg-gradient-to-br from-white/5 via-transparent to-transparent";

const questions = [
  {
    id: "q1",
    text: "A promising but volatile new stock is being hyped. It could double in a month or lose half its value. What's your move?",
    options: [
      { id: "a", text: "Invest a small, 'fun' amount I'm okay with losing.", value: 1 },
      { id: "b", text: "Go all in. High risk, high reward!", value: 0 },
      { id: "c", text: "Ignore it. I stick to my long-term, diversified plan.", value: 2 },
    ],
  },
  {
    id: "q2",
    text: "The stock market has a major downturn, falling 20%. Your portfolio is down significantly. How do you feel?",
    options: [
      { id: "a", text: "Nervous, but I see it as a potential buying opportunity.", value: 2 },
      { id: "b", text: "I feel sick and immediately sell to prevent further losses.", value: 0 },
      { id: "c", text: "I'm concerned and start checking my portfolio daily, but I don't sell.", value: 1 },
    ],
  },
  {
    id: "q3",
    text: "You receive an unexpected $10,000 bonus. What is your first instinct?",
    options: [
      { id: "a", text: "Pay off some debt and invest the rest in my index funds.", value: 2 },
      { id: "b", text: "Put it towards a down payment for a house or car.", value: 1 },
      { id: "c", text: "Book a luxury vacation I've been dreaming of.", value: 0 },
    ],
  },
  {
    id: "q4",
    text: "How often do you prefer to check on your investments?",
    options: [
      { id: "a", text: "Daily. I need to know what's happening.", value: 0 },
      { id: "b", text: "Maybe once a month, just to make sure things are on track.", value: 1 },
      { id: "c", text: "Quarterly or even less. My strategy is for the long haul.", value: 2 },
    ],
  },
  {
    id: "q5",
    text: "When do you plan to need the money you are investing?",
    options: [
      { id: "a", text: "In the next 1-3 years.", value: 0 },
      { id: "b", text: "In 20+ years, for retirement.", value: 2 },
      { id: "c", text: "In about 5-10 years, for a major life event.", value: 1 },
    ],
  },
  {
    id: "q6",
    text: "Which statement best describes your view on investing?",
    options: [
        { id: "a", text: "It's a disciplined way to build wealth over a lifetime.", value: 2 },
        { id: "b", text: "It's a necessary step for major financial goals.", value: 1 },
        { id: "c", text: "It's a way to potentially make a lot of money quickly.", value: 0 },
    ],
  },
  {
    id: "q7",
    text: "Your friend tells you about a 'guaranteed' investment tip. How do you react?",
    options: [
        { id: "a", text: "I'm skeptical. I'll do my own extensive research before considering.", value: 2 },
        { id: "b", text: "I might put a little money in, just in case they're right.", value: 1 },
        { id: "c", text: "I'm in! I don't want to miss out on a sure thing.", value: 0 },
    ],
  },
  {
    id: "q8",
    text: "How comfortable are you with the idea that your investment value will go up and down?",
    options: [
        { id: "a", text: "I find it very stressful and would prefer stable, low-return options.", value: 0 },
        { id: "b", text: "I understand it's part of the process for long-term growth.", value: 2 },
        { id: "c", text: "I can handle some fluctuations, but large drops make me anxious.", value: 1 },
    ],
  },
  {
    id: "q9",
    text: "Imagine your portfolio has grown 15% in one year. What's your next move?",
    options: [
        { id: "a", text: "Sell some of the profits to lock in the gains.", value: 1 },
        { id: "b", text: "Stick to the plan. This is a good year, but my strategy doesn't change.", value: 2 },
        { id: "c", text: "Invest more money, hoping to ride the wave.", value: 0 },
    ],
  },
  {
    id: "q10",
    text: "Which of these financial goals is most important to you right now?",
    options: [
        { id: "a", text: "Having a large emergency fund that is easily accessible.", value: 1 },
        { id: "b", text: "Maximizing my retirement savings for 30 years from now.", value: 2 },
        { id: "c", text: "Generating extra income for my current lifestyle.", value: 0 },
    ],
  },
];

const results = {
  "Trader": {
    title: "You're a Trader.",
    message: "You're focused on immediate opportunities and quick wins. This can be exciting, but true wealth is often built through patience. Let's build a plan that balances today's action with a long-term vision.",
    buttonText: "Start Building a Long-Term Portfolio",
  },
  "Balanced Investor": {
    title: "You're a Balanced Investor.",
    message: "You have a healthy perspective, blending a desire for growth with an understanding of risk. You're ready to build a solid, diversified plan. Let's create a portfolio that matches your sensible approach.",
    buttonText: "Build My Balanced Portfolio",
  },
  "Wealth Visionary": {
    title: "You're a Wealth Visionary.",
    message: "You're playing the long game, focused on discipline and the power of compounding. Your mindset is primed for building lasting wealth. Let’s design the portfolio to make your vision a reality.",
    buttonText: "Map Out My Vision",
  },
};

type Answers = { [key: string]: string };
const STORAGE_KEY = 'wealthpath-quiz-state';

export function RiskMindsetQuiz() {
  const [answers, setAnswers] = React.useState<Answers>({});
  const [score, setScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const { answers: savedAnswers, score: savedScore } = JSON.parse(savedState);
        setAnswers(savedAnswers || {});
        setScore(savedScore !== undefined ? savedScore : null);
      }
    } catch (error) {
      console.error("Failed to parse quiz state from localStorage", error);
      setAnswers({});
      setScore(null);
    }
  }, []);

  React.useEffect(() => {
    try {
      const stateToSave = JSON.stringify({ answers, score });
      localStorage.setItem(STORAGE_KEY, stateToSave);
    } catch (error) {
      console.error("Failed to save quiz state to localStorage", error);
    }
  }, [answers, score]);

  const handleValueChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const question of questions) {
      const answerValue = answers[question.id];
      if (answerValue !== undefined) {
        totalScore += parseInt(answerValue, 10);
      }
    }
    setScore(totalScore);
  };

  const getResultProfile = () => {
    if (score === null) return null;
    if (score <= 6) return "Trader";
    if (score >= 7 && score <= 13) return "Balanced Investor";
    return "Wealth Visionary";
  };

  const resultProfile = getResultProfile();
  const resultData = resultProfile ? results[resultProfile as keyof typeof results] : null;

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  return (
    <Card className={`max-w-3xl mx-auto ${glassCardClasses}`}>
      <CardContent className="p-6 md:p-8">
        {score === null ? (
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id}>
                <h3 className="font-semibold text-lg mb-4">{q.text}</h3>
                <RadioGroup value={answers[q.id]} onValueChange={(value) => handleValueChange(q.id, value)}>
                  <div className="space-y-3">
                    {q.options.map((opt) => (
                       <Label key={opt.id} htmlFor={`${q.id}-${opt.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <CustomRadio
                          id={`${q.id}-${opt.id}`}
                          value={String(opt.value)}
                        />
                        <span className="text-base font-normal">
                          {opt.text}
                        </span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
            <AnimatedButton
              onClick={calculateScore}
              disabled={!allQuestionsAnswered}
              className="w-full mt-8"
            >
              See My Result
            </AnimatedButton>
          </div>
        ) : (
          resultData && (
            <div className="text-center flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">{resultData.title}</h2>
              <p className="text-muted-foreground text-lg mb-8">{resultData.message}</p>
              <AnimatedButton asChild className="w-full flex items-center justify-center">
                <Link href="/portfolio-builder">
                  {resultData.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AnimatedButton>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
