
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateFinanceSummary } from "@/data/mockData";
import { ArrowDown, ArrowUp, CreditCard, Coins, DollarSign } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

const FinanceSummary = () => {
  const [includeLongTermDebt, setIncludeLongTermDebt] = useState(false);
  const summary = calculateFinanceSummary();
  
  // Adjust net worth based on toggle
  const adjustedNetWorth = includeLongTermDebt
    ? summary.netWorth - summary.longTermDebt
    : summary.netWorth;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Summary</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Include Long-Term Debt</span>
          <Toggle 
            pressed={includeLongTermDebt} 
            onPressedChange={setIncludeLongTermDebt}
          />
        </div>
      </div>
      
      {/* Main stats with consistent heights and alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Available Balance */}
        <Card className="border-l-4 border-l-teal h-48">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Available Balance
            </CardTitle>
            <CardDescription>Current + Expected Income - Short-Term Debt - Monthly Expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20">
            <p className={`text-3xl font-bold ${summary.availableBalance >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              ${summary.availableBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Net Worth */}
        <Card className="border-l-4 border-l-primary h-48">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Worth</CardTitle>
            <CardDescription>
              {includeLongTermDebt
                ? "Available Balance + Assets - All Debt"
                : "Available Balance + Assets"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20">
            <p className={`text-3xl font-bold ${adjustedNetWorth >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              ${adjustedNetWorth.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        {/* Upcoming Income */}
        <Card className="border-l-4 border-l-positive h-48">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDown className="h-5 w-5" />
              Upcoming Income
            </CardTitle>
            <CardDescription>Expected in next 60 days</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20">
            <p className="text-3xl font-bold finance-positive">
              ${summary.upcomingIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary stats with consistent alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Expenses */}
        <Card className="h-32">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-14">
            <p className="text-xl font-semibold finance-negative">
              ${summary.monthlyExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Short-Term Debt */}
        <Card className="h-32">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Short-Term Debt
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-14">
            <p className="text-xl font-semibold finance-negative">
              ${summary.shortTermDebt.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Long-Term Debt */}
        <Card className="h-32">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Long-Term Debt
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-14">
            <p className="text-xl font-semibold text-muted-foreground">
              ${summary.longTermDebt.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Assets Value */}
        <Card className="h-32">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Assets Value
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-14">
            <p className="text-xl font-semibold finance-positive">
              ${summary.savingsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceSummary;
