import { EnhancedMeal, Meal } from '@/domain/meal';
import { hasLength, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useUpsertMeal, useDeleteMeal } from '@/components/meal-service-provider';
import {
  Button,
  Card,
  NumberInput,
  Space,
  Text,
  Popover,
  Group,
  Grid,
  ScrollArea,
  Stack,
  Divider,
} from '@mantine/core';
import { useListFoodItems } from '@/components/foodItem-service-provider';
import dayjs from 'dayjs';
import { useFuzzySearch } from '@/components/fuzzy-search';
import { useMemo } from 'react';
import FoodItemCard from '@/components/create-meal-form/food-item-card.tsx';

function EditMealForm({ meal, onFinish }: EditMealFormProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const foodItemOptions = foodItems.map((item) => ({
    id: item.id,
    name: item.name,
    date: dayjs(item.createdAt).format('YYYY-MM-DD'),
  }));

  const { mutate: upsertMeal, isPending: isUpserting, isError: isUpsertError } = useUpsertMeal(meal.id);

  const { mutate: deleteMeal, isPending: isDeleting, isError: isDeleteError } = useDeleteMeal(meal.id);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      foodItemId: meal.foodItemId,
      amount: meal.amount,
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

  function handleSelectFoodItem(id: string) {
    form.setFieldValue('foodItemId', id);
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
              <Button variant="outline" size="compact-xs" onClick={() => handleSelectFoodItem('')} color="red">
                {t('clear')}
              </Button>
            </Grid.Col>
          </Grid>
        )}

        <Space h="md" />

        <NumberInput {...form.getInputProps('amount')} label={t('mealAmount')} disabled={isPending} />

        <Space h="md" />

        <ScrollArea h={280}>
          <Stack>
            {results.map(({ item, matches }) => {
              const valueMatches = matches?.filter((match) => match.indices[0][0] >= 0 && match.value === item.name);

              return (
                <>
                  <FoodItemCard
                    key={item.id}
                    id={item.id}
                    name={highlightText(item.name, valueMatches)}
                    date={item.date}
                    onSelect={handleSelectFoodItem}
                  />

                  <Divider />
                </>
              );
            })}
          </Stack>
        </ScrollArea>

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
