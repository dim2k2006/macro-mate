import { useState } from 'react';
import { Box, TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout';
import { useCreateLlmKey } from '@/components/llmKey-service-provider';

function Intro() {
  const { t } = useTranslation();

  const { isError, isPending, mutate } = useCreateLlmKey();

  const [apiKey, setApiKey] = useState<string>('');

  function handleSave() {
    mutate(apiKey);
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
          disabled={isPending}
        />
        <Button mt="sm" fullWidth onClick={handleSave} disabled={!apiKey || isPending} loading={isPending}>
          {t('llmKeySave')}
        </Button>

        {isError && (
          <Box mt="sm" color="red">
            {t('llmKeyError')}
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default Intro;
