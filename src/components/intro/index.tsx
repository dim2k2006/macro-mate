import { useState, useEffect } from 'react';
import { Box, TextInput, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout';

function Intro() {
  const { t } = useTranslation();

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
    <Layout>
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
    </Layout>
  );
}

export default Intro;
