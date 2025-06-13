
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, AlertCircle } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

interface UserWithRole {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  role: UserRole | null;
}

const fetchUsersWithRoles = async (): Promise<UserWithRole[]> => {
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, is_active');

  if (usersError) throw usersError;

  const usersWithRoles = await Promise.all(
    users.map(async (user) => {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      return {
        ...user,
        role: roleData?.role || null
      };
    })
  );

  return usersWithRoles;
};

const RoleManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: UserRole }>({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: fetchUsersWithRoles,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      // First, delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  const getRoleBadgeVariant = (role: UserRole | null) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'project_manager': return 'default';
      case 'site_supervisor': return 'secondary';
      case 'foreman': return 'outline';
      case 'worker': return 'outline';
      case 'client': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role: UserRole | null) => {
    if (!role) return 'No Role';
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Loading Users...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Role Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    {!user.is_active && (
                      <Badge variant="outline" className="text-orange-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedRole[user.id] || user.role || ''}
                    onValueChange={(value) => {
                      setSelectedRole({ ...selectedRole, [user.id]: value as UserRole });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="project_manager">Project Manager</SelectItem>
                      <SelectItem value="site_supervisor">Site Supervisor</SelectItem>
                      <SelectItem value="foreman">Foreman</SelectItem>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedRole[user.id] && selectedRole[user.id] !== user.role && (
                    <Button
                      size="sm"
                      onClick={() => handleRoleChange(user.id, selectedRole[user.id])}
                      disabled={updateRoleMutation.isPending}
                    >
                      Update
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
