
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Users, Shield, Bell, Building2 } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Basic company details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="BuildPro Construction" />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Contact Email</Label>
                    <Input id="company-email" type="email" defaultValue="contact@buildpro.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company-address">Address</Label>
                  <Input id="company-address" defaultValue="123 Construction Ave, Builder City, BC 12345" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div>
                    <Label htmlFor="company-website">Website</Label>
                    <Input id="company-website" defaultValue="https://buildpro.com" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Configure default settings and behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable daily automatic backups</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme interface</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Active Users</h3>
                  <Button>Add New User</Button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "John Smith", email: "john@buildpro.com", role: "Admin", status: "Active" },
                    { name: "Sarah Johnson", email: "sarah@buildpro.com", role: "Project Manager", status: "Active" },
                    { name: "Mike Wilson", email: "mike@buildpro.com", role: "Site Supervisor", status: "Active" }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">{user.role}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{user.status}</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure access levels for different user roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { role: "Admin", permissions: ["Full Access", "User Management", "System Settings", "Reports"] },
                  { role: "Project Manager", permissions: ["Projects", "Sites", "Tasks", "Reports"] },
                  { role: "Site Supervisor", permissions: ["Site Management", "Task Updates", "Safety Reports"] },
                  { role: "Worker", permissions: ["Time Tracking", "Task View", "Safety Reports"] }
                ].map((roleConfig, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{roleConfig.role}</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {roleConfig.permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <span className="text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email, SMS, and in-app notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                {[
                  "Project milestone updates",
                  "Safety incident reports",
                  "Equipment maintenance alerts",
                  "Timesheet approvals",
                  "Budget threshold warnings"
                ].map((notification) => (
                  <div key={notification} className="flex items-center justify-between">
                    <span className="text-sm">{notification}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">SMS Notifications</h4>
                {[
                  "Emergency safety alerts",
                  "Critical equipment failures",
                  "Weather warnings"
                ].map((notification) => (
                  <div key={notification} className="flex items-center justify-between">
                    <span className="text-sm">{notification}</span>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
              <CardDescription>Connect with external services and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Supabase", status: "Connected", description: "Database and authentication" },
                  { name: "Stripe Payments", status: "Not Connected", description: "Payment processing" },
                  { name: "Email Service", status: "Connected", description: "Email notifications" },
                  { name: "SMS Service", status: "Connected", description: "SMS notifications" },
                  { name: "Weather API", status: "Not Connected", description: "Weather data for safety" }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        integration.status === 'Connected' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status}
                      </span>
                      <Button variant="outline" size="sm">
                        {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
