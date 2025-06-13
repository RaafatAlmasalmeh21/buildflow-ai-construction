
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HardHat, Building2, Users, Wrench, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">BuildPro</h1>
          </div>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 construction-gradient bg-clip-text text-transparent">
            Complete Construction Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage projects, workforce, equipment, and safety documentation in one powerful platform. 
            Built for construction companies who demand efficiency and compliance.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/login">Get Started</a>
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="construction-card p-6">
            <Building2 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-muted-foreground">
              Full project lifecycle management with Gantt charts, budget tracking, and progress monitoring.
            </p>
          </div>
          
          <div className="construction-card p-6">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Workforce Management</h3>
            <p className="text-muted-foreground">
              Schedule crews, track time & attendance, manage skills and certifications.
            </p>
          </div>
          
          <div className="construction-card p-6">
            <Wrench className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Equipment Tracking</h3>
            <p className="text-muted-foreground">
              Monitor equipment usage, maintenance schedules, and inventory levels with QR codes.
            </p>
          </div>
          
          <div className="construction-card p-6">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safety & Compliance</h3>
            <p className="text-muted-foreground">
              Digital safety forms, incident reporting, and compliance documentation.
            </p>
          </div>
          
          <div className="construction-card p-6">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-muted-foreground">
              Real-time dashboards, AI-powered forecasting, and comprehensive reporting.
            </p>
          </div>
          
          <div className="construction-card p-6">
            <HardHat className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mobile-First</h3>
            <p className="text-muted-foreground">
              Offline-capable mobile app for field workers with sync capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HardHat className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">BuildPro</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 BuildPro Construction Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
