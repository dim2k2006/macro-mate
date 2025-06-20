import {
  TextInput,
  Button,
  Textarea,
  NumberInput,
  Space,
  SimpleGrid,
  Card,
  Group,
  Popover,
  Text,
  Grid,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit, FoodItem } from '@/domain/foodItem';
import {
  useUpsertFoodItem,
  useDeleteFoodItem,
  useCalculateMacros,
  useListFoodItems,
} from '@/components/foodItem-service-provider';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import SearchableFoodItems from '@/components/searchable-food-items';
import { useLocation } from 'react-router-dom';

function CookingFoodItem({ foodItem, isExpanded: initialIsExpanded = true }: CookingFoodItemProps) {
  const { t } = useTranslation();

  const foodItemsState = useListFoodItems();

  const foodItems = foodItemsState.data || [];

  const { mutate: upsertFoodItem } = useUpsertFoodItem();

  const debouncedUpsertFoodItem = useMemo(() => debounce(upsertFoodItem, 300), [upsertFoodItem]);

  const { mutate: deleteFoodItem } = useDeleteFoodItem(foodItem.id);

  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const queryInitialValues: SubmitValues = {
    description: query.get('description') || foodItem.description,
    name: query.get('name') || foodItem.name,
    unit: foodItem.unit,
    calories: query.get('calories') ? Number(query.get('calories')) : foodItem.calories,
    proteins: query.get('proteins') ? Number(query.get('proteins')) : foodItem.proteins,
    fats: query.get('fats') ? Number(query.get('fats')) : foodItem.fats,
    carbs: query.get('carbs') ? Number(query.get('carbs')) : foodItem.carbs,
  };

  // This is used to prevent the form from reinitializing when the food item is updated
  const [initialValues] = useState<SubmitValues>(queryInitialValues);

  const form = useForm({
    mode: 'controlled',
    initialValues: initialValues,
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
    onValuesChange(values, previousValues) {
      if (isEqual(values, previousValues)) {
        return;
      }

      const newFoodItem: FoodItem = {
        ...foodItem,
        description: values.description,
        name: values.name,
        unit: values.unit,
        calories: values.calories,
        proteins: values.proteins,
        fats: values.fats,
        carbs: values.carbs,
      };

      debouncedUpsertFoodItem({ id: foodItem.id, foodItem: newFoodItem });
    },
  });

  const {
    mutate: calculateMacros,
    isPending: isCalculatingMacros,
    isError: isCalculateMacrosError,
  } = useCalculateMacros(foodItem.id, {
    onSuccess: (data) => {
      form.setValues({
        description: data.description,
        name: foodItem.name || data.name,
        unit: data.unit,
        calories: data.calories,
        proteins: data.proteins,
        fats: data.fats,
        carbs: data.carbs,
      });
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

    upsertFoodItem({ id: foodItem.id, foodItem: newFoodItem });
  }

  function handleDelete() {
    deleteFoodItem();
  }

  function handleCalculateMacros() {
    calculateMacros();
  }

  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const date = dayjs(foodItem.updatedAt).format('YYYY-MM-DD HH:mm');

  const [opened, { open, close }] = useDisclosure(false);

  function handleSelectFoodItem(selectedFoodItem: FoodItem) {
    const currentDescription = form.values.description;

    const newDescription = `${currentDescription}

${t('macros')} ${selectedFoodItem.name}
${selectedFoodItem.description}
${t('calories')}: ${selectedFoodItem.calories}
${t('proteins')}: ${selectedFoodItem.proteins}
${t('fats')}: ${selectedFoodItem.fats}
${t('carbs')}: ${selectedFoodItem.carbs}
    `;

    form.setFieldValue('description', newDescription);

    close();
  }

  const isLoading = isCalculatingMacros;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {!isExpanded && (
          <Grid align="end">
            <Grid.Col span={10}>
              <Text size="sm" fw={500}>
                {form.values.name}
              </Text>

              <Text size="xs">{date}</Text>

              <Space h="sm" />

              <Grid>
                <Grid.Col span={3}>
                  <Text size="xs" color="dimmed">
                    {t('calories')} {form.values.calories}
                  </Text>
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" color="dimmed">
                    {t('proteins')} {form.values.proteins}
                  </Text>
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" color="dimmed">
                    {t('fats')} {form.values.fats}
                  </Text>
                </Grid.Col>

                <Grid.Col span={3}>
                  <Text size="xs" color="dimmed">
                    {t('carbs')} {form.values.carbs}
                  </Text>
                </Grid.Col>
              </Grid>
            </Grid.Col>

            <Grid.Col span={2}>
              <Button variant="default" color="yellow" fullWidth={false} size="xs" onClick={handleExpand}>
                {isExpanded ? '-' : '+'}
              </Button>
            </Grid.Col>
          </Grid>
        )}

        {isExpanded && (
          <>
            <Textarea
              {...form.getInputProps('description')}
              label={t('foodItemLabel')}
              placeholder={t('foodItemPlaceholder')}
              autosize
              minRows={8}
              maxRows={10}
              size="lg"
            />

            {isCalculateMacrosError && (
              <Text c="red" size="sm" mt="md">
                {t('calculateMacrosError')}
              </Text>
            )}

            <Space h="md" />

            <Grid>
              <Grid.Col span={12}>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  fullWidth
                  loaderProps={{ type: 'dots' }}
                  loading={isCalculatingMacros}
                  disabled={isCalculatingMacros}
                  onClick={handleCalculateMacros}
                >
                  {t('calculateMacros')}
                </Button>
              </Grid.Col>

              <Grid.Col span={12}>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  fullWidth
                  loaderProps={{ type: 'dots' }}
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={open}
                >
                  {t('addIngredientsMacros')}
                </Button>
              </Grid.Col>
            </Grid>

            <Space h="md" />

            <Grid align="end">
              <Grid.Col span={10}>
                <TextInput {...form.getInputProps('name')} label={t('foodItemNameLabel')} />
              </Grid.Col>

              <Grid.Col span={2}>
                <Button variant="default" color="yellow" fullWidth={false} size="xs" onClick={handleExpand}>
                  {isExpanded ? '-' : '+'}
                </Button>
              </Grid.Col>
            </Grid>

            <Space h="md" />

            <SimpleGrid cols={4}>
              <div>
                <NumberInput
                  type="tel"
                  {...form.getInputProps('calories')}
                  label={t('caloriesWithEmoji')}
                  disabled={isLoading}
                  hideControls
                />
              </div>

              <div>
                <NumberInput
                  type="tel"
                  {...form.getInputProps('proteins')}
                  label={t('proteinsWithEmoji')}
                  disabled={isLoading}
                  hideControls
                />
              </div>

              <div>
                <NumberInput
                  type="tel"
                  {...form.getInputProps('fats')}
                  label={t('fatsWithEmoji')}
                  disabled={isLoading}
                  hideControls
                />
              </div>

              <div>
                <NumberInput
                  type="tel"
                  {...form.getInputProps('carbs')}
                  label={t('carbsWithEmoji')}
                  disabled={isLoading}
                  hideControls
                />
              </div>
            </SimpleGrid>

            <Space h="md" />

            <Group justify="center">
              <Button type="submit" mt="md" color="teal" fullWidth disabled={isLoading}>
                {t('saveFoodItem')}
              </Button>

              <Space h="md" />

              <Popover width={150} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button color="red" size="xs" variant="outline" disabled={isLoading}>
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
          </>
        )}
      </form>

      <Modal opened={opened} onClose={close} title={t('products')}>
        <SearchableFoodItems foodItems={foodItems} onSelectFoodItem={handleSelectFoodItem} height={420} />
      </Modal>
    </Card>
  );
}

type CookingFoodItemProps = {
  foodItem: FoodItem;
  isExpanded?: boolean;
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
