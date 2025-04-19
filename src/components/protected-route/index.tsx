import { Navigate, Outlet } from 'react-router-dom';
import { useHasLlmKey } from '@/components/llmKey-service-provider';

function ProtectedRoute() {
  const llmKeyState = useHasLlmKey();

  if (llmKeyState.isLoading) {
    return null;
  }

  const hasLlmKey = (llmKeyState.isSuccess || llmKeyState.isError) && !!llmKeyState.data;

  return hasLlmKey ? <Outlet /> : <Navigate to="/intro" replace />;
}

export default ProtectedRoute;
