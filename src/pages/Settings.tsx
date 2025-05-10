
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const [includeLongTermDebt, setIncludeLongTermDebt] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
