import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { MealPlan, MealPlanRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Hook for interacting with saved meal plans
export const useSavedMealPlans = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all saved meal plans for a user
  const getUserMealPlans = (userId: number) => {
    return useQuery({
      queryKey: ['/api/meal-plans/user', userId],
      queryFn: getQueryFn({ on401: "returnNull" }),
    });
  };

  // Get a specific meal plan by ID
  const getMealPlan = (id: number) => {
    return useQuery({
      queryKey: ['/api/meal-plans', id],
      queryFn: getQueryFn({ on401: "returnNull" }),
      enabled: !!id,
    });
  };

  // Save a meal plan to the database
  const saveMealPlan = useMutation({
    mutationFn: async ({ 
      userId = 1, // Default user ID (temporary)
      planName, 
      planRequest, 
      planData 
    }: { 
      userId?: number;
      planName?: string;
      planRequest: MealPlanRequest;
      planData: MealPlan;
    }) => {
      return await apiRequest(
        'POST', 
        '/api/meal-plans/save', 
        {
          user_id: userId,
          plan_name: planName,
          plan_request: planRequest,
          plan_data: planData
        }
      );
    },
    onSuccess: () => {
      // Invalidate cached meal plans to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans/user'] });
      toast({
        title: "Success",
        description: "Meal plan saved successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to save meal plan: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Delete a meal plan
  const deleteMealPlan = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/meal-plans/${id}`);
    },
    onSuccess: () => {
      // Invalidate cached meal plans to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans/user'] });
      toast({
        title: "Success",
        description: "Meal plan deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete meal plan: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  return {
    getUserMealPlans,
    getMealPlan,
    saveMealPlan,
    deleteMealPlan
  };
};