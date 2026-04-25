import { Container, Title, Text, Stack, Box, ThemeIcon, Group, rem } from '@mantine/core';
import { IconShield, IconGauge, IconClipboard } from '@tabler/icons-react';

export default function AdminDashboard() {
  return (
    <Container py="xl">
      <Stack gap="xl">
        <Group>
          <ThemeIcon size={rem(40)} variant="light">
            <IconShield size={rem(24)} />
          </ThemeIcon>
          <div>
            <Title order={1}>🛡️ Admin Panel</Title>
            <Text c="dimmed">Hello, Commissioner</Text>
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
            Your Dashboard
          </Title>
          <Stack gap="md">
            <Box>
              <Group mb="sm">
                <IconGauge size={20} />
                <Text fw={500}>Global Statistics</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Monitor the overall health of the league, number of teams, upcoming matches and
                pending alerts.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <IconClipboard size={20} />
                <Text fw={500}>Season Management</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Create, edit, and delete leagues and seasons. Configure the rules and parameters of the
                competition.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <IconShield size={20} />
                <Text fw={500}>System Audit</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Review the logs of critical changes. Who modified results, when, and why.
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box p="lg" style={{ backgroundColor: '#fff3bf', borderRadius: rem(8) }}>
          <Text size="sm" fw={500}>
            📌 Remember: You have total control over the integrity of the league. Use this power with
            responsibility.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
