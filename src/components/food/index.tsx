import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useMemo, useState } from 'react';
import CookingFoodItem from '@/components/cooking-foodItem';
import { Box, Space, TextInput } from '@mantine/core';
import React from 'react';
import { useFuzzySearch } from '@/components/fuzzy-search';
import { useTranslation } from 'react-i18next';

function Food() {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = useMemo(() => {
    if (foodItemsState.isLoading || foodItemsState.isError) {
      return [];
    }

    if (foodItemsState.isSuccess) {
      return foodItemsState.data.filter((foodItem) => foodItem.state === 'cooked');
    }

    return [];
  }, [foodItemsState.data, foodItemsState.isError, foodItemsState.isLoading, foodItemsState.isSuccess]);

  const [query, setQuery] = useState('');

  const { search } = useFuzzySearch(foodItems, {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    keys: ['name', 'date'],
    findAllMatches: true,
    minMatchCharLength: 1,
  });

  const searchResults = useMemo(() => {
    if (!query) return [];

    return search(query).map((result) => ({
      item: result.item,
      matches: result.matches,
    }));
  }, [query, search]);

  const results =
    searchResults.length > 0 ? searchResults : foodItems.map((foodItem) => ({ item: foodItem, matches: [] }));

  return (
    <Box p="md">
      <TextInput onInput={(event) => setQuery(event.currentTarget.value)} label={t('selectFoodItem')} />

      <Space h="md" />

      {results.map(({ item }) => {
        return (
          <React.Fragment key={item.id}>
            <CookingFoodItem foodItem={item} isExpanded={false} />

            <Space h="md" />
          </React.Fragment>
        );
      })}
    </Box>
  );
}

export default Food;
