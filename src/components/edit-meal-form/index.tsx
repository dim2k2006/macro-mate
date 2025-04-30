import { EnhancedMeal, Meal } from '@/domain/meal';
import { hasLength, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useUpsertMeal, useDeleteMeal } from '@/components/meal-service-provider';
import { Button, Card, NumberInput, Space, Text, Popover, Group, Grid } from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import dayjs from 'dayjs';
import { FoodItem } from '@/domain/foodItem';
import SearchableFoodItems from '@/components/searchable-food-items';

function EditMealForm({ meal, onFinish }: EditMealFormProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const { mutate: upsertMeal, isPending: isUpserting, isError: isUpsertError } = useUpsertMeal(meal.id);

  const { mutate: deleteMeal, isPending: isDeleting, isError: isDeleteError } = useDeleteMeal(meal.id);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      foodItemId: meal.foodItemId,
      amount: meal.amount,
    },
    validate: {
      foodItemId: hasLength({ min: 3 }, t('requiredField')),
      amount: (value) => {
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

  function handleSubmit(values: SubmitValues) {
    const newMeal: Meal = {
      ...meal,
      foodItemId: values.foodItemId,
      amount: values.amount,
    };

    upsertMeal(newMeal, {
      onSuccess: () => {
        form.reset();

        if (onFinish) {
          onFinish();
        }
      },
    });
  }

  function handleSelectFoodItem(foodItem: FoodItem) {
    form.setFieldValue('foodItemId', foodItem.id);
  }

  function handleClearFoodItem() {
    form.setFieldValue('foodItemId', '');
  }

  function handleDelete() {
    deleteMeal(undefined, {
      onSuccess: () => {
        form.reset();

        if (onFinish) {
          onFinish();
        }
      },
    });
  }

  const selectedFoodItem = foodItems.find((item) => item.id === form.values.foodItemId);

  const isPending = isUpserting || isDeleting;
  const isError = isUpsertError || isDeleteError;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {!!selectedFoodItem && (
          <Grid>
            <Grid.Col span={8}>
              <Text fw={500}>{selectedFoodItem.name}</Text>

              <Text size="xs">{dayjs(selectedFoodItem.createdAt).format('YYYY-MM-DD')}</Text>
            </Grid.Col>

            <Grid.Col span={4}>
              <Button variant="outline" size="compact-xs" onClick={() => handleClearFoodItem()} color="red">
                {t('clear')}
              </Button>
            </Grid.Col>
          </Grid>
        )}

        <Space h="md" />

        <NumberInput {...form.getInputProps('amount')} label={t('mealAmount')} disabled={isPending} />

        <Space h="md" />

        <SearchableFoodItems foodItems={foodItems} onSelectFoodItem={handleSelectFoodItem} />

        <Group justify="center">
          <Button type="submit" mt="md" color="teal" fullWidth>
            {t('saveMeal')}
          </Button>

          <Space h="md" />

          <Popover width={150} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button color="red" size="xs" variant="outline">
                {t('deleteMeal')}
              </Button>
            </Popover.Target>

            <Popover.Dropdown>
              <Group justify="center">
                <Text fw={500} size="sm">
                  {t('deleteMealConfirmLabel')}
                </Text>

                <Space h="sm" />

                <Button variant="filled" color="red" size="xs" onClick={handleDelete}>
                  {t('deleteMealConfirm')}
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>

        {isError && (
          <>
            <Text c="red" size="sm" mt="md">
              {t('genericError')}
            </Text>
          </>
        )}
      </form>
    </Card>
  );
}

type EditMealFormProps = {
  meal: EnhancedMeal;
  onFinish?: () => void;
};

type SubmitValues = {
  foodItemId: string;
  amount: number;
};

export default EditMealForm;
