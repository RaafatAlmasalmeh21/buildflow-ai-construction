
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, Wrench, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this month",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Total Workers",
      value: "84",
      change: "+5 this week",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Equipment Units",
      value: "156",
      change: "3 in maintenance",
      icon: Wrench,
      color: "text-orange-600"
    },
    {
      title: "Safety Incidents",
      value: "2",
      change: "-1 this month",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest project updates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Downtown Office Complex", status: "On Track", progress: 75 },
                { name: "Residential Phase 2", status: "Delayed", progress: 45 },
                { name: "Warehouse Extension", status: "Ahead", progress: 90 }
              ].map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{project.progress}%</p>
                    <div className="w-20 h-2 bg-background rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Important deadlines and scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Safety inspection - Site A", date: "Tomorrow", priority: "High" },
                { task: "Equipment maintenance check", date: "Dec 15", priority: "Medium" },
                { task: "Client progress meeting", date: "Dec 18", priority: "High" },
                { task: "Material delivery - Site B", date: "Dec 20", priority: "Medium" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
