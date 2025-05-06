import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettingsService } from './settings-service-provider.tsx';
import { Settings } from '@/domain/settings';

export function useGetSettings() {
  const settingsService = useSettingsService();

  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useUpdateSettings() {
  const settingsService = useSettingsService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Settings) => settingsService.updateSettings(settings),
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);

      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
    },
  });
}
