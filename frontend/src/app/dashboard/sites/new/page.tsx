'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Tooltip,
  Badge,
  Divider,
  JsonInput,
  TagsInput,
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
} from '@tabler/icons-react';
import { tasks, CreateTaskData } from '@/lib/api';
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

interface FormValues extends CreateTaskData {
  headersJson: string;
  actionsText: string;
  ignoreRules: string[];
}

export default function NewSitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      url: '',
      standard: 'WCAG2AA',
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
      url: (value) => {
        if (!value) return 'URL is required';
        try {
          new URL(value);
          return null;
        } catch {
          return 'Invalid URL format';
        }
      },
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

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
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
        : undefined;

      const taskData: CreateTaskData = {
        name: values.name,
        url: values.url,
        standard: values.standard,
        timeout: values.timeout,
        wait: values.wait,
        ...(values.username && { username: values.username }),
        ...(values.password && { password: values.password }),
        ...(values.hideElements && { hideElements: values.hideElements }),
        ...(headers && Object.keys(headers).length > 0 && { headers }),
        ...(actions && actions.length > 0 && { actions }),
        ...(values.ignoreRules && values.ignoreRules.length > 0 && { ignore: values.ignoreRules }),
      };

      const task = await tasks.create(taskData);
      notifications.show({
        title: 'Site added',
        message: 'Your site has been added to monitoring',
        color: 'green',
      });
      router.push(`/dashboard/sites/${task.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add site';
      if (message.includes('URL limit')) {
        setError(
          'You have reached your URL limit. Upgrade your plan to add more sites.'
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Button
        component={Link}
        href="/dashboard/sites"
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
      >
        Back to Sites
      </Button>

      <Card shadow="sm" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
        <Title order={3} mb="sm">
          Add New Site
        </Title>
        <Text c="dimmed" size="sm" mb="xl">
          Enter the URL you want to monitor for accessibility issues. Configure advanced options for more control over how the scan runs.
        </Text>

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

            <TextInput
              label="URL"
              placeholder="https://example.com"
              description="The URL to scan (must include https://)"
              required
              {...form.getInputProps('url')}
            />

            <Select
              label="Accessibility Standard"
              description="Which standard to test against"
              data={standards}
              {...form.getInputProps('standard')}
            />

            <Divider my="md" />

            {/* Advanced Settings Accordion */}
            <Accordion variant="contained" radius="md">
              {/* Timing Settings */}
              <Accordion.Item value="timing">
                <Accordion.Control icon={<IconClock size={18} />}>
                  <Group gap="xs">
                    <Text fw={500}>Timing Settings</Text>
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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
                    <Badge size="sm" variant="light" color="gray">
                      Optional
                    </Badge>
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

            {/* Schedule Info */}
            <Alert
              icon={<IconInfoCircle size={16} />}
              color="blue"
              variant="light"
            >
              <Text size="sm">
                <strong>Automatic Scheduling:</strong> Sites are automatically scanned on a regular schedule configured by the server. You can also run manual scans anytime from the site details page.
              </Text>
            </Alert>

            <Group justify="flex-end" mt="md">
              <Button
                component={Link}
                href="/dashboard/sites"
                variant="subtle"
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Add Site
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
