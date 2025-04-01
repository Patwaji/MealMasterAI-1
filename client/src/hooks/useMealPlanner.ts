import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { MealPlan, MealPlanRequest } from '@shared/schema';

export const useMealPlanner = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const generateMealPlanMutation = useMutation({
    mutationFn: async (request: MealPlanRequest) => {
      const response = await apiRequest('POST', '/api/meal-plan', request);
      return await response.json() as MealPlan;
    },
    onSuccess: (data) => {
      setMealPlan(data);
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  });

  const generateMealPlan = (request: MealPlanRequest) => {
    setIsLoading(true);
    generateMealPlanMutation.mutate(request);
  };

  return {
    generateMealPlan,
    isLoading,
    mealPlan
  };
};
