import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const formatSEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const formatPercent = (n: number) => `${n.toFixed(1)} %`;

const Index = () => {
  const [price, setPrice] = useState(3000000);
  const [downPayment, setDownPayment] = useState(450000);
  const [fee, setFee] = useState(4500);
  const [interestRate, setInterestRate] = useState(3.5);

  const loan = Math.max(price - downPayment, 0);
  const ltv = price > 0 ? loan / price : 0;

  // Swedish amortization rules
  let amortizationRate = 0;
  if (ltv > 0.7) amortizationRate = 2;
  else if (ltv > 0.5) amortizationRate = 1;

  const monthlyInterest = (loan * (interestRate / 100)) / 12;
  const monthlyAmortization = (loan * (amortizationRate / 100)) / 12;
  const totalMonthlyCost = monthlyInterest + monthlyAmortization + fee;

  const inputField = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    suffix?: string,
    step?: number
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step || 1000}
          min={0}
          className="text-lg font-semibold pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  const resultRow = (label: string, value: string, highlight?: boolean) => (
    <div className={`flex justify-between items-center py-2 ${highlight ? "font-bold text-lg" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-primary" : ""}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bostadskalkylator</h1>
          <p className="text-muted-foreground">Räkna ut din månadskostnad</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-muted-foreground">Uppgifter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputField("Bostadens pris", price, setPrice, "kr")}
            {inputField("Kontantinsats", downPayment, setDownPayment, "kr")}
            {inputField("Månadsavgift till föreningen", fee, setFee, "kr", 100)}
            {inputField("Ränta", interestRate, setInterestRate, "%", 0.1)}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-muted-foreground">Resultat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {resultRow("Lån", formatSEK(loan))}
            {resultRow("Belåningsgrad", formatPercent(ltv * 100))}
            {resultRow("Amorteringstakt", `${amortizationRate} % / år`)}
            <Separator className="my-2" />
            {resultRow("Ränta (efter avdrag)", formatSEK(monthlyInterestAfterDeduction))}
            {resultRow("Amortering", formatSEK(monthlyAmortization))}
            {resultRow("Avgift", formatSEK(fee))}
            <Separator className="my-2" />
            {resultRow("Total månadskostnad", formatSEK(totalMonthlyCost), true)}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Beräkningen inkluderar 30 % ränteavdrag. Amortering enligt svenska amorteringskrav.
        </p>
      </div>
    </div>
  );
};

export default Index;
