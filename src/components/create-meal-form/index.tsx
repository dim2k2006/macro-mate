import { useMemo } from 'react';
import { hasLength, useForm } from '@mantine/form';
import { MealType } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Button, Card, NumberInput, Space, Text, TextInput, Center, Stack, Paper, Group } from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useCreateMeal } from '@/components/meal-service-provider';
import { useFuzzySearch } from '@/components/fuzzy-search';
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

  const { search, highlightText } = useFuzzySearch(foodItemOptions, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    keys: ['0.label'],
    findAllMatches: true,
    minMatchCharLength: 1,
  });

  const searchResults = useMemo(() => {
    if (!form.values.query) return [];

    return search(form.values.query).map((result) => ({
      item: result.item,
      matches: result.matches,
    }));
  }, [form.values.query, search]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput {...form.getInputProps('amount')} label={t('mealAmount')} disabled={isPending} />

        <Space h="md" />

        <TextInput {...form.getInputProps('query')} label={t('selectFoodItem')} disabled={isPending} />

        <Space h="md" />

        {searchResults.length === 0 && (
          <Center p="xl" style={{ flexDirection: 'column' }}>
            <Text size="lg" fw={500} mt="sm">
              No results found
            </Text>
            <Text color="dimmed" size="sm">
              Try adjusting your search criteria.
            </Text>
          </Center>
        )}

        {searchResults.length > 0 && (
          <Stack p="sm">
            {searchResults.map(({ item, matches }) => {
              return (
                <Paper key={item.value} shadow="xs" p="md">
                  <Group justify="space-between">
                    <Text>{item.label}</Text>

                    <Button size="xs" variant="outline">
                      Select
                    </Button>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}

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
  query: string;
};

export default CreateMealForm;
