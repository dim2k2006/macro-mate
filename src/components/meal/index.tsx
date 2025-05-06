import { useState } from 'react';
import { Box, Button, Divider, Grid, Group, Loader, Progress, Space, Stack, Table, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { DonutChart } from '@mantine/charts';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { useGetMacrosByDate, useGetMealsByDate } from '@/components/meal-service-provider';
import { useGetSettings } from '@/components/settings-service-provider';
import MealCard from '@/components/meal-card';
import { useTranslation } from 'react-i18next';

dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);

const days = getDaysOfCurrentYear();

function Meal() {
  const { t } = useTranslation();

  const settingsState = useGetSettings();

  const macroGoals = settingsState.data?.macroGoals;

  const todayDayOfYear = dayjs().dayOfYear() - 1;

  const [activeIndex, setActiveIndex] = useState(todayDayOfYear);
  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

  const activeDay = days[activeIndex];

  const mealsState = useGetMealsByDate(activeDay.format('YYYY-MM-DD'));

  const meals = mealsState.data || [];

  const breakfastMeals = meals.filter((meal) => meal.type === 'breakfast');
  const lunchMeals = meals.filter((meal) => meal.type === 'lunch');
  const dinnerMeals = meals.filter((meal) => meal.type === 'dinner');
  const snackMeals = meals.filter((meal) => meal.type === 'snack');

  const macrosState = useGetMacrosByDate(activeDay.format('YYYY-MM-DD'));

  const proteins = macrosState.data?.proteins ?? 0;
  const fats = macrosState.data?.fats ?? 0;
  const carbs = macrosState.data?.carbs ?? 0;

  const proteinsColor = '#E68D85';
  const fatsColor = '#F1C761';
  const carbsColor = '#87C1D8';

  const data = [
    { name: t('protein'), value: proteins, color: proteinsColor },
    { name: t('fat'), value: fats, color: fatsColor },
    { name: t('carbs'), value: carbs, color: carbsColor },
  ];

  return (
    <Box p="md">
      <Carousel
        slideSize={30}
        height={36}
        slideGap="xs"
        align="center"
        loop
        withControls={false}
        initialSlide={activeIndex}
      >
        {days.map((day, index) => {
          const isToday = index === todayDayOfYear;

          const isActive = index === activeIndex;

          const variant = isToday ? (isActive ? 'filled' : 'light') : isActive ? 'filled' : 'default';

          return (
            <Carousel.Slide key={day.toString()}>
              <Stack justify="center" align="center">
                <Button variant={variant} autoContrast onClick={() => handleSlideChange(index)}>
                  <Text size="xs" style={{ width: '100%', textAlign: 'center' }}>
                    {day.format('MMM D')}, {day.format('dd')}
                  </Text>
                </Button>
              </Stack>
            </Carousel.Slide>
          );
        })}
      </Carousel>

      {macrosState.isLoading && <Loader color="blue" />}

      {macrosState.isError && (
        <Text color="red" size="sm">
          {t('errorLoadingMacros')}
        </Text>
      )}

      {macrosState.isSuccess && (
        <>
          <Space h="sm" />

          <Grid>
            <Grid.Col span={12}>
              <Table withRowBorders={false}>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Text
                        fw={500}
                      >{`${t('caloriesWithRef', { current: macrosState.data.calories, goal: macroGoals?.calories })}`}</Text>

                      <Space h={5} />

                      <Progress.Root size={20} radius="md">
                        <Progress.Section
                          value={countProgress(macrosState.data.calories, macroGoals?.calories)}
                          color={getColor(macrosState.data.calories, macroGoals?.calories)}
                        >
                          <Progress.Label>
                            {t('percent', { percent: countProgress(macrosState.data.calories, macroGoals?.calories) })}
                          </Progress.Label>
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td>
                      <Text
                        fw={500}
                        color={proteinsColor}
                      >{`${t('proteinsWithRef', { current: macrosState.data.proteins, goal: macroGoals?.proteins })}`}</Text>

                      <Space h={5} />

                      <Progress.Root size={20} radius="md">
                        <Progress.Section
                          value={countProgress(macrosState.data.proteins, macroGoals?.proteins)}
                          color={getColor(macrosState.data.proteins, macroGoals?.proteins, true)}
                        >
                          <Progress.Label>
                            {t('percent', { percent: countProgress(macrosState.data.proteins, macroGoals?.proteins) })}
                          </Progress.Label>
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td>
                      <Text
                        fw={500}
                        color={fatsColor}
                      >{`${t('fatsWithRef', { current: macrosState.data.fats, goal: macroGoals?.fats })}`}</Text>

                      <Space h={5} />

                      <Progress.Root size={20} radius="md">
                        <Progress.Section
                          value={countProgress(macrosState.data.fats, macroGoals?.fats)}
                          color={getColor(macrosState.data.fats, macroGoals?.fats)}
                        >
                          <Progress.Label>
                            {t('percent', { percent: countProgress(macrosState.data.fats, macroGoals?.fats) })}
                          </Progress.Label>
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Td>
                      <Text
                        fw={500}
                        color={carbsColor}
                      >{`${t('carbsWithRef', { current: macrosState.data.carbs, goal: macroGoals?.carbs })}`}</Text>

                      <Space h={5} />

                      <Progress.Root size={20} radius="md">
                        <Progress.Section
                          value={countProgress(macrosState.data.carbs, macroGoals?.carbs)}
                          color={getColor(macrosState.data.carbs, macroGoals?.carbs)}
                        >
                          <Progress.Label>
                            {t('percent', { percent: countProgress(macrosState.data.carbs, macroGoals?.carbs) })}
                          </Progress.Label>
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Grid.Col>
          </Grid>
        </>
      )}

      <Space h="md" />

      <MealCard title={t('breakfast')} mealType="breakfast" meals={breakfastMeals} />

      <Space h="md" />

      <MealCard title={t('lunch')} mealType="lunch" meals={lunchMeals} />

      <Space h="md" />

      <MealCard title={t('dinner')} mealType="dinner" meals={dinnerMeals} />

      <Space h="md" />

      <MealCard title={t('snack')} mealType="snack" meals={snackMeals} />

      {macrosState.isSuccess && (
        <>
          <Divider my="xl" />

          <Group justify="center">
            <DonutChart size={100} withLabelsLine withLabels data={data} labelsType="percent" />
          </Group>
        </>
      )}
    </Box>
  );
}

function getDaysOfCurrentYear(): dayjs.Dayjs[] {
  const start = dayjs().startOf('year');
  const daysInYear = start.isLeapYear() ? 366 : 365;

  return Array.from({ length: daysInYear }, (_, i) => start.add(i, 'day'));
}

function countProgress(current: number, goal = 0): number {
  if (goal === 0) {
    return 0;
  }

  return Math.round((current / goal) * 100);
}

function getColor(value: number, goal = 0, exceedIsGood = false): string {
  // no meaningful goal ⇒ always gray
  if (goal <= 0) {
    return 'gray';
  }

  const progress = (value / goal) * 100;

  if (progress < 20) {
    return 'gray';
  }
  if (progress < 90) {
    return 'yellow';
  }
  // from 90% up to 110%, always green;
  // if exceedIsGood, any progress ≥90% is considered green
  if (progress < 110 || exceedIsGood) {
    return 'green';
  }
  // otherwise (progress ≥110% and exceedIsGood === false)
  return 'red';
}

export default Meal;
