
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAssets, exchangeRate } from "@/data/mockData";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

const AssetList = () => {
  // Get currency from localStorage
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  // Calculate total asset value based on selected currency
  const totalValue = mockAssets.reduce((sum, asset) => {
    const assetValue = asset.amount * asset.currentPrice;
    return sum + (currency === 'USD' ? assetValue : Math.round(assetValue * exchangeRate.USDTRY));
  }, 0);

  // Update when localStorage changes (from other components)
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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            <span>Assets Overview</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Total Value:</span>{" "}
            <span className="font-semibold finance-positive">{currencySymbol}{Math.round(totalValue).toLocaleString()}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {mockAssets.map((asset) => {
            // Calculate asset values based on currency
            const assetValue = asset.amount * asset.currentPrice;
            const displayValue = currency === 'USD' ? assetValue : Math.round(assetValue * exchangeRate.USDTRY);
            const unitPrice = currency === 'USD' ? asset.currentPrice : Math.round(asset.currentPrice * exchangeRate.USDTRY);
            
            return (
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
                    {currencySymbol}{Math.round(displayValue).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currencySymbol}{Math.round(unitPrice).toLocaleString()} per {asset.unit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetList;
