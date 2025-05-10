
import Layout from "@/components/Layout";
import ExpenseList from "@/components/expenses/ExpenseList";

const Expenses = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <ExpenseList />
      </div>
    </Layout>
  );
};

export default Expenses;
