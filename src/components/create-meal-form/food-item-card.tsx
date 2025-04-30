import { Button, Text, Grid } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function FoodItemCard({ id, name, date, onSelect }: FoodItemCardProps) {
  const { t } = useTranslation();

  return (
    <Grid>
      <Grid.Col span={8}>
        <Text size="sm" fw={500}>
          {name}
        </Text>

        <Text size="xs">{date}</Text>
      </Grid.Col>

      <Grid.Col span={4}>
        <Button size="compact-xs" variant="outline" onClick={() => onSelect(id)}>
          {t('select')}
        </Button>
      </Grid.Col>
    </Grid>
  );
}

type FoodItemCardProps = {
  id: string;
  name: string;
  date: string;
  onSelect: (id: string) => void;
};

export default FoodItemCard;
