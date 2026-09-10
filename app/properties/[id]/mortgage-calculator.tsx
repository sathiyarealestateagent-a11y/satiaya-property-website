'use client';

import {
  BadgeDollarSign,
  Calculator,
  Landmark,
  MessageCircle,
  ReceiptText,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type MortgageCalculatorProps = {
  propertyPrice: number;
  whatsappNumber: string;
};

type NumericInput = number | '';

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
});

const incomeFields = [
  { key: 'grossSalary', label: 'Gross monthly salary' },
  { key: 'fixedAllowance', label: 'Fixed allowance' },
  { key: 'commission', label: 'Average commission / overtime' },
  { key: 'rentalIncome', label: 'Rental income' },
  { key: 'otherIncome', label: 'Other documented income' },
] as const;

const deductionFields = [
  { key: 'epf', label: 'EPF' },
  { key: 'socso', label: 'SOCSO / EIS' },
  { key: 'incomeTax', label: 'PCB / income tax' },
  { key: 'otherDeductions', label: 'Other statutory deductions' },
] as const;

const commitmentFields = [
  { key: 'housingLoan1', label: 'Housing loan 1' },
  { key: 'housingLoan2', label: 'Housing loan 2' },
  { key: 'carLoan', label: 'Car loan' },
  { key: 'personalLoan', label: 'Personal loan' },
  { key: 'creditCard', label: 'Credit card commitment' },
  { key: 'educationLoan', label: 'PTPTN / education loan' },
  { key: 'otherFinancing', label: 'ASB / other financing' },
  { key: 'otherCommitments', label: 'Other monthly commitments' },
] as const;

type IncomeKey = (typeof incomeFields)[number]['key'];
type DeductionKey = (typeof deductionFields)[number]['key'];
type CommitmentKey = (typeof commitmentFields)[number]['key'];

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

function emptyValues<T extends readonly { key: PropertyKey }[]>(fields: T) {
  return Object.fromEntries(fields.map(({ key }) => [key, ''])) as Record<
    T[number]['key'],
    NumericInput
  >;
}

function totalValues(values: Record<string, NumericInput>) {
  return Object.values(values).reduce<number>(
    (total, value) => total + clamp(Number(value), 0, 100_000_000),
    0,
  );
}

function formatDsr(value: number | null) {
  return value === null ? '—' : `${value.toFixed(1)}%`;
}

