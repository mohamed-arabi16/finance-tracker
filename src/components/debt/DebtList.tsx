
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertCurrency } from "@/data/mockData";
import { Debt } from "@/types/finance";
import { CreditCard, Currency } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useSupabaseData from "@/hooks/useSupabaseData";

const DebtList = () => {
  const { data: debts, loading, error } = useSupabaseData<Debt>('debts');
  // Get currency from localStorage
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  // Update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('defaultCurrency');
      if (saved === 'USD' || saved === 'TRY') {
        setCurrency(saved);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check on initial mount
    handleStorageChange();
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('defaultCurrency', currency);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, [currency]);
  
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  const shortTermDebts = debts.filter(debt => !debt.is_long_term);
  const longTermDebts = debts.filter(debt => debt.is_long_term);

  // Use consistent currency conversion function
  const totalShortTerm = shortTermDebts.reduce((sum, debt) => 
    sum + convertCurrency(debt.amount, debt.currency, currency), 0);
  
  const totalLongTerm = longTermDebts.reduce((sum, debt) => 
    sum + convertCurrency(debt.amount, debt.currency, currency), 0);

  const formatDeadline = (date: string) => {
    const newDate = new Date(date);
    // Check if it's the beginning of 2026 (used for "no fixed date")
    if (newDate.getFullYear() === 2026 && newDate.getMonth() === 0 && newDate.getDate() === 1) {
      return "No fixed date";
    }
    return format(newDate, "MMM d, yyyy");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Debt Overview</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 flex gap-1 ml-2">
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
              {shortTermDebts.slice(0, 3).map((debt) => {
                // Use the consistent currency conversion
                const displayAmount = convertCurrency(debt.amount, debt.currency, currency);
                
                return (
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
                        {currencySymbol}{Math.round(displayAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="long-term">
            <div className="space-y-3">
              {longTermDebts.map((debt) => {
                // Use the consistent currency conversion
                const displayAmount = convertCurrency(debt.amount, debt.currency, currency);
                
                return (
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
                        {currencySymbol}{Math.round(displayAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DebtList;
