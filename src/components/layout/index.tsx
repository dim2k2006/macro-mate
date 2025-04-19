import { AppShell, Group, Image, Tabs } from '@mantine/core';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<string | null>(location.pathname);

  function handleTabChange(value: string | null) {
    if (!value) {
      return;
    }

    setActiveTab(value);

    navigate(value, { replace: true });
  }

  return (
    <AppShell
      padding={0}
      header={{
        height: 60,
      }}
      footer={{
        height: 60,
      }}
    >
      <AppShell.Header p="sm">
        <Group justify="center" align="center">
          <Image src="/logo.png" alt="MacroMate logo" h={40} w="auto" fit="contain" />
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer p="sm">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List justify="center">
            <Tabs.Tab value="/">{t('home')}</Tabs.Tab>
            <Tabs.Tab value="/food">{t('foodItems')}</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </AppShell.Footer>
    </AppShell>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

export default Layout;
