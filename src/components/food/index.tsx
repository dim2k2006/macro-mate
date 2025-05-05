import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useMemo } from 'react';
import CookingFoodItem from '@/components/cooking-foodItem';
import { Box, Space } from '@mantine/core';
import React from 'react';

function Food() {
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

  return (
    <Box p="md">
      {foodItems.map((foodItem) => (
        <React.Fragment key={foodItem.id}>
          <CookingFoodItem foodItem={foodItem} isExpanded={false} />

          <Space h="md" />
        </React.Fragment>
      ))}
    </Box>
  );
}

export default Food;
