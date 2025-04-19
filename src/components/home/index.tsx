import { Box, TextInput } from '@mantine/core';

function Home() {
  return (
    <Box p="md">
      <TextInput
        label="Описание блюда"
        placeholder="Введите описание блюда"
        value=""
        onChange={(e) => console.log(e.currentTarget.value)}
        required
      />

      <TextInput
        label="Название блюда"
        placeholder="Введите название блюда"
        value=""
        onChange={(e) => console.log(e.currentTarget.value)}
        required
      />
    </Box>
  );
}

export default Home;
