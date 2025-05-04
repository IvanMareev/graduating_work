// app/layout.tsx
"use client";
import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
    </ThemeProvider>
  );
}
