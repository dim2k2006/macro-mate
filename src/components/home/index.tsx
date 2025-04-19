import { Box, TextInput, Button, Textarea, NativeSelect, NumberInput, Space, SimpleGrid } from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit } from '@/domain/foodItem';

const units: Unit[] = ['g', 'ml'];

function Home() {
  const { t } = useTranslation();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      description: '',
      name: '',
      unit: 'g' as const,
      calories: undefined,
      proteins: undefined,
      fats: undefined,
      carbs: undefined,
    },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
    },
  });

  function handleSubmit(values: {
    description: string;
    name: string;
    unit: Unit;
    calories: number | undefined;
    proteins: number | undefined;
    fats: number | undefined;
    carbs: number | undefined;
  }) {
    console.log('values:', values);
  }

  return (
    <Box p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          {...form.getInputProps('description')}
          label={t('foodItemLabel')}
          placeholder={t('foodItemPlaceholder')}
          autosize
          minRows={10}
        />

        <Button type="button" mt="md" color="teal" fullWidth>
          {t('calculateMacros')}
        </Button>

        <Space h="md" />

        <TextInput
          {...form.getInputProps('name')}
          label={t('foodItemLabel')}
          placeholder={t('foodItemNamePlaceholder')}
        />

        <Space h="md" />

        <NativeSelect {...form.getInputProps('unit')} label={t('foodItemUnitLabel')} data={units} />

        <Space h="md" />

        <NumberInput
          {...form.getInputProps('calories')}
          label={t('foodItemCaloriesLabel')}
          placeholder={t('foodItemCaloriesPlaceholder')}
        />

        <Space h="md" />

        <SimpleGrid cols={3}>
          <div>
            <NumberInput
              {...form.getInputProps('proteins')}
              label={t('foodItemProteinLabel')}
              placeholder={t('foodItemProteinPlaceholder')}
            />
          </div>

          <div>
            <NumberInput
              {...form.getInputProps('fats')}
              label={t('foodItemFatLabel')}
              placeholder={t('foodItemFatPlaceholder')}
            />
          </div>

          <div>
            <NumberInput
              {...form.getInputProps('carbs')}
              label={t('foodItemCarbsLabel')}
              placeholder={t('foodItemCarbsPlaceholder')}
            />
          </div>
        </SimpleGrid>

        <Button type="submit" mt="md" fullWidth>
          {t('saveFoodItem')}
        </Button>
      </form>
    </Box>
  );
}

export default Home;
