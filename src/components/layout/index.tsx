import { AppShell, Group, Image, Tabs } from '@mantine/core';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import style from './style.module.css';

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  const location = useLocation();

  return (
    <AppShell
      padding={0}
      header={{
        height: 60,
      }}
      footer={{
        height: 50,
      }}
    >
      <AppShell.Header p="sm">
        <Group justify="center" align="center">
          <Image src="/logo.png" alt="MacroMate logo" h={40} w="auto" fit="contain" />
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer>
        <Tabs value={location.pathname}>
          <Tabs.List justify="center">
            <Tabs.Tab value="/" className={style.link}>
              <Link to="/">{t('cookingFoodItems')}</Link>
            </Tabs.Tab>

            <Tabs.Tab value="/food" className={style.link}>
              <Link to="/food">{t('foodItems')}</Link>
            </Tabs.Tab>

            <Tabs.Tab value="/meal" className={style.link}>
              <Link to="/meal">{t('meals')}</Link>
            </Tabs.Tab>
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
