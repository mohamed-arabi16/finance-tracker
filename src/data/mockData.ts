
import { Asset, Debt, Expense, Income } from "@/types/finance";

export const mockIncomes: Income[] = [
  {
    id: "1",
    title: "Freelance Web Development",
    amount: 2500,
    category: "freelance",
    date: new Date(2025, 4, 15), // May 15, 2025
    status: "expected"
  },
  {
    id: "2",
    title: "Student Project Commission",
    amount: 1200,
    category: "student",
    date: new Date(2025, 5, 10), // June 10, 2025
    status: "expected"
  },
  {
    id: "3",
    title: "Apartment Rental Income",
    amount: 850,
    category: "rent",
    date: new Date(2025, 4, 5), // May 5, 2025
    status: "received"
  },
  {
    id: "4",
    title: "Wedding Videography",
    amount: 1500,
    category: "videography",
    date: new Date(2025, 4, 20), // May 20, 2025
    status: "expected"
  }
];

export const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Rent",
    amount: 1200,
    date: new Date(2025, 4, 1), // May 1, 2025
    type: "recurring",
    category: "Housing"
  },
  {
    id: "2",
    title: "Internet",
    amount: 65,
    date: new Date(2025, 4, 5), // May 5, 2025
    type: "recurring",
    category: "Utilities"
  },
  {
    id: "3",
    title: "Grocery",
    amount: 350,
    date: new Date(2025, 4, 10), // May 10, 2025
    type: "recurring",
    category: "Food"
  },
  {
    id: "4",
    title: "New Camera Equipment",
    amount: 800,
    date: new Date(2025, 4, 15), // May 15, 2025
    type: "one-time",
    category: "Business Expense"
  }
];

export const mockDebts: Debt[] = [
  {
    id: "1",
    title: "Friend Loan",
    amount: 500,
    creditor: "Ahmed",
    deadline: new Date(2025, 4, 30), // May 30, 2025
    isLongTerm: false,
    status: "pending"
  },
  {
    id: "2",
    title: "Camera Equipment Loan",
    amount: 2000,
    creditor: "Camera Store",
    deadline: new Date(2025, 7, 15), // Aug 15, 2025
    isLongTerm: true,
    status: "pending"
  },
  {
    id: "3",
    title: "Student Loan",
    amount: 15000,
    creditor: "University Credit",
    deadline: new Date(2028, 0, 1), // Jan 1, 2028
    isLongTerm: true,
    status: "pending"
  }
];

export const mockAssets: Asset[] = [
  {
    id: "1",
    title: "Silver Bars",
    type: "silver",
    amount: 1, // 1 kilogram
    unit: "kg",
    currentPrice: 850 // $850 per kg
  },
  {
    id: "2",
    title: "Silver Coins",
    type: "silver",
    amount: 20, // 20 coins
    unit: "oz",
    currentPrice: 27 // $27 per oz
  }
];

export const calculateFinanceSummary = () => {
  // Current cash (simplification: sum of received incomes - sum of expenses)
  const currentCash = mockIncomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0) - 
    mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Savings value
  const savingsValue = mockAssets.reduce(
    (sum, asset) => sum + asset.amount * asset.currentPrice, 0
  );

  // Available balance
  const availableBalance = currentCash + upcomingIncome - shortTermDebt - monthlyExpenses;

  // Net worth (without long term debt)
  const netWorth = availableBalance + savingsValue;

  return {
    availableBalance,
    upcomingIncome,
    shortTermDebt,
    longTermDebt,
    monthlyExpenses,
    savingsValue,
    netWorth
  };
};
