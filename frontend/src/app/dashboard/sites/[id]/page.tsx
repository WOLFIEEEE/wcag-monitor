'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Badge,
  Skeleton,
  Alert,
  Table,
  Tabs,
  Accordion,
  Stack,
  Box,
  Code,
  ActionIcon,
  TextInput,
  Select,
  SegmentedControl,
  Menu,
  Tooltip,
  Modal,
  Checkbox,
  ScrollArea,
  Divider,
  CopyButton,
  Paper,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AreaChart } from '@mantine/charts';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconPlayerPlay,
  IconExternalLink,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconSearch,
  IconFilter,
  IconDownload,
  IconSettings,
  IconEdit,
  IconClock,
  IconCode,
  IconKey,
  IconEyeOff,
  IconCopy,
  IconCheck,
  IconGitCompare,
} from '@tabler/icons-react';
import { tasks, Task, Result, TrendData, Issue } from '@/lib/api';

export default function SiteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [trend, setTrend] = useState<TrendData[]>([]);
  const [latestIssues, setLatestIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Compare modal
  const [compareOpened, { open: openCompare, close: closeCompare }] = useDisclosure(false);
  const [compareResults, setCompareResults] = useState<[string, string]>(['', '']);

  // Config modal
  const [configOpened, { open: openConfig, close: closeConfig }] = useDisclosure(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [taskData, resultsData, trendData] = await Promise.all([
        tasks.get(id, true),
        tasks.results(id, true),
        tasks.trend(id),
      ]);
      setTask(taskData);
      setResults(resultsData);
      setTrend(trendData);
      if (resultsData.length > 0 && resultsData[0].results) {
        setLatestIssues(resultsData[0].results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load site');
    } finally {
      setLoading(false);
    }
  }

  async function handleRun() {
    setRunning(true);
    try {
      await tasks.run(id);
      notifications.show({
        title: 'Scan complete',
        message: 'Accessibility scan finished successfully',
        color: 'green',
      });
      loadData();
    } catch (err) {
      notifications.show({
        title: 'Scan failed',
        message: err instanceof Error ? err.message : 'Failed to run scan',
        color: 'red',
      });
    } finally {
      setRunning(false);
    }
  }

  // Filter issues based on search and type
  const filteredIssues = useMemo(() => {
    let filtered = latestIssues;
    
    if (filterType !== 'all') {
      filtered = filtered.filter((issue) => issue.type === filterType);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.message.toLowerCase().includes(query) ||
          issue.code.toLowerCase().includes(query) ||
          issue.selector?.toLowerCase().includes(query) ||
          issue.context?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [latestIssues, filterType, searchQuery]);

  // Export issues to CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Code', 'Message', 'Selector', 'Context'];
    const rows = filteredIssues.map((issue) => [
      issue.type,
      issue.code,
      `"${issue.message.replace(/"/g, '""')}"`,
      `"${(issue.selector || '').replace(/"/g, '""')}"`,
      `"${(issue.context || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task?.name || 'accessibility'}-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Export complete',
      message: `Exported ${filteredIssues.length} issues to CSV`,
      color: 'green',
    });
  };

  // Export full report as JSON
  const exportFullReport = () => {
    const report = {
      site: {
        name: task?.name,
        url: task?.url,
        standard: task?.standard,
      },
      scannedAt: results[0]?.date,
      score: results[0]?.score,
      summary: results[0]?.count,
      issues: filteredIssues,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${task?.name || 'accessibility'}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Export complete',
      message: 'Full report exported as JSON',
      color: 'green',
    });
  };

  // Compare two results
  const getComparisonData = () => {
    const result1 = results.find((r) => r.id === compareResults[0]);
    const result2 = results.find((r) => r.id === compareResults[1]);
    if (!result1 || !result2) return null;

    return {
      result1,
      result2,
      scoreDiff: result2.score - result1.score,
      errorDiff: result2.count.error - result1.count.error,
      warningDiff: result2.count.warning - result1.count.warning,
      noticeDiff: result2.count.notice - result1.count.notice,
    };
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <IconAlertCircle size={16} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <IconAlertTriangle size={16} style={{ color: '#f59e0b' }} />;
      default:
        return <IconInfoCircle size={16} style={{ color: '#2563eb' }} />;
    }
  };

  const issueCounts = useMemo(() => {
    const counts = { error: 0, warning: 0, notice: 0 };
    latestIssues.forEach((issue) => {
      if (issue.type in counts) {
        counts[issue.type as keyof typeof counts]++;
      }
    });
    return counts;
  }, [latestIssues]);

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={200} mb="lg" />
        <Skeleton height={400} />
      </Container>
    );
  }

  if (!task) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Not Found">
          Site not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="md">
        <Button
          component={Link}
          href="/dashboard/sites"
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Sites
        </Button>
        <Group gap="xs">
          <Tooltip label="View Configuration">
            <ActionIcon variant="light" size="lg" onClick={openConfig}>
              <IconSettings size={18} />
            </ActionIcon>
          </Tooltip>
          <Button
            component={Link}
            href={`/dashboard/sites/${id}/edit`}
            variant="light"
            leftSection={<IconEdit size={16} />}
          >
            Edit
          </Button>
        </Group>
      </Group>

      {/* Header */}
      <Card shadow="sm" padding="lg" radius="md" mb="lg" style={{ backgroundColor: '#ffffff' }}>
        <Group justify="space-between" wrap="wrap">
          <Box>
            <Group gap="xs" mb={4}>
              <Title order={3}>{task.name}</Title>
              <ActionIcon
                component="a"
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                size="sm"
              >
                <IconExternalLink size={18} style={{ color: '#94a3b8' }} />
              </ActionIcon>
            </Group>
            <Text size="sm" c="dimmed" mb="sm">
              {task.url}
            </Text>
            <Group gap="xs">
              <Badge color="blue" variant="light">
                {task.standard}
              </Badge>
              {task.timeout && task.timeout !== 30000 && (
                <Badge color="gray" variant="light" size="sm">
                  Timeout: {task.timeout / 1000}s
                </Badge>
              )}
              {task.wait && task.wait > 0 && (
                <Badge color="gray" variant="light" size="sm">
                  Wait: {task.wait}ms
                </Badge>
              )}
              {task.actions && task.actions.length > 0 && (
                <Badge color="violet" variant="light" size="sm">
                  {task.actions.length} actions
                </Badge>
              )}
              {task.ignore && task.ignore.length > 0 && (
                <Badge color="orange" variant="light" size="sm">
                  {task.ignore.length} ignored rules
                </Badge>
              )}
              {task.lastRun && (
                <Text size="xs" c="dimmed">
                  Last scan: {new Date(task.lastRun).toLocaleString()}
                </Text>
              )}
            </Group>
          </Box>
          <Group>
            {task.last_result && (
              <Box ta="center">
                <Text size="xs" c="dimmed" mb={4}>
                  Score
                </Text>
                <Text
                  size="xl"
                  fw={700}
                  c={task.last_result.score >= 80 ? 'green' : 'orange'}
                >
                  {task.last_result.score}
                </Text>
              </Box>
            )}
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              loading={running}
              onClick={handleRun}
            >
              Run Scan
            </Button>
          </Group>
        </Group>
      </Card>

      <Tabs defaultValue="issues">
        <Tabs.List mb="md">
          <Tabs.Tab value="issues">
            Issues ({latestIssues.length})
          </Tabs.Tab>
          <Tabs.Tab value="history">History ({results.length})</Tabs.Tab>
          <Tabs.Tab value="trend">Trend</Tabs.Tab>
          <Tabs.Tab value="config">
            <Group gap={4}>
              <IconSettings size={14} />
              Config
            </Group>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="issues">
          {latestIssues.length === 0 ? (
            <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Box ta="center">
                <Text c="dimmed">
                  No issues found. Run a scan to see results.
                </Text>
              </Box>
            </Card>
          ) : (
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
              {/* Filter Bar */}
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <TextInput
                    placeholder="Search issues..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    style={{ width: 250 }}
                  />
                  <SegmentedControl
                    value={filterType}
                    onChange={setFilterType}
                    data={[
                      { value: 'all', label: `All (${latestIssues.length})` },
                      { value: 'error', label: `Errors (${issueCounts.error})` },
                      { value: 'warning', label: `Warnings (${issueCounts.warning})` },
                      { value: 'notice', label: `Notices (${issueCounts.notice})` },
                    ]}
                    size="xs"
                  />
                </Group>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      variant="light"
                      leftSection={<IconDownload size={16} />}
                      size="sm"
                    >
                      Export
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={exportToCSV}>
                      Export as CSV
                    </Menu.Item>
                    <Menu.Item onClick={exportFullReport}>
                      Export Full Report (JSON)
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>

              {filteredIssues.length === 0 ? (
                <Box ta="center" py="xl">
                  <Text c="dimmed">No issues match your filters</Text>
                  <Button
                    variant="subtle"
                    size="sm"
                    mt="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <>
                  <Accordion variant="separated">
                    {filteredIssues.slice(0, 50).map((issue, index) => (
                      <Accordion.Item key={index} value={`issue-${index}`}>
                        <Accordion.Control icon={getIssueIcon(issue.type)}>
                          <Group gap="xs">
                            <Badge
                              color={
                                issue.type === 'error'
                                  ? 'red'
                                  : issue.type === 'warning'
                                  ? 'yellow'
                                  : 'blue'
                              }
                              size="sm"
                            >
                              {issue.type}
                            </Badge>
                            <Text size="sm" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {issue.message}
                            </Text>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="sm">
                            <Box>
                              <Group justify="space-between" mb={4}>
                                <Text size="xs" fw={500} c="dimmed">
                                  Code
                                </Text>
                                <CopyButton value={issue.code}>
                                  {({ copied, copy }) => (
                                    <ActionIcon
                                      variant="subtle"
                                      size="xs"
                                      onClick={copy}
                                    >
                                      {copied ? (
                                        <IconCheck size={14} />
                                      ) : (
                                        <IconCopy size={14} />
                                      )}
                                    </ActionIcon>
                                  )}
                                </CopyButton>
                              </Group>
                              <Code block>{issue.code}</Code>
                            </Box>
                            {issue.selector && (
                              <Box>
                                <Group justify="space-between" mb={4}>
                                  <Text size="xs" fw={500} c="dimmed">
                                    Selector
                                  </Text>
                                  <CopyButton value={issue.selector}>
                                    {({ copied, copy }) => (
                                      <ActionIcon
                                        variant="subtle"
                                        size="xs"
                                        onClick={copy}
                                      >
                                        {copied ? (
                                          <IconCheck size={14} />
                                        ) : (
                                          <IconCopy size={14} />
                                        )}
                                      </ActionIcon>
                                    )}
                                  </CopyButton>
                                </Group>
                                <Code block style={{ backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: 6 }}>
                                  {issue.selector}
                                </Code>
                              </Box>
                            )}
                            {issue.context && (
                              <Box>
                                <Group justify="space-between" mb={4}>
                                  <Text size="xs" fw={500} c="dimmed">
                                    Context
                                  </Text>
                                  <CopyButton value={issue.context}>
                                    {({ copied, copy }) => (
                                      <ActionIcon
                                        variant="subtle"
                                        size="xs"
                                        onClick={copy}
                                      >
                                        {copied ? (
                                          <IconCheck size={14} />
                                        ) : (
                                          <IconCopy size={14} />
                                        )}
                                      </ActionIcon>
                                    )}
                                  </CopyButton>
                                </Group>
                                <Code block style={{ backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: 6, overflowX: 'auto' }}>
                                  {issue.context}
                                </Code>
                              </Box>
                            )}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                  {filteredIssues.length > 50 && (
                    <Text size="sm" c="dimmed" ta="center" mt="md">
                      Showing 50 of {filteredIssues.length} issues
                    </Text>
                  )}
                </>
              )}
            </Card>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
            {results.length === 0 ? (
              <Box ta="center" py="xl">
                <Text c="dimmed">
                  No scan history yet
                </Text>
              </Box>
            ) : (
              <>
                {results.length >= 2 && (
                  <Group justify="flex-end" mb="md">
                    <Button
                      variant="light"
                      leftSection={<IconGitCompare size={16} />}
                      size="sm"
                      onClick={openCompare}
                    >
                      Compare Results
                    </Button>
                  </Group>
                )}
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Score</Table.Th>
                      <Table.Th>Errors</Table.Th>
                      <Table.Th>Warnings</Table.Th>
                      <Table.Th>Notices</Table.Th>
                      <Table.Th>Total</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {results.map((result, index) => (
                      <Table.Tr key={result.id}>
                        <Table.Td>
                          <Group gap="xs">
                            {index === 0 && (
                              <Badge size="xs" color="green" variant="light">
                                Latest
                              </Badge>
                            )}
                            {new Date(result.date).toLocaleString()}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={result.score >= 80 ? 'green' : 'orange'}
                          >
                            {result.score}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="red" variant="light">
                            {result.count.error}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="yellow" variant="light">
                            {result.count.warning}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="blue" variant="light">
                            {result.count.notice}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {result.count.total}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="trend">
          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
            {trend.length === 0 ? (
              <Box ta="center" py="xl">
                <Text c="dimmed">
                  Not enough data for trends yet
                </Text>
              </Box>
            ) : (
              <>
                <Title order={5} mb="md">
                  Issues Over Time
                </Title>
                <AreaChart
                  h={300}
                  data={trend}
                  dataKey="week"
                  series={[
                    { name: 'errors', color: 'red.6' },
                    { name: 'warnings', color: 'yellow.6' },
                    { name: 'notices', color: 'blue.6' },
                  ]}
                  curveType="natural"
                />
              </>
            )}
          </Card>
        </Tabs.Panel>

        {/* Configuration Tab */}
        <Tabs.Panel value="config">
          <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
            <Group justify="space-between" mb="md">
              <Title order={5}>Site Configuration</Title>
              <Button
                component={Link}
                href={`/dashboard/sites/${id}/edit`}
                variant="light"
                size="sm"
                leftSection={<IconEdit size={14} />}
              >
                Edit Settings
              </Button>
            </Group>

            <Stack gap="md">
              <Paper p="md" withBorder>
                <Group gap="xs" mb="xs">
                  <IconClock size={16} style={{ color: '#64748b' }} />
                  <Text fw={500} size="sm">Timing</Text>
                </Group>
                <Group gap="xl">
                  <Box>
                    <Text size="xs" c="dimmed">Timeout</Text>
                    <Text size="sm">{(task.timeout || 30000) / 1000} seconds</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Wait Time</Text>
                    <Text size="sm">{task.wait || 0} ms</Text>
                  </Box>
                </Group>
              </Paper>

              {(task.username || task.password) && (
                <Paper p="md" withBorder>
                  <Group gap="xs" mb="xs">
                    <IconKey size={16} style={{ color: '#64748b' }} />
                    <Text fw={500} size="sm">HTTP Basic Auth</Text>
                  </Group>
                  <Group gap="xl">
                    <Box>
                      <Text size="xs" c="dimmed">Username</Text>
                      <Text size="sm">{task.username || '-'}</Text>
                    </Box>
                    <Box>
                      <Text size="xs" c="dimmed">Password</Text>
                      <Text size="sm">••••••••</Text>
                    </Box>
                  </Group>
                </Paper>
              )}

              {task.actions && task.actions.length > 0 && (
                <Paper p="md" withBorder>
                  <Group gap="xs" mb="xs">
                    <IconCode size={16} style={{ color: '#64748b' }} />
                    <Text fw={500} size="sm">Actions ({task.actions.length})</Text>
                  </Group>
                  <Stack gap={4}>
                    {task.actions.map((action, i) => (
                      <Code key={i} block style={{ fontSize: 12 }}>
                        {action}
                      </Code>
                    ))}
                  </Stack>
                </Paper>
              )}

              {task.hideElements && (
                <Paper p="md" withBorder>
                  <Group gap="xs" mb="xs">
                    <IconEyeOff size={16} style={{ color: '#64748b' }} />
                    <Text fw={500} size="sm">Hidden Elements</Text>
                  </Group>
                  <Code block>{task.hideElements}</Code>
                </Paper>
              )}

              {task.headers && Object.keys(task.headers).length > 0 && (
                <Paper p="md" withBorder>
                  <Group gap="xs" mb="xs">
                    <IconSettings size={16} style={{ color: '#64748b' }} />
                    <Text fw={500} size="sm">Custom Headers</Text>
                  </Group>
                  <Code block style={{ fontSize: 12 }}>
                    {JSON.stringify(task.headers, null, 2)}
                  </Code>
                </Paper>
              )}

              {task.ignore && task.ignore.length > 0 && (
                <Paper p="md" withBorder>
                  <Group gap="xs" mb="xs">
                    <IconInfoCircle size={16} style={{ color: '#64748b' }} />
                    <Text fw={500} size="sm">Ignored Rules ({task.ignore.length})</Text>
                  </Group>
                  <Group gap="xs">
                    {task.ignore.map((rule, i) => (
                      <Badge key={i} variant="light" color="orange" size="sm">
                        {rule}
                      </Badge>
                    ))}
                  </Group>
                </Paper>
              )}

              {!task.actions?.length && !task.hideElements && !task.headers && !task.ignore?.length && !task.username && (
                <Text c="dimmed" size="sm" ta="center" py="md">
                  No advanced configuration. Using default settings.
                </Text>
              )}
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Compare Results Modal */}
      <Modal
        opened={compareOpened}
        onClose={closeCompare}
        title="Compare Scan Results"
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="First Result (Older)"
            placeholder="Select a scan result"
            data={results.map((r) => ({
              value: r.id,
              label: `${new Date(r.date).toLocaleString()} - Score: ${r.score}`,
            }))}
            value={compareResults[0]}
            onChange={(v) => setCompareResults([v || '', compareResults[1]])}
          />
          <Select
            label="Second Result (Newer)"
            placeholder="Select a scan result"
            data={results.map((r) => ({
              value: r.id,
              label: `${new Date(r.date).toLocaleString()} - Score: ${r.score}`,
            }))}
            value={compareResults[1]}
            onChange={(v) => setCompareResults([compareResults[0], v || ''])}
          />

          {compareResults[0] && compareResults[1] && (() => {
            const comparison = getComparisonData();
            if (!comparison) return null;

            return (
              <Card withBorder p="md" mt="md">
                <Title order={5} mb="md">Comparison</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Metric</Table.Th>
                      <Table.Th>Before</Table.Th>
                      <Table.Th>After</Table.Th>
                      <Table.Th>Change</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>Score</Table.Td>
                      <Table.Td>{comparison.result1.score}</Table.Td>
                      <Table.Td>{comparison.result2.score}</Table.Td>
                      <Table.Td>
                        <Badge color={comparison.scoreDiff >= 0 ? 'green' : 'red'}>
                          {comparison.scoreDiff >= 0 ? '+' : ''}{comparison.scoreDiff}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Errors</Table.Td>
                      <Table.Td>{comparison.result1.count.error}</Table.Td>
                      <Table.Td>{comparison.result2.count.error}</Table.Td>
                      <Table.Td>
                        <Badge color={comparison.errorDiff <= 0 ? 'green' : 'red'}>
                          {comparison.errorDiff >= 0 ? '+' : ''}{comparison.errorDiff}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Warnings</Table.Td>
                      <Table.Td>{comparison.result1.count.warning}</Table.Td>
                      <Table.Td>{comparison.result2.count.warning}</Table.Td>
                      <Table.Td>
                        <Badge color={comparison.warningDiff <= 0 ? 'green' : 'red'}>
                          {comparison.warningDiff >= 0 ? '+' : ''}{comparison.warningDiff}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Notices</Table.Td>
                      <Table.Td>{comparison.result1.count.notice}</Table.Td>
                      <Table.Td>{comparison.result2.count.notice}</Table.Td>
                      <Table.Td>
                        <Badge color={comparison.noticeDiff <= 0 ? 'green' : 'red'}>
                          {comparison.noticeDiff >= 0 ? '+' : ''}{comparison.noticeDiff}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>

                <Alert
                  color={comparison.scoreDiff >= 0 ? 'green' : 'red'}
                  variant="light"
                  mt="md"
                >
                  {comparison.scoreDiff > 0
                    ? `Score improved by ${comparison.scoreDiff} points!`
                    : comparison.scoreDiff < 0
                    ? `Score decreased by ${Math.abs(comparison.scoreDiff)} points.`
                    : 'Score remained the same.'}
                </Alert>
              </Card>
            );
          })()}
        </Stack>
      </Modal>

      {/* Config Modal (Quick View) */}
      <Modal
        opened={configOpened}
        onClose={closeConfig}
        title="Site Configuration"
        size="md"
      >
        <Stack gap="md">
          <Box>
            <Text size="xs" c="dimmed">URL</Text>
            <Text size="sm" fw={500}>{task.url}</Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">Standard</Text>
            <Badge color="blue">{task.standard}</Badge>
          </Box>
          <Divider />
          <Group grow>
            <Box>
              <Text size="xs" c="dimmed">Timeout</Text>
              <Text size="sm">{(task.timeout || 30000) / 1000}s</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Wait</Text>
              <Text size="sm">{task.wait || 0}ms</Text>
            </Box>
          </Group>
          {task.actions && task.actions.length > 0 && (
            <Box>
              <Text size="xs" c="dimmed">Actions</Text>
              <Text size="sm">{task.actions.length} configured</Text>
            </Box>
          )}
          {task.ignore && task.ignore.length > 0 && (
            <Box>
              <Text size="xs" c="dimmed">Ignored Rules</Text>
              <Text size="sm">{task.ignore.length} rules</Text>
            </Box>
          )}
          <Group justify="flex-end" mt="md">
            <Button
              component={Link}
              href={`/dashboard/sites/${id}/edit`}
              leftSection={<IconEdit size={14} />}
            >
              Edit Settings
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
