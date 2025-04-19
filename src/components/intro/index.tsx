import { useState } from 'react';
import { Box, TextInput, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useCreateLlmKey } from '@/components/llmKey-service-provider';
import { useNavigate } from 'react-router-dom';

function Intro() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { isError, isPending, mutate } = useCreateLlmKey();

  const [apiKey, setApiKey] = useState<string>('');

  function handleSave() {
    mutate(apiKey, {
      onSuccess: () => {
        navigate('/');
      },
    });
  }

  return (
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
  );
}

export default Intro;
