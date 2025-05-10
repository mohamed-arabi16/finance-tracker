
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDebts } from "@/data/mockData";
import { CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DebtList = () => {
  const shortTermDebts = mockDebts.filter(debt => !debt.isLongTerm);
  const longTermDebts = mockDebts.filter(debt => debt.isLongTerm);

  const totalShortTerm = shortTermDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalLongTerm = longTermDebts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Debt Overview</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Short-Term:</span>{" "}
              <span className="font-semibold finance-negative">${totalShortTerm.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Long-Term:</span>{" "}
              <span className="font-semibold finance-negative">${totalLongTerm.toLocaleString()}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="short-term">
          <TabsList className="mb-4">
            <TabsTrigger value="short-term">Short-Term Debt</TabsTrigger>
            <TabsTrigger value="long-term">Long-Term Debt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="short-term">
            <div className="space-y-3">
              {shortTermDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{debt.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>Creditor: {debt.creditor}</span>
                      {debt.deadline && (
                        <span>
                          Due: {
                            debt.deadline.getFullYear() === 2026 
                              ? "No fixed date" 
                              : format(debt.deadline, "MMM d, yyyy")
                          }
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={debt.status === "pending" ? "default" : "outline"}
                      className={debt.status === "pending" ? "bg-negative/20 text-negative hover:bg-negative/30" : ""}
                    >
                      {debt.status === "pending" ? "Pending" : "Paid"}
                    </Badge>
                    <div className="font-semibold text-right w-24 text-lg text-negative">
                      ${debt.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="long-term">
            <div className="space-y-3">
              {longTermDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 rounded-md bg-card border hover:border-negative/30 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{debt.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Creditor: {debt.creditor}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Long-Term</Badge>
                    <div className="font-semibold text-right w-24 text-lg text-negative">
                      ${debt.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DebtList;
