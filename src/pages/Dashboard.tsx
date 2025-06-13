
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, Wrench, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, profile, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [projectsRes, usersRes, equipmentRes, incidentsRes] = await Promise.all([
        supabase.from('projects').select('id, status').eq('deleted_at', null),
        supabase.from('users').select('id').eq('is_active', true),
        supabase.from('equipment').select('id, status').eq('deleted_at', null),
        supabase.from('incidents').select('id, created_at').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        projects: projectsRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        equipment: equipmentRes.data?.length || 0,
        incidents: incidentsRes.data?.length || 0,
        equipmentInMaintenance: equipmentRes.data?.filter(e => e.status === 'maintenance').length || 0
      };
    },
    enabled: !!user
  });

  // Fetch recent projects
  const { data: recentProjects } = useQuery({
    queryKey: ['recent-projects', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, status, progress_percentage')
        .eq('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch upcoming tasks
  const { data: upcomingTasks } = useQuery({
    queryKey: ['upcoming-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('id, name, planned_end_date, priority, status')
        .eq('deleted_at', null)
        .in('status', ['not_started', 'in_progress'])
        .not('planned_end_date', 'is', null)
        .order('planned_end_date', { ascending: true })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email;

  const dashboardStats = [
    {
      title: "Active Projects",
      value: stats?.projects?.toString() || "0",
      change: "Updated now",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: stats?.users?.toString() || "0",
      change: "Company wide",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Equipment Units",
      value: stats?.equipment?.toString() || "0",
      change: `${stats?.equipmentInMaintenance || 0} in maintenance`,
      icon: Wrench,
      color: "text-orange-600"
    },
    {
      title: "Recent Incidents",
      value: stats?.incidents?.toString() || "0",
      change: "Last 30 days",
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: case 4: return 'bg-red-100 text-red-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 2: case 1: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {displayName}
              {profile?.role && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {profile.role.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : stat.value}
              </div>
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
            <CardDescription>Latest project updates and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects?.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{project.progress_percentage}%</p>
                    <div className="w-20 h-2 bg-background rounded-full mt-1">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${project.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No recent projects</p>
              )}
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
              {upcomingTasks?.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.planned_end_date && formatDate(task.planned_end_date)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    Priority {task.priority}
                  </span>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">No upcoming tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
