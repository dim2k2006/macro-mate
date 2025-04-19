import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './components/app/app.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConfigProvider from './components/config-provider';
import { FoodItemServiceProvider } from './components/foodItem-service-provider';
// import { ParameterServiceProvider } from './components/parameter-service-provider';
// import TelegramProviderProvider from './components/telegram-provider-provider';
// import { UserIdProvider } from './components/user-id-provider';
import { buildConfig, buildContainer } from './container';

const queryClient = new QueryClient();

const config = buildConfig();
const container = buildContainer(config);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider config={config}>
        <FoodItemServiceProvider service={container.foodItemService}>here goes something</FoodItemServiceProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);

// function UserIdContainer({ children }: UserIdContainerProps) {
//   const userId = new URLSearchParams(window.location.search).get('userId');
//
//   return (
//     <>
//       {userId === null && (
//         <div className="w-full p-4">
//           <div className="border border-red-400 bg-red-100 text-red-700 px-4 py-3 rounded">
//             <strong className="font-bold">Error:</strong> <span>User ID is not provided.</span>
//           </div>
//         </div>
//       )}
//
//       {userId !== null && userId.length > 0 && <UserIdProvider userId={userId}>{children}</UserIdProvider>}
//     </>
//   );
// }
//
// type UserIdContainerProps = {
//   children: React.ReactNode;
// };
