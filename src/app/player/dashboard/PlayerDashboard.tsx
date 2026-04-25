import { Container, Title, Text, Stack, Box, ThemeIcon, Group, rem } from '@mantine/core';
import { IconUserCircle, IconUserStar, IconCalendarStats } from '@tabler/icons-react';

export default function PlayerDashboard() {
  return (
    <Container py="xl">
      <Stack gap="xl">
        <Group>
          <ThemeIcon size={rem(40)} variant="light">
            <IconUserCircle size={rem(24)} />
          </ThemeIcon>
          <div>
            <Title order={1}>🏃 Mi Dashboard</Title>
            <Text c="dimmed">Bienvenido, Jugador</Text>
          </div>
        </Group>

        <Box
          p="lg"
          style={{
            border: `${rem(1)} solid #dee2e6`,
            borderRadius: rem(8),
            backgroundColor: '#f8f9fa',
          }}
        >
          <Title order={3} mb="md">
            Tu Información
          </Title>
          <Stack gap="md">
            <Box>
              <Group mb="sm">
                <IconUserStar size={20} />
                <Text fw={500}>Mis Estadísticas</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Consulta tus goles, tarjetas amarillas/rojas, partidos jugados y rendimiento
                general.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <IconCalendarStats size={20} />
                <Text fw={500}>Mi Calendario</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Ve tus próximos partidos, horarios y dónde se juegan. Recibe notificaciones de tus
                encuentros.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <Text fw={500}>🏆 Clasificación</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Consulta la tabla de posiciones de la liga. Busca el Pichichi (máximo goleador) y
                compárate con otros jugadores.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <IconUserCircle size={20} />
                <Text fw={500}>Mi Perfil</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Edita tu información personal: foto, posición preferida, pierna hábil y más datos
                personales.
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box p="lg" style={{ backgroundColor: '#e7f5ff', borderRadius: rem(8) }}>
          <Text size="sm" fw={500}>
            ⚽ ¡Que disfrutes tu experiencia! Consulta tus estadísticas y compite por ser el mejor
            de la liga.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
