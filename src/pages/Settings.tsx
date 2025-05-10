
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  // Load settings from localStorage if available
  const [includeLongTermDebt, setIncludeLongTermDebt] = useState(() => {
    const saved = localStorage.getItem('includeLongTermDebt');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });
  
  const { toast } = useToast();
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('includeLongTermDebt', JSON.stringify(includeLongTermDebt));
  }, [includeLongTermDebt]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Apply dark mode to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('defaultCurrency', defaultCurrency);
  }, [defaultCurrency]);

  const handleResetSettings = () => {
    setIncludeLongTermDebt(false);
    setDarkMode(false);
    setNotifications(false);
    setDefaultCurrency('USD');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };
  
  const handleExportData = () => {
    // In a real app, this would export all financial data
    toast({
      title: "Export Started",
      description: "Your financial data is being exported.",
    });
    
    // Simulate file download
    setTimeout(() => {
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8,");
      element.setAttribute("download", "financial-data.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Export Complete",
        description: "Your financial data has been exported successfully.",
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">Settings</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="longTermDebt">Include Long-Term Debt in Balance</Label>
                <p className="text-sm text-muted-foreground">Show long-term debt in your available balance calculations</p>
              </div>
              <Switch 
                id="longTermDebt"
                checked={includeLongTermDebt}
                onCheckedChange={setIncludeLongTermDebt}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch 
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for upcoming expenses and income</p>
              </div>
              <Switch 
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
              </div>
              <Select 
                value={defaultCurrency}
                onValueChange={(value: 'USD' | 'TRY') => setDefaultCurrency(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="TRY">TRY (₺)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Export Financial Data</Label>
                <p className="text-sm text-muted-foreground">Download all your financial data in JSON format</p>
              </div>
              <Button onClick={handleExportData} variant="outline">Export</Button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label>Reset All Settings</Label>
                <p className="text-sm text-muted-foreground">This will reset all your preferences to default</p>
              </div>
              <Button onClick={handleResetSettings} variant="destructive">Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
