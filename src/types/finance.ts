
export type IncomeStatus = 'received' | 'expected';
export type DebtStatus = 'paid' | 'pending';
export type ExpenseType = 'recurring' | 'one-time';
export type IncomeCategory = 'freelance' | 'student' | 'rent' | 'videography' | 'other';

export interface Income {
  id: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: Date;
  status: IncomeStatus;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  type: ExpenseType;
  category?: string;
}

export interface Debt {
  id: string;
  title: string;
  amount: number;
  creditor: string;
  deadline: Date;
  isLongTerm: boolean;
  status: DebtStatus;
}

export interface Asset {
  id: string;
  title: string;
  type: string;
  amount: number;
  unit: string;
  currentPrice: number;
}

export interface FinanceSummary {
  availableBalance: number;
  upcomingIncome: number;
  shortTermDebt: number;
  longTermDebt: number;
  monthlyExpenses: number;
  savingsValue: number;
  netWorth: number;
}
