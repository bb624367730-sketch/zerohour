import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0c0f1a',
          color: '#eae6f0',
          border: '1px solid rgba(212,168,83,0.25)',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#0c0f1a',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: '#0c0f1a',
          },
        },
      }}
    />
  );
}
