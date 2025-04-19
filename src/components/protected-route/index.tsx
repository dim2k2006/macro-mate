import { Navigate, Outlet } from 'react-router-dom';
import { useGetLlmKey } from '@/components/llmKey-service-provider';

function ProtectedRoute() {
  const llmKeyState = useGetLlmKey();

  if (llmKeyState.isLoading) {
    return null;
  }

  const hasLlmKey = (llmKeyState.isSuccess || llmKeyState.isError) && !!llmKeyState.data?.key;

  console.log('llmKeyState.data:', llmKeyState.data);
  console.log('hasLlmKey:', hasLlmKey);

  return hasLlmKey ? <Outlet /> : <Navigate to="/intro" replace />;
}

export default ProtectedRoute;