export function MortgageCalculator({
  propertyPrice: initialPropertyPrice,
  whatsappNumber,
}: MortgageCalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState(initialPropertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(4);
  const [tenureYears, setTenureYears] = useState(30);
  const [income, setIncome] = useState<Record<IncomeKey, NumericInput>>(() =>
    emptyValues(incomeFields),
  );
  const [deductions, setDeductions] = useState<
    Record<DeductionKey, NumericInput>
  >(() => emptyValues(deductionFields));
  const [commitments, setCommitments] = useState<
    Record<CommitmentKey, NumericInput>
  >(() => emptyValues(commitmentFields));

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
    const totalIncome = totalValues(income);
    const totalDeductions = totalValues(deductions);
    const netIncome = totalIncome - totalDeductions;
    const existingCommitments = totalValues(commitments);
    const totalCommitments = existingCommitments + monthlyRepayment;
    const dsr = netIncome > 0 ? (totalCommitments / netIncome) * 100 : null;
    const disposableIncome =
      netIncome > 0 ? netIncome - totalCommitments : null;

    return {
      propertyPrice: safePrice,
      downPayment,
      loanAmount,
      monthlyRepayment,
      netIncome,
      existingCommitments,
      totalCommitments,
      dsr,
      disposableIncome,
    };
  }, [
    commitments,
    deductions,
    downPaymentPercent,
    income,
    interestRate,
    propertyPrice,
    tenureYears,
  ]);

  const dsrStatus =
    estimate.dsr === null
      ? 'Enter income to calculate'
      : estimate.dsr <= 40
        ? 'Lower Commitment'
        : estimate.dsr <= 60
          ? 'Moderate Commitment'
          : 'Higher Commitment';

  const whatsappMessage = [
    'Hi Satiaya, I would like help checking my home loan eligibility.',
    '',
    `Property Price: ${currencyFormatter.format(estimate.propertyPrice)}`,
    `Estimated Loan Amount: ${currencyFormatter.format(estimate.loanAmount)}`,
    `Estimated Monthly Instalment: ${currencyFormatter.format(estimate.monthlyRepayment)} / month`,
    `Estimated DSR: ${formatDsr(estimate.dsr)}`,
    `Estimated Disposable Income: ${estimate.disposableIncome === null ? '—' : `${currencyFormatter.format(estimate.disposableIncome)} / month`}`,
    '',
    'Please advise me on the next step.',
  ].join('\n');
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section
      id="home-loan-dsr-calculator"
      aria-labelledby="home-loan-dsr-heading"
      className="scroll-mt-24 overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_18px_48px_rgba(23,63,74,.07)]"
    >
      <div className="border-b border-border p-6 sm:p-8 lg:p-10">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-secondary">
            <Calculator className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
              Plan your purchase
            </p>
            <h2
              id="home-loan-dsr-heading"
              className="mt-1 font-heading text-2xl font-bold tracking-[-0.02em] text-primary sm:text-3xl"
            >
              Home Loan &amp; DSR Calculator
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Estimate your monthly home-loan instalment, debt service ratio and
              disposable income in one place.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-6 bg-background/70 p-5 sm:p-7 lg:p-9">
          <CalculatorSection
            number="01"
            title="Property & loan details"
            icon={Landmark}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                id="loan-property-price"
                label="Property price"
                prefix="RM"
                min={0}
                max={100_000_000}
                step={1000}
                value={propertyPrice}
                onChange={(value) => setPropertyPrice(Number(value))}
              />
              <NumberField
                id="loan-down-payment"
                label="Down payment"
                suffix="%"
                min={0}
                max={100}
                step={1}
                value={downPaymentPercent}
                onChange={(value) => setDownPaymentPercent(Number(value))}
                hint={`${currencyFormatter.format(estimate.downPayment)} upfront`}
              />
              <CalculatedField
                label="Estimated loan amount"
                value={currencyFormatter.format(estimate.loanAmount)}
              />
              <NumberField
                id="loan-interest-rate"
                label="Interest rate"
                suffix="% p.a."
                min={0}
                max={20}
                step={0.05}
                value={interestRate}
                onChange={(value) => setInterestRate(Number(value))}
                hint="Use the rate quoted by your bank"
              />
              <NumberField
                id="loan-tenure"
                label="Loan tenure"
                suffix="years"
                min={1}
                max={35}
                step={1}
                value={tenureYears}
                onChange={(value) => setTenureYears(Number(value) || 1)}
              />
              <CalculatedField
                label="Estimated monthly instalment"
                value={`${currencyFormatter.format(estimate.monthlyRepayment)} / month`}
                emphasized
              />
            </div>
          </CalculatorSection>

          <CalculatorSection
            number="02"
            title="Monthly income"
            icon={WalletCards}
            tone="tinted"
          >
            <MoneyFieldGrid
              fields={incomeFields}
              values={income}
              onChange={(key, value) =>
                setIncome((current) => ({ ...current, [key]: value }))
              }
            />
          </CalculatorSection>

          <CalculatorSection
            number="03"
            title="Monthly deductions"
            icon={ReceiptText}
          >
            <MoneyFieldGrid
              fields={deductionFields}
              values={deductions}
              onChange={(key, value) =>
                setDeductions((current) => ({ ...current, [key]: value }))
              }
            />
            <CalculatedTotal
              label="Estimated net monthly income"
              value={estimate.netIncome}
            />
          </CalculatorSection>

          <CalculatorSection
            number="04"
            title="Existing monthly commitments"
            icon={BadgeDollarSign}
            tone="tinted"
          >
            <MoneyFieldGrid
              fields={commitmentFields}
              values={commitments}
              onChange={(key, value) =>
                setCommitments((current) => ({ ...current, [key]: value }))
              }
            />
            <CalculatedTotal
              label="New property monthly instalment"
              value={estimate.monthlyRepayment}
            />
          </CalculatorSection>
        </div>

        <aside className="relative overflow-hidden bg-primary p-6 text-white sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-56 rounded-full bg-accent/10"
          />
          <div className="relative mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/65">
              Your estimate
            </p>
            <p
              aria-live="polite"
              className="mt-3 font-heading text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl"
            >
              {formatDsr(estimate.dsr)}
            </p>
            <p className="mt-2 text-sm font-semibold text-accent-light">
              {dsrStatus}
            </p>

            <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/15">
              <span
                className="block h-full rounded-full bg-accent-light transition-[width] duration-300 motion-reduce:transition-none"
                style={{
                  width: `${Math.min(Math.max(estimate.dsr ?? 0, 0), 100)}%`,
                }}
              />
            </div>

            <dl className="mt-8 divide-y divide-white/15 border-y border-white/15">
              <ResultRow
                label="Property price"
                value={estimate.propertyPrice}
              />
              <ResultRow label="Down payment" value={estimate.downPayment} />
              <ResultRow
                label="Estimated loan amount"
                value={estimate.loanAmount}
              />
              <ResultRow
                label="Estimated monthly instalment"
                value={estimate.monthlyRepayment}
                suffix=" / month"
              />
              <ResultRow
                label="Estimated net monthly income"
                value={estimate.netIncome}
              />
              <ResultRow
                label="Existing monthly commitments"
                value={estimate.existingCommitments}
              />
              <ResultRow
                label="Total monthly commitments"
                value={estimate.totalCommitments}
              />
              <div className="flex items-center justify-between gap-4 py-4 text-sm">
                <dt className="text-primary-foreground/65">Estimated DSR</dt>
                <dd className="font-heading font-bold tabular-nums text-white">
                  {formatDsr(estimate.dsr)}
                </dd>
              </div>
              <ResultRow
                label="Estimated disposable income"
                value={estimate.disposableIncome}
                suffix=" / month"
              />
            </dl>

            <p className="mt-6 text-xs leading-5 text-primary-foreground/65">
              This calculator provides an estimate for general information only.
              Actual home loan eligibility, DSR calculation, financing margin,
              interest rate and approval vary by bank and are subject to income
              verification, CCRIS/CTOS profile, existing commitments and
              individual bank lending policies.
            </p>

            <div className="mt-7 border-t border-white/15 pt-7">
              <p className="font-heading text-lg font-bold text-white">
                Need Help Checking Your Home Loan?
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-4 h-12 w-full border-accent bg-accent px-5 text-primary hover:border-accent-light hover:bg-accent-light sm:w-auto',
                )}
              >
                <MessageCircle /> WhatsApp Satiaya
              </a>
              <p className="mt-3 text-xs leading-5 text-primary-foreground/65">
                Only the property and calculated summary are included. Your
                detailed income and commitments stay on this device.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

