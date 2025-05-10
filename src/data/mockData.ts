
import { Asset, Debt, Expense, Income } from "@/types/finance";

export const mockIncomes: Income[] = [
  {
    id: "1",
    title: "Freelance Work",
    amount: 3500, // Variable monthly amount (example)
    category: "freelance",
    date: new Date(2025, 4, 15), // May 15, 2025
    status: "received"
  },
  {
    id: "2",
    title: "Student Registration Commission",
    amount: 6000,
    category: "student",
    date: new Date(2025, 8, 10), // Sep 10, 2025
    status: "expected"
  },
  {
    id: "3",
    title: "Delayed Paycheck",
    amount: 2600,
    category: "other",
    date: new Date(2025, 6, 20), // Jul 20, 2025
    status: "expected"
  },
  {
    id: "4",
    title: "Videography Rent Income",
    amount: 500,
    category: "videography",
    date: new Date(2025, 7, 15), // Aug 15, 2025
    status: "expected"
  }
];

export const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Rent",
    amount: 18000,
    date: new Date(2025, 4, 14), // May 14, 2025
    type: "recurring",
    category: "Housing",
    currency: "TRY"
  },
  {
    id: "2",
    title: "Utilities",
    amount: 1100,
    date: new Date(2025, 4, 5), // May 5, 2025
    type: "recurring",
    category: "Utilities",
    currency: "TRY"
  },
  {
    id: "3",
    title: "Other Bills",
    amount: 3000,
    date: new Date(2025, 4, 10), // May 10, 2025
    type: "recurring",
    category: "Bills",
    currency: "TRY"
  }
];

export const mockDebts: Debt[] = [
  {
    id: "1",
    title: "Phone Installment",
    amount: 1150,
    creditor: "Phone Company",
    deadline: new Date(2025, 5, 30), // June 30, 2025
    isLongTerm: false,
    status: "pending"
  },
  {
    id: "2",
    title: "Debt to Mother",
    amount: 700,
    creditor: "Mother",
    deadline: new Date(2026, 0, 1), // No fixed date (set to beginning of next year)
    isLongTerm: false,
    status: "pending"
  },
  {
    id: "3",
    title: "Debt to Wife",
    amount: 100,
    creditor: "Wife",
    deadline: new Date(2026, 0, 1), // No fixed date (set to beginning of next year)
    isLongTerm: false,
    status: "pending"
  },
  {
    id: "4",
    title: "Wedding and Furniture",
    amount: 8000,
    creditor: "Various",
    deadline: new Date(2028, 0, 1), // Jan 1, 2028
    isLongTerm: true,
    status: "pending"
  }
];

// Current silver price - in a real app, this would come from an API
const currentSilverPricePerKg = 950; // Approximately $950 per kg

export const mockAssets: Asset[] = [
  {
    id: "1",
    title: "Silver",
    type: "silver",
    amount: 1, // 1 kilogram
    unit: "kg",
    currentPrice: currentSilverPricePerKg // Would be fetched from API
  }
];

// Exchange rate - in a real app, this would come from an API
export const exchangeRate = {
  USDTRY: 31.5 // 1 USD = 31.5 TRY (example rate)
};

export const calculateFinanceSummary = (currency = 'USD') => {
  const rate = currency === 'USD' ? 1 : exchangeRate.USDTRY;
  
  // Function to convert expense amount to selected currency
  const convertExpenseAmount = (expense: Expense) => {
    if (expense.currency === 'TRY') {
      return currency === 'USD' ? expense.amount / exchangeRate.USDTRY : expense.amount;
    } else {
      return currency === 'USD' ? expense.amount : expense.amount * exchangeRate.USDTRY;
    }
  };

  // Current cash (simplification: sum of received incomes - sum of expenses)
  const currentCash = mockIncomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0) - 
    mockExpenses.reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);

  // Expected income (next 60 days)
  const now = new Date();
  const sixtyDaysLater = new Date(now);
  sixtyDaysLater.setDate(now.getDate() + 60);
  
  const upcomingIncome = mockIncomes
    .filter(income => income.status === "expected" && income.date <= sixtyDaysLater)
    .reduce((sum, income) => sum + income.amount, 0);
  
  // Short term debt
  const shortTermDebt = mockDebts
    .filter(debt => !debt.isLongTerm && debt.status === "pending")
    .reduce((sum, debt) => sum + debt.amount, 0);
  
  // Long term debt
  const longTermDebt = mockDebts
    .filter(debt => debt.isLongTerm && debt.status === "pending")
    .reduce((sum, debt) => sum + debt.amount, 0);

  // Monthly expenses (recurring only)
  const monthlyExpenses = mockExpenses
    .filter(expense => expense.type === "recurring")
    .reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);

  // Savings value
  const savingsValue = mockAssets.reduce(
    (sum, asset) => sum + asset.amount * asset.currentPrice, 0
  );

  // Available balance
  const availableBalance = currentCash + upcomingIncome - shortTermDebt - monthlyExpenses;

  // Net worth (without long term debt)
  const netWorth = availableBalance + savingsValue;

  return {
    currency,
    availableBalance,
    upcomingIncome,
    shortTermDebt,
    longTermDebt,
    monthlyExpenses,
    savingsValue,
    netWorth
  };
};
