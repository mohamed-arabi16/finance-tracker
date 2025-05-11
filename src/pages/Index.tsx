
import Layout from "@/components/Layout";
import FinanceSummary from "@/components/dashboard/FinanceSummary";
import IncomeList from "@/components/income/IncomeList";
import ExpenseList from "@/components/expenses/ExpenseList";
import AssetList from "@/components/assets/AssetList";
import DebtList from "@/components/debt/DebtList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Currency } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const Index = () => {
  const isMobile = useIsMobile();
  
  // Get currency from localStorage
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  // Save currency preference to localStorage when it changes and notify other components
  useEffect(() => {
    localStorage.setItem('defaultCurrency', currency);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, [currency]);
  
  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('defaultCurrency');
      if (saved === 'USD' || saved === 'TRY') {
        setCurrency(saved);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
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
        </div>
        
        <FinanceSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <IncomeList />
          <ExpenseList />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DebtList />
          <AssetList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
