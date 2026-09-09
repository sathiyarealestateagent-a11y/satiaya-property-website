'use client';

import { CalendarDays, Calculator, Landmark, Percent } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

type MortgageCalculatorProps = {
  propertyPrice: number;
};

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
});

function clamp(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(Math.max(value, minimum), maximum);
}

function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  tenureYears: number,
) {
  const months = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) return principal / months;

  const growth = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function MortgageCalculator({
  propertyPrice: initialPropertyPrice,
}: MortgageCalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState(initialPropertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(4);
  const [tenureYears, setTenureYears] = useState(30);

  const estimate = useMemo(() => {
    const safePrice = clamp(propertyPrice, 0, 100_000_000);
    const safeDownPayment = clamp(downPaymentPercent, 0, 100);
    const safeRate = clamp(interestRate, 0, 20);
    const safeTenure = clamp(tenureYears, 1, 35);
    const downPayment = safePrice * (safeDownPayment / 100);
    const loanAmount = Math.max(0, safePrice - downPayment);
    const monthlyRepayment = calculateMonthlyRepayment(
      loanAmount,
      safeRate,
      safeTenure,
    );
    const totalRepayment = monthlyRepayment * safeTenure * 12;

    return {
      downPayment,
      loanAmount,
      monthlyRepayment,
      totalRepayment,
      totalInterest: Math.max(0, totalRepayment - loanAmount),
      loanPercent: 100 - safeDownPayment,
    };
  }, [downPaymentPercent, interestRate, propertyPrice, tenureYears]);

  return (
    <section
      aria-labelledby="mortgage-calculator-heading"
      className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_18px_48px_rgba(23,63,74,.07)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-secondary">
              <Calculator className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                Plan your budget
              </p>
              <h2
                id="mortgage-calculator-heading"
                className="mt-1 font-heading text-2xl font-bold tracking-[-0.02em] text-primary sm:text-3xl"
              >
                Mortgage estimator
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Adjust the figures to see an estimated monthly home-loan
                repayment for this property.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <CalculatorField
              id="mortgage-property-price"
              label="Property price"
              prefix="RM"
              min={0}
              max={100_000_000}
              step={1000}
              value={propertyPrice}
              onChange={setPropertyPrice}
              icon={Landmark}
            />
            <CalculatorField
              id="mortgage-down-payment"
              label="Down payment"
              suffix="%"
              min={0}
              max={100}
              step={1}
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
              icon={Percent}
              hint={`${currencyFormatter.format(estimate.downPayment)} upfront`}
            />
            <CalculatorField
              id="mortgage-interest-rate"
              label="Interest rate"
              suffix="% p.a."
              min={0}
              max={20}
              step={0.05}
              value={interestRate}
              onChange={setInterestRate}
              icon={Percent}
              hint="Use the rate quoted by your bank"
            />
            <CalculatorField
              id="mortgage-tenure"
              label="Loan tenure"
              suffix="years"
              min={1}
              max={35}
              step={1}
              value={tenureYears}
              onChange={setTenureYears}
              icon={CalendarDays}
            />
          </div>
        </div>

        <div className="relative overflow-hidden bg-primary p-6 text-white sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-56 rounded-full bg-accent/10"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/65">
              Estimated monthly repayment
            </p>
            <p
              aria-live="polite"
              className="mt-3 font-heading text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl"
            >
              {currencyFormatter.format(estimate.monthlyRepayment)}
              <span className="ml-2 text-base font-semibold tracking-normal text-primary-foreground/65">
                / month
              </span>
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-semibold text-primary-foreground/70">
                <span>{downPaymentPercent}% down payment</span>
                <span>{estimate.loanPercent}% financing</span>
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/15">
                <span
                  className="bg-accent-light transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${clamp(downPaymentPercent, 0, 100)}%` }}
                />
                <span className="flex-1 bg-secondary" />
              </div>
            </div>

            <dl className="mt-8 divide-y divide-white/15 border-y border-white/15">
              <ResultRow label="Loan amount" value={estimate.loanAmount} />
              <ResultRow
                label="Total interest"
                value={estimate.totalInterest}
              />
              <ResultRow
                label="Total repayment"
                value={estimate.totalRepayment}
              />
            </dl>

            <p className="mt-6 text-xs leading-5 text-primary-foreground/65">
              Illustration only. Actual rates, eligibility and repayments are
              determined by the lender. This estimate excludes MRTA/MRTT, legal
              fees, stamp duty, insurance and other charges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type CalculatorFieldProps = {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  icon: typeof Calculator;
};

function CalculatorField({
  id,
  label,
  prefix,
  suffix,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  icon: Icon,
}: CalculatorFieldProps) {
  const helpId = hint ? `${id}-help` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <Icon className="size-4 text-secondary" /> {label}
      </label>
      <div className="relative mt-2">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={helpId}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-12 rounded-xl bg-background text-base font-semibold tabular-nums text-foreground ${prefix ? 'pl-12' : ''} ${suffix ? 'pr-20' : ''}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={helpId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 text-sm">
      <dt className="text-primary-foreground/65">{label}</dt>
      <dd className="font-heading font-bold tabular-nums text-white">
        {currencyFormatter.format(value)}
      </dd>
    </div>
  );
}
