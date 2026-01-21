'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Card,
  TextInput,
  Select,
  Button,
  Alert,
  Group,
  Stack,
  Accordion,
  NumberInput,
  Textarea,
  PasswordInput,
  Badge,
  Divider,
  JsonInput,
  TagsInput,
  Skeleton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconSettings,
  IconClock,
  IconKey,
  IconCode,
  IconEyeOff,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';
import { tasks, Task, CreateTaskData } from '@/lib/api';
import Link from 'next/link';

const standards = [
  { value: 'WCAG2AA', label: 'WCAG 2.1 Level AA (Recommended)' },
  { value: 'WCAG2A', label: 'WCAG 2.1 Level A' },
  { value: 'WCAG2AAA', label: 'WCAG 2.1 Level AAA' },
  { value: 'Section508', label: 'Section 508' },
];

const actionExamples = [
  'click element #submit-button',
  'set field #username to testuser',
  'set field #password to testpass',
  'check field #remember-me',
  'uncheck field #newsletter',
  'screen capture screenshots/before.png',
  'wait for element #content to be visible',
  'wait for url to be https://example.com/dashboard',
  'navigate to https://example.com/login',
];

interface FormValues {
  name: string;
  timeout: number;
  wait: number;
  username: string;
  password: string;
  hideElements: string;
  headersJson: string;
  actionsText: string;
  ignoreRules: string[];
}

