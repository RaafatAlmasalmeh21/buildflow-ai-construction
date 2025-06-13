
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, ClipboardList, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const SiteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock site data
  const site = {
    id: 1,
    name: "Downtown Main Building",
    project: "Downtown Office Complex",
    address: "123 Main Street, Downtown",
    status: "Active",
    workers: 24,
    tasks: 45,
    progress: 75,
    coordinates: { lat: 40.7128, lng: -74.0060 },
    activeTasks: [
      { id: 1, name: "Foundation Pour - Section C", assignee: "Team Alpha", priority: "High", status: "In Progress" },
      { id: 2, name: "Steel Frame Installation", assignee: "Team Beta", priority: "Medium", status: "Pending" },
      { id: 3, name: "Electrical Rough-in", assignee: "Team Gamma", priority: "Low", status: "Planned" }
    ],
    recentActivity: [
      { time: "2 hours ago", activity: "Safety inspection completed", user: "John Smith" },
      { time: "4 hours ago", activity: "Material delivery received", user: "Sarah Johnson" },
      { time: "6 hours ago", activity: "Team Alpha checked in", user: "Mike Wilson" }
    ]
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/sites')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.project}</p>
        </div>
        <Badge className="bg-green-100 text-green-800">{site.status}</Badge>
      </div>

      {/* Site Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.workers}</div>
            <p className="text-xs text-muted-foreground">Currently on site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.tasks}</div>
            <p className="text-xs text-muted-foreground">All phases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <ClipboardList className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.progress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${site.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Site Location</CardTitle>
          <CardDescription>{site.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive site map coming soon</p>
              <p className="text-sm text-muted-foreground">
                Coordinates: {site.coordinates.lat}, {site.coordinates.lng}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Tasks and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Current work in progress at this site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {site.activeTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">{task.assignee}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={task.priority === 'High' ? 'destructive' : 
                               task.priority === 'Medium' ? 'default' : 'secondary'}
                    >
                      {task.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{task.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {site.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteDetail;
