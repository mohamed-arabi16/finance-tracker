
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIncomes, exchangeRate } from "@/data/mockData";
import { Income, IncomeCategory, IncomeStatus } from "@/types/finance";
import { format } from "date-fns";
import { Plus, Edit, Trash, Currency } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const IncomePage = () => {
  const [incomes, setIncomes] = useState<Income[]>(mockIncomes);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const { toast } = useToast();
  
  // Get currency from localStorage
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('defaultCurrency', currency);
  }, [currency]);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    amount: number;
    category: IncomeCategory;
    date: string;
    status: IncomeStatus;
    currency?: 'USD' | 'TRY';
  }>({
    title: "",
    amount: 0,
    category: "other",
    date: new Date().toISOString().split('T')[0],
    status: "expected",
    currency: "USD"
  });

  // Convert income amount based on selected currency
  const convertAmount = (income: Income): number => {
    if (income.currency === 'TRY' && currency === 'USD') {
      return Math.round(income.amount / exchangeRate.USDTRY);
    } else if (!income.currency || income.currency === 'USD' && currency === 'TRY') {
      return Math.round(income.amount * exchangeRate.USDTRY);
    } 
    return Math.round(income.amount);
  };

  const totalReceived = incomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + convertAmount(income), 0);

  const totalExpected = incomes
    .filter(income => income.status === "expected")
    .reduce((sum, income) => sum + convertAmount(income), 0);

  // Category totals need to use the converted amounts
  const incomeByCategory = incomes.reduce((acc, income) => {
    if (!acc[income.category]) {
      acc[income.category] = 0;
    }
    acc[income.category] += convertAmount(income);
    return acc;
  }, {} as Record<string, number>);

  const handleAddIncome = () => {
    const newIncome: Income = {
      id: Date.now().toString(),
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      date: new Date(formData.date),
      status: formData.status,
      currency: formData.currency
    };
    
    setIncomes([...incomes, newIncome]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Income Added",
      description: `${newIncome.title} has been added to your incomes.`,
    });
  };

  const handleEditIncome = () => {
    if (!editingIncome) return;
    
    const updatedIncomes = incomes.map(income => {
      if (income.id === editingIncome.id) {
        return {
          ...income,
          title: formData.title,
          amount: Number(formData.amount),
          category: formData.category,
          date: new Date(formData.date),
          status: formData.status,
          currency: formData.currency
        };
      }
      return income;
    });
    
    setIncomes(updatedIncomes);
    setIsEditDialogOpen(false);
    setEditingIncome(null);
    resetForm();
    
    toast({
      title: "Income Updated",
      description: `${formData.title} has been updated.`,
    });
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter(income => income.id !== id));
    
    toast({
      title: "Income Deleted",
      description: "The income has been removed from your records.",
    });
  };

  const openEditDialog = (income: Income) => {
    setEditingIncome(income);
    setFormData({
      title: income.title,
      amount: income.amount,
      category: income.category,
      date: format(income.date, "yyyy-MM-dd"),
      status: income.status,
      currency: income.currency || "USD"
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: 0,
      category: "other",
      date: new Date().toISOString().split('T')[0],
      status: "expected",
      currency: "USD"
    });
  };

  const currencySymbol = currency === 'USD' ? '$' : '₺';

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Income Manager</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 flex gap-1">
                  <Currency className="h-4 w-4" />
                  <span>{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCurrency('USD')}>
                  USD ($)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency('TRY')}>
                  TRY (₺)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal hover:bg-teal-light">
                <Plus className="h-4 w-4 mr-2" /> Add Income
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
                <DialogDescription>
                  Enter the details for your new income.
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
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value: IncomeCategory) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="student">Student Commission</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="videography">Videography</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="col-span-3"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value: IncomeStatus) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="expected">Expected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddIncome}>Add Income</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Income summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-positive">{currencySymbol}{totalReceived.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Expected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currencySymbol}{totalExpected.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currencySymbol}{(totalReceived + totalExpected).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Income by category */}
        <Card>
          <CardHeader>
            <CardTitle>Income by Category</CardTitle>
            <CardDescription>Breakdown of income sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <div key={category} className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1 capitalize">{category}</div>
                  <div className="text-lg font-semibold">{currencySymbol}{amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Income list */}
        <Card>
          <CardHeader>
            <CardTitle>All Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-3 bg-muted text-muted-foreground text-sm font-medium">
                <div className="col-span-2">Title</div>
                <div>Date</div>
                <div>Status</div>
                <div>Amount</div>
                <div className="text-right">Actions</div>
              </div>
              {incomes.map((income: Income) => (
                <div
                  key={income.id}
                  className="grid grid-cols-6 p-3 border-t items-center"
                >
                  <div className="col-span-2">
                    <div>{income.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{income.category}</div>
                  </div>
                  <div>{format(income.date, "MMM d, yyyy")}</div>
                  <div>
                    <Badge className={income.status === "received" ? 
                      "bg-positive/10 text-positive" : 
                      "bg-muted text-muted-foreground"
                    }>
                      {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="font-medium">
                    {income.currency === 'TRY' ? '₺' : '$'}{Math.round(income.amount).toLocaleString()}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(income)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteIncome(income.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Income Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
            <DialogDescription>
              Update the details of your income.
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
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value: IncomeCategory) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="student">Student Commission</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">Date</Label>
              <Input 
                id="edit-date" 
                type="date" 
                className="col-span-3"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value: IncomeStatus) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="expected">Expected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingIncome(null);
            }}>Cancel</Button>
            <Button onClick={handleEditIncome}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default IncomePage;
