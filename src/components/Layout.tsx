
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ArrowDown, 
  ArrowUp, 
  CreditCard, 
  Coins, 
  Settings,
  Currency
} from "lucide-react";
import { ReactNode } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Load currency preference from localStorage if available
  const [currency, setCurrency] = useState<'USD' | 'TRY'>(() => {
    const saved = localStorage.getItem('defaultCurrency');
    return (saved === 'USD' || saved === 'TRY') ? saved : 'USD';
  });

  // Save currency preference to localStorage when it changes and notify other components
  useEffect(() => {
    localStorage.setItem('defaultCurrency', currency);
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, [currency]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">
                  Balance Tracker
                </h1>
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
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/" },
    { title: "Income", icon: ArrowDown, href: "/income" },
    { title: "Expenses", icon: ArrowUp, href: "/expenses" },
    { title: "Debt", icon: CreditCard, href: "/debt" },
    { title: "Assets", icon: Coins, href: "/assets" },
    { title: "Settings", icon: Settings, href: "/settings" }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Coins size={24} />
          Balance Tracker
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Layout;
