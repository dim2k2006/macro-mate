import { Box, TextInput, Button, Textarea, NativeSelect, NumberInput, Space, SimpleGrid } from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit, FoodItem } from '@/domain/foodItem';
import { useUpdateFoodItem } from '@/components/foodItem-service-provider';

const units: Unit[] = ['g', 'ml'];

function CookingFoodItem({ foodItem }: CookingFoodItemProps) {
  const { t } = useTranslation();

  const { mutate } = useUpdateFoodItem(foodItem.id);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      description: foodItem.description,
      name: foodItem.name,
      unit: foodItem.unit,
      calories: foodItem.calories,
      proteins: foodItem.proteins,
      fats: foodItem.fats,
      carbs: foodItem.carbs,
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
    const newFoodItem: FoodItem = {
      ...foodItem,
      description: values.description,
      name: values.name,
      unit: values.unit,
      calories: values.calories,
      proteins: values.proteins,
      fats: values.fats,
      carbs: values.carbs,
    };

    mutate(newFoodItem);
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

type CookingFoodItemProps = {
  foodItem: FoodItem;
};

export default CookingFoodItem;
