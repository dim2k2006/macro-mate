import { EnhancedMeal } from '@/domain/meal';
import { useTranslation } from 'react-i18next';
import { Card, Text, Divider, Table, Button, Group, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MealType } from '@/domain/meal/meal.model.ts';
import CreateMealForm from '@/components/create-meal-form';
import EditMealForm from '@/components/edit-meal-form';
import React, { useState } from 'react';

function MealCard({ title, mealType, meals }: MealCardProps) {
  const { t } = useTranslation();

  const [editingModalOpened, { open: openEditingModal, close: closeEditingModal }] = useDisclosure(false);

  const [editingMeal, setEditingMeal] = useState<EnhancedMeal | null>(null);
  function handleEditMeal(meal: EnhancedMeal) {
    setEditingMeal(meal);
    openEditingModal();
  }
  function handleEditMealFinish() {
    closeEditingModal();
    setEditingMeal(null);
  }

  const [opened, { open, close }] = useDisclosure(false);

  const calories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const proteins = meals.reduce((acc, meal) => acc + meal.proteins, 0);
  const fats = meals.reduce((acc, meal) => acc + meal.fats, 0);
  const carbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);

  const isEmpty = meals.length === 0;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <Text fw={500}>{title}</Text>

        <Button variant="outline" color="green" size="xs" onClick={open}>
          {t('add')}
        </Button>
      </Group>

      {!isEmpty && (
        <>
          <Divider my="md" />

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="25%">{t('calories')}</Table.Th>
                <Table.Th w="25%">{t('protein')}</Table.Th>
                <Table.Th w="25%">{t('fat')}</Table.Th>
                <Table.Th w="25%">{t('carbs')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w="25%">{calories}</Table.Td>
                <Table.Td w="25%">{proteins}</Table.Td>
                <Table.Td w="25%">{fats}</Table.Td>
                <Table.Td w="25%">{carbs}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Divider my="xs" />

          {meals.map((meal) => (
            <React.Fragment key={meal.id}>
              <Group justify="space-between">
                <Text fw={500} size="md">
                  {meal.foodItemName}
                </Text>

                <Button variant="default" color="green" size="xs" onClick={() => handleEditMeal(meal)}>
                  ...
                </Button>
              </Group>

              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td w="25%">{meal.calories}</Table.Td>
                    <Table.Td w="25%">{meal.proteins}</Table.Td>
                    <Table.Td w="25%">{meal.fats}</Table.Td>
                    <Table.Td w="25%">{meal.carbs}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              <Divider my="xs" />
            </React.Fragment>
          ))}
        </>
      )}

      <Modal opened={opened} onClose={close} title={t('addNewMeal')}>
        <CreateMealForm mealType={mealType} onSuccess={close} />
      </Modal>

      <Modal opened={editingModalOpened} onClose={closeEditingModal} title={t('editMeal')}>
        {editingMeal && <EditMealForm meal={editingMeal} onFinish={handleEditMealFinish} />}
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
