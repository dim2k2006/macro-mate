import { AppShell, Group, Image, ActionIcon, FloatingIndicator, UnstyledButton } from '@mantine/core';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconCameraAi, IconClipboardList } from '@tabler/icons-react';
import classes from './style.module.css';

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const data = [
    { title: t('cooking'), path: '/' },
    { title: t('eating'), path: '/meal' },
  ];

  const controls = data.map((item, index) => (
    <UnstyledButton
      key={index}
      className={classes.control}
      ref={setControlRef(index)}
      onClick={() => {
        setActive(index);

        navigate(item.path);
      }}
      mod={{ active: active === index }}
    >
      <span className={classes.controlLabel}>{item.title}</span>
    </UnstyledButton>
  ));

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
        <ActionIcon
          onClick={() => navigate('/food')}
          variant="default"
          size="lg"
          style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)' }}
        >
          <IconClipboardList size={20} />
        </ActionIcon>

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
        <div className={classes.root} ref={setRootRef}>
          {controls}

          <FloatingIndicator target={controlsRefs[active]} parent={rootRef} className={classes.indicator} />
        </div>
      </AppShell.Footer>
    </AppShell>
  );
}

type LayoutProps = {
  children: React.ReactNode;
};

export default Layout;
