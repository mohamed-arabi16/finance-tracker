
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDebts, exchangeRate } from "@/data/mockData";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DebtList = () => {
  // Get currency from localStorage
  const currency = localStorage.getItem('defaultCurrency') === 'TRY' ? 'TRY' : 'USD';
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  const shortTermDebts = mockDebts.filter(debt => !debt.isLongTerm);
  const longTermDebts = mockDebts.filter(debt => debt.isLongTerm);

  // Convert debt amount based on selected currency
  const calculateAmount = (amount: number, debtCurrency?: string) => {
    if (debtCurrency === 'TRY' && currency === 'USD') {
      return Math.round(amount / exchangeRate.USDTRY);
    } else if (!debtCurrency || debtCurrency === 'USD' && currency === 'TRY') {
      return Math.round(amount * exchangeRate.USDTRY);
    } 
    return amount;
  };

  const totalShortTerm = shortTermDebts.reduce((sum, debt) => 
    sum + calculateAmount(debt.amount, debt.currency), 0);
  
  const totalLongTerm = longTermDebts.reduce((sum, debt) => 
    sum + calculateAmount(debt.amount, debt.currency), 0);

  const formatDeadline = (date: Date) => {
    // Check if it's the beginning of 2026 (used for "no fixed date")
    if (date.getFullYear() === 2026 && date.getMonth() === 0 && date.getDate() === 1) {
      return "No fixed date";
    }
    return format(date, "MMM d, yyyy");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Debt Overview</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Short-Term:</span>{" "}
              <span className="font-semibold finance-negative">{currencySymbol}{Math.round(totalShortTerm).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Long-Term:</span>{" "}
              <span className="font-semibold finance-negative">{currencySymbol}{Math.round(totalLongTerm).toLocaleString()}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="short-term">
          <TabsList className="mb-4">
            <TabsTrigger value="short-term">Short-Term Debt</TabsTrigger>
            <TabsTrigger value="long-term">Long-Term Debt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="short-term">
            <div className="space-y-3">
              {shortTermDebts.slice(0, 3).map((debt) => (
                <div
                  key={debt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors gap-2"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{debt.title}</div>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>Creditor: {debt.creditor}</span>
                      {debt.deadline && (
                        <span className="hidden sm:inline">•</span>
                      )}
                      {debt.deadline && (
                        <span>
                          Due: {formatDeadline(debt.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Badge 
                      variant={debt.status === "pending" ? "default" : "outline"}
                      className={debt.status === "pending" ? "bg-negative/20 text-negative hover:bg-negative/30" : ""}
                    >
                      {debt.status === "pending" ? "Pending" : "Paid"}
                    </Badge>
                    <div className="font-semibold text-right w-24 text-lg text-negative">
                      {debt.currency === 'TRY' && currency === 'TRY' ? '₺' : 
                       debt.currency === 'USD' && currency === 'USD' ? '$' :
                       currencySymbol}{Math.round(calculateAmount(debt.amount, debt.currency)).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="long-term">
            <div className="space-y-3">
              {longTermDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors gap-2"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{debt.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Creditor: {debt.creditor}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Badge variant="outline">Long-Term</Badge>
                    <div className="font-semibold text-right w-24 text-lg text-negative">
                      {debt.currency === 'TRY' && currency === 'TRY' ? '₺' : 
                       debt.currency === 'USD' && currency === 'USD' ? '$' :
                       currencySymbol}{Math.round(calculateAmount(debt.amount, debt.currency)).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DebtList;
