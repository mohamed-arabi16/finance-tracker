
import Layout from "@/components/Layout";
import FinanceSummary from "@/components/dashboard/FinanceSummary";
import IncomeList from "@/components/income/IncomeList";
import ExpenseList from "@/components/expenses/ExpenseList";
import AssetList from "@/components/assets/AssetList";
import DebtList from "@/components/debt/DebtList";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
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
