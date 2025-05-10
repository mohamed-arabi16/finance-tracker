
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIncomes } from "@/data/mockData";
import { Income } from "@/types/finance";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IncomePage = () => {
  const totalReceived = mockIncomes
    .filter(income => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0);

  const totalExpected = mockIncomes
    .filter(income => income.status === "expected")
    .reduce((sum, income) => sum + income.amount, 0);

  const incomeByCategory = mockIncomes.reduce((acc, income) => {
    if (!acc[income.category]) {
      acc[income.category] = 0;
    }
    acc[income.category] += income.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Income Manager</h2>
          <Button className="bg-teal hover:bg-teal-light">
            <Plus className="h-4 w-4 mr-2" /> Add Income
          </Button>
        </div>
        
        {/* Income summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold finance-positive">${totalReceived.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Expected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalExpected.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${(totalReceived + totalExpected).toLocaleString()}</p>
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
                  <div className="text-lg font-semibold">${amount.toLocaleString()}</div>
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
              <div className="grid grid-cols-5 p-3 bg-muted text-muted-foreground text-sm font-medium">
                <div className="col-span-2">Title</div>
                <div>Date</div>
                <div>Status</div>
                <div className="text-right">Amount</div>
              </div>
              {mockIncomes.map((income: Income) => (
                <div
                  key={income.id}
                  className="grid grid-cols-5 p-3 border-t items-center"
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
                  <div className="text-right font-medium">
                    ${income.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IncomePage;
