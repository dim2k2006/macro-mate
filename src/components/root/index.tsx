import { useMemo } from 'react';
import { useGetLlmKey } from '@/components/llmKey-service-provider';
import { buildConfig, buildContainer } from '@/container';
import ConfigProvider from '@/components/config-provider';
import { FoodItemServiceProvider } from '@/components/foodItem-service-provider';
import { Route, Routes } from 'react-router-dom';
import Intro from '@/components/intro';
import Home from '@/components/home';

function Root() {
  const llmKeyFetchingState = useGetLlmKey();

  const key = llmKeyFetchingState.data?.key ?? '';

  const config = useMemo(() => buildConfig(key), [key]);

  const container = useMemo(() => buildContainer(config), [config]);

  return (
    <ConfigProvider config={config}>
      <FoodItemServiceProvider service={container.foodItemService}>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </FoodItemServiceProvider>
    </ConfigProvider>
  );
}

export default Root;
