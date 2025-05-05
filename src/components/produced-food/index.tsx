import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Space, Title } from '@mantine/core';
import CreateProducedFoodItemForm from '@/components/create-produced-foodItem-form';
import type { FormValues } from '@/components/create-produced-foodItem-form';
import { useCreateFoodItem, useUpsertFoodItem } from '@/components/foodItem-service-provider';
import { useTranslation } from 'react-i18next';

function ProducedFood() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const queryInitialValues: FormValues = {
    description: query.get('description') || '',
    name: query.get('name') || '',
    unit: 'g',
    calories: query.get('calories') ? Number(query.get('calories')) : 0,
    proteins: query.get('proteins') ? Number(query.get('proteins')) : 0,
    fats: query.get('fats') ? Number(query.get('fats')) : 0,
    carbs: query.get('carbs') ? Number(query.get('carbs')) : 0,
  };

  const { mutate: createFoodItem, isPending } = useCreateFoodItem();

  const { mutate: upsertFoodItem } = useUpsertFoodItem();

  function handleSubmit(values: FormValues) {
    const input = {
      state: 'cooked',
      unit: values.unit,
      description: values.description,
      name: values.name,
      calories: values.calories,
      proteins: values.proteins,
      fats: values.fats,
      carbs: values.carbs,
    } as const;

    createFoodItem(input, {
      onSuccess: (foodItem) => {
        const newFoodItem = {
          ...foodItem,
          state: 'cooked',
        } as const;

        upsertFoodItem(
          { id: foodItem.id, foodItem: newFoodItem },
          {
            onSuccess: () => {
              navigate('/');
            },
          },
        );
      },
    });
  }

  return (
    <Box p="md">
      <Title order={2}>{t('producedFoodItemForm')}</Title>

      <Space h="md" />

      <CreateProducedFoodItemForm initialValues={queryInitialValues} onSubmit={handleSubmit} isLoading={isPending} />
    </Box>
  );
}

export default ProducedFood;
