import { Box, TextInput, Button, Textarea } from '@mantine/core';
import { useForm, hasLength, isEmail } from '@mantine/form';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  const form = useForm({
    mode: 'controlled',
    initialValues: { name: '', email: '' },
    validate: {
      name: hasLength({ min: 3 }, 'Must be at least 3 characters'),
      email: isEmail('Invalid email'),
    },
  });

  function handleSubmit(values: { name: string; email: string }) {
    console.log('values:', values);
  }

  return (
    <Box p="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea label={t('foodItemLabel')} placeholder={t('foodItemPlaceholder')} autosize minRows={10} />

        <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" />

        <TextInput {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" />

        <Button type="submit" mt="md">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default Home;
