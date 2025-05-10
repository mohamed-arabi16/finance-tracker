
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockExpenses, exchangeRate } from "@/data/mockData";
import { ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ExpenseList = () => {
  // Sort expenses by date, with most recent first
  const sortedExpenses = [...mockExpenses].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  const totalRecurring = mockExpenses
    .filter(expense => expense.type === "recurring")
    .reduce((sum, expense) => {
      // Convert TRY to USD for display
      const amountInUSD = expense.currency === 'TRY' ? expense.amount / exchangeRate.USDTRY : expense.amount;
      return sum + amountInUSD;
    }, 0);

  const totalOneTime = mockExpenses
    .filter(expense => expense.type === "one-time")
    .reduce((sum, expense) => {
      // Convert TRY to USD for display
      const amountInUSD = expense.currency === 'TRY' ? expense.amount / exchangeRate.USDTRY : expense.amount;
      return sum + amountInUSD;
    }, 0);

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
              <span className="font-semibold finance-negative">${totalRecurring.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-muted-foreground">One-time:</span>{" "}
              <span className="font-semibold finance-negative">${totalOneTime.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors"
            >
              <div className="flex flex-col">
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Due: {format(expense.date, "MMM d, yyyy")}</span>
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
                  {expense.currency === 'TRY' ? '₺' : '$'}{expense.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
