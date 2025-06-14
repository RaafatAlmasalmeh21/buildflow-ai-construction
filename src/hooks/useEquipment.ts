
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EquipmentData {
  id: string;
  asset_tag: string;
  name: string;
  description: string;
  category: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  location: string;
  purchase_date: string;
  purchase_cost: number;
  current_value: number;
  next_service_date: string;
  last_service_date: string;
  operator?: string;
  hours_used?: number;
  service_interval?: number;
}

export const useEquipment = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      // Fetch equipment data
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select(`
          id,
          asset_tag,
          name,
          description,
          category,
          status,
          location,
          purchase_date,
          purchase_cost,
          current_value,
          next_service_date,
          last_service_date
        `)
        .is('deleted_at', null);

      if (equipmentError) throw equipmentError;

      // Fetch equipment operators
      const { data: operators, error: operatorsError } = await supabase
        .from('equipment_operators')
        .select(`
          equipment_id,
          users!inner(first_name, last_name)
        `)
        .eq('is_active', true);

      if (operatorsError) throw operatorsError;

      // Process the data
      const equipmentData: EquipmentData[] = equipment.map(item => {
        const operator = operators?.find(op => op.equipment_id === item.id);
        const operatorName = operator?.users 
          ? `${operator.users.first_name} ${operator.users.last_name}` 
          : undefined;

        // Calculate mock hours based on equipment age for demonstration
        const purchaseDate = new Date(item.purchase_date);
        const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
        const mockHoursUsed = Math.floor(daysSincePurchase * 2.5); // Rough estimate

        // Set service intervals based on category
        let serviceInterval = 250; // default
        if (item.category === 'Heavy Machinery') serviceInterval = 250;
        else if (item.category === 'Lifting Equipment') serviceInterval = 500;
        else if (item.category === 'Concrete Equipment') serviceInterval = 200;
        else if (item.category === 'Material Handling') serviceInterval = 300;

        return {
          id: item.id,
          asset_tag: item.asset_tag,
          name: item.name,
          description: item.description || '',
          category: item.category || 'General',
          status: item.status as EquipmentData['status'],
          location: item.location || 'Unknown',
          purchase_date: item.purchase_date,
          purchase_cost: item.purchase_cost || 0,
          current_value: item.current_value || 0,
          next_service_date: item.next_service_date,
          last_service_date: item.last_service_date,
          operator: operatorName,
          hours_used: mockHoursUsed,
          service_interval: serviceInterval
        };
      });

      return equipmentData;
    },
  });
};
