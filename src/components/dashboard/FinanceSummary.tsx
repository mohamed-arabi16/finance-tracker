
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateFinanceSummary } from "@/data/mockData";
import { ArrowDown, ArrowUp, CreditCard, Coins, DollarSign, Currency, Download } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const FinanceSummary = () => {
  const [includeLongTermDebt, setIncludeLongTermDebt] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'TRY'>('USD');
  const { toast } = useToast();
  
  const summary = calculateFinanceSummary(currency);
  
  // Adjust net worth based on toggle
  const adjustedNetWorth = includeLongTermDebt
    ? summary.netWorth - summary.longTermDebt
    : summary.netWorth;
    
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  const handleDownloadReport = () => {
    // In a real app, this would generate a PDF or Excel file
    toast({
      title: "Report Download Started",
      description: "Your financial report will be downloaded shortly.",
    });
    
    // Simulate file download
    setTimeout(() => {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8,");
      element.setAttribute("download", "financial-report.txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Report Downloaded",
        description: "Your financial report has been downloaded successfully.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Financial Summary</h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 flex gap-1">
                <Currency className="h-4 w-4" />
                <span>{currency}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCurrency('USD')}>
                USD ($)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrency('TRY')}>
                TRY (₺)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
              <DollarSign className="h-5 w-5" />
              Available Balance
            </CardTitle>
            <CardDescription>Current + Expected Income - Short-Term Debt - Monthly Expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-20 pt-2">
            <p className={`text-3xl font-bold ${summary.availableBalance >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              {currencySymbol}{Math.abs(summary.availableBalance).toLocaleString()}
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
          <CardContent className="flex items-center justify-center h-20 pt-2">
            <p className={`text-3xl font-bold ${adjustedNetWorth >= 0 ? 'finance-positive' : 'finance-negative'}`}>
              {currencySymbol}{Math.abs(adjustedNetWorth).toLocaleString()}
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
    </div>
  );
};

export default FinanceSummary;
