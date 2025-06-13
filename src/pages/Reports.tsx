
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, FileText, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    {
      id: 1,
      name: "Project Progress Report",
      description: "Detailed analysis of project completion status and timelines",
      icon: BarChart3,
      category: "Project Management",
      lastGenerated: "2024-12-10"
    },
    {
      id: 2,
      name: "Financial Summary",
      description: "Budget vs actual costs, expense breakdown, and profit margins",
      icon: DollarSign,
      category: "Finance",
      lastGenerated: "2024-12-09"
    },
    {
      id: 3,
      name: "Workforce Utilization",
      description: "Labor hours, productivity metrics, and resource allocation",
      icon: TrendingUp,
      category: "Workforce",
      lastGenerated: "2024-12-08"
    },
    {
      id: 4,
      name: "Safety & Compliance",
      description: "Incident reports, safety scores, and compliance documentation",
      icon: FileText,
      category: "Safety",
      lastGenerated: "2024-12-07"
    }
  ];

  const recentReports = [
    {
      name: "Weekly Project Status - December Week 2",
      type: "Project Progress",
      generatedBy: "John Smith",
      date: "2024-12-10",
      format: "PDF"
    },
    {
      name: "Monthly Financial Summary - November",
      type: "Financial",
      generatedBy: "Sarah Johnson",
      date: "2024-12-01",
      format: "Excel"
    },
    {
      name: "Q4 Safety Report",
      type: "Safety",
      generatedBy: "Mike Wilson",
      date: "2024-11-30",
      format: "PDF"
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate insights and analytics</p>
          </div>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Connected systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">Processing time</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Builder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Report Generator</CardTitle>
          <CardDescription>Create custom reports with filters and date ranges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project Progress</SelectItem>
                <SelectItem value="financial">Financial Summary</SelectItem>
                <SelectItem value="workforce">Workforce Report</SelectItem>
                <SelectItem value="safety">Safety Report</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="downtown">Downtown Office Complex</SelectItem>
                <SelectItem value="residential">Residential Phase 2</SelectItem>
                <SelectItem value="warehouse">Warehouse Extension</SelectItem>
              </SelectContent>
            </Select>

            <Button>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Pre-configured report types for common use cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <report.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Generate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • Generated by {report.generatedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.date).toLocaleDateString()} • {report.format}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
