import { AppShell, Group, Image, Text, Table, ActionIcon } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconCameraAi } from '@tabler/icons-react';

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

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

        <ActionIcon
          component="a"
          href="https://chatgpt.com/g/g-6818cee3ed188191876291c0e7eb1f3d"
          target="_blank"
          variant="default"
          size="lg"
          style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)' }}
        >
          <IconCameraAi size={20} />
        </ActionIcon>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer>
        <Table withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td w="33%" align="center">
                <Link to="/">
                  <Text size="md">{t('cookingFoodItems')}</Text>
                </Link>
              </Table.Td>

              <Table.Td w="33%" align="center">
                <Link to="/food">
                  <Text size="md">{t('foodItems')}</Text>
                </Link>
              </Table.Td>

              <Table.Td w="33%" align="center">
                <Link to="/meal">
                  <Text size="md">{t('meals')}</Text>
                </Link>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </AppShell.Footer>
    </AppShell>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

export default Layout;
