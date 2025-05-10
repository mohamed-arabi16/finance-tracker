
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { mockDebts, exchangeRate } from "@/data/mockData";
import { Debt, DebtStatus } from "@/types/finance";
import { format } from "date-fns";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const DebtPage = () => {
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    amount: number;
    creditor: string;
    deadline: string;
    isLongTerm: boolean;
    status: DebtStatus;
    currency?: 'USD' | 'TRY';
  }>({
    title: "",
    amount: 0,
    creditor: "",
    deadline: new Date().toISOString().split('T')[0],
    isLongTerm: false,
    status: "pending",
    currency: "USD"
  });

  const shortTermDebts = debts.filter(debt => !debt.isLongTerm);
  const longTermDebts = debts.filter(debt => debt.isLongTerm);

  const totalShortTerm = shortTermDebts.reduce((sum, debt) => {
    // Convert TRY to USD for display
    const amountInUSD = debt.currency === 'TRY' ? Math.round(debt.amount / exchangeRate.USDTRY) : debt.amount;
    return sum + amountInUSD;
  }, 0);

  const totalLongTerm = longTermDebts.reduce((sum, debt) => {
    // Convert TRY to USD for display
    const amountInUSD = debt.currency === 'TRY' ? Math.round(debt.amount / exchangeRate.USDTRY) : debt.amount;
    return sum + amountInUSD;
  }, 0);

  const totalPending = debts
    .filter(debt => debt.status === "pending")
    .reduce((sum, debt) => {
      const amountInUSD = debt.currency === 'TRY' ? Math.round(debt.amount / exchangeRate.USDTRY) : debt.amount;
      return sum + amountInUSD;
    }, 0);

  const totalPaid = debts
    .filter(debt => debt.status === "paid")
    .reduce((sum, debt) => {
      const amountInUSD = debt.currency === 'TRY' ? Math.round(debt.amount / exchangeRate.USDTRY) : debt.amount;
      return sum + amountInUSD;
    }, 0);

  const handleAddDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      title: formData.title,
      amount: Number(formData.amount),
      creditor: formData.creditor,
      deadline: new Date(formData.deadline),
      isLongTerm: formData.isLongTerm,
      status: formData.status,
      currency: formData.currency
    };
    
    setDebts([...debts, newDebt]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Debt Added",
      description: `${newDebt.title} has been added to your debts.`,
    });
  };

  const handleEditDebt = () => {
    if (!editingDebt) return;
    
    const updatedDebts = debts.map(debt => {
      if (debt.id === editingDebt.id) {
        return {
          ...debt,
          title: formData.title,
          amount: Number(formData.amount),
          creditor: formData.creditor,
          deadline: new Date(formData.deadline),
          isLongTerm: formData.isLongTerm,
          status: formData.status,
          currency: formData.currency
        };
      }
      return debt;
    });
    
    setDebts(updatedDebts);
    setIsEditDialogOpen(false);
    setEditingDebt(null);
    resetForm();
    
    toast({
      title: "Debt Updated",
      description: `${formData.title} has been updated.`,
    });
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
    
    toast({
      title: "Debt Deleted",
      description: "The debt has been removed from your records.",
    });
  };

  const openEditDialog = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      title: debt.title,
      amount: debt.amount,
      creditor: debt.creditor,
      deadline: format(debt.deadline, "yyyy-MM-dd"),
      isLongTerm: debt.isLongTerm,
      status: debt.status,
      currency: debt.currency || "USD"
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: 0,
      creditor: "",
      deadline: new Date().toISOString().split('T')[0],
      isLongTerm: false,
      status: "pending",
      currency: "USD"
    });
  };

  const formatDeadline = (date: Date) => {
    // Check if it's the beginning of 2026 (used for "no fixed date")
    if (date.getFullYear() === 2026 && date.getMonth() === 0 && date.getDate() === 1) {
      return "No fixed date";
    }
    return format(date, "MMM d, yyyy");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Debt Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Debt</DialogTitle>
                <DialogDescription>
                  Enter the details for your debt.
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
                  <Label htmlFor="currency" className="text-right">Currency</Label>
                  <Select 
                    value={formData.currency}
                    onValueChange={(value: 'USD' | 'TRY') => setFormData({...formData, currency: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creditor" className="text-right">Creditor</Label>
                  <Input 
                    id="creditor" 
                    className="col-span-3"
                    value={formData.creditor}
                    onChange={(e) => setFormData({...formData, creditor: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">Due Date</Label>
                  <Input 
                    id="deadline" 
                    type="date" 
                    className="col-span-3"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isLongTerm" className="text-right">Long-Term Debt</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch 
                      id="isLongTerm"
                      checked={formData.isLongTerm}
                      onCheckedChange={(checked) => setFormData({...formData, isLongTerm: checked})}
                    />
                    <Label htmlFor="isLongTerm" className="text-sm text-muted-foreground">
                      {formData.isLongTerm ? "Yes (excluded from balance)" : "No (included in balance)"}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value: DebtStatus) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDebt}>Add Debt</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Debt Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Short-Term Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-negative">${totalShortTerm.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Long-Term Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-muted-foreground">${totalLongTerm.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-negative">${totalPending.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-positive">${totalPaid.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Debt Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Overview</CardTitle>
            <CardDescription>View and manage all your debts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="short-term">
              <TabsList className="mb-4">
                <TabsTrigger value="short-term">Short-Term Debt</TabsTrigger>
                <TabsTrigger value="long-term">Long-Term Debt</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short-term">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-3 bg-muted text-muted-foreground text-sm font-medium">
                    <div className="col-span-2">Title</div>
                    <div>Creditor</div>
                    <div>Due Date</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {shortTermDebts.map((debt) => (
                    <div
                      key={debt.id}
                      className="grid grid-cols-7 p-3 border-t items-center"
                    >
                      <div className="col-span-2">{debt.title}</div>
                      <div>{debt.creditor}</div>
                      <div>{formatDeadline(debt.deadline)}</div>
                      <div>
                        <Badge className={debt.status === "pending" ? 
                          "bg-negative/20 text-negative" : 
                          "bg-positive/20 text-positive"
                        }>
                          {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="font-medium">
                        {debt.currency === 'TRY' ? '₺' : '$'}{debt.amount.toLocaleString()}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(debt)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDebt(debt.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="long-term">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-3 bg-muted text-muted-foreground text-sm font-medium">
                    <div className="col-span-2">Title</div>
                    <div>Creditor</div>
                    <div>Due Date</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {longTermDebts.map((debt) => (
                    <div
                      key={debt.id}
                      className="grid grid-cols-7 p-3 border-t items-center"
                    >
                      <div className="col-span-2">{debt.title}</div>
                      <div>{debt.creditor}</div>
                      <div>{formatDeadline(debt.deadline)}</div>
                      <div>
                        <Badge className={debt.status === "pending" ? 
                          "bg-negative/20 text-negative" : 
                          "bg-positive/20 text-positive"
                        }>
                          {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="font-medium">
                        {debt.currency === 'TRY' ? '₺' : '$'}{debt.amount.toLocaleString()}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(debt)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDebt(debt.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Debt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Debt</DialogTitle>
            <DialogDescription>
              Update the details of your debt.
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
              <Label htmlFor="edit-currency" className="text-right">Currency</Label>
              <Select 
                value={formData.currency}
                onValueChange={(value: 'USD' | 'TRY') => setFormData({...formData, currency: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="TRY">TRY (₺)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-creditor" className="text-right">Creditor</Label>
              <Input 
                id="edit-creditor" 
                className="col-span-3"
                value={formData.creditor}
                onChange={(e) => setFormData({...formData, creditor: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deadline" className="text-right">Due Date</Label>
              <Input 
                id="edit-deadline" 
                type="date" 
                className="col-span-3"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isLongTerm" className="text-right">Long-Term Debt</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch 
                  id="edit-isLongTerm"
                  checked={formData.isLongTerm}
                  onCheckedChange={(checked) => setFormData({...formData, isLongTerm: checked})}
                />
                <Label htmlFor="edit-isLongTerm" className="text-sm text-muted-foreground">
                  {formData.isLongTerm ? "Yes (excluded from balance)" : "No (included in balance)"}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value: DebtStatus) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingDebt(null);
            }}>Cancel</Button>
            <Button onClick={handleEditDebt}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DebtPage;
