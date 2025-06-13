
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MapPin, Building2, Users } from 'lucide-react';

const Sites = () => {
  const sites = [
    {
      id: 1,
      name: "Downtown Main Building",
      project: "Downtown Office Complex",
      address: "123 Main Street, Downtown",
      status: "Active",
      workers: 24,
      tasks: 45,
      progress: 75,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: "Residential Phase 2 - Block A",
      project: "Residential Phase 2",
      address: "456 Oak Avenue, Greenfield",
      status: "Active",
      workers: 18,
      tasks: 32,
      progress: 45,
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    {
      id: 3,
      name: "Warehouse Extension Site",
      project: "Warehouse Extension",
      address: "789 Industrial Blvd, Port District",
      status: "Active",
      workers: 12,
      tasks: 18,
      progress: 90,
      coordinates: { lat: 40.6892, lng: -74.0445 }
    },
    {
      id: 4,
      name: "School Main Campus",
      project: "School Renovation",
      address: "321 Education Way, Midtown",
      status: "Planning",
      workers: 0,
      tasks: 8,
      progress: 15,
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
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
            <h1 className="text-3xl font-bold">Sites</h1>
            <p className="text-muted-foreground">Manage construction sites and locations</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Site
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search sites..." className="pl-10" />
        </div>
        <Button variant="outline">Map View</Button>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription>{site.project}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(site.status)}>
                  {site.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Address */}
                <div className="text-sm text-muted-foreground">
                  {site.address}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{site.workers} workers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{site.tasks} tasks</span>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{site.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${site.progress}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Site Locations</CardTitle>
          <CardDescription>Interactive map showing all active construction sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive map coming soon</p>
              <p className="text-sm text-muted-foreground">Will show live site locations and worker check-ins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sites;
