
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ClipboardList, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          name,
          description,
          status,
          priority,
          planned_hours,
          actual_hours,
          planned_start_date,
          planned_end_date,
          progress_percentage,
          sites(
            name,
            projects(name)
          )
        `)
        .neq('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800'; // High
    if (priority >= 3) return 'bg-orange-100 text-orange-800'; // Medium
    return 'bg-green-100 text-green-800'; // Low
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return 'High';
    if (priority >= 3) return 'Medium';
    return 'Low';
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Card 
            key={task.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTaskClick(task.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{task.name}</h3>
                    <Badge className={getStatusColor(task.status)}>
                      {formatStatus(task.status)}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.sites?.projects?.name} • {task.sites?.name}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  View Details
                </Button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Unassigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Due: {task.planned_end_date ? new Date(task.planned_end_date).toLocaleDateString() : 'No date set'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Hours: </span>
                  {task.actual_hours || 0}/{task.planned_hours || 0}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progress: </span>
                  {task.progress_percentage || 0}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${task.progress_percentage || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      )}

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
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.priority >= 4).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + (t.progress_percentage || 0), 0) / tasks.length) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;
