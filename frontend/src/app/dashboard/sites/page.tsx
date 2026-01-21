'use client';

import { useEffect, useState } from 'react';
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
  Menu,
  ActionIcon,
  Modal,
  Stack,
  Box,
  Progress,
  Checkbox,
  Tooltip,
  TextInput,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconDotsVertical,
  IconPlayerPlay,
  IconTrash,
  IconExternalLink,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconEdit,
  IconDownload,
} from '@tabler/icons-react';
import { tasks, Task } from '@/lib/api';

export default function SitesPage() {
  const [sitesList, setSitesList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [runningAll, setRunningAll] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  // Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      const data = await tasks.list(true);
      setSitesList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  }

  async function handleRun(id: string) {
    setRunningId(id);
    try {
      await tasks.run(id);
      notifications.show({
        title: 'Scan complete',
        message: 'Accessibility scan finished successfully',
        color: 'green',
      });
      loadSites();
    } catch (err) {
      notifications.show({
        title: 'Scan failed',
        message: err instanceof Error ? err.message : 'Failed to run scan',
        color: 'red',
      });
    } finally {
      setRunningId(null);
    }
  }

  async function handleRunAll() {
    const toRun = selectedIds.length > 0 ? selectedIds : sitesList.map((s) => s.id);
    if (toRun.length === 0) return;

    setRunningAll(true);
    setRunProgress(0);

    let completed = 0;
    let failed = 0;

    for (const id of toRun) {
      try {
        await tasks.run(id);
        completed++;
      } catch {
        failed++;
      }
      setRunProgress(((completed + failed) / toRun.length) * 100);
    }

    setRunningAll(false);
    setRunProgress(0);
    setSelectedIds([]);

    notifications.show({
      title: 'Bulk scan complete',
      message: `Successfully scanned ${completed} sites${failed > 0 ? `, ${failed} failed` : ''}`,
      color: failed > 0 ? 'orange' : 'green',
    });

    loadSites();
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await tasks.delete(deleteId);
      notifications.show({
        title: 'Site removed',
        message: 'Site has been removed from monitoring',
        color: 'green',
      });
      setSitesList((prev) => prev.filter((t) => t.id !== deleteId));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
    } catch (err) {
      notifications.show({
        title: 'Delete failed',
        message: err instanceof Error ? err.message : 'Failed to delete site',
        color: 'red',
      });
    } finally {
      closeDelete();
      setDeleteId(null);
    }
  }

  // Export all sites summary
  function exportSitesSummary() {
    const headers = ['Name', 'URL', 'Standard', 'Last Score', 'Errors', 'Warnings', 'Notices', 'Last Run'];
    const rows = sitesList.map((site) => [
      `"${site.name}"`,
      site.url,
      site.standard,
      site.last_result?.score ?? 'N/A',
      site.last_result?.count.error ?? 'N/A',
      site.last_result?.count.warning ?? 'N/A',
      site.last_result?.count.notice ?? 'N/A',
      site.lastRun ? new Date(site.lastRun).toLocaleString() : 'Never',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sites-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    notifications.show({
      title: 'Export complete',
      message: 'Sites summary exported to CSV',
      color: 'green',
    });
  }

  // Filter and sort sites
  const filteredSites = sitesList
    .filter((site) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        site.name.toLowerCase().includes(query) ||
        site.url.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return (b.last_result?.score ?? -1) - (a.last_result?.score ?? -1);
        case 'errors':
          return (b.last_result?.count.error ?? -1) - (a.last_result?.count.error ?? -1);
        case 'lastRun':
          return new Date(b.lastRun || 0).getTime() - new Date(a.lastRun || 0).getTime();
        default:
          return 0;
      }
    });

  const allSelected = filteredSites.length > 0 && selectedIds.length === filteredSites.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredSites.length;

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
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} mb={4}>Sites</Title>
          <Text c="dimmed">Manage your monitored websites</Text>
        </Box>
        <Group gap="sm">
          <Button
            component={Link}
            href="/dashboard/sites/new"
            leftSection={<IconPlus size={16} />}
          >
            Add Site
          </Button>
        </Group>
      </Group>

      {/* Progress bar for bulk operations */}
      {runningAll && (
        <Card shadow="sm" padding="md" radius="md" mb="md" style={{ backgroundColor: '#ffffff' }}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Running scans...</Text>
            <Text size="sm" c="dimmed">{Math.round(runProgress)}%</Text>
          </Group>
          <Progress value={runProgress} animated />
        </Card>
      )}

      {loading ? (
        <Stack gap="md">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} />
          ))}
        </Stack>
      ) : sitesList.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
          <Box ta="center">
            <Text c="dimmed" mb="md">
              You haven&apos;t added any sites yet
            </Text>
            <Button
              component={Link}
              href="/dashboard/sites/new"
              leftSection={<IconPlus size={16} />}
            >
              Add Your First Site
            </Button>
          </Box>
        </Card>
      ) : (
        <>
          {/* Filter and Action Bar */}
          <Card shadow="sm" padding="md" radius="md" mb="md" style={{ backgroundColor: '#ffffff' }}>
            <Group justify="space-between">
              <Group gap="sm">
                <TextInput
                  placeholder="Search sites..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  style={{ width: 250 }}
                />
                <Select
                  placeholder="Sort by"
                  leftSection={<IconFilter size={16} />}
                  value={sortBy}
                  onChange={(v) => setSortBy(v || 'name')}
                  data={[
                    { value: 'name', label: 'Name' },
                    { value: 'score', label: 'Score (High to Low)' },
                    { value: 'errors', label: 'Errors (Most First)' },
                    { value: 'lastRun', label: 'Last Run (Recent)' },
                  ]}
                  style={{ width: 180 }}
                />
              </Group>
              <Group gap="sm">
                <Tooltip label="Export summary to CSV">
                  <ActionIcon
                    variant="light"
                    size="lg"
                    onClick={exportSitesSummary}
                  >
                    <IconDownload size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Refresh list">
                  <ActionIcon
                    variant="light"
                    size="lg"
                    onClick={loadSites}
                    loading={loading}
                  >
                    <IconRefresh size={18} />
                  </ActionIcon>
                </Tooltip>
                <Button
                  variant="light"
                  leftSection={<IconPlayerPlay size={16} />}
                  loading={runningAll}
                  onClick={handleRunAll}
                  disabled={filteredSites.length === 0}
                >
                  {selectedIds.length > 0 
                    ? `Run Selected (${selectedIds.length})`
                    : `Run All (${filteredSites.length})`}
                </Button>
              </Group>
            </Group>
          </Card>

          {/* Select All */}
          {filteredSites.length > 0 && (
            <Group mb="sm" ml="sm">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onChange={() => {
                  if (allSelected) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(filteredSites.map((s) => s.id));
                  }
                }}
                label={
                  <Text size="sm" c="dimmed">
                    {selectedIds.length > 0
                      ? `${selectedIds.length} selected`
                      : 'Select all'}
                  </Text>
                }
              />
            </Group>
          )}

          <Stack gap="md">
            {filteredSites.map((task) => (
              <Card key={task.id} shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="md" style={{ flex: 1 }}>
                    <Checkbox
                      checked={selectedIds.includes(task.id)}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          setSelectedIds([...selectedIds, task.id]);
                        } else {
                          setSelectedIds(selectedIds.filter((id) => id !== task.id));
                        }
                      }}
                    />
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs" mb={4}>
                        <Link
                          href={`/dashboard/sites/${task.id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Text fw={600} c="blue" style={{ transition: 'color 0.2s' }}>
                            {task.name}
                          </Text>
                        </Link>
                        <ActionIcon
                          component="a"
                          href={task.url}
                          target="_blank"
                          variant="subtle"
                          size="sm"
                        >
                          <IconExternalLink size={14} />
                        </ActionIcon>
                      </Group>
                      <Text size="sm" c="dimmed" mb="sm">
                        {task.url}
                      </Text>
                      <Group gap="xs">
                        <Badge color="blue" variant="light" size="sm">
                          {task.standard}
                        </Badge>
                        {task.actions && task.actions.length > 0 && (
                          <Badge color="violet" variant="light" size="sm">
                            {task.actions.length} actions
                          </Badge>
                        )}
                        {task.lastRun && (
                          <Text size="xs" c="dimmed">
                            Last run: {new Date(task.lastRun).toLocaleDateString()}
                          </Text>
                        )}
                      </Group>
                    </Box>
                  </Group>

                  <Group gap="sm" wrap="nowrap">
                    {task.last_result && (
                      <>
                        <Badge
                          color={task.last_result.score >= 80 ? 'green' : 'orange'}
                          size="lg"
                        >
                          Score: {task.last_result.score}
                        </Badge>
                        <Badge
                          color={task.last_result.count.error > 0 ? 'red' : 'green'}
                          variant="light"
                        >
                          {task.last_result.count.error} errors
                        </Badge>
                      </>
                    )}

                    <Button
                      variant="light"
                      size="sm"
                      leftSection={<IconPlayerPlay size={14} />}
                      loading={runningId === task.id || runningAll}
                      onClick={() => handleRun(task.id)}
                    >
                      Run
                    </Button>

                    <Menu shadow="md" width={150}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          component={Link}
                          href={`/dashboard/sites/${task.id}`}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item
                          component={Link}
                          href={`/dashboard/sites/${task.id}/edit`}
                          leftSection={<IconEdit size={14} />}
                        >
                          Edit Settings
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => {
                            setDeleteId(task.id);
                            openDelete();
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>

          {filteredSites.length === 0 && sitesList.length > 0 && (
            <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
              <Box ta="center">
                <Text c="dimmed" mb="md">
                  No sites match your search
                </Text>
                <Button variant="subtle" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </Box>
            </Card>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Site">
        <Text mb="md">
          Are you sure you want to delete this site? This will also remove all
          historical results.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
