import { hasLength, useForm } from '@mantine/form';
import { MealType } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Button, Card, NumberInput, Space, Text, Grid } from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useCreateMeal } from '@/components/meal-service-provider';
import dayjs from 'dayjs';
import { FoodItem } from '@/domain/foodItem';
import SearchableFoodItems from '@/components/searchable-food-items';

function CreateMealForm({ mealType, onSuccess, onError }: CreateMealFormProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const { mutate: createMeal, isPending, isError } = useCreateMeal();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      foodItemId: '',
      amount: undefined,
      query: '',
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
    const input = {
      foodItemId: values.foodItemId,
      amount: values.amount ?? 0,
      type: mealType,
      consumedAt: new Date().toISOString(),
    };

    createMeal(input, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: () => {
        if (onError) {
          onError();
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

  const selectedFoodItem = foodItems.find((item) => item.id === form.values.foodItemId);

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

        <NumberInput
          type="tel"
          {...form.getInputProps('amount')}
          label={t('mealAmount')}
          disabled={isPending}
          hideControls
        />

        <Space h="md" />

        <SearchableFoodItems foodItems={foodItems} onSelectFoodItem={handleSelectFoodItem} />

        <Button
          type="submit"
          mt="md"
          color="teal"
          fullWidth
          loading={isPending}
          disabled={isPending}
          loaderProps={{ type: 'dots' }}
        >
          {t('saveMeal')}
        </Button>

        {isError && (
          <>
            <Text c="red" size="sm" mt="md">
              {t('errorCreatingMeal')}
            </Text>
          </>
        )}
      </form>
    </Card>
  );
}

type CreateMealFormProps = {
  mealType: MealType;
  onSuccess?: () => void;
  onError?: () => void;
};

type SubmitValues = {
  foodItemId: string;
  amount: number | undefined;
  query: string;
};

export default CreateMealForm;
