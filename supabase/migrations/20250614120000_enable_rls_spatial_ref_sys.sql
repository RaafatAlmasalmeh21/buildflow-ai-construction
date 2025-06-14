
-- Enable RLS on spatial_ref_sys table to fix security linting error
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to all users since this is a reference table
CREATE POLICY "Allow read access to spatial_ref_sys" ON public.spatial_ref_sys
FOR SELECT USING (true);
