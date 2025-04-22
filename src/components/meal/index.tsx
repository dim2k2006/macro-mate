import { useState } from 'react';
import { Box, Text, Stack, Button, Space, Loader } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
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

  const macrosState = useGetMacrosByDate(activeDay.format('YYYY-MM-DD'));

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

      <MealCard title={t('breakfast')} mealType="breakfast" meals={meals} />

      {macrosState.isLoading && <Loader color="blue" />}

      {macrosState.isError && (
        <Text color="red" size="sm">
          {t('errorLoadingMacros')}
        </Text>
      )}

      {macrosState.isSuccess && (
        <>
          <Stack>
            <Text size="sm" fw={500}>
              {t('mealMacros')}
            </Text>

            <Text size="sm">
              {t('calories')}: {macrosState.data.calories}
            </Text>

            <Text size="sm">
              {t('protein')}: {macrosState.data.proteins}
            </Text>

            <Text size="sm">
              {t('carbs')}: {macrosState.data.carbs}
            </Text>

            <Text size="sm">
              {t('fat')}: {macrosState.data.fats}
            </Text>
          </Stack>
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
