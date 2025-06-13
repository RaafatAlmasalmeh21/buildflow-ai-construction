
import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckSquare, ArrowRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TodaysTask {
  id: string;
  name: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  priority: number;
  planned_start_date: string | null;
  planned_end_date: string | null;
  site: {
    name: string;
  } | null;
}

const fetchTodaysTasks = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      name,
      description,
      status,
      priority,
      planned_start_date,
      planned_end_date,
      site:sites(name)
    `)
    .eq('assignee_id', userId)
    .lte('planned_start_date', today)
    .gte('planned_end_date', today)
    .is('deleted_at', null)
    .order('priority', { ascending: false })
    .returns<TodaysTask[]>();

  if (error) {
    console.error('Error fetching today\'s tasks:', error);
    throw error;
  }

  return data || [];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'on_hold':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: number) => {
  if (priority >= 4) return 'bg-red-100 text-red-800';
  if (priority >= 3) return 'bg-orange-100 text-orange-800';
  if (priority >= 2) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const TodaysTasks = () => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['todays-tasks', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return fetchTodaysTasks(user.id);
    },
    enabled: !!user?.id,
  });

  const updateTaskStatus = async (taskId: string, newStatus: 'not_started' | 'in_progress' | 'completed' | 'on_hold') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          actual_start_date: newStatus === 'in_progress' ? new Date().toISOString().split('T')[0] : undefined,
          actual_end_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
        })
        .eq('id', taskId);

      if (error) throw error;
      
      // Refetch tasks after update
      window.location.reload();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Today's Tasks</h1>
            <p className="text-muted-foreground">Loading your tasks for today...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Today's Tasks</h1>
            <p className="text-red-500">Error loading tasks</p>
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const notStartedTasks = tasks.filter(task => task.status === 'not_started');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Today's Tasks</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{notStartedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Tasks ({tasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks scheduled for today</p>
              <p className="text-sm">Check back tomorrow or view all your tasks</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium">{task.name}</h3>
                      {task.site && (
                        <p className="text-sm text-gray-600">Site: {task.site.name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        Priority {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {task.planned_start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Start: {new Date(task.planned_start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {task.planned_end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>End: {new Date(task.planned_end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {task.status === 'not_started' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                        >
                          Complete Task
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodaysTasks;
