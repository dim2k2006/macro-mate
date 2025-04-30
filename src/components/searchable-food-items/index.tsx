import { FoodItem } from '@/domain/foodItem';
import { Card, Space, TextInput, ScrollArea, Divider, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useFuzzySearch } from '@/components/fuzzy-search';
import { useMemo } from 'react';
import FoodItemCard from '@/components/food-item-card';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

function SearchableFoodItems({ foodItems, onSelectFoodItem }: SearchableFoodItemsProps) {
  const { t } = useTranslation();

  function handleSelectFoodItem(foodItemId: string) {
    const selectedFoodItem = foodItems.find((item) => item.id === foodItemId);

    if (selectedFoodItem) {
      onSelectFoodItem(selectedFoodItem);
    }
  }

  function handleSubmit() {
    // Handle form submission if needed
  }

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      query: '',
    },
  });

  const { search, highlightText } = useFuzzySearch(foodItems, {
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
    searchResults.length > 0 ? searchResults : foodItems.map((foodItem) => ({ item: foodItem, matches: [] }));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput {...form.getInputProps('query')} label={t('selectFoodItem')} />

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
                    date={dayjs(item.createdAt).format('YYYY-MM-DD')}
                    onSelect={handleSelectFoodItem}
                  />

                  <Divider />
                </>
              );
            })}
          </Stack>
        </ScrollArea>
      </form>
    </Card>
  );
}

type SearchableFoodItemsProps = {
  foodItems: FoodItem[];
  onSelectFoodItem: (foodItem: FoodItem) => void;
};

export default SearchableFoodItems;