export default function EditSitePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      timeout: 30000,
      wait: 0,
      username: '',
      password: '',
      hideElements: '',
      headersJson: '{}',
      actionsText: '',
      ignoreRules: [],
    },
    validate: {
      name: (value) => (!value ? 'Name is required' : null),
      headersJson: (value) => {
        if (!value || value === '{}') return null;
        try {
          JSON.parse(value);
          return null;
        } catch {
          return 'Invalid JSON format';
        }
      },
    },
  });

  useEffect(() => {
    loadTask();
  }, [id]);

  async function loadTask() {
    try {
      const taskData = await tasks.get(id);
      setTask(taskData);
      
      // Populate form with existing values
      form.setValues({
        name: taskData.name,
        timeout: taskData.timeout || 30000,
        wait: taskData.wait || 0,
        username: taskData.username || '',
        password: taskData.password || '',
        hideElements: taskData.hideElements || '',
        headersJson: taskData.headers ? JSON.stringify(taskData.headers, null, 2) : '{}',
        actionsText: taskData.actions?.join('\n') || '',
        ignoreRules: taskData.ignore || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load site');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    setError(null);

    try {
      // Parse headers
      let headers: Record<string, string> | undefined;
      if (values.headersJson && values.headersJson !== '{}') {
        try {
          headers = JSON.parse(values.headersJson);
        } catch {
          // Ignore invalid JSON
        }
      }

      // Parse actions
      const actions = values.actionsText
        ? values.actionsText.split('\n').filter((a) => a.trim())
        : [];

      const updateData: Partial<CreateTaskData> = {
        name: values.name,
        timeout: values.timeout,
        wait: values.wait,
        username: values.username || undefined,
        password: values.password || undefined,
        hideElements: values.hideElements || undefined,
        headers: headers && Object.keys(headers).length > 0 ? headers : undefined,
        actions: actions.length > 0 ? actions : [],
        ignore: values.ignoreRules.length > 0 ? values.ignoreRules : [],
      };

      await tasks.update(id, updateData);
      notifications.show({
        title: 'Site updated',
        message: 'Your site settings have been saved',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      router.push(`/dashboard/sites/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update site';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Skeleton height={40} mb="md" />
        <Skeleton height={400} />
      </Container>
    );
  }

  if (!task) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Not Found">
          Site not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Button
        component={Link}
        href={`/dashboard/sites/${id}`}
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
      >
        Back to Site
      </Button>

      <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
        <Title order={3} mb="sm">
          Edit Site Settings
        </Title>
        <Text c="dimmed" size="sm" mb="xs">
          {task.url}
        </Text>
        <Badge color="blue" variant="light" mb="xl">
          {task.standard}
        </Badge>

        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            mb="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Basic Settings */}
            <TextInput
              label="Site Name"
              placeholder="My Website"
              description="A friendly name to identify this site"
              required
              {...form.getInputProps('name')}
            />

            <Alert variant="light" color="gray" p="sm">
              <Text size="sm" c="dimmed">
                <strong>URL:</strong> {task.url}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Standard:</strong> {task.standard}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                URL and Standard cannot be changed after creation. Delete and recreate the site if you need to change these.
              </Text>
            </Alert>

            <Divider my="md" />

            {/* Advanced Settings Accordion */}
            <Accordion variant="contained" radius="md" defaultValue="timing">
              {/* Timing Settings */}
              <Accordion.Item value="timing">
                <Accordion.Control icon={<IconClock size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Timing Settings</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <NumberInput
                      label="Timeout (ms)"
                      description="Maximum time to wait for the page to load"
                      placeholder="30000"
                      min={1000}
                      max={300000}
                      step={1000}
                      {...form.getInputProps('timeout')}
                    />
                    <NumberInput
                      label="Wait Time (ms)"
                      description="Time to wait after page load before running tests (useful for JS-heavy pages)"
                      placeholder="0"
                      min={0}
                      max={60000}
                      step={100}
                      {...form.getInputProps('wait')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Authentication */}
              <Accordion.Item value="auth">
                <Accordion.Control icon={<IconKey size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>HTTP Basic Authentication</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      Enter credentials for pages protected with HTTP Basic Auth
                    </Text>
                    <TextInput
                      label="Username"
                      placeholder="username"
                      {...form.getInputProps('username')}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="password"
                      {...form.getInputProps('password')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Actions */}
              <Accordion.Item value="actions">
                <Accordion.Control icon={<IconCode size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Actions (Pre-test Automation)</Text>
                    {task.actions && task.actions.length > 0 && (
                      <Badge size="sm" color="blue">
                        {task.actions.length} configured
                      </Badge>
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      Actions to perform before testing (e.g., logging in, clicking buttons).
                      Enter one action per line.
                    </Text>
                    <Textarea
                      label="Actions"
                      placeholder={actionExamples.slice(0, 3).join('\n')}
                      description="One action per line"
                      minRows={4}
                      autosize
                      {...form.getInputProps('actionsText')}
                    />
                    <Accordion variant="subtle" chevronPosition="left">
                      <Accordion.Item value="examples">
                        <Accordion.Control>
                          <Text size="sm" c="blue">View action examples</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap={4}>
                            {actionExamples.map((example, i) => (
                              <Text key={i} size="xs" c="dimmed" ff="monospace">
                                {example}
                              </Text>
                            ))}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Hide Elements */}
              <Accordion.Item value="hide">
                <Accordion.Control icon={<IconEyeOff size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Hide Elements</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      CSS selector for elements to hide during testing. Useful for hiding
                      dynamic content like ads or chat widgets that may cause false positives.
                    </Text>
                    <TextInput
                      label="CSS Selector"
                      placeholder=".ad-banner, #chat-widget, .cookie-notice"
                      {...form.getInputProps('hideElements')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Custom Headers */}
              <Accordion.Item value="headers">
                <Accordion.Control icon={<IconSettings size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Custom HTTP Headers</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      Custom headers to send with the request (JSON format).
                      Useful for API tokens or custom authentication.
                    </Text>
                    <JsonInput
                      label="Headers (JSON)"
                      placeholder='{"Authorization": "Bearer token123", "X-Custom-Header": "value"}'
                      formatOnBlur
                      autosize
                      minRows={3}
                      {...form.getInputProps('headersJson')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Ignore Rules */}
              <Accordion.Item value="ignore">
                <Accordion.Control icon={<IconInfoCircle size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Ignore Rules</Text>
                    {task.ignore && task.ignore.length > 0 && (
                      <Badge size="sm" color="orange">
                        {task.ignore.length} ignored
                      </Badge>
                    )}
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      Accessibility rule codes to ignore during testing. Press Enter after each code.
                    </Text>
                    <TagsInput
                      label="Rules to Ignore"
                      placeholder="WCAG2AA.Principle1.Guideline1_1.1_1_1.H37"
                      description="Enter rule codes to exclude from results"
                      {...form.getInputProps('ignoreRules')}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Group justify="flex-end" mt="md">
              <Button
                component={Link}
                href={`/dashboard/sites/${id}`}
                variant="subtle"
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
