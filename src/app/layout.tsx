import '@mantine/core/styles.css'; // Los estilos se importan aquí
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  /* Tu configuración de tema aquí */
});

export const metadata = {
  title: 'MiLiga',
  description: 'Gestión de ligas',
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}