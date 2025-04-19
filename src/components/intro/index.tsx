import { useState } from 'react';
import { Box, TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout';
import { useCreateLlmKey } from '@/components/llmKey-service-provider';

function Intro() {
  const { t } = useTranslation();

  const createLlmKey = useCreateLlmKey();

  const [apiKey, setApiKey] = useState<string>('');

  const handleSave = () => {
    createLlmKey.mutate(apiKey);
  };

  if (createLlmKey.isSuccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Box p="md">
        <TextInput
          label={t('llmKeyLabel')}
          placeholder={t('llmKeyPlaceholder')}
          value={apiKey}
          onChange={(e) => setApiKey(e.currentTarget.value)}
          required
          disabled={createLlmKey.isPending}
        />
        <Button
          mt="sm"
          fullWidth
          onClick={handleSave}
          disabled={!apiKey || createLlmKey.isPending}
          loading={createLlmKey.isPending}
        >
          {t('llmKeySave')}
        </Button>
      </Box>
    </Layout>
  );
}

export default Intro;
