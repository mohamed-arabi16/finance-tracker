
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertCurrency } from "@/data/mockData";
import { Asset } from "@/types/finance";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import useSupabaseData from "@/hooks/useSupabaseData";

const AssetList = () => {
  const { data: assets, loading, error } = useSupabaseData<Asset>('assets');
  // Get currency from localStorage with state to ensure reactivity
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
    // Also listen for custom event for real-time updates
    window.addEventListener('exchangeRateUpdated', handleStorageChange);
    // Also check on initial mount and when component updates
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('exchangeRateUpdated', handleStorageChange);
    };
  }, []);
  
  const currencySymbol = currency === 'USD' ? '$' : '₺';
  
  // Calculate total asset value based on selected currency using the consistent conversion function
  const totalValue = assets.reduce((sum, asset) => {
    const assetValueUSD = asset.amount * asset.current_price;
    return sum + convertCurrency(assetValueUSD, 'USD', currency);
  }, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
          {assets.map((asset) => {
            // Calculate asset values using the consistent conversion function
            const assetValueUSD = asset.amount * asset.current_price;
            const displayValue = convertCurrency(assetValueUSD, 'USD', currency);
            const unitPrice = convertCurrency(asset.current_price, 'USD', currency);
            
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
