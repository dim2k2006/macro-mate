import { Navigate, Outlet } from 'react-router-dom';
import { useGetSettings } from '@/components/settings-service-provider';

function ProtectedRoute() {
  const settingsState = useGetSettings();

  if (settingsState.isLoading) {
    return null;
  }

  const hasLlmKey = (settingsState.isSuccess || settingsState.isError) && !!settingsState.data?.llmKey;

  return hasLlmKey ? <Outlet /> : <Navigate to="/intro" replace />;
}

export default ProtectedRoute;
