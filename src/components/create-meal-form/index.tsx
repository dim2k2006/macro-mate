import { hasLength, useForm } from '@mantine/form';
import { MealType } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Button, Card, NumberInput, Space, Select, Text } from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useCreateMeal } from '@/components/meal-service-provider';
import dayjs from 'dayjs';

function CreateMealForm({ mealType, onSuccess, onError }: CreateMealFormProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const foodItemOptions = foodItems.map((item) => ({
    label: `${item.name} (${dayjs(item.createdAt).format('YYYY-MM-DD')})`,
    value: item.id,
  }));

  const { mutate: createMeal, isPending, isError } = useCreateMeal();

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      foodItemId: '',
      amount: 0,
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
      amount: values.amount,
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          {...form.getInputProps('foodItemId')}
          label={t('selectFoodItem')}
          data={foodItemOptions}
          searchable
          disabled={isPending}
        />

        <Space h="md" />

        <NumberInput {...form.getInputProps('amount')} label={t('mealAmount')} disabled={isPending} />

        <Space h="md" />

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
  amount: number;
};

export default CreateMealForm;
