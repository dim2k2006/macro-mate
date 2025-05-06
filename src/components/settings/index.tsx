import { Box, TextInput, Button, Alert, Space, NumberInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useUpdateSettings, useGetSettings } from '@/components/settings-service-provider';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';

function Settings() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const settingsState = useGetSettings();

  const { mutate: updateSettings, isPending, isError } = useUpdateSettings();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      llmKey: settingsState.data?.llmKey ?? '',
      calories: settingsState.data?.macroGoals.calories ?? 0,
      proteins: settingsState.data?.macroGoals.proteins ?? 0,
      fats: settingsState.data?.macroGoals.fats ?? 0,
      carbs: settingsState.data?.macroGoals.carbs ?? 0,
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

  if (settingsState.isLoading) {
    return (
      <>
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }

  function handleSubmit(values: FormValues) {
    const newSettings = {
      llmKey: values.llmKey,
      macroGoals: {
        calories: values.calories,
        proteins: values.proteins,
        fats: values.fats,
        carbs: values.carbs,
      },
    };

    updateSettings(newSettings, {
      onSuccess: () => {
        navigate('/');
      },
    });
  }

  if (settingsState.isError) {
    return (
      <Alert variant="light" color="blue" title={t('failLoadingSettingsTitle')}>
        {t('failLoadingSettingsMessage')}
      </Alert>
    );
  }

  return (
    <Box p="md">
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

type FormValues = {
  llmKey: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export default Settings;
