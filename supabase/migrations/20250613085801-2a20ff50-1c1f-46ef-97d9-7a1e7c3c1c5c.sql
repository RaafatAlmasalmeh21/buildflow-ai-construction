
-- Enable necessary extensions
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA extensions;

-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'project_manager', 'site_supervisor', 'foreman', 'worker', 'client');
CREATE TYPE public.task_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled');
CREATE TYPE public.equipment_status AS ENUM ('available', 'in_use', 'maintenance', 'out_of_service');
CREATE TYPE public.incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.txn_type AS ENUM ('check_out', 'check_in', 'transfer', 'maintenance');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    company_id UUID,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    contact_person TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    client_id UUID REFERENCES public.clients(id),
    company_id UUID REFERENCES public.companies(id),
    project_manager_id UUID REFERENCES public.users(id),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'planning',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Sites table
CREATE TABLE public.sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    description TEXT,
    site_supervisor_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES public.tasks(id),
    name TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'not_started',
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    planned_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2) DEFAULT 0,
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    assignee_id UUID REFERENCES public.users(id),
    created_by UUID REFERENCES public.users(id),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Equipment table
CREATE TABLE public.equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id),
    asset_tag TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status equipment_status DEFAULT 'available',
    purchase_date DATE,
    purchase_cost DECIMAL(12,2),
    current_value DECIMAL(12,2),
    next_service_date DATE,
    last_service_date DATE,
    location TEXT,
    assigned_site_id UUID REFERENCES public.sites(id),
    qr_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Inventory transactions table
CREATE TABLE public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES public.equipment(id),
    task_id UUID REFERENCES public.tasks(id),
    user_id UUID REFERENCES public.users(id),
    quantity INTEGER DEFAULT 1,
    txn_type txn_type NOT NULL,
    notes TEXT,
    location_from TEXT,
    location_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timesheets table
CREATE TABLE public.timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    task_id UUID REFERENCES public.tasks(id),
    site_id UUID REFERENCES public.sites(id),
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ,
    break_duration INTEGER DEFAULT 0, -- minutes
    total_hours DECIMAL(8,2),
    geo_hash TEXT,
    check_in_location POINT,
    check_out_location POINT,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents table
CREATE TABLE public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id),
    task_id UUID REFERENCES public.tasks(id),
    reported_by UUID REFERENCES public.users(id) NOT NULL,
    incident_date TIMESTAMPTZ NOT NULL,
    severity incident_severity NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    immediate_action TEXT,
    corrective_action TEXT,
    attachment_url TEXT,
    investigation_complete BOOLEAN DEFAULT false,
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety documents table
CREATE TABLE public.safety_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.sites(id),
    task_id UUID REFERENCES public.tasks(id),
    document_type TEXT NOT NULL, -- 'swms', 'jsa', 'toolbox_talk', 'induction'
    title TEXT NOT NULL,
    content JSONB,
    created_by UUID REFERENCES public.users(id),
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMPTZ,
    valid_until DATE,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document signatures table
CREATE TABLE public.document_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.safety_documents(id),
    user_id UUID REFERENCES public.users(id),
    signature_data TEXT, -- base64 encoded signature
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    UNIQUE(document_id, user_id)
);

-- Audit log table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for company_id to users table
ALTER TABLE public.users ADD CONSTRAINT fk_users_company 
    FOREIGN KEY (company_id) REFERENCES public.companies(id);

-- Create indexes for performance
CREATE INDEX idx_users_company_id ON public.users(company_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_projects_company_id ON public.projects(company_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_sites_project_id ON public.sites(project_id);
CREATE INDEX idx_tasks_site_id ON public.tasks(site_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_timesheets_user_id ON public.timesheets(user_id);
CREATE INDEX idx_timesheets_task_id ON public.timesheets(task_id);
CREATE INDEX idx_equipment_company_id ON public.equipment(company_id);
CREATE INDEX idx_incidents_site_id ON public.incidents(site_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON public.timesheets 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_safety_documents_updated_at BEFORE UPDATE ON public.safety_documents 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role FROM public.user_roles 
    WHERE user_id = user_uuid 
    ORDER BY 
        CASE role
            WHEN 'admin' THEN 1
            WHEN 'project_manager' THEN 2
            WHEN 'site_supervisor' THEN 3
            WHEN 'foreman' THEN 4
            WHEN 'worker' THEN 5
            WHEN 'client' THEN 6
        END
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_uuid AND role = check_role
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_company_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT company_id FROM public.users WHERE id = user_uuid;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    
    -- Assign default worker role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'worker');
    
    RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for companies table
CREATE POLICY "Users can view their company" ON public.companies
    FOR SELECT USING (id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage companies" ON public.companies
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for projects table
CREATE POLICY "Users can view projects in their company" ON public.projects
    FOR SELECT USING (
        company_id = public.get_user_company_id(auth.uid()) OR 
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Project managers and admins can manage projects" ON public.projects
    FOR ALL USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager')
    );

-- RLS Policies for sites table
CREATE POLICY "Users can view sites in projects they have access to" ON public.sites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
        )
    );

CREATE POLICY "Site supervisors and above can manage sites" ON public.sites
    FOR ALL USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor')
    );

-- RLS Policies for tasks table
CREATE POLICY "Users can view tasks in sites they have access to" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites s 
            JOIN public.projects p ON s.project_id = p.id
            WHERE s.id = site_id 
            AND (p.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
        ) OR assignee_id = auth.uid()
    );

CREATE POLICY "Foremen and above can manage tasks" ON public.tasks
    FOR ALL USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor') OR 
        public.has_role(auth.uid(), 'foreman')
    );

-- RLS Policies for timesheets table
CREATE POLICY "Users can view their own timesheets" ON public.timesheets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Supervisors can view team timesheets" ON public.timesheets
    FOR SELECT USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor')
    );

CREATE POLICY "Users can create their own timesheets" ON public.timesheets
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own timesheets" ON public.timesheets
    FOR UPDATE USING (user_id = auth.uid() AND approved_at IS NULL);

CREATE POLICY "Supervisors can approve timesheets" ON public.timesheets
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor')
    );

-- RLS Policies for equipment table
CREATE POLICY "Users can view company equipment" ON public.equipment
    FOR SELECT USING (
        company_id = public.get_user_company_id(auth.uid()) OR 
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Supervisors and above can manage equipment" ON public.equipment
    FOR ALL USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor')
    );

-- RLS Policies for incidents table
CREATE POLICY "Users can view incidents in accessible sites" ON public.incidents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sites s 
            JOIN public.projects p ON s.project_id = p.id
            WHERE s.id = site_id 
            AND (p.company_id = public.get_user_company_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
        )
    );

CREATE POLICY "All authenticated users can report incidents" ON public.incidents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Supervisors and above can manage incidents" ON public.incidents
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'project_manager') OR 
        public.has_role(auth.uid(), 'site_supervisor')
    );

-- Insert sample company and admin user data
INSERT INTO public.companies (id, name, address, phone, email) VALUES 
(gen_random_uuid(), 'BuildPro Construction', '123 Construction Ave, Builder City, BC 12345', '+1 (555) 123-4567', 'contact@buildpro.com');
