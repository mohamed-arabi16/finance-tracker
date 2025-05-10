
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAssets } from "@/data/mockData";
import { Asset } from "@/types/finance";
import { useState } from "react";
import { Coins, Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const AssetTypes = ["silver", "gold", "crypto", "property", "stocks", "other"];

const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    type: string;
    amount: number;
    unit: string;
    currentPrice: number;
  }>({
    title: "",
    type: "silver",
    amount: 0,
    unit: "kg",
    currentPrice: 0
  });

  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.amount * asset.currentPrice, 0
  );

  const handleAddAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      amount: Number(formData.amount),
      unit: formData.unit,
      currentPrice: Number(formData.currentPrice)
    };
    
    setAssets([...assets, newAsset]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Asset Added",
      description: `${newAsset.title} has been added to your assets.`,
    });
  };

  const handleEditAsset = () => {
    if (!editingAsset) return;
    
    const updatedAssets = assets.map(asset => {
      if (asset.id === editingAsset.id) {
        return {
          ...asset,
          title: formData.title,
          type: formData.type,
          amount: Number(formData.amount),
          unit: formData.unit,
          currentPrice: Number(formData.currentPrice)
        };
      }
      return asset;
    });
    
    setAssets(updatedAssets);
    setIsEditDialogOpen(false);
    setEditingAsset(null);
    resetForm();
    
    toast({
      title: "Asset Updated",
      description: `${formData.title} has been updated.`,
    });
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    
    toast({
      title: "Asset Deleted",
      description: "The asset has been removed from your records.",
    });
  };

  const openEditDialog = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      title: asset.title,
      type: asset.type,
      amount: asset.amount,
      unit: asset.unit,
      currentPrice: asset.currentPrice
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "silver",
      amount: 0,
      unit: "kg",
      currentPrice: 0
    });
  };

  // Group by asset type for summary
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = 0;
    }
    acc[asset.type] += asset.amount * asset.currentPrice;
    return acc;
  }, {} as Record<string, number>);

  const fetchSilverPrice = () => {
    // In a real application, this would call an API
    toast({
      title: "Silver Price Updated",
      description: "The current silver price has been updated.",
    });
    
    // Update silver assets with new price
    const updatedAssets = assets.map(asset => {
      if (asset.type === "silver") {
        // For demo purposes, we'll use a slightly different price
        const newPrice = 950 + Math.floor(Math.random() * 50);
        return {...asset, currentPrice: newPrice};
      }
      return asset;
    });
    
    setAssets(updatedAssets);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Assets</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSilverPrice}>
              Update Prices
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new asset.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input 
                      id="title" 
                      className="col-span-3"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <select
                      id="type"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {AssetTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      className="col-span-3"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">Unit</Label>
                    <Input 
                      id="unit" 
                      className="col-span-3"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentPrice" className="text-right">Price per Unit ($)</Label>
                    <Input 
                      id="currentPrice" 
                      type="number" 
                      className="col-span-3"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({...formData, currentPrice: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddAsset}>Add Asset</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Assets Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Assets Overview
            </CardTitle>
            <CardDescription>
              Total Value: <span className="font-semibold finance-positive">${totalValue.toLocaleString()}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(assetsByType).map(([type, value]) => (
                <div key={type} className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1 capitalize">{type}</div>
                  <div className="text-lg font-semibold finance-positive">${value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Asset List */}
        <Card>
          <CardHeader>
            <CardTitle>All Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-7 p-3 bg-muted text-muted-foreground text-sm font-medium">
                <div className="col-span-2">Title</div>
                <div>Type</div>
                <div>Amount</div>
                <div>Unit Price</div>
                <div>Total Value</div>
                <div className="text-right">Actions</div>
              </div>
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid grid-cols-7 p-3 border-t items-center"
                >
                  <div className="col-span-2">{asset.title}</div>
                  <div className="capitalize">{asset.type}</div>
                  <div>
                    {asset.amount} {asset.unit}
                  </div>
                  <div>${asset.currentPrice.toLocaleString()}</div>
                  <div className="font-medium finance-positive">
                    ${(asset.amount * asset.currentPrice).toLocaleString()}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(asset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the details of your asset.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input 
                id="edit-title" 
                className="col-span-3"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <select
                id="edit-type"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                {AssetTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">Amount</Label>
              <Input 
                id="edit-amount" 
                type="number" 
                className="col-span-3"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-unit" className="text-right">Unit</Label>
              <Input 
                id="edit-unit" 
                className="col-span-3"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-currentPrice" className="text-right">Price per Unit ($)</Label>
              <Input 
                id="edit-currentPrice" 
                type="number" 
                className="col-span-3"
                value={formData.currentPrice}
                onChange={(e) => setFormData({...formData, currentPrice: Number(e.target.value)})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingAsset(null);
            }}>Cancel</Button>
            <Button onClick={handleEditAsset}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AssetsPage;
