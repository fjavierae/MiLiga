import { Box, Container, Group, Stack, Text, ThemeIcon, Title, rem } from "@mantine/core";
import { IconBell, IconClipboardList, IconTarget } from "@tabler/icons-react";

interface ManagerDashboardProps {
  readonly pendingRequestsCount: number;
}

export default function ManagerDashboard({ pendingRequestsCount }: ManagerDashboardProps) {
  return (
    <Container py="xl">
      <Stack gap="xl">
        <Group>
          <ThemeIcon size={rem(40)} variant="light">
            <IconClipboardList size={rem(24)} />
          </ThemeIcon>
          <div>
            <Title order={1}>Manager Dashboard</Title>
            <Text c="dimmed">Control center for your team</Text>
          </div>
        </Group>

        <Box
          p="lg"
          style={{
            border: `${rem(1)} solid #dee2e6`,
            borderRadius: rem(8),
            backgroundColor: "#f8f9fa",
          }}
        >
          <Title order={3} mb="md">
            Team Hub
          </Title>
          <Stack gap="md">
            <Box>
              <Group mb="sm">
                <IconBell size={20} />
                <Text fw={500}>Pending Notifications</Text>
              </Group>
              <Text size="sm" c="dimmed">
                You have {pendingRequestsCount} pending player request(s) waiting for review.
              </Text>
            </Box>

            <Box>
              <Group mb="sm">
                <IconTarget size={20} />
                <Text fw={500}>Match Preparation</Text>
              </Group>
              <Text size="sm" c="dimmed">
                Organize your lineup, assign jersey numbers, and prepare your squad for upcoming matches.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
