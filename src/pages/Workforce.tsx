
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Clock, Calendar, HardHat, Loader2 } from 'lucide-react';
import AddWorkerDialog from '@/components/AddWorkerDialog';
import { useWorkforce } from '@/hooks/useWorkforce';
import { useState } from 'react';

const Workforce = () => {
  const { data: workers = [], isLoading, error } = useWorkforce();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter(worker =>
    `${worker.first_name} ${worker.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.current_project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Site': return 'bg-green-100 text-green-800';
      case 'Break': return 'bg-yellow-100 text-yellow-800';
      case 'Off Duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-destructive">Error loading workforce data: {error.message}</p>
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
            <h1 className="text-3xl font-bold">Workforce</h1>
            <p className="text-muted-foreground">Manage crew schedules and time tracking</p>
          </div>
        </div>
        <AddWorkerDialog />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On Site</CardTitle>
            <HardHat className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.filter(w => w.status === 'On Site').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Today</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.reduce((acc, w) => acc + w.hours_today, 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Hours logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workers.reduce((acc, w) => acc + w.weekly_hours, 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">This week total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search workers..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Schedule</Button>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Workers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      {worker.first_name} {worker.last_name}
                    </CardTitle>
                    <CardDescription>{worker.role}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(worker.status)}>
                  {worker.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Assignment */}
                <div>
                  <p className="text-sm font-medium">Current Project</p>
                  <p className="text-sm text-muted-foreground">{worker.current_project}</p>
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-muted-foreground">{worker.check_in_time}</p>
                  </div>
                  <div>
                    <p className="font-medium">Hours Today</p>
                    <p className="text-muted-foreground">{worker.hours_today}h</p>
                  </div>
                </div>

                {/* Weekly Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Hours</span>
                    <span className="text-sm text-muted-foreground">{worker.weekly_hours}/40h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((worker.weekly_hours / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkers.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No workers found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Workforce;
