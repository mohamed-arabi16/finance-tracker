
import { Asset, Debt, Expense, Income } from "@/types/finance";

export const mockIncomes: Income[] = [
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
  },
  {
    id: "5",
    title: "Videography Shooting",
    amount: 200,
    category: "videography",
    date: new Date(2025, 4, 25), // May 25, 2025
    status: "received"
  },
  {
    id: "6",
    title: "Part of Student Registration Commission",
    amount: 300,
    category: "student",
    date: new Date(2025, 4, 20), // May 20, 2025
    status: "received"
  },
  {
    id: "7",
    title: "Debt Payback from Ahmad",
    amount: 10000,
    category: "other",
    date: new Date(2025, 4, 18), // May 18, 2025
    status: "received",
    currency: "TRY"
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
  },
  {
    id: "5",
    title: "Silver Debt to Wife",
    amount: 1900, // Estimated value of 2kg silver
    creditor: "Wife",
    deadline: new Date(2028, 0, 1), // Jan 1, 2028
    isLongTerm: true,
    status: "pending"
  },
  {
    id: "6",
    title: "Credit Card",
    amount: 84500,
    creditor: "Bank",
    deadline: new Date(2025, 4, 14), // May 14, 2025
    isLongTerm: false,
    status: "pending",
    currency: "TRY"
  },
  {
    id: "7",
    title: "Saralia Event Marketing",
    amount: 1000,
    creditor: "Saralia",
    deadline: new Date(2025, 5, 15), // Jun 15, 2025
    isLongTerm: false,
    status: "pending"
  },
  {
    id: "8",
    title: "Debt to Diaa ALzoughbi",
    amount: 4000,
    creditor: "Diaa ALzoughbi",
    deadline: new Date(2025, 6, 1), // Jul 1, 2025
    isLongTerm: false,
    status: "pending",
    currency: "TRY"
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

// Helper function to get the current exchange rate from localStorage or use default
export const getExchangeRate = (): number => {
  const savedRate = localStorage.getItem('currentExchangeRate');
  return savedRate ? parseFloat(savedRate) : 38.76; // Default fallback
};

// Helper function to consistently convert currency across the app
export const convertCurrency = (amount: number, fromCurrency?: string, toCurrency?: string): number => {
  // Default currencies if not specified
  const from = fromCurrency || 'USD';
  const to = toCurrency || 'USD';
  
  // If currencies are the same, no conversion needed
  if (from === to) {
    return amount;
  }
  
  // Get current exchange rate
  const currentRate = getExchangeRate();
  
  // Convert TRY to USD
  if (from === 'TRY' && to === 'USD') {
    return Math.round(amount / currentRate);
  }
  
  // Convert USD to TRY
  if (from === 'USD' && to === 'TRY') {
    return Math.round(amount * currentRate);
  }
  
  // Fallback (should not happen)
  return amount;
};

export const calculateFinanceSummary = (currency = 'USD') => {
  // Use the new convertCurrency helper function
  
  // Function to convert expense amount to selected currency
  const convertExpenseAmount = (expense: Expense) => {
    return convertCurrency(expense.amount, expense.currency || 'USD', currency);
  };

  // Function to convert income amount to selected currency
  const convertIncomeAmount = (income: Income) => {
    return convertCurrency(income.amount, income.currency || 'USD', currency);
  };

  // Function to convert debt amount to selected currency
  const convertDebtAmount = (debt: Debt) => {
    return convertCurrency(debt.amount, debt.currency || 'USD', currency);
  };

  // Current cash (simplification: sum of received incomes - sum of expenses)
  const currentCash = mockIncomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + convertIncomeAmount(income), 0) - 
    mockExpenses.reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);

  // Expected income (next 60 days)
  const now = new Date();
  const sixtyDaysLater = new Date(now);
  sixtyDaysLater.setDate(now.getDate() + 60);
  
  const upcomingIncome = mockIncomes
    .filter(income => income.status === "expected" && income.date <= sixtyDaysLater)
    .reduce((sum, income) => sum + convertIncomeAmount(income), 0);
  
  // Short term debt
  const shortTermDebt = mockDebts
    .filter(debt => !debt.isLongTerm && debt.status === "pending")
    .reduce((sum, debt) => sum + convertDebtAmount(debt), 0);
  
  // Long term debt
  const longTermDebt = mockDebts
    .filter(debt => debt.isLongTerm && debt.status === "pending")
    .reduce((sum, debt) => sum + convertDebtAmount(debt), 0);

  // Monthly expenses (recurring only)
  const monthlyExpenses = mockExpenses
    .filter(expense => expense.type === "recurring")
    .reduce((sum, expense) => sum + convertExpenseAmount(expense), 0);

  // Savings value
  const savingsValue = mockAssets.reduce(
    (sum, asset) => {
      const assetValue = asset.amount * asset.currentPrice;
      return sum + convertCurrency(assetValue, 'USD', currency);
    }, 0
  );

  // Available balance (don't include assets in net worth as specified)
  const availableBalance = currentCash + upcomingIncome - shortTermDebt - monthlyExpenses;

  // Net worth (without assets as specified)
  const netWorth = availableBalance;

  // Get urgent debts (due within 7 days)
  const now2 = new Date();
  const sevenDaysLater = new Date(now2);
  sevenDaysLater.setDate(now2.getDate() + 7);
  
  const urgentDebts = mockDebts
    .filter(debt => 
      !debt.isLongTerm && 
      debt.status === "pending" && 
      debt.deadline >= now2 && 
      debt.deadline <= sevenDaysLater
    )
    .map(debt => ({
      ...debt,
      amountConverted: convertDebtAmount(debt)
    }));

  return {
    currency,
    availableBalance,
    upcomingIncome,
    shortTermDebt,
    longTermDebt,
    monthlyExpenses,
    savingsValue,
    netWorth,
    urgentDebts
  };
};
