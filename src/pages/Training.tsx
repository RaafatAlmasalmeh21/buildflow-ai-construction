
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Training {
  id: string;
  title: string;
  url: string;
  duration: number;
  required_for_task_type: string;
  description?: string;
}

interface CompletedTraining {
  training_id: string;
  completed_at: string;
}

const fetchTraining = async (): Promise<Training[]> => {
  const { data, error } = await supabase
    .from('training')
    .select('*')
    .order('title');

  if (error) {
    console.error('Error fetching training:', error);
    throw error;
  }

  return (data || []) as Training[];
};

const fetchCompletedTraining = async (userId: string): Promise<CompletedTraining[]> => {
  const { data, error } = await supabase
    .from('user_training_completed')
    .select('training_id, completed_at')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching completed training:', error);
    throw error;
  }

  return (data || []) as CompletedTraining[];
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const Training = () => {
  const { user } = useAuth();

  const { data: training = [], isLoading: trainingLoading } = useQuery({
    queryKey: ['training'],
    queryFn: fetchTraining,
  });

  const { data: completedTraining = [], isLoading: completedLoading } = useQuery({
    queryKey: ['completed-training', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return fetchCompletedTraining(user.id);
    },
    enabled: !!user?.id,
  });

  const isCompleted = (trainingId: string) => {
    return completedTraining.some(ct => ct.training_id === trainingId);
  };

  const handleWatchVideo = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  if (trainingLoading || completedLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Micro-Training</h1>
            <p className="text-muted-foreground">Loading training materials...</p>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = training.filter(t => isCompleted(t.id)).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Micro-Training</h1>
          <p className="text-muted-foreground">
            Complete required training modules for your tasks
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{training.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {training.length > 0 ? Math.round((completedCount / training.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Training Modules ({training.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {training.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No training modules available</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {training.map((item) => {
                const completed = isCompleted(item.id);
                return (
                  <div 
                    key={item.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{item.title}</h3>
                          {completed && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {item.required_for_task_type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(item.duration)}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        variant={completed ? "outline" : "default"}
                        onClick={() => handleWatchVideo(item.url)}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        {completed ? 'Watch Again' : 'Watch Video'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Training;
