import { useListFoodItems } from '@/components/foodItem-service-provider';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import CookingFoodItem from '@/components/cooking-foodItem-form';
import { FoodItem } from '@/domain/foodItem';

function Home() {
  const foodItemsState = useListFoodItems();

  const foodItems = useMemo(() => foodItemsState.data ?? [], [foodItemsState.data]);

  const cookingFoodItems = useMemo(() => foodItems.filter((item) => item.state === 'cooking'), [foodItems]);

  const cookingFoodItemsWithDraft = useMemo(() => {
    if (cookingFoodItems.length === 0) {
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

    return cookingFoodItems;
  }, [cookingFoodItems]);

  return (
    <>
      {cookingFoodItemsWithDraft.map((foodItem) => (
        <CookingFoodItem key={foodItem.id} foodItem={foodItem} />
      ))}
    </>
  );
}

export default Home;
