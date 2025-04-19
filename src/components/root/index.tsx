import React, { useMemo } from 'react';
import { useGetLlmKey } from '@/components/llmKey-service-provider';
import { buildConfig, buildContainer } from '@/container';
import ConfigProvider from '@/components/config-provider';
import { FoodItemServiceProvider } from '@/components/foodItem-service-provider';
import { Routes, Route } from 'react-router-dom';
import Intro from '@/components/intro';
import Home from '@/components/home';
import ProtectedRoute from '@/components/protected-route';
import Layout from '@/components/layout';

function Root() {
  const llmKeyFetchingState = useGetLlmKey();

  const key = llmKeyFetchingState.data?.key ?? '';

  const config = useMemo(() => buildConfig(key), [key]);

  const container = useMemo(() => buildContainer(config), [config]);

  return (
    <ConfigProvider config={config}>
      <FoodItemServiceProvider service={container.foodItemService}>
        <Layout>
          <Routes>
            <React.Fragment>
              <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route path="/intro" element={<Intro />} />
            </React.Fragment>
          </Routes>
        </Layout>
      </FoodItemServiceProvider>
    </ConfigProvider>
  );
}

export default Root;
