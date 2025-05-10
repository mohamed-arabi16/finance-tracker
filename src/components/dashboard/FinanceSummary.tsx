
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateFinanceSummary } from "@/data/mockData";
import { ArrowDown, ArrowUp, CreditCard, Coins, Currency, Download } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const FinanceSummary = () => {
  const [includeLongTermDebt, setIncludeLongTermDebt] = useState(() => {
    const saved = localStorage.getItem('includeLongTermDebt');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  // Get currency from localStorage (should be set by Layout)
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  const { toast } = useToast();
  
  const summary = calculateFinanceSummary(currency);
  
  // Adjust net worth based on toggle
  const adjustedNetWorth = includeLongTermDebt
    ? summary.netWorth - summary.longTermDebt
    : summary.netWorth;
    
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  const handleDownloadReport = () => {
    // Generate CSV data for all finances
    const generateCSV = () => {
      // Build headers
      let csvContent = "Type,Title,Amount,Status,Date,Notes\n";
      
      // Add incomes to CSV
      const { mockIncomes, mockExpenses, mockDebts, mockAssets, exchangeRate } = require("@/data/mockData");
      
      mockIncomes.forEach(income => {
        const amount = income.currency === 'TRY' ? 
          `${income.amount} TRY (~ ${Math.round(income.amount / exchangeRate.USDTRY)} USD)` : 
          `${income.amount} USD`;
        csvContent += `Income,${income.title},${amount},${income.status},${format(income.date, "yyyy-MM-dd")},"${income.category}"\n`;
      });
      
      // Add expenses to CSV
      mockExpenses.forEach(expense => {
        const amount = expense.currency === 'TRY' ? 
          `${expense.amount} TRY (~ ${Math.round(expense.amount / exchangeRate.USDTRY)} USD)` : 
          `${expense.amount} USD`;
        csvContent += `Expense,${expense.title},${amount},${expense.type},${format(expense.date, "yyyy-MM-dd")},"${expense.category || 'N/A'}"\n`;
      });
      
      // Add debts to CSV
      mockDebts.forEach(debt => {
        const amount = debt.currency === 'TRY' ? 
          `${debt.amount} TRY (~ ${Math.round(debt.amount / exchangeRate.USDTRY)} USD)` : 
          `${debt.amount} USD`;
        csvContent += `Debt,${debt.title},${amount},${debt.isLongTerm ? 'Long-Term' : 'Short-Term'},${format(debt.deadline, "yyyy-MM-dd")},"Creditor: ${debt.creditor}"\n`;
      });
      
      // Add assets to CSV
      mockAssets.forEach(asset => {
        csvContent += `Asset,${asset.title},${asset.amount} ${asset.unit},Current Value: $${Math.round(asset.amount * asset.currentPrice)},N/A,"Type: ${asset.type}"\n`;
      });
      
      // Add summary section
      csvContent += "\n\nFINANCIAL SUMMARY\n";
      csvContent += `Available Balance,${currencySymbol}${Math.abs(summary.availableBalance).toLocaleString()},${summary.availableBalance >= 0 ? 'Positive' : 'Negative'}\n`;
      csvContent += `Net Worth,${currencySymbol}${Math.abs(adjustedNetWorth).toLocaleString()},${adjustedNetWorth >= 0 ? 'Positive' : 'Negative'}\n`;
      csvContent += `Monthly Expenses,${currencySymbol}${summary.monthlyExpenses.toLocaleString()}\n`;
      csvContent += `Short-Term Debt,${currencySymbol}${summary.shortTermDebt.toLocaleString()}\n`;
      csvContent += `Long-Term Debt,${currencySymbol}${summary.longTermDebt.toLocaleString()}\n`;
      
      return csvContent;
    };
    
    // Start download process
    toast({
      title: "Report Download Started",
      description: "Your financial report will be downloaded shortly.",
    });
    
    // Generate CSV and download
    setTimeout(() => {
      const csvData = generateCSV();
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", `financial-report-${format(new Date(), "yyyy-MM-dd")}.csv`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Report Downloaded",
        description: "Your financial report has been downloaded successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold">Financial Summary</h2>
          
          <Button variant="outline" size="sm" className="h-8" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
        
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
              <ArrowDown className="h-5 w-5" />
              Available Balance
            </CardTitle>
            <CardDescription>Current + Expected Income - Short-Term Debt - Monthly Expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20 pt-2">
            <p className={`text-3xl font-bold ${summary.availableBalance >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              {summary.availableBalance >= 0 ? '' : '-'}{currencySymbol}{Math.abs(summary.availableBalance).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Net Worth */}
        <Card className="border-l-4 border-l-primary h-48">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Worth</CardTitle>
            <CardDescription>
              {includeLongTermDebt
                ? "Available Balance - Long-Term Debt"
                : "Available Balance"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20 pt-2">
            <p className={`text-3xl font-bold ${adjustedNetWorth >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              {adjustedNetWorth >= 0 ? '' : '-'}{currencySymbol}{Math.abs(adjustedNetWorth).toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-20 pt-2">
            <p className="text-3xl font-bold finance-positive">
              {currencySymbol}{summary.upcomingIncome.toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-14 pt-2">
            <p className="text-xl font-semibold finance-negative">
              {currencySymbol}{summary.monthlyExpenses.toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-14 pt-2">
            <p className="text-xl font-semibold finance-negative">
              {currencySymbol}{summary.shortTermDebt.toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-14 pt-2">
            <p className="text-xl font-semibold text-muted-foreground">
              {currencySymbol}{summary.longTermDebt.toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-14 pt-2">
            <p className="text-xl font-semibold finance-positive">
              {currencySymbol}{summary.savingsValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Urgent Debts Section */}
      {summary.urgentDebts && summary.urgentDebts.length > 0 && (
        <Card className="border-2 border-negative/30">
          <CardHeader>
            <CardTitle className="text-negative flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Urgent Debts
            </CardTitle>
            <CardDescription>
              These debts are due within the next 7 days and require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {summary.urgentDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 rounded-md bg-negative/5 border border-negative/20"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{debt.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {format(debt.deadline, "MMM d, yyyy")} ({Math.round((debt.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left)
                    </div>
                  </div>
                  <div className="font-semibold text-negative">
                    {debt.currency === 'TRY' ? '₺' : '$'}{Math.round(debt.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinanceSummary;
