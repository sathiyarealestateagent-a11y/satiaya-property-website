'use client';

import { useCallback, useState } from 'react';

import { DsrCalculator } from './dsr-calculator';
import { MortgageCalculator } from './mortgage-calculator';

export function PropertyFinanceCalculators({
  propertyPrice,
}: {
  propertyPrice: number;
}) {
  const [monthlyRepayment, setMonthlyRepayment] = useState(0);
  const handleMonthlyRepaymentChange = useCallback((amount: number) => {
    setMonthlyRepayment(amount);
  }, []);

  return (
    <>
      <MortgageCalculator
        propertyPrice={propertyPrice}
        onMonthlyRepaymentChange={handleMonthlyRepaymentChange}
      />
      <DsrCalculator estimatedMonthlyRepayment={monthlyRepayment} />
    </>
  );
}
