
import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Clock, Play, Square, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Timesheet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Query for active timesheet
  const { data: activeTimesheet, isLoading: isLoadingActive } = useQuery({
    queryKey: ['active-timesheet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .eq('user_id', user.id)
        .is('check_out', null)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });

  // Query for timesheet history (last 7 days)
  const { data: timesheetHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['timesheet-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('timesheets')
        .select(`
          id,
          check_in,
          check_out,
          total_hours,
          sites(name),
          tasks(name)
        `)
        .eq('user_id', user.id)
        .gte('check_in', sevenDaysAgo.toISOString())
        .order('check_in', { ascending: false });

      if (error) {
        console.error('Error fetching timesheet history:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id
  });

  // Start shift mutation
  const startShiftMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const timesheetData: any = {
        user_id: user.id,
        check_in: new Date().toISOString(),
      };

      // Add geo_hash if location is available
      if (location) {
        timesheetData.geo_hash = `${location.lat},${location.lng}`;
        timesheetData.check_in_location = `POINT(${location.lng} ${location.lat})`;
      }

      const { data, error } = await supabase
        .from('timesheets')
        .insert(timesheetData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Shift Started",
        description: "Your work shift has been started successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['active-timesheet'] });
      queryClient.invalidateQueries({ queryKey: ['timesheet-history'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start shift. Please try again.",
        variant: "destructive",
      });
      console.error('Error starting shift:', error);
    }
  });

  // End shift mutation
  const endShiftMutation = useMutation({
    mutationFn: async () => {
      if (!activeTimesheet) throw new Error('No active timesheet');

      const checkOut = new Date();
      const checkIn = new Date(activeTimesheet.check_in);
      const totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      const updateData: any = {
        check_out: checkOut.toISOString(),
        total_hours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
      };

      // Add checkout location if available
      if (location) {
        updateData.check_out_location = `POINT(${location.lng} ${location.lat})`;
      }

      const { error } = await supabase
        .from('timesheets')
        .update(updateData)
        .eq('id', activeTimesheet.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Shift Ended",
        description: "Your work shift has been ended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['active-timesheet'] });
      queryClient.invalidateQueries({ queryKey: ['timesheet-history'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to end shift. Please try again.",
        variant: "destructive",
      });
      console.error('Error ending shift:', error);
    }
  });

  const formatDuration = (checkIn: string, checkOut?: string) => {
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${Math.floor(hours)}h ${Math.floor((hours % 1) * 60)}m`;
  };

  if (isLoadingActive) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Timesheet</h1>
            <p className="text-muted-foreground">Loading...</p>
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
          <h1 className="text-3xl font-bold">Timesheet</h1>
          <p className="text-muted-foreground">Track your work hours</p>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Shift
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTimesheet ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Started at {format(new Date(activeTimesheet.check_in), 'h:mm a')} • 
                Duration: {formatDuration(activeTimesheet.check_in)}
              </div>
              <Button
                onClick={() => endShiftMutation.mutate()}
                disabled={endShiftMutation.isPending}
                variant="destructive"
                size="lg"
                className="w-full"
              >
                <Square className="h-5 w-5 mr-2" />
                {endShiftMutation.isPending ? 'Ending Shift...' : 'End Shift'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {location ? 'Ready to start your shift' : 'Getting location...'}
              </p>
              <Button
                onClick={() => startShiftMutation.mutate()}
                disabled={startShiftMutation.isPending || !location}
                size="lg"
                className="w-full"
              >
                <Play className="h-5 w-5 mr-2" />
                {startShiftMutation.isPending ? 'Starting Shift...' : 'Start Shift'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading history...
            </div>
          ) : timesheetHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No timesheet entries in the last 7 days</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Site/Task</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheetHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.check_in), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.check_in), 'h:mm a')}
                    </TableCell>
                    <TableCell>
                      {entry.check_out ? (
                        format(new Date(entry.check_out), 'h:mm a')
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.total_hours ? 
                        `${entry.total_hours}h` : 
                        formatDuration(entry.check_in, entry.check_out || undefined)
                      }
                    </TableCell>
                    <TableCell>
                      {entry.sites?.name || entry.tasks?.name || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Timesheet;
