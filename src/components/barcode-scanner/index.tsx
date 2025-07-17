import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Box, Alert, useMantineTheme } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type ScannerStatus = 'idle' | 'scanning' | 'error';

export const BarcodeScanner = ({ onResult }: { onResult: (result: string) => void }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theme = useMantineTheme();
  const [status, setStatus] = useState<ScannerStatus>('idle');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stop: () => void;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (result) {
          const code = result.getText();

          onResult(code);
        }
      })
      .then((controller) => {
        stop = () => controller.stop();

        setStatus('scanning');
      })
      .catch(() => {
        setStatus('error');
      });

    return () => stop?.();
  }, [onResult]);

  return (
    <Box pos="relative" w="100%" maw={400} mx="auto">
      <video ref={videoRef} style={{ width: '100%' }} />

      {status === 'scanning' && (
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          w="80%"
          h="60%"
          style={{
            transform: 'translate(-50%, -50%)',
            border: `2px dashed ${theme.colors.gray[3]}`,
            borderRadius: 8,
            pointerEvents: 'none',
          }}
        />
      )}

      {status === 'error' && (
        <Alert icon={<IconAlertTriangle size={16} />} title={t('scanner')} color="red" mt="md" radius="md">
          {t('unableToAccessCamera')}
        </Alert>
      )}
    </Box>
  );
};