type CalculatorSectionProps = {
  number: string;
  title: string;
  icon: typeof Calculator;
  tone?: 'white' | 'tinted';
  children: React.ReactNode;
};

function CalculatorSection({
  number,
  title,
  icon: Icon,
  tone = 'white',
  children,
}: CalculatorSectionProps) {
  return (
    <fieldset
      className={cn(
        'rounded-[20px] border border-border/80 p-5 shadow-[0_8px_24px_rgba(23,63,74,.035)] sm:p-7',
        tone === 'tinted' ? 'bg-muted/45' : 'bg-white',
      )}
    >
      <legend className="flex w-full items-center gap-3 pb-7">
        <span className="grid size-9 place-items-center rounded-xl bg-muted text-secondary">
          <Icon className="size-4" />
        </span>
        <span className="font-heading text-lg font-bold text-primary">
          {title}
        </span>
        <span className="ml-auto text-xs font-bold tracking-[0.12em] text-muted-foreground">
          {number}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: NumericInput;
  onChange: (value: NumericInput) => void;
};

function NumberField({
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
}: NumberFieldProps) {
  const helpId = hint ? `${id}-help` : undefined;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <div className="relative mt-2">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-muted-foreground">
            {prefix}
          </span>
        ) : null}
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
          onChange={(event) => {
            const raw = event.target.value;
            onChange(raw === '' ? '' : clamp(Number(raw), min, max));
          }}
          className={cn(
            'h-12 rounded-xl bg-white text-base font-semibold tabular-nums text-foreground',
            prefix && 'pl-12',
            suffix && 'pr-20',
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={helpId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type MoneyFieldGridProps<TKey extends string> = {
  fields: readonly { key: TKey; label: string }[];
  values: Record<TKey, NumericInput>;
  onChange: (key: TKey, value: NumericInput) => void;
};

function MoneyFieldGrid<TKey extends string>({
  fields,
  values,
  onChange,
}: MoneyFieldGridProps<TKey>) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map(({ key, label }) => (
        <NumberField
          key={key}
          id={`finance-${key}`}
          label={label}
          prefix="RM"
          min={0}
          max={100_000_000}
          step={100}
          value={values[key]}
          onChange={(value) => onChange(key, value)}
        />
      ))}
    </div>
  );
}

function CalculatedField({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-primary">{label}</p>
      <output
        className={cn(
          'mt-2 flex min-h-12 items-center rounded-xl border border-border bg-muted px-4 font-heading text-base font-bold tabular-nums text-primary',
          emphasized && 'border-secondary/30 text-secondary',
        )}
      >
        {value}
      </output>
    </div>
  );
}

function CalculatedTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-6 flex flex-col justify-between gap-2 rounded-2xl border border-border bg-muted px-4 py-3 sm:flex-row sm:items-center">
      <span className="text-sm font-semibold text-primary">{label}</span>
      <output className="font-heading font-bold tabular-nums text-secondary">
        {currencyFormatter.format(value)}
      </output>
    </div>
  );
}

function ResultRow({
  label,
  value,
  suffix = '',
}: {
  label: string;
  value: number | null;
  suffix?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 text-sm">
      <dt className="max-w-[55%] text-primary-foreground/65">{label}</dt>
      <dd className="text-right font-heading font-bold tabular-nums text-white">
        {value === null ? '—' : `${currencyFormatter.format(value)}${suffix}`}
      </dd>
    </div>
  );
}
