'use client';

import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/lib/auth';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';

// Custom brand color - clean blue
const brand: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
];

const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 6,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
  },
  colors: {
    brand,
  },
  white: '#ffffff',
  black: '#0f172a',
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  respectReducedMotion: true,
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderColor: '#e2e8f0',
          '&:focus': {
            borderColor: '#2563eb',
          },
        },
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderColor: '#e2e8f0',
          '&:focus': {
            borderColor: '#2563eb',
          },
        },
      },
    },
    Card: {
      styles: {
        root: {
          border: '1px solid #e2e8f0',
        },
      },
    },
    Badge: {
      styles: {
        root: {
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
    Anchor: {
      defaultProps: {
        underline: 'hover',
      },
    },
    NavLink: {
      styles: {
        root: {
          borderRadius: '0.5rem',
          fontWeight: 500,
        },
      },
    },
  },
  other: {
    headerHeight: 64,
    sidebarWidth: 260,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={9999} />
      <AuthProvider>
        {children}
      </AuthProvider>
    </MantineProvider>
  );
}
