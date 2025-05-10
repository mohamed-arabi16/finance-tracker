
export type IncomeStatus = 'received' | 'expected';
export type DebtStatus = 'paid' | 'pending';
export type ExpenseType = 'recurring' | 'one-time';
export type IncomeCategory = 'freelance' | 'student' | 'rent' | 'videography' | 'other';
export type Currency = 'USD' | 'TRY';

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: Date;
  status: IncomeStatus;
  currency?: Currency; // Optional for backward compatibility
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  type: ExpenseType;
  category?: string;
  currency?: Currency; // Optional for backward compatibility
}

export interface Debt {
  id: string;
  title: string;
  amount: number;
  creditor: string;
  deadline: Date;
  isLongTerm: boolean;
  status: DebtStatus;
  currency?: Currency; // Optional for backward compatibility
}

export interface Asset {
  id: string;
  title: string;
  type: string;
  amount: number;
  unit: string;
  currentPrice: number;
  currency?: Currency; // Optional for backward compatibility
}

export interface FinanceSummary {
  currency: Currency;
  availableBalance: number;
  upcomingIncome: number;
  shortTermDebt: number;
  longTermDebt: number;
  monthlyExpenses: number;
  savingsValue: number;
  netWorth: number;
}
