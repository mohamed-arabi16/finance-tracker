
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAssets } from "@/data/mockData";
import { Coins } from "lucide-react";

const AssetList = () => {
  const totalValue = mockAssets.reduce(
    (sum, asset) => sum + asset.amount * asset.currentPrice, 0
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            <span>Assets Overview</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Total Value:</span>{" "}
            <span className="font-semibold finance-positive">${totalValue.toLocaleString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {mockAssets.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center justify-between p-4 rounded-md bg-card border hover:border-positive/30 transition-colors"
            >
              <div className="flex flex-col">
                <div className="font-medium">{asset.title}</div>
                <div className="text-sm text-muted-foreground">
                  {asset.amount} {asset.unit} of {asset.type}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-semibold text-lg finance-positive">
                  ${(asset.amount * asset.currentPrice).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${asset.currentPrice.toLocaleString()} per {asset.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetList;
