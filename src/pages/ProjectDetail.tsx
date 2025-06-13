
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock project data
  const project = {
    id: 1,
    name: "Downtown Office Complex",
    client: "Metro Development Corp",
    status: "In Progress",
    budget: "$2,500,000",
    spent: "$1,875,000",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    progress: 75,
    description: "A modern 15-story office complex in the heart of downtown, featuring sustainable design and state-of-the-art facilities.",
    sites: [
      { id: 1, name: "Main Building", address: "123 Main St", status: "Active" },
      { id: 2, name: "Parking Garage", address: "125 Main St", status: "Active" },
      { id: 3, name: "Landscape Area", address: "127 Main St", status: "Planned" }
    ],
    team: [
      { name: "John Smith", role: "Project Manager", contact: "john@buildpro.com" },
      { name: "Sarah Johnson", role: "Site Supervisor", contact: "sarah@buildpro.com" },
      { name: "Mike Wilson", role: "Safety Officer", contact: "mike@buildpro.com" }
    ]
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.client}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">{project.status}</Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.budget}</div>
            <p className="text-xs text-muted-foreground">Spent: {project.spent}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Building2 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">11 months</div>
            <p className="text-xs text-muted-foreground">
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sites</CardTitle>
            <MapPin className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.sites.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>Key personnel assigned to this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.team.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Contact</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sites">
          <Card>
            <CardHeader>
              <CardTitle>Project Sites</CardTitle>
              <CardDescription>All locations associated with this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.sites.map((site) => (
                  <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{site.name}</h4>
                        <p className="text-sm text-muted-foreground">{site.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={site.status === 'Active' ? 'default' : 'secondary'}>
                        {site.status}
                      </Badge>
                      <Button variant="outline" size="sm">View Site</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Project Schedule</CardTitle>
              <CardDescription>Timeline and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Gantt chart and schedule view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Plans, permits, and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document management system coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Budget tracking and cost analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Financial dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
