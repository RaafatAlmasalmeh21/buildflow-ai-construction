
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ClipboardList, Calendar, User } from 'lucide-react';

const Tasks = () => {
  const tasks = [
    {
      id: 1,
      name: "Foundation Pour - Section C",
      project: "Downtown Office Complex",
      site: "Main Building",
      assignee: "Team Alpha",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-12-15",
      progress: 60,
      estimatedHours: 40,
      actualHours: 24
    },
    {
      id: 2,
      name: "Steel Frame Installation",
      project: "Downtown Office Complex",
      site: "Main Building",
      assignee: "Team Beta",
      priority: "Medium",
      status: "Pending",
      dueDate: "2024-12-20",
      progress: 0,
      estimatedHours: 80,
      actualHours: 0
    },
    {
      id: 3,
      name: "Electrical Rough-in",
      project: "Residential Phase 2",
      site: "Block A",
      assignee: "Team Gamma",
      priority: "Low",
      status: "Planned",
      dueDate: "2024-12-25",
      progress: 0,
      estimatedHours: 60,
      actualHours: 0
    },
    {
      id: 4,
      name: "Plumbing Installation",
      project: "Warehouse Extension",
      site: "Main Site",
      assignee: "Team Delta",
      priority: "High",
      status: "In Progress",
      dueDate: "2024-12-18",
      progress: 85,
      estimatedHours: 50,
      actualHours: 42
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Planned': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage work assignments and progress</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search tasks..." className="pl-10" />
        </div>
        <Button variant="outline">Kanban View</Button>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort</Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{task.name}</h3>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.project} • {task.site}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{task.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Hours: </span>
                  {task.actualHours}/{task.estimatedHours}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progress: </span>
                  {task.progress}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.priority === 'High').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;
