'use client';

import { Gauge, ReceiptText, WalletCards } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

type DsrCalculatorProps = {
  estimatedMonthlyRepayment: number;
};

const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
});

function toSafeAmount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100_000_000);
}

export function DsrCalculator({
  estimatedMonthlyRepayment,
}: DsrCalculatorProps) {
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>('');
  const [existingCommitments, setExistingCommitments] = useState<number | ''>(
    '',
  );

  const result = useMemo(() => {
    const income = toSafeAmount(Number(monthlyIncome));
    const commitments = toSafeAmount(Number(existingCommitments));
    const homeLoan = toSafeAmount(estimatedMonthlyRepayment);
    const totalCommitments = commitments + homeLoan;
    const ratio = income > 0 ? (totalCommitments / income) * 100 : null;

    return { commitments, homeLoan, totalCommitments, ratio };
  }, [estimatedMonthlyRepayment, existingCommitments, monthlyIncome]);

  const guidance =
    result.ratio === null
      ? 'Enter your gross monthly income to see your estimate.'
      : result.ratio <= 40
        ? 'Lower commitment range'
        : result.ratio <= 60
          ? 'Moderate commitment range'
          : 'Higher commitment range';

  return (
    <section
      aria-labelledby="dsr-calculator-heading"
      className="mt-6 overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_18px_48px_rgba(23,63,74,.07)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-secondary">
              <Gauge className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">
                Check your affordability
              </p>
              <h2
                id="dsr-calculator-heading"
                className="mt-1 font-heading text-2xl font-bold tracking-[-0.02em] text-primary sm:text-3xl"
              >
                DSR calculator
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Estimate the share of your gross monthly income used for debt
                payments, including the home-loan repayment calculated above.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <DsrField
              id="dsr-monthly-income"
              label="Gross monthly income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              icon={WalletCards}
              hint="Income before EPF, SOCSO and tax deductions"
            />
            <DsrField
              id="dsr-existing-commitments"
              label="Existing monthly commitments"
              value={existingCommitments}
              onChange={setExistingCommitments}
              icon={ReceiptText}
              hint="Car, personal loans, cards, PTPTN and other financing"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
            The estimated home-loan payment is linked to the mortgage estimator
            above. Adjust its figures to update this calculation automatically.
          </div>
        </div>

        <div className="relative overflow-hidden bg-primary p-6 text-white sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-56 rounded-full bg-accent/10"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/65">
              Estimated debt service ratio
            </p>
            <p
              aria-live="polite"
              className="mt-3 font-heading text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl"
            >
              {result.ratio === null ? '—' : `${result.ratio.toFixed(1)}%`}
            </p>
            <p className="mt-2 text-sm font-semibold text-accent-light">
              {guidance}
            </p>

            <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/15">
              <span
                className="block h-full rounded-full bg-accent-light transition-[width] duration-300 motion-reduce:transition-none"
                style={{
                  width: `${Math.min(Math.max(result.ratio ?? 0, 0), 100)}%`,
                }}
              />
            </div>

            <dl className="mt-8 divide-y divide-white/15 border-y border-white/15">
              <ResultRow
                label="Existing commitments"
                value={result.commitments}
              />
              <ResultRow
                label="Estimated home loan"
                value={result.homeLoan}
              />
              <ResultRow
                label="Total monthly commitments"
                value={result.totalCommitments}
              />
            </dl>

            <p className="mt-6 text-xs leading-5 text-primary-foreground/65">
              Illustration only. Banks calculate DSR differently and may assess
              net income, credit history, age and other factors. This result is
              not a loan approval or financial advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

type DsrFieldProps = {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  icon: typeof Gauge;
  hint: string;
};

function DsrField({
  id,
  label,
  value,
  onChange,
  icon: Icon,
  hint,
}: DsrFieldProps) {
  const helpId = `${id}-help`;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <Icon className="size-4 text-secondary" /> {label}
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-muted-foreground">
          RM
        </span>
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          max={100_000_000}
          step={100}
          value={value}
          placeholder="0"
          aria-describedby={helpId}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) =>
            onChange(
              event.target.value === '' ? '' : Number(event.target.value),
            )
          }
          className="h-12 rounded-xl bg-background pl-12 text-base font-semibold tabular-nums text-foreground"
        />
      </div>
      <p id={helpId} className="mt-1.5 text-xs text-muted-foreground">
        {hint}
      </p>
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
