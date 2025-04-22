import { EnhancedMeal } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Card, Text, Divider, Table, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MealType } from '@/domain/meal/meal.model.ts';
import CreateMealForm from '@/components/create-meal-form';
import React from 'react';

function MealCard({ title, mealType, meals }: MealCardProps) {
  const { t } = useTranslation();

  const [opened, { open, close }] = useDisclosure(false);

  const calories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const proteins = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const fats = meals.reduce((acc, meal) => acc + meal.fat, 0);
  const carbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={500}>{title}</Text>

        <Button variant="outline" color="green" size="xs" onClick={open}>
          {t('add')}
        </Button>
      </Group>

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

      <Divider my="xs" />

      {meals.map((meal) => (
        <React.Fragment key={meal.id}>
          <Text fw={500} size="md">
            {meal.foodItemName}
          </Text>

          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{meal.calories}</Table.Td>
                <Table.Td>{meal.protein}</Table.Td>
                <Table.Td>{meal.fat}</Table.Td>
                <Table.Td>{meal.carbs}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Divider my="xs" />
        </React.Fragment>
      ))}

      <Modal opened={opened} onClose={close} title={t('addNewMeal')}>
        <CreateMealForm mealType={mealType} onSuccess={close} />
      </Modal>
    </Card>
  );
}

type MealCardProps = {
  title: string;
  mealType: MealType;
  meals: EnhancedMeal[];
};

export default MealCard;
