'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Skeleton,
  Alert,
  SimpleGrid,
  Badge,
  Stack,
  Box,
} from '@mantine/core';
import { AreaChart, BarChart, DonutChart } from '@mantine/charts';
import { tasks, Result, Stats } from '@/lib/api';

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, resultsData] = await Promise.all([
        tasks.stats(),
        tasks.allResults(),
      ]);
      setStats(statsData);
      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }

  // Process data for charts
  const issuesByType = stats
    ? [
        { name: 'Errors', value: stats.totalErrors, color: 'red.6' },
        { name: 'Warnings', value: stats.totalWarnings, color: 'yellow.6' },
        { name: 'Notices', value: stats.totalNotices, color: 'blue.6' },
      ]
    : [];

  // Group results by date for trend
  const trendData = results
    .slice(0, 30)
    .reverse()
    .map((result) => ({
      date: new Date(result.date).toLocaleDateString(),
      errors: result.count.error,
      warnings: result.count.warning,
      score: result.score,
    }));

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="xl">
        Reports
      </Title>

      {/* Overview Stats */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={100} />
            ))}
          </>
        ) : (
          <>
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Text size="sm" c="dimmed" mb={4}>
                Total Sites
              </Text>
              <Text size="xl" fw={700}>
                {stats?.urlCount || 0}
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Text size="sm" c="dimmed" mb={4}>
                Total Errors
              </Text>
              <Text size="xl" fw={700} c="red">
                {stats?.totalErrors || 0}
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Text size="sm" c="dimmed" mb={4}>
                Total Warnings
              </Text>
              <Text size="xl" fw={700} c="yellow">
                {stats?.totalWarnings || 0}
              </Text>
            </Card>
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Text size="sm" c="dimmed" mb={4}>
                Average Score
              </Text>
              <Text
                size="xl"
                fw={700}
                c={(stats?.averageScore || 0) >= 80 ? 'green' : 'orange'}
              >
                {stats?.averageScore || 0}
              </Text>
            </Card>
          </>
        )}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="lg">
        {/* Issues by Type */}
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          <Title order={4} mb="md">
            Issues by Type
          </Title>
          {loading ? (
            <Skeleton height={200} />
          ) : issuesByType.every((i) => i.value === 0) ? (
            <Box ta="center" py="xl">
              <Text c="dimmed" mb="sm">No issues found</Text>
              <Badge color="green">All clear!</Badge>
            </Box>
          ) : (
            <DonutChart
              data={issuesByType}
              h={200}
              withLabels
              withLabelsLine
            />
          )}
        </Card>

        {/* Issues Distribution Bar */}
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          <Title order={4} mb="md">
            Issue Distribution
          </Title>
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <BarChart
              h={200}
              data={[
                {
                  type: 'All Sites',
                  errors: stats?.totalErrors || 0,
                  warnings: stats?.totalWarnings || 0,
                  notices: stats?.totalNotices || 0,
                },
              ]}
              dataKey="type"
              series={[
                { name: 'errors', color: 'red.6' },
                { name: 'warnings', color: 'yellow.6' },
                { name: 'notices', color: 'blue.6' },
              ]}
            />
          )}
        </Card>
      </SimpleGrid>

      {/* Trend Over Time */}
      <Card shadow="sm" padding="lg" radius="md" mb="lg" style={{ backgroundColor: '#ffffff' }}>
        <Title order={4} mb="md">
          Issues Over Time
        </Title>
        {loading ? (
          <Skeleton height={300} />
        ) : trendData.length === 0 ? (
          <Box ta="center" py="xl">
            <Text c="dimmed">
              No scan history yet. Run some scans to see trends.
            </Text>
          </Box>
        ) : (
          <AreaChart
            h={300}
            data={trendData}
            dataKey="date"
            series={[
              { name: 'errors', color: 'red.6' },
              { name: 'warnings', color: 'yellow.6' },
            ]}
            curveType="natural"
          />
        )}
      </Card>

      {/* Score Trend */}
      {trendData.length > 0 && (
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
          <Title order={4} mb="md">
            Score Trend
          </Title>
          <AreaChart
            h={200}
            data={trendData}
            dataKey="date"
            series={[{ name: 'score', color: 'green.6' }]}
            curveType="natural"
          />
        </Card>
      )}
    </Container>
  );
}
