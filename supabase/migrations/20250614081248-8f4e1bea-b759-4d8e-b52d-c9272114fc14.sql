
-- Insert sample sites and projects first (if they don't exist)
INSERT INTO projects (id, name, description, status) VALUES 
(gen_random_uuid(), 'Downtown Office Complex', 'Large commercial office building project', 'active'),
(gen_random_uuid(), 'Residential Phase 2', 'Multi-unit residential development', 'active'),
(gen_random_uuid(), 'Warehouse Extension', 'Industrial warehouse expansion project', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample sites
WITH project_ids AS (
  SELECT id, name FROM projects WHERE name IN ('Downtown Office Complex', 'Residential Phase 2', 'Warehouse Extension')
)
INSERT INTO sites (id, project_id, name, address) VALUES 
(gen_random_uuid(), (SELECT id FROM project_ids WHERE name = 'Downtown Office Complex'), 'Main Building', '123 Downtown Ave'),
(gen_random_uuid(), (SELECT id FROM project_ids WHERE name = 'Residential Phase 2'), 'Block A', '456 Residential St'),
(gen_random_uuid(), (SELECT id FROM project_ids WHERE name = 'Warehouse Extension'), 'Main Site', '789 Industrial Blvd')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
WITH site_data AS (
  SELECT s.id as site_id, s.name as site_name, p.name as project_name
  FROM sites s
  JOIN projects p ON s.project_id = p.id
  WHERE s.name IN ('Main Building', 'Block A', 'Main Site')
)
INSERT INTO tasks (
  id, 
  site_id, 
  name, 
  description, 
  status, 
  priority, 
  planned_hours, 
  actual_hours, 
  planned_start_date, 
  planned_end_date, 
  progress_percentage
) VALUES 
-- Tasks for Main Building (Downtown Office Complex)
(
  gen_random_uuid(),
  (SELECT site_id FROM site_data WHERE site_name = 'Main Building'),
  'Foundation Pour - Section C',
  'Complete concrete foundation pour for section C of the building',
  'in_progress',
  5, -- High priority
  40,
  24,
  '2024-12-10',
  '2024-12-15',
  60
),
(
  gen_random_uuid(),
  (SELECT site_id FROM site_data WHERE site_name = 'Main Building'),
  'Steel Frame Installation',
  'Install steel framework for floors 1-3',
  'not_started',
  3, -- Medium priority
  80,
  0,
  '2024-12-16',
  '2024-12-20',
  0
),
-- Tasks for Block A (Residential Phase 2)
(
  gen_random_uuid(),
  (SELECT site_id FROM site_data WHERE site_name = 'Block A'),
  'Electrical Rough-in',
  'Install electrical wiring and outlets for units 1-10',
  'not_started',
  2, -- Low priority
  60,
  0,
  '2024-12-20',
  '2024-12-25',
  0
),
-- Tasks for Main Site (Warehouse Extension)
(
  gen_random_uuid(),
  (SELECT site_id FROM site_data WHERE site_name = 'Main Site'),
  'Plumbing Installation',
  'Install main plumbing lines and fixtures',
  'in_progress',
  4, -- High priority
  50,
  42,
  '2024-12-12',
  '2024-12-18',
  85
);
