import { useState } from 'react';
import { useRecognizeMacrosFromImage } from '@/components/foodItem-service-provider';
import { IconCameraAi, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Modal, Button, SimpleGrid, Text, Image, Space } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { useNavigate } from 'react-router-dom';

function MacroRecognition() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { mutate, isPending, isError } = useRecognizeMacrosFromImage();

  const [opened, { open, close }] = useDisclosure(false);

  const [files, setFiles] = useState<FileWithPath[]>([]);

  function handleDrop(acceptedFiles: FileWithPath[]) {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);

    const handleRemove = () => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(imageUrl);
    };

    // return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    return (
      <div key={index} style={{ position: 'relative' }}>
        <Image src={imageUrl} radius="md" />
        <ActionIcon
          variant="light"
          color="red"
          size="sm"
          onClick={handleRemove}
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'white',
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </div>
    );
  });

  const handleFileChange = async () => {
    mutate(files, {
      onSuccess: (foodItem) => {
        close();
        setFiles([]);
        navigate(
          `/produced-food?description=${foodItem.description}&name=${foodItem.name}&calories=${foodItem.calories}&proteins=${foodItem.proteins}&fats=${foodItem.fats}&carbs=${foodItem.carbs}`,
        ); // Redirect to produced food page with query params
      },
      onError: (error) => {
        console.error('Error recognizing macros:', error);
      },
    });
  };

  return (
    <>
      <ActionIcon variant="default" size="lg" onClick={open}>
        <IconCameraAi size={20} />
      </ActionIcon>

      <Modal opened={opened} onClose={close} title={t('aiProductRecognition')} size="lg" centered>
        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleDrop}>
          <Text ta="center">{t('attachProductImages')}</Text>
        </Dropzone>

        <Space h="md" />

        <SimpleGrid cols={3}>{previews}</SimpleGrid>

        <Space h="md" />

        <Button variant="outline" onClick={handleFileChange} disabled={files.length === 0} loading={isPending}>
          {t('recognizeProduct')}
        </Button>

        {isError && (
          <>
            <Space h="md" />

            <Text c="red" size="sm" mt="md">
              {t('recognizeProductError')}
            </Text>
          </>
        )}
      </Modal>
    </>
  );
}

export default MacroRecognition;
