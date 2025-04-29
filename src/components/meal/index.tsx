import { useState } from 'react';
import { Box, Text, Stack, Button, Space, Loader, Grid, Divider, Table } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { DonutChart } from '@mantine/charts';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import { useGetMacrosByDate, useGetMealsByDate } from '@/components/meal-service-provider';
import MealCard from '@/components/meal-card';
import { useTranslation } from 'react-i18next';

dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);

const days = getDaysOfCurrentYear();

function Meal() {
  const { t } = useTranslation();

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

      <Space h="md" />

      <MealCard title={t('breakfast')} mealType="breakfast" meals={breakfastMeals} />

      <Space h="md" />

      <MealCard title={t('lunch')} mealType="lunch" meals={lunchMeals} />

      <Space h="md" />

      <MealCard title={t('dinner')} mealType="dinner" meals={dinnerMeals} />

      <Space h="md" />

      <MealCard title={t('snack')} mealType="snack" meals={snackMeals} />

      {macrosState.isLoading && <Loader color="blue" />}

      {macrosState.isError && (
        <Text color="red" size="sm">
          {t('errorLoadingMacros')}
        </Text>
      )}

      {macrosState.isSuccess && (
        <>
          <Divider my="xl" />

          <Grid>
            <Grid.Col span={6}>
              <Stack>
                <Text size="md" fw={500}>
                  {t('totalPerDay')}
                </Text>

                <Table variant="vertical" layout="fixed" withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>{t('calories')}</Table.Th>
                      <Table.Td>{macrosState.data.calories}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th c={proteinsColor}>{t('protein')}</Table.Th>
                      <Table.Td>
                        {macrosState.data.proteins} {t('grams')}
                      </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th c={fatsColor}>{t('fat')}</Table.Th>
                      <Table.Td>
                        {macrosState.data.fats} {t('grams')}
                      </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Th c={carbsColor}>{t('carbs')}</Table.Th>
                      <Table.Td>
                        {macrosState.data.carbs} {t('grams')}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <DonutChart size={100} withLabelsLine withLabels data={data} labelsType="percent" />
            </Grid.Col>
          </Grid>
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

export default Meal;
