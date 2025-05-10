
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
  Settings 
} from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                Balance Tracker
              </h1>
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
