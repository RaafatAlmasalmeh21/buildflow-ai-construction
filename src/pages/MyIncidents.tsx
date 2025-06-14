
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Calendar, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
}

const fetchMyIncidents = async (userId: string) => {
  const { data, error } = await supabase
    .from('incidents')
    .select('id, title, severity, description, attachment_url, created_at, updated_at')
    .eq('reported_by', userId)
    .order('created_at', { ascending: false })
    .returns<Incident[]>();

  if (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }

  return data || [];
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const MyIncidents = () => {
  const { user } = useAuth();

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['my-incidents', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return fetchMyIncidents(user.id);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">My Incident Reports</h1>
            <p className="text-muted-foreground">Loading your incident reports...</p>
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
            <h1 className="text-3xl font-bold">My Incident Reports</h1>
            <p className="text-muted-foreground">View and track your reported incidents</p>
          </div>
        </div>
        <Button asChild>
          <Link to="/incidents/new">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {incidents.filter(i => i.severity === 'high').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {incidents.filter(i => 
                new Date(i.created_at).getMonth() === new Date().getMonth()
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Incident Reports ({incidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No incident reports found</p>
              <p className="text-sm">Your reported incidents will appear here</p>
              <Button asChild className="mt-4">
                <Link to="/incidents/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Report an Incident
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{incident.title}</h3>
                    <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {incident.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Reported {new Date(incident.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {incident.attachment_url && (
                      <span className="text-blue-600">Has media attachment</span>
                    )}
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

export default MyIncidents;
