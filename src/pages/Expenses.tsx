
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockExpenses, exchangeRate } from "@/data/mockData";
import { Expense, ExpenseType } from "@/types/finance";
import { format } from "date-fns";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  "Housing", "Utilities", "Food", "Transportation", 
  "Healthcare", "Entertainment", "Education", "Bills", "Other"
];

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    amount: number;
    date: string;
    type: ExpenseType;
    category?: string;
    currency?: 'USD' | 'TRY';
  }>({
    title: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: "one-time",
    category: "Other",
    currency: "USD"
  });

  const totalRecurring = expenses
    .filter(expense => expense.type === "recurring")
    .reduce((sum, expense) => {
      // Convert TRY to USD for display
      const amountInUSD = expense.currency === 'TRY' ? Math.round(expense.amount / exchangeRate.USDTRY) : expense.amount;
      return sum + amountInUSD;
    }, 0);

  const totalOneTime = expenses
    .filter(expense => expense.type === "one-time")
    .reduce((sum, expense) => {
      // Convert TRY to USD for display
      const amountInUSD = expense.currency === 'TRY' ? Math.round(expense.amount / exchangeRate.USDTRY) : expense.amount;
      return sum + amountInUSD;
    }, 0);

  const handleAddExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      title: formData.title,
      amount: Number(formData.amount),
      date: new Date(formData.date),
      type: formData.type,
      category: formData.category,
      currency: formData.currency
    };
    
    setExpenses([...expenses, newExpense]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: `${newExpense.title} has been added to your expenses.`,
    });
  };

  const handleEditExpense = () => {
    if (!editingExpense) return;
    
    const updatedExpenses = expenses.map(expense => {
      if (expense.id === editingExpense.id) {
        return {
          ...expense,
          title: formData.title,
          amount: Number(formData.amount),
          date: new Date(formData.date),
          type: formData.type,
          category: formData.category,
          currency: formData.currency
        };
      }
      return expense;
    });
    
    setExpenses(updatedExpenses);
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    resetForm();
    
    toast({
      title: "Expense Updated",
      description: `${formData.title} has been updated.`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    toast({
      title: "Expense Deleted",
      description: "The expense has been removed from your records.",
    });
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      date: format(expense.date, "yyyy-MM-dd"),
      type: expense.type,
      category: expense.category || "Other",
      currency: expense.currency || "USD"
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: "one-time",
      category: "Other",
      currency: "USD"
    });
  };

  // Group by category for summary
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    // Convert to USD for display
    const amountInUSD = expense.currency === 'TRY' ? Math.round(expense.amount / exchangeRate.USDTRY) : expense.amount;
    acc[category] += amountInUSD;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Expense Manager</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details for your new expense.
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
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value: ExpenseType) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value: string) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Due Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="col-span-3"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Expense Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly Recurring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-negative">${totalRecurring.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">One-Time Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-negative">${totalOneTime.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Expenses by category */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="p-4 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">{category}</div>
                  <div className="text-lg font-semibold finance-negative">${amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* All Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-7 p-3 bg-muted text-muted-foreground text-sm font-medium">
                <div className="col-span-2">Title</div>
                <div>Due Date</div>
                <div>Type</div>
                <div>Category</div>
                <div>Amount</div>
                <div className="text-right">Actions</div>
              </div>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="grid grid-cols-7 p-3 border-t items-center"
                >
                  <div className="col-span-2">
                    <div>{expense.title}</div>
                  </div>
                  <div>{format(expense.date, "MMM d, yyyy")}</div>
                  <div>
                    <Badge className={expense.type === "recurring" ? 
                      "bg-negative/20 text-negative" : 
                      "bg-muted text-muted-foreground"
                    }>
                      {expense.type === "recurring" ? "Monthly" : "One-time"}
                    </Badge>
                  </div>
                  <div>{expense.category || "Uncategorized"}</div>
                  <div className="font-medium text-negative">
                    {expense.currency === 'TRY' ? '₺' : '$'}{expense.amount.toLocaleString()}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(expense)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of your expense.
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
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value: ExpenseType) => setFormData({...formData, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value: string) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">Due Date</Label>
              <Input 
                id="edit-date" 
                type="date" 
                className="col-span-3"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingExpense(null);
            }}>Cancel</Button>
            <Button onClick={handleEditExpense}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Expenses;
