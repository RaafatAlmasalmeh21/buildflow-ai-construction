
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WorkerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  current_project: string;
  status: 'On Site' | 'Break' | 'Off Duty';
  check_in_time: string;
  hours_today: number;
  weekly_hours: number;
  skills: string[];
}

export const useWorkforce = () => {
  return useQuery({
    queryKey: ['workforce'],
    queryFn: async () => {
      // Fetch users with their roles
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          user_roles!inner(role)
        `)
        .eq('is_active', true);

      if (usersError) throw usersError;

      // Fetch today's timesheets
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTimesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select(`
          user_id,
          check_in,
          check_out,
          total_hours,
          sites(name, projects(name))
        `)
        .gte('check_in', `${today}T00:00:00`)
        .lt('check_in', `${today}T23:59:59`);

      if (timesheetsError) throw timesheetsError;

      // Fetch this week's timesheets for weekly totals
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];

      const { data: weeklyTimesheets, error: weeklyError } = await supabase
        .from('timesheets')
        .select('user_id, total_hours')
        .gte('check_in', `${weekStartStr}T00:00:00`)
        .not('total_hours', 'is', null);

      if (weeklyError) throw weeklyError;

      // Process the data
      const workforce: WorkerData[] = users.map(user => {
        const todayTimesheet = todayTimesheets?.find(t => t.user_id === user.id);
        const userWeeklyHours = weeklyTimesheets
          ?.filter(t => t.user_id === user.id)
          .reduce((sum, t) => sum + (t.total_hours || 0), 0) || 0;

        // Determine status
        let status: 'On Site' | 'Break' | 'Off Duty' = 'Off Duty';
        let checkInTime = '-';
        let hoursToday = 0;

        if (todayTimesheet) {
          checkInTime = new Date(todayTimesheet.check_in).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          if (todayTimesheet.check_out) {
            status = 'Off Duty';
            hoursToday = todayTimesheet.total_hours || 0;
          } else {
            // Still checked in - determine if on break or on site
            const checkInDate = new Date(todayTimesheet.check_in);
            const now = new Date();
            const timeDiff = (now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
            
            status = timeDiff > 4 ? 'Break' : 'On Site';
            hoursToday = Math.round(timeDiff * 10) / 10;
          }
        }

        // Get skills based on role
        const roleSkillsMap: Record<string, string[]> = {
          'site_supervisor': ['Leadership', 'Safety', 'Concrete'],
          'worker': ['Construction', 'Safety', 'Tools'],
          'project_manager': ['Planning', 'Communication', 'Documentation'],
          'foreman': ['Leadership', 'Safety', 'Construction']
        };

        const role = user.user_roles[0]?.role || 'worker';
        const skills = roleSkillsMap[role] || ['General Construction'];

        return {
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email,
          phone: user.phone || '',
          role: role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          current_project: todayTimesheet?.sites?.projects?.name || 'Unassigned',
          status,
          check_in_time: checkInTime,
          hours_today: hoursToday,
          weekly_hours: userWeeklyHours,
          skills
        };
      });

      return workforce;
    },
  });
};
