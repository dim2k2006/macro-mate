import { Unit } from '@/domain/foodItem';
import { hasLength, useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Group,
  NativeSelect,
  NumberInput,
  Popover,
  SimpleGrid,
  Space,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';

const units: Unit[] = ['g', 'ml'];

function CreateProducedFoodItemForm({ initialValues, isLoading, onSubmit }: CreateFoodItemFormProps) {
  const { t } = useTranslation();

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
  });

  function handleSubmit(values: FormValues) {
    onSubmit(values);
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          {...form.getInputProps('description')}
          label={t('foodItemLabel')}
          placeholder={t('foodItemPlaceholder')}
          autosize
          minRows={8}
          maxRows={10}
          size="lg"
        />

        <Space h="md" />

        <TextInput {...form.getInputProps('name')} label={t('foodItemNameLabel')} />

        <Space h="md" />

        <SimpleGrid cols={2}>
          <NativeSelect {...form.getInputProps('unit')} label={t('foodItemUnitLabel')} data={units} />

          <NumberInput
            type="tel"
            {...form.getInputProps('calories')}
            label={t('foodItemCaloriesLabel')}
            disabled={isLoading}
            hideControls
          />
        </SimpleGrid>

        <Space h="md" />

        <SimpleGrid cols={3}>
          <div>
            <NumberInput
              type="tel"
              {...form.getInputProps('proteins')}
              label={t('foodItemProteinLabel')}
              disabled={isLoading}
              hideControls
            />
          </div>

          <div>
            <NumberInput
              type="tel"
              {...form.getInputProps('fats')}
              label={t('foodItemFatLabel')}
              disabled={isLoading}
              hideControls
            />
          </div>

          <div>
            <NumberInput
              type="tel"
              {...form.getInputProps('carbs')}
              label={t('foodItemCarbsLabel')}
              disabled={isLoading}
              hideControls
            />
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
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </form>
    </Card>
  );
}

export type FormValues = {
  description: string;
  name: string;
  unit: Unit;
  calories: number | undefined;
  proteins: number | undefined;
  fats: number | undefined;
  carbs: number | undefined;
};

type CreateFoodItemFormProps = {
  initialValues?: FormValues;
  isLoading: boolean;
  onSubmit: (values: FormValues) => void;
};

export default CreateProducedFoodItemForm;
