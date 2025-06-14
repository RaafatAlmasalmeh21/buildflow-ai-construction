
-- Update the existing user role from worker to admin for the admin email
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = '81e1c470-5e89-4719-b175-22e16b897be8' 
AND role = 'worker';
