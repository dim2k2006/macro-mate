import {
  TextInput,
  Button,
  Textarea,
  NativeSelect,
  NumberInput,
  Space,
  SimpleGrid,
  Card,
  Group,
  Popover,
  Text,
} from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit, FoodItem } from '@/domain/foodItem';
import { useUpsertFoodItem, useDeleteFoodItem } from '@/components/foodItem-service-provider';
import { useEffect } from 'react';

const units: Unit[] = ['g', 'ml'];

function CookingFoodItem({ foodItem }: CookingFoodItemProps) {
  const { t } = useTranslation();

  const { mutate } = useUpsertFoodItem(foodItem.id);

  const { mutate: deleteFoodItem } = useDeleteFoodItem(foodItem.id);

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

  function handleSubmit(values: SubmitValues) {
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

  const formValues = form.values;

  useEffect(() => {
    const newFoodItem: FoodItem = {
      ...foodItem,
      description: formValues.description,
      name: formValues.name,
      unit: formValues.unit,
      calories: formValues.calories,
      proteins: formValues.proteins,
      fats: formValues.fats,
      carbs: formValues.carbs,
    };

    mutate(newFoodItem);
  }, [foodItem, formValues, mutate]);

  function handleDelete() {
    deleteFoodItem();
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          {...form.getInputProps('description')}
          label={t('foodItemLabel')}
          placeholder={t('foodItemPlaceholder')}
          autosize
          minRows={8}
        />

        <Button type="button" mt="md" color="teal" fullWidth>
          {t('calculateMacros')}
        </Button>

        <Space h="md" />

        <TextInput {...form.getInputProps('name')} label={t('foodItemNameLabel')} />

        <Space h="md" />

        <SimpleGrid cols={2}>
          <NativeSelect {...form.getInputProps('unit')} label={t('foodItemUnitLabel')} data={units} />

          <NumberInput {...form.getInputProps('calories')} label={t('foodItemCaloriesLabel')} />
        </SimpleGrid>

        <Space h="md" />

        <SimpleGrid cols={3}>
          <div>
            <NumberInput {...form.getInputProps('proteins')} label={t('foodItemProteinLabel')} />
          </div>

          <div>
            <NumberInput {...form.getInputProps('fats')} label={t('foodItemFatLabel')} />
          </div>

          <div>
            <NumberInput {...form.getInputProps('carbs')} label={t('foodItemCarbsLabel')} />
          </div>
        </SimpleGrid>

        <Group justify="center">
          <Button type="submit" mt="md" fullWidth>
            {t('saveFoodItem')}
          </Button>

          <Space h="md" />

          <Popover width={150} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button variant="filled" color="red" size="xs">
                {t('deleteFoodItem')}
              </Button>
            </Popover.Target>

            <Popover.Dropdown>
              <Group justify="center">
                <Text fw={500} size="sm">
                  {t('deleteFoodItemConfirmLabel')}
                </Text>

                <Space h="sm" />

                <Button variant="filled" color="red" size="xs" onClick={handleDelete}>
                  {t('deleteFoodItemConfirm')}
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </form>
    </Card>
  );
}

type CookingFoodItemProps = {
  foodItem: FoodItem;
};

type SubmitValues = {
  description: string;
  name: string;
  unit: Unit;
  calories: number | undefined;
  proteins: number | undefined;
  fats: number | undefined;
  carbs: number | undefined;
};

export default CookingFoodItem;
