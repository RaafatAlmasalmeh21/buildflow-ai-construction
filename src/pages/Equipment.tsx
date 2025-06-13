
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Wrench, Calendar, AlertTriangle, Settings } from 'lucide-react';

const Equipment = () => {
  const equipment = [
    {
      id: 1,
      name: "Excavator CAT 320",
      assetTag: "EQ-001",
      type: "Heavy Machinery",
      status: "Active",
      location: "Downtown Site",
      operator: "Mike Wilson",
      nextService: "2024-12-20",
      hoursUsed: 1240,
      serviceInterval: 250,
      lastMaintenance: "2024-11-15"
    },
    {
      id: 2,
      name: "Tower Crane TC-7035",
      assetTag: "EQ-002",
      type: "Lifting Equipment",
      status: "Active",
      location: "Downtown Site",
      operator: "Sarah Johnson",
      nextService: "2024-12-25",
      hoursUsed: 890,
      serviceInterval: 500,
      lastMaintenance: "2024-10-20"
    },
    {
      id: 3,
      name: "Concrete Mixer M150",
      assetTag: "EQ-003",
      type: "Concrete Equipment",
      status: "Maintenance",
      location: "Workshop",
      operator: "-",
      nextService: "2024-12-14",
      hoursUsed: 2100,
      serviceInterval: 200,
      lastMaintenance: "2024-12-10"
    },
    {
      id: 4,
      name: "Forklift FL-3000",
      assetTag: "EQ-004",
      type: "Material Handling",
      status: "Available",
      location: "Warehouse Site",
      operator: "-",
      nextService: "2024-12-30",
      hoursUsed: 450,
      serviceInterval: 300,
      lastMaintenance: "2024-11-30"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Available': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatus = (equipment: any) => {
    const hoursSinceService = equipment.hoursUsed % equipment.serviceInterval;
    const percentage = (hoursSinceService / equipment.serviceInterval) * 100;
    
    if (percentage > 90) return { color: 'text-red-600', status: 'Overdue' };
    if (percentage > 75) return { color: 'text-yellow-600', status: 'Due Soon' };
    return { color: 'text-green-600', status: 'Good' };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Equipment</h1>
            <p className="text-muted-foreground">Track machinery, tools, and maintenance schedules</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Wrench className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
            <p className="text-xs text-muted-foreground">Registered units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Settings className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment.filter(e => e.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment.filter(e => e.status === 'Maintenance').length}
            </div>
            <p className="text-xs text-muted-foreground">Being serviced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Service Due</CardTitle>
            <Calendar className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment.filter(e => getMaintenanceStatus(e).status === 'Due Soon' || getMaintenanceStatus(e).status === 'Overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search equipment..." className="pl-10" />
        </div>
        <Button variant="outline">QR Scanner</Button>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipment.map((item) => {
          const maintenanceStatus = getMaintenanceStatus(item);
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.assetTag} • {item.type}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Location and Operator */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{item.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Operator</p>
                      <p className="text-muted-foreground">{item.operator || 'Unassigned'}</p>
                    </div>
                  </div>

                  {/* Usage Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Usage Hours</span>
                      <span className="text-sm text-muted-foreground">{item.hoursUsed}h</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${((item.hoursUsed % item.serviceInterval) / item.serviceInterval) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Maintenance Status */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Next Service</p>
                      <p className="text-muted-foreground">{new Date(item.nextService).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Maintenance</p>
                      <p className={maintenanceStatus.color}>{maintenanceStatus.status}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Schedule Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Equipment;
