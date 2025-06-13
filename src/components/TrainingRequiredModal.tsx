
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, AlertTriangle } from 'lucide-react';

interface Training {
  id: string;
  title: string;
  url: string;
  duration: number;
  required_for_task_type: string;
}

interface TrainingRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: Training[];
  onComplete: () => void;
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const TrainingRequiredModal = ({ 
  isOpen, 
  onClose, 
  training, 
  onComplete 
}: TrainingRequiredModalProps) => {
  const [completedTraining, setCompletedTraining] = useState<Set<string>>(new Set());
  
  const handleWatchVideo = (trainingItem: Training) => {
    window.open(trainingItem.url, '_blank');
    // Mark as completed (in real implementation, this would be tracked properly)
    setCompletedTraining(prev => new Set([...prev, trainingItem.id]));
  };

  const allCompleted = training.every(t => completedTraining.has(t.id));

  const handleComplete = () => {
    if (allCompleted) {
      onComplete();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Training Required
          </DialogTitle>
          <DialogDescription>
            You must complete the following training modules before starting this task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {training.map((item) => {
            const completed = completedTraining.has(item.id);
            return (
              <div 
                key={item.id} 
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {item.required_for_task_type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(item.duration)}</span>
                      </div>
                    </div>
                  </div>
                  {completed && (
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant={completed ? "outline" : "default"}
                  onClick={() => handleWatchVideo(item)}
                  className="w-full"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {completed ? 'Watch Again' : 'Watch Video'}
                </Button>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={!allCompleted}
          >
            {allCompleted ? 'Start Task' : `Complete ${training.length - completedTraining.size} More`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingRequiredModal;
