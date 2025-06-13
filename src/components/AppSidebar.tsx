import {
  BarChart3,
  Building2,
  Calendar,
  HardHat,
  MapPin,
  Settings,
  Users,
  Wrench,
  ClipboardList,
  Home,
  Clock,
  CheckSquare,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ['admin', 'project_manager', 'site_supervisor', 'foreman', 'worker', 'client']
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Building2,
    roles: ['admin', 'project_manager', 'site_supervisor', 'client']
  },
  {
    title: "Sites",
    url: "/sites",
    icon: MapPin,
    roles: ['admin', 'project_manager', 'site_supervisor', 'foreman']
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ClipboardList,
    roles: ['admin', 'project_manager', 'site_supervisor', 'foreman']
  },
  {
    title: "My Tasks",
    url: "/tasks/my",
    icon: ClipboardList,
    roles: ['worker', 'foreman']
  },
  {
    title: "Today's Tasks",
    url: "/tasks/today",
    icon: CheckSquare,
    roles: ['worker', 'foreman']
  },
  {
    title: "Timesheet",
    url: "/timesheet",
    icon: Clock,
    roles: ['worker', 'foreman']
  },
  {
    title: "Workforce",
    url: "/workforce",
    icon: Users,
    roles: ['admin', 'project_manager', 'site_supervisor']
  },
  {
    title: "Equipment",
    url: "/equipment",
    icon: Wrench,
    roles: ['admin', 'project_manager', 'site_supervisor', 'foreman']
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ['admin', 'project_manager', 'client']
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ['admin']
  },
  {
    title: "Report Incident",
    url: "/incidents/new",
    icon: AlertTriangle,
    roles: ['worker', 'foreman']
  },
  {
    title: "My Incidents",
    url: "/incidents/mine",
    icon: AlertTriangle,
    roles: ['worker', 'foreman']
  },
];

export function AppSidebar() {
  const { profile } = useAuth();

  const filteredItems = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <HardHat className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">BuildPro</h1>
            <p className="text-xs text-sidebar-foreground/70">Construction Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
