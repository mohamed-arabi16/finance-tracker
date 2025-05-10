
import Layout from "@/components/Layout";
import AssetList from "@/components/assets/AssetList";

const Assets = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Assets</h2>
        <AssetList />
      </div>
    </Layout>
  );
};

export default Assets;
