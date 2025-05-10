
import Layout from "@/components/Layout";
import FinanceSummary from "@/components/dashboard/FinanceSummary";
import IncomeList from "@/components/income/IncomeList";
import ExpenseList from "@/components/expenses/ExpenseList";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <FinanceSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <IncomeList />
          <ExpenseList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
