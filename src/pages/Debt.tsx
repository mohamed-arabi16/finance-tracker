
import Layout from "@/components/Layout";
import DebtList from "@/components/debt/DebtList";

const Debt = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Debt Management</h2>
        <DebtList />
      </div>
    </Layout>
  );
};

export default Debt;
