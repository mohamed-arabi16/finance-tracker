
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIncomes } from "@/data/mockData";
import { IncomeStatus } from "@/types/finance";
import { ArrowDown, Check, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const statusIcons = {
  received: <Check className="h-4 w-4" />,
  expected: <Clock className="h-4 w-4" />
};

const statusColors = {
  received: "bg-positive/10 text-positive border-positive/30",
  expected: "bg-muted text-muted-foreground border-muted-foreground/30"
};

const IncomeList = () => {
  // Get currency from localStorage
  const currency = localStorage.getItem('defaultCurrency') === 'TRY' ? 'TRY' : 'USD';
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  const exchangeRate = 38.76; // Hardcoded for now, would be from API
  
  // Sort incomes by date, with most recent first
  const sortedIncomes = [...mockIncomes].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  // Convert amounts based on selected currency
  const calculateAmount = (amount: number, incomeCurrency?: string) => {
    if (incomeCurrency === 'TRY' && currency === 'USD') {
      return Math.round(amount / exchangeRate);
    } else if (!incomeCurrency || incomeCurrency === 'USD' && currency === 'TRY') {
      return Math.round(amount * exchangeRate);
    } 
    return amount;
  };

  const totalReceived = mockIncomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + calculateAmount(income.amount, income.currency), 0);

  const totalExpected = mockIncomes
    .filter(income => income.status === "expected")
    .reduce((sum, income) => sum + calculateAmount(income.amount, income.currency), 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            <span>Recent Income</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Received:</span>{" "}
              <span className="font-semibold finance-positive">{currencySymbol}{Math.round(totalReceived).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Expected:</span>{" "}
              <span className="font-semibold">{currencySymbol}{Math.round(totalExpected).toLocaleString()}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {sortedIncomes.slice(0, 4).map((income) => (
            <div
              key={income.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-card border hover:border-primary/30 transition-colors gap-2"
            >
              <div className="flex flex-col">
                <div className="font-medium">{income.title}</div>
                <div className="text-sm text-muted-foreground">
                  {format(income.date, "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <Badge className={`${statusColors[income.status]} px-2 py-1`}>
                  <span className="flex items-center gap-1">
                    {statusIcons[income.status]} 
                    {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                  </span>
                </Badge>
                <div className="font-semibold text-right w-24 text-lg">
                  {income.currency === 'TRY' && currency === 'TRY' ? '₺' : 
                   income.currency === 'USD' && currency === 'USD' ? '$' :
                   currencySymbol}{Math.round(calculateAmount(income.amount, income.currency)).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeList;
