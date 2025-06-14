
-- Create training videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-videos', 'training-videos', true);

-- Create RLS policies for training videos bucket
CREATE POLICY "Anyone can view training videos" ON storage.objects
FOR SELECT USING (bucket_id = 'training-videos');

CREATE POLICY "Admins can upload training videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'training-videos' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'project_manager')
  )
);

CREATE POLICY "Admins can update training videos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'training-videos' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'project_manager')
  )
);

CREATE POLICY "Admins can delete training videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'training-videos' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'project_manager')
  )
);
