
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Clock, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TodayTask {
  id: string;
  name: string;
  status: string;
  planned_hours: number;
  actual_hours: number;
  sites: {
    name: string;
  } | null;
}

const TodaysTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['todays-tasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          name,
          status,
          planned_hours,
          actual_hours,
          sites(name)
        `)
        .eq('assignee_id', user.id)
        .eq('planned_date', today)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching today\'s tasks:', error);
        throw error;
      }

      return data as TodayTask[] || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes for offline-first experience
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status,
          ...(status === 'done' && { actual_hours: tasks.find(t => t.id === taskId)?.planned_hours || 0 })
        })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todays-tasks'] });
      toast.success('Task status updated');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status');
    },
  });

  const handleTaskToggle = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'in_progress' : 'done';
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Today's Tasks</h1>
          <p className="text-muted-foreground">Your job card for {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completedTasks} of {tasks.length} tasks completed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Job Card ({tasks.length} tasks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks scheduled for today</p>
              <p className="text-sm">Check back later or contact your supervisor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                    task.status === 'done' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Checkbox
                    checked={task.status === 'done'}
                    onCheckedChange={() => handleTaskToggle(task.id, task.status)}
                    disabled={updateTaskMutation.isPending}
                  />
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.sites?.name || 'No site assigned'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.planned_hours || 0}h planned</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      task.status === 'done' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {task.status === 'done' ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.reduce((acc, t) => acc + (t.planned_hours || 0), 0)}h
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TodaysTasks;
