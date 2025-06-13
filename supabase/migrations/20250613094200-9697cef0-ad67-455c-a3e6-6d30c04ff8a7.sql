
-- Create training table
CREATE TABLE training (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- duration in minutes
  required_for_task_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_training_completed table
CREATE TABLE user_training_completed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES training(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, training_id)
);

-- Enable RLS
ALTER TABLE training ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_training_completed ENABLE ROW LEVEL SECURITY;

-- Policies for training table
CREATE POLICY "Everyone can view training" ON training
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage training" ON training
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'project_manager')
  ));

-- Policies for user_training_completed table  
CREATE POLICY "Users can view their own training completion" ON user_training_completed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark training as completed" ON user_training_completed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all training completion" ON user_training_completed
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'project_manager')
  ));

-- Insert some sample training data
INSERT INTO training (title, url, duration, required_for_task_type, description) VALUES
('Safety Basics', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 'construction', 'Basic safety procedures for construction sites'),
('Equipment Operation', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 'equipment', 'How to safely operate heavy equipment'),
('First Aid Training', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 'all', 'Basic first aid and emergency procedures'),
('Electrical Safety', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 'electrical', 'Electrical safety protocols and procedures');
