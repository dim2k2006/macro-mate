import { AppShell, Group, Image } from '@mantine/core';
import React from 'react';

function Layout({ children }: LayoutProps) {
  return (
    <AppShell
      padding={0}
      header={{
        height: 60,
      }}
    >
      <AppShell.Header p="sm">
        <Group justify="center" align="center">
          <Image src="/logo.png" alt="MacroMate logo" h={40} w="auto" fit="contain" />
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

export default Layout;
