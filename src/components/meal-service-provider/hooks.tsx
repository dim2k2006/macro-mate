import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMealService } from './meal-service-provider.tsx';
import { Meal, CreateMealInput, EnhancedMeal } from '@/domain/meal';

export function useCreateMeal() {
  const service = useMealService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createMeal'],
    mutationFn: (input: CreateMealInput) => service.createMeal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listMeals'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMealsByDate'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMacrosByDate'],
      });
    },
    onError: (error: Error) => {
      console.error('Error creating meal:', error);
    },
  });
}

export function useGetMealsByDate(date: string) {
  const service = useMealService();

  return useQuery({
    queryKey: ['getMealsByDate', date],
    queryFn: () => service.getMealsByDate(date),
  });
}

export function useListMeals() {
  const service = useMealService();

  return useQuery({
    queryKey: ['listMeals'],
    queryFn: () => service.listMeals(),
  });
}

export function useUpsertMeal(mealId: string) {
  const service = useMealService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['upsertMeal', mealId],
    mutationFn: (meal: Meal) => service.upsertMeal(mealId, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listMeals'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMealsByDate'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMacrosByDate'],
      });
    },
    onError: (error: Error) => {
      console.error('Error upserting meal:', error);
    },
  });
}

export function useUpdateMeal(mealId: string) {
  const service = useMealService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateMeal', mealId],
    mutationFn: (meal: Partial<Meal>) => service.updateMeal(mealId, meal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listMeals'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMealsByDate'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMacrosByDate'],
      });
    },
    onError: (error: Error) => {
      console.error('Error updating meal:', error);
    },
  });
}

export function useDeleteMeal(mealId: string) {
  const service = useMealService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteMeal', mealId],
    mutationFn: () => service.deleteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['listMeals'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMealsByDate'],
      });

      queryClient.invalidateQueries({
        queryKey: ['getMacrosByDate'],
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting meal:', error);
    },
  });
}

export function useGetMacrosByDate(date: string) {
  const service = useMealService();

  return useQuery({
    queryKey: ['getMacrosByDate', date],
    queryFn: () => service.getMacrosByDate(date),
  });
}

export function useCountTotalMacrosByMeals(meals: EnhancedMeal[]) {
  const service = useMealService();

  return service.countTotalMacrosByMeals(meals);
}
