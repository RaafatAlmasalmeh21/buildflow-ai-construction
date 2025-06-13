
-- Insert demo project with proper UUID
INSERT INTO projects (id, name, start_date, budget)
VALUES ('01234567-89ab-cdef-0123-456789abcdef', 'Warehouse Expansion', now(), 250000);

-- Insert demo site with name
INSERT INTO sites (project_id, name, latitude, longitude, address)
VALUES ('01234567-89ab-cdef-0123-456789abcdef', 'Riyadh Industrial Site', 24.7136, 46.6753, 'Riyadh Industrial Area');

-- Insert demo task
INSERT INTO tasks (site_id, name, status, planned_hours)
SELECT id, 'Demo Task - Warehouse Foundation', 'not_started', 16 
FROM sites WHERE project_id = '01234567-89ab-cdef-0123-456789abcdef';
