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
  Grid,
} from '@mantine/core';
import { usePrevious } from 'react-use';
import { useForm, hasLength } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { Unit, FoodItem } from '@/domain/foodItem';
import {
  useUpsertFoodItem,
  useDeleteFoodItem,
  useCalculateMacros,
  useParseMacros,
} from '@/components/foodItem-service-provider';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

const units: Unit[] = ['g', 'ml'];

function CookingFoodItem({ foodItem, isExpanded: initialIsExpanded = true }: CookingFoodItemProps) {
  const { t } = useTranslation();

  const { mutate: upsertFoodItem } = useUpsertFoodItem(foodItem.id);

  const debouncedUpsertFoodItem = useMemo(() => debounce(upsertFoodItem, 300), [upsertFoodItem]);

  const { mutate: deleteFoodItem } = useDeleteFoodItem(foodItem.id);

  const {
    mutate: calculateMacros,
    isPending: isCalculatingMacros,
    isError: isCalculateMacrosError,
  } = useCalculateMacros(foodItem.id);

  const { mutate: parseMacros, isPending: isParsingMacros, isError: isParseMacrosError } = useParseMacros(foodItem.id);

  const isLoading = isCalculatingMacros || isParsingMacros;

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

      debouncedUpsertFoodItem(newFoodItem);
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

    upsertFoodItem(newFoodItem);
  }

  const prevFoodItem = usePrevious(foodItem);

  useEffect(() => {
    function handleUpdateInitialValues() {
      if (isEqual(foodItem, prevFoodItem)) {
        return;
      }

      form.setValues({
        description: foodItem.description,
        name: foodItem.name,
        unit: foodItem.unit,
        calories: foodItem.calories,
        proteins: foodItem.proteins,
        fats: foodItem.fats,
        carbs: foodItem.carbs,
      });
    }

    handleUpdateInitialValues();
  }, [foodItem, form, prevFoodItem]);

  function handleDelete() {
    deleteFoodItem();
  }

  function handleCalculateMacros() {
    calculateMacros();
  }

  function handleParseMacros() {
    parseMacros();
  }

  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const date = dayjs(foodItem.updatedAt).format('YYYY-MM-DD HH:mm');

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
            <Grid align="end">
              <Grid.Col span={10}>
                <TextInput
                  {...form.getInputProps('name')}
                  label={
                    <>
                      {t('foodItemNameLabel')}
                      <Text size="xs">{`(${date})`}</Text>
                    </>
                  }
                />
              </Grid.Col>

              <Grid.Col span={2}>
                <Button variant="default" color="yellow" fullWidth={false} size="xs" onClick={handleExpand}>
                  {isExpanded ? '-' : '+'}
                </Button>
              </Grid.Col>
            </Grid>

            <Space h="md" />

            <Textarea
              {...form.getInputProps('description')}
              label={t('foodItemLabel')}
              placeholder={t('foodItemPlaceholder')}
              autosize
              minRows={8}
              maxRows={10}
            />

            {isCalculateMacrosError && (
              <Text c="red" size="sm" mt="md">
                {t('calculateMacrosError')}
              </Text>
            )}

            {isParseMacrosError && (
              <Text c="red" size="sm" mt="md">
                {t('parseMacrosError')}
              </Text>
            )}

            <Space h="md" />

            <Grid>
              <Grid.Col span={6}>
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

              <Grid.Col span={6}>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  fullWidth
                  loaderProps={{ type: 'dots' }}
                  loading={isParsingMacros}
                  disabled={isParsingMacros}
                  onClick={handleParseMacros}
                >
                  {t('parseMacros')}
                </Button>
              </Grid.Col>
            </Grid>

            <Space h="md" />

            <SimpleGrid cols={2}>
              <NativeSelect {...form.getInputProps('unit')} label={t('foodItemUnitLabel')} data={units} />

              <NumberInput
                {...form.getInputProps('calories')}
                label={t('foodItemCaloriesLabel')}
                disabled={isLoading}
              />
            </SimpleGrid>

            <Space h="md" />

            <SimpleGrid cols={3}>
              <div>
                <NumberInput
                  {...form.getInputProps('proteins')}
                  label={t('foodItemProteinLabel')}
                  disabled={isLoading}
                />
              </div>

              <div>
                <NumberInput {...form.getInputProps('fats')} label={t('foodItemFatLabel')} disabled={isLoading} />
              </div>

              <div>
                <NumberInput {...form.getInputProps('carbs')} label={t('foodItemCarbsLabel')} disabled={isLoading} />
              </div>
            </SimpleGrid>

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
