import { useState, useEffect } from 'react';
import { AppShell, Box, TextInput, Button, Image, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

function Intro() {
  const { t } = useTranslation();

  const [opened, { toggle }] = useDisclosure();
  const [apiKey, setApiKey] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  // Загружаем сохранённый ключ при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('OPENAI_API_KEY');
    if (stored) setApiKey(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem('OPENAI_API_KEY', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell
      padding={0}
      header={{
        height: 60,
      }}
    >
      <AppShell.Header>
        <Group justify="center">
          <Image src="/public/logo.png" alt="MacroMate logo" h={40} w="auto" fit="contain" />
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box p="md">
          <TextInput
            label={t('llmKeyLabel')}
            placeholder={t('llmKeyPlaceholder')}
            value={apiKey}
            onChange={(e) => setApiKey(e.currentTarget.value)}
            required
          />
          <Button mt="sm" fullWidth onClick={handleSave} disabled={!apiKey}>
            {saved ? 'Сохранено!' : t('llmKeySave')}
          </Button>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default Intro;
