
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppSidebar } from '@/components/AppSidebar';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Sites from '@/pages/Sites';
import SiteDetail from '@/pages/SiteDetail';
import Tasks from '@/pages/Tasks';
import MyTasks from '@/pages/MyTasks';
import Timesheet from '@/pages/Timesheet';
import Workforce from '@/pages/Workforce';
import Equipment from '@/pages/Equipment';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import TodaysTasks from '@/pages/TodaysTasks';
import NewIncident from '@/pages/NewIncident';
import MyIncidents from '@/pages/MyIncidents';
import Training from '@/pages/Training';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes with sidebar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Dashboard />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Projects />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <ProjectDetail />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Sites />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites/:id"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <SiteDetail />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Tasks />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/my"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <MyTasks />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/today"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <TodaysTasks />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/timesheet"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Timesheet />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workforce"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Workforce />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Equipment />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Reports />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Settings />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/training"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <Training />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/new"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <NewIncident />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/mine"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1">
                      <MyIncidents />
                    </main>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
