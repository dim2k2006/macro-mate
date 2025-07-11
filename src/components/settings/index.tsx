import { Box, TextInput, Button, Alert, Space, NumberInput, Title, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useUpdateSettings, useGetSettings } from '@/components/settings-service-provider';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { Settings } from '@/domain/settings';

function SettingsPage() {
  const { t } = useTranslation();

  const settingsState = useGetSettings();

  if (settingsState.isLoading) {
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }

  if (settingsState.isError) {
    return (
      <Alert variant="light" color="blue" title={t('failLoadingSettingsTitle')}>
        {t('failLoadingSettingsMessage')}
      </Alert>
    );
  }

  return <>{settingsState.isSuccess && <SettingsForm settings={settingsState.data} />}</>;
}

function SettingsForm({ settings }: SettingsFormProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { mutate: updateSettings, isPending, isError } = useUpdateSettings();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      llmKey: settings.llmKey,
      calories: settings.macroGoals.calories,
      proteins: settings.macroGoals.proteins,
      fats: settings.macroGoals.fats,
      carbs: settings.macroGoals.carbs,
      lng: settings.lng || 'en',
    },
    validate: {
      llmKey: hasLength({ min: 3 }, t('requiredField')),
      calories: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      proteins: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      fats: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      carbs: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
    },
  });

  function handleSubmit(values: FormValues) {
    const newSettings = {
      llmKey: values.llmKey,
      macroGoals: {
        calories: values.calories,
        proteins: values.proteins,
        fats: values.fats,
        carbs: values.carbs,
      },
      lng: values.lng,
    };

    updateSettings(newSettings, {
      onSuccess: () => {
        navigate('/');
      },
    });
  }

  return (
    <Box p="md">
      <Title order={2}>{t('settings')}</Title>

      <Space h="md" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput {...form.getInputProps('llmKey')} label={t('llmKeyLabel')} disabled={isPending} required />

        <Space h="md" />

        <NumberInput
          type="tel"
          {...form.getInputProps('calories')}
          label={t('foodItemCaloriesLabel')}
          disabled={isPending}
          hideControls
        />

        <Space h="md" />

        <NumberInput
          type="tel"
          {...form.getInputProps('proteins')}
          label={t('foodItemProteinLabel')}
          disabled={isPending}
          hideControls
        />

        <Space h="md" />

        <NumberInput
          type="tel"
          {...form.getInputProps('fats')}
          label={t('foodItemFatLabel')}
          disabled={isPending}
          hideControls
        />

        <Space h="md" />

        <NumberInput
          type="tel"
          {...form.getInputProps('carbs')}
          label={t('foodItemCarbsLabel')}
          disabled={isPending}
          hideControls
        />

        <Space h="md" />

        <Select
          {...form.getInputProps('lng')}
          label={t('languageLabel')}
          data={[
            { value: 'en', label: t('languageEnglish') },
            { value: 'ru', label: t('languageRussian') },
          ]}
          disabled={isPending}
          required
        />

        <Button type="submit" mt="sm" fullWidth disabled={isPending} loading={isPending}>
          {t('saveSettings')}
        </Button>
      </form>

      {isError && (
        <Box mt="sm" color="red">
          {t('saveSettingsError')}
        </Box>
      )}
    </Box>
  );
}

type SettingsFormProps = {
  settings: Settings;
};

type FormValues = {
  llmKey: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  lng: string;
};

export default SettingsPage;
