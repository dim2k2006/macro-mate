import { useMemo } from 'react';
import { hasLength, useForm } from '@mantine/form';
import { MealType } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Button, Card, NumberInput, Space, Text, TextInput, Stack, ScrollArea, Divider, Grid } from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useCreateMeal } from '@/components/meal-service-provider';
import { useFuzzySearch } from '@/components/fuzzy-search';
import dayjs from 'dayjs';
import FoodItemCard from './food-item-card';

function CreateMealForm({ mealType, onSuccess, onError }: CreateMealFormProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const foodItemOptions = foodItems.map((item) => ({
    id: item.id,
    name: item.name,
    date: dayjs(item.createdAt).format('YYYY-MM-DD'),
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

  function handleSelectFoodItem(id: string) {
    form.setFieldValue('foodItemId', id);
  }

  const { search, highlightText } = useFuzzySearch(foodItemOptions, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    keys: ['name', 'date'],
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

  const results =
    searchResults.length > 0 ? searchResults : foodItemOptions.map((option) => ({ item: option, matches: [] }));

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
              <Button variant="outline" size="compact-xs" onClick={() => handleSelectFoodItem('')} color="red">
                {t('clear')}
              </Button>
            </Grid.Col>
          </Grid>
        )}

        <Space h="md" />

        <NumberInput {...form.getInputProps('amount')} label={t('mealAmount')} disabled={isPending} />

        <Space h="md" />

        <TextInput {...form.getInputProps('query')} label={t('selectFoodItem')} disabled={isPending} />

        <Space h="md" />

        <ScrollArea h={280}>
          <Stack>
            {results.map(({ item, matches }) => {
              return (
                <>
                  <FoodItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    date={item.date}
                    onSelect={handleSelectFoodItem}
                  />

                  <Divider />
                </>
              );
            })}
          </Stack>
        </ScrollArea>

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
