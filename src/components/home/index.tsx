import { useListFoodItems, useCreateFoodItem } from '@/components/foodItem-service-provider';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import CookingFoodItem from '@/components/cooking-foodItem';
import { FoodItem } from '@/domain/foodItem';
import { Box, Button, Space } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

function Home() {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const cookingFoodItemsWithDraft = useMemo(() => {
    if (foodItemsState.isLoading || foodItemsState.isError) {
      return [];
    }

    if (foodItemsState.isSuccess) {
      const foodItems = foodItemsState.data;

      const cookingFoodItems = foodItems.filter((item) => item.state === 'cooking');

      if (cookingFoodItems.length > 0) {
        return cookingFoodItems;
      }

      const draftFoodItem: FoodItem = {
        id: uuidV4(),
        name: '',
        description: '',
        unit: 'g',
        calories: undefined,
        proteins: undefined,
        fats: undefined,
        carbs: undefined,
        state: 'cooking',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return [draftFoodItem];
    }

    return [];
  }, [foodItemsState.data, foodItemsState.isError, foodItemsState.isLoading, foodItemsState.isSuccess]);

  const { mutate: createFoodItem } = useCreateFoodItem();

  function handleCreateFoodItem() {
    const input = {
      state: 'cooking' as const,
      unit: 'g' as const,
      description: '',
      name: '',
    };

    createFoodItem(input);
  }

  return (
    <Box p="md">
      {cookingFoodItemsWithDraft.map((foodItem) => (
        <React.Fragment key={foodItem.id}>
          <CookingFoodItem foodItem={foodItem} />

          <Space h="md" />
        </React.Fragment>
      ))}

      <Button type="button" mt="md" variant="outline" fullWidth onClick={handleCreateFoodItem}>
        {t('createFoodItem')}
      </Button>
    </Box>
  );
}

export default Home;
