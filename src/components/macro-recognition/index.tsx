import React from 'react';
import { useRecognizeMacrosFromImage } from '@/components/foodItem-service-provider';

function MacroRecognition() {
  const { mutate } = useRecognizeMacrosFromImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log('file:', file);

    if (!file) return;

    console.log('Recognizing macros from file:', file.name);

    mutate(file, {
      onSuccess: (foodItem) => {
        console.log('Macros recognized:', foodItem);
      },
      onError: (error) => {
        console.error('Error recognizing macros:', error);
      },
    });
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
}

export default MacroRecognition;
