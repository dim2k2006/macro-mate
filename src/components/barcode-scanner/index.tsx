import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export const BarcodeScanner = ({ onResult }: { onResult: (result: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stop: () => void;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, error) => {
        if (result) {
          onResult(result.getText());
        }
      })
      .then((controller) => {
        stop = () => controller.stop();
      })
      .catch((err) => {
        console.error('Error starting scanner:', err);
      });

    return () => {
      stop?.();
    };
  }, [onResult]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
    </div>
  );
};
