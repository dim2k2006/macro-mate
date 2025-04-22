import { EnhancedMeal } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Card, Text, Divider, Table } from '@mantine/core';

function MealCard({ title, meals }: MealCardProps) {
  const { t } = useTranslation();

  const calories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const proteins = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const fats = meals.reduce((acc, meal) => acc + meal.fat, 0);
  const carbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={500}>{title}</Text>

      <Divider my="md" />

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('calories')}</Table.Th>
            <Table.Th>{t('protein')}</Table.Th>
            <Table.Th>{t('fat')}</Table.Th>
            <Table.Th>{t('carbs')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {meals.map((meal) => (
            <Table.Tr key={meal.id}>
              <Table.Td>{calories}</Table.Td>
              <Table.Td>{proteins}</Table.Td>
              <Table.Td>{fats}</Table.Td>
              <Table.Td>{carbs}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {meals.map((meal) => (
        <Text key={meal.id} size="sm">
          {t('meal.type', { type: meal.type })}: {meal.amount}g
        </Text>
      ))}
    </Card>
  );
}

type MealCardProps = {
  title: string;
  meals: EnhancedMeal[];
};

export default MealCard;
