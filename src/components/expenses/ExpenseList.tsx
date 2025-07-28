
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertCurrency } from "@/data/mockData";
import { Expense } from "@/types/finance";
import { ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import useSupabaseData from "@/hooks/useSupabaseData";

const ExpenseList = () => {
  const { data: expenses, loading, error } = useSupabaseData<Expense>('expenses');
  // Get currency from localStorage
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });

  // Update when localStorage changes (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('defaultCurrency');
      if (saved === 'USD' || saved === 'TRY') {
        setCurrency(saved);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for real-time updates
    window.addEventListener('exchangeRateUpdated', handleStorageChange);
    // Also check on initial mount and when component updates
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('exchangeRateUpdated', handleStorageChange);
    };
  }, []);
  
  // Sort expenses by date, with most recent first
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calculateAmount = (expense: any) => {
    // Use the convertCurrency function for consistent conversion
    return convertCurrency(expense.amount, expense.currency || 'USD', currency);
  };

  const totalRecurring = expenses
    .filter(expense => expense.type === "recurring")
    .reduce((sum, expense) => sum + calculateAmount(expense), 0);

  const totalOneTime = expenses
    .filter(expense => expense.type === "one-time")
    .reduce((sum, expense) => sum + calculateAmount(expense), 0);
    
  const currencySymbol = currency === 'USD' ? '$' : '₺';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5" />
            <span>Upcoming Expenses</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Monthly:</span>{" "}
              <span className="font-semibold finance-negative">{currencySymbol}{Math.round(totalRecurring).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">One-time:</span>{" "}
              <span className="font-semibold finance-negative">{currencySymbol}{Math.round(totalOneTime).toLocaleString()}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {sortedExpenses.map((expense) => {
            const displayAmount = calculateAmount(expense);
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="font-medium">{expense.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Due: {format(new Date(expense.date), "MMM d, yyyy")}</span>
                    {expense.category && (
                      <Badge variant="outline" className="font-normal">
                        {expense.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={expense.type === "recurring" ? "default" : "outline"}
                    className={expense.type === "recurring" ? "bg-negative/20 text-negative hover:bg-negative/30" : ""}
                  >
                    {expense.type === "recurring" ? "Monthly" : "One-time"}
                  </Badge>
                  <div className="font-semibold text-right w-24 text-lg text-negative">
                    {currencySymbol}{Math.round(displayAmount).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
