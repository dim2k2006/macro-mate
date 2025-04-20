import {
  TextInput,
  Button,
  Textarea,
  NativeSelect,
  NumberInput,
  Space,
  SimpleGrid,
  Card,
  Group,
  Popover,
  Text,
  Badge,
} from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit, FoodItem } from '@/domain/foodItem';
import { useUpsertFoodItem, useDeleteFoodItem, useCalculateMacros } from '@/components/foodItem-service-provider';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const units: Unit[] = ['g', 'ml'];

function CookingFoodItem({ foodItem }: CookingFoodItemProps) {
  const { t } = useTranslation();

  const { mutate } = useUpsertFoodItem(foodItem.id);

  const { mutate: deleteFoodItem } = useDeleteFoodItem(foodItem.id);

  const {
    mutate: calculateMacros,
    isPending: isCalculatingMacros,
    isError: isCalculateMacrosError,
  } = useCalculateMacros(foodItem.id);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      description: foodItem.description,
      name: foodItem.name,
      unit: foodItem.unit,
      calories: foodItem.calories,
      proteins: foodItem.proteins,
      fats: foodItem.fats,
      carbs: foodItem.carbs,
    },
    validate: {
      description: hasLength({ min: 3 }, t('requiredField')),
      name: hasLength({ min: 3 }, t('requiredField')),
      calories: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      proteins: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      fats: (value) => {
        if (value === undefined) {
          return t('requiredField');
        }

        if (value < 0) {
          return t('invalidValue');
        }

        return null;
      },
      carbs: (value) => {
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
    const newFoodItem: FoodItem = {
      ...foodItem,
      description: values.description,
      name: values.name,
      unit: values.unit,
      calories: values.calories,
      proteins: values.proteins,
      fats: values.fats,
      carbs: values.carbs,
      state: 'cooked' as const,
    };

    mutate(newFoodItem);
  }

  const formValues = form.values;

  useEffect(() => {
    const newFoodItem: FoodItem = {
      ...foodItem,
      description: formValues.description,
      name: formValues.name,
      unit: formValues.unit,
      calories: formValues.calories,
      proteins: formValues.proteins,
      fats: formValues.fats,
      carbs: formValues.carbs,
    };

    mutate(newFoodItem);
  }, [foodItem, formValues, mutate]);

  function handleDelete() {
    deleteFoodItem();
  }

  function handleCalculateMacros() {
    calculateMacros();
  }

  const date = dayjs(foodItem.updatedAt).format('YYYY-MM-DD HH:mm');

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Badge variant="outline" color="gray" style={{ position: 'absolute', top: '10px', right: '10px' }}>
        {date}
      </Badge>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          {...form.getInputProps('description')}
          label={t('foodItemLabel')}
          placeholder={t('foodItemPlaceholder')}
          autosize
          minRows={8}
        />

        <Button
          type="button"
          mt="md"
          color="indigo"
          fullWidth
          variant="outline"
          loaderProps={{ type: 'dots' }}
          loading={isCalculatingMacros}
          disabled={isCalculatingMacros}
          onClick={handleCalculateMacros}
        >
          {t('calculateMacros')}
        </Button>

        {isCalculateMacrosError && (
          <>
            <Space h="sm" />

            <Text c="red" size="sm" mt="md">
              {t('calculateMacrosError')}
            </Text>
          </>
        )}

        <TextInput {...form.getInputProps('name')} label={t('foodItemNameLabel')} />

        <Space h="md" />

        <SimpleGrid cols={2}>
          <NativeSelect {...form.getInputProps('unit')} label={t('foodItemUnitLabel')} data={units} />

          <NumberInput
            {...form.getInputProps('calories')}
            label={t('foodItemCaloriesLabel')}
            disabled={isCalculatingMacros}
          />
        </SimpleGrid>

        <Space h="md" />

        <SimpleGrid cols={3}>
          <div>
            <NumberInput
              {...form.getInputProps('proteins')}
              label={t('foodItemProteinLabel')}
              disabled={isCalculatingMacros}
            />
          </div>

          <div>
            <NumberInput {...form.getInputProps('fats')} label={t('foodItemFatLabel')} disabled={isCalculatingMacros} />
          </div>

          <div>
            <NumberInput
              {...form.getInputProps('carbs')}
              label={t('foodItemCarbsLabel')}
              disabled={isCalculatingMacros}
            />
          </div>
        </SimpleGrid>

        <Group justify="center">
          <Button type="submit" mt="md" color="teal" fullWidth>
            {t('saveFoodItem')}
          </Button>

          <Space h="md" />

          <Popover width={150} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <Button color="red" size="xs" variant="outline">
                {t('deleteFoodItem')}
              </Button>
            </Popover.Target>

            <Popover.Dropdown>
              <Group justify="center">
                <Text fw={500} size="sm">
                  {t('deleteFoodItemConfirmLabel')}
                </Text>

                <Space h="sm" />

                <Button variant="filled" color="red" size="xs" onClick={handleDelete}>
                  {t('deleteFoodItemConfirm')}
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </form>
    </Card>
  );
}

type CookingFoodItemProps = {
  foodItem: FoodItem;
};

type SubmitValues = {
  description: string;
  name: string;
  unit: Unit;
  calories: number | undefined;
  proteins: number | undefined;
  fats: number | undefined;
  carbs: number | undefined;
};

export default CookingFoodItem;
