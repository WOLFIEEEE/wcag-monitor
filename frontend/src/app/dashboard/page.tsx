'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Button,
  Badge,
  Skeleton,
  Alert,
  Progress,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconWorld,
  IconAlertTriangle,
  IconChartLine,
  IconPlus,
  IconArrowRight,
} from '@tabler/icons-react';
import { tasks, Stats, Task } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, tasksData] = await Promise.all([
          tasks.stats(),
          tasks.list(true),
        ]);
        setStats(statsData);
        setRecentTasks(tasksData.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error loading dashboard">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} mb={4}>Dashboard</Title>
          <Text c="dimmed">
            Welcome back, {user?.name || user?.email.split('@')[0]}!
          </Text>
        </Box>
        <Button
          component={Link}
          href="/dashboard/sites/new"
          leftSection={<IconPlus size={16} />}
        >
          Add Site
        </Button>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Sites Monitored
                </Text>
                <IconWorld size={20} style={{ color: '#2563eb' }} />
              </Group>
              <Text size="xl" fw={700}>
                {stats?.urlCount || 0}
              </Text>
              <Text size="xs" c="dimmed">
                of {stats?.urlLimit || 2} available
              </Text>
              <Progress
                value={((stats?.urlCount || 0) / (stats?.urlLimit || 2)) * 100}
                size="xs"
                color="blue"
              />
            </Stack>
          )}
        </Card>

        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Total Issues
                </Text>
                <IconAlertTriangle size={20} style={{ color: '#f59e0b' }} />
              </Group>
              <Text size="xl" fw={700}>
                {(stats?.totalErrors || 0) +
                  (stats?.totalWarnings || 0) +
                  (stats?.totalNotices || 0)}
              </Text>
              <Group gap="xs" mt="xs">
                <Badge color="red" size="sm">
                  {stats?.totalErrors || 0} errors
                </Badge>
                <Badge color="yellow" size="sm">
                  {stats?.totalWarnings || 0} warnings
                </Badge>
              </Group>
            </Stack>
          )}
        </Card>

        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Average Score
                </Text>
                <IconChartLine size={20} style={{ color: '#10b981' }} />
              </Group>
              <Text
                size="xl"
                fw={700}
                c={(stats?.averageScore || 0) >= 80 ? 'green' : 'orange'}
              >
                {stats?.averageScore || 0}
              </Text>
              <Text size="xs" c="dimmed">
                out of 100
              </Text>
            </Stack>
          )}
        </Card>

        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Plan
                </Text>
                <Badge
                  color={stats?.plan === 'pro' ? 'blue' : 'gray'}
                  variant="light"
                >
                  {stats?.plan === 'pro' ? 'Pro' : 'Free'}
                </Badge>
              </Group>
              <Text size="xl" fw={700}>
                {stats?.urlsRemaining || 0}
              </Text>
              <Text size="xs" c="dimmed">
                URLs remaining
              </Text>
            </Stack>
          )}
        </Card>
      </SimpleGrid>

      {/* Recent Sites */}
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
        <Group justify="space-between" mb="md">
          <Title order={4}>Recent Sites</Title>
          <Button
            component={Link}
            href="/dashboard/sites"
            variant="subtle"
            rightSection={<IconArrowRight size={14} />}
          >
            View All
          </Button>
        </Group>

        {loading ? (
          <Stack gap="md">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={60} />
            ))}
          </Stack>
        ) : recentTasks.length === 0 ? (
          <Box ta="center" py="xl">
            <Text c="dimmed" mb="md">
              No sites monitored yet
            </Text>
            <Button
              component={Link}
              href="/dashboard/sites/new"
              leftSection={<IconPlus size={16} />}
            >
              Add Your First Site
            </Button>
          </Box>
        ) : (
          <Stack gap="md">
            {recentTasks.map((task) => (
              <Link
                key={task.id}
                href={`/dashboard/sites/${task.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500} mb={4}>{task.name}</Text>
                      <Text size="xs" c="dimmed">
                        {task.url}
                      </Text>
                    </Box>
                    <Group gap="xs">
                      {task.last_result ? (
                        <>
                          <Badge
                            color={
                              task.last_result.score >= 80 ? 'green' : 'orange'
                            }
                            variant="light"
                          >
                            Score: {task.last_result.score}
                          </Badge>
                          <Badge
                            color={
                              task.last_result.count.error > 0 ? 'red' : 'green'
                            }
                            variant="light"
                          >
                            {task.last_result.count.error} errors
                          </Badge>
                        </>
                      ) : (
                        <Badge color="gray" variant="light">
                          No results
                        </Badge>
                      )}
                    </Group>
                  </Group>
                </Card>
              </Link>
            ))}
          </Stack>
        )}
      </Card>
    </Container>
  );
}
