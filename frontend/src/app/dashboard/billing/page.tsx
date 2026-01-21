'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Button,
  Group,
  Badge,
  Skeleton,
  Alert,
  NumberInput,
  Divider,
  Stack,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconExternalLink, IconAlertCircle } from '@tabler/icons-react';
import { billing, UsageInfo } from '@/lib/api';

export default function BillingPage() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    loadUsage();
  }, []);

  async function loadUsage() {
    try {
      const data = await billing.usage();
      setUsage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing info');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const { url } = await billing.checkout(quantity);
      window.location.href = url;
    } catch (err) {
      notifications.show({
        title: 'Checkout failed',
        message: err instanceof Error ? err.message : 'Failed to start checkout',
        color: 'red',
      });
      setCheckoutLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const { url } = await billing.portal();
      window.location.href = url;
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to open billing portal',
        color: 'red',
      });
      setPortalLoading(false);
    }
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">
        Billing
      </Title>

      {/* Current Plan */}
      <Card shadow="sm" padding="lg" radius="md" mb="md" style={{ backgroundColor: '#ffffff' }}>
        <Group justify="space-between" mb="md">
          <Box>
            <Text size="sm" c="dimmed" mb={4}>
              Current Plan
            </Text>
            {loading ? (
              <Skeleton height={32} width={100} />
            ) : (
              <Group gap="xs">
                <Text size="xl" fw={700}>
                  {usage?.plan === 'pro' ? 'Pro' : 'Free'}
                </Text>
                <Badge color={usage?.plan === 'pro' ? 'blue' : 'gray'}>
                  {usage?.plan === 'pro' ? 'Active' : 'Basic'}
                </Badge>
              </Group>
            )}
          </Box>
          {usage?.subscription && (
            <Button
              variant="subtle"
              rightSection={<IconExternalLink size={14} />}
              loading={portalLoading}
              onClick={handlePortal}
            >
              Manage Subscription
            </Button>
          )}
        </Group>

        {loading ? (
          <Skeleton height={60} />
        ) : (
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                Free URLs
              </Text>
              <Text fw={600}>{usage?.freeUrls || 2}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                Paid URLs
              </Text>
              <Text fw={600}>{usage?.paidUrls || 0}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                Total Limit
              </Text>
              <Text fw={600}>{usage?.totalLimit || 2}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                Currently Used
              </Text>
              <Text fw={600}>{usage?.currentUsage || 0}</Text>
            </Box>
          </SimpleGrid>
        )}

        {usage?.subscription && (
          <Box mt="md" pt="md" style={{ borderTop: '1px solid #e2e8f0' }}>
            <Text size="sm" c="dimmed">
              Next billing date:{' '}
              {new Date(usage.subscription.currentPeriodEnd).toLocaleDateString()}
            </Text>
          </Box>
        )}
      </Card>

      {/* Add More URLs */}
      <Card shadow="sm" padding="lg" radius="md" mb="md" style={{ backgroundColor: '#ffffff' }}>
        <Title order={4} mb="sm">
          Add More URLs
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Each additional URL costs ${usage?.pricePerUrl || 9}/month and includes{' '}
          {usage?.pagesPerUrl || 100} pages with daily scans.
        </Text>

        <Alert
          icon={<IconAlertCircle size={16} />}
          color="blue"
          variant="light"
          mb="md"
        >
          You currently have <strong>{usage?.remaining || 0}</strong> URL slots
          remaining.
        </Alert>

        <Divider my="md" />

        <Group align="flex-end" wrap="nowrap" gap="md">
          <NumberInput
            label="Number of URLs to add"
            value={quantity}
            onChange={(val) => setQuantity(Number(val) || 1)}
            min={1}
            max={100}
            style={{ flex: 1 }}
          />
          <Box>
            <Text size="sm" c="dimmed" mb={4}>
              Monthly cost
            </Text>
            <Text size="xl" fw={700}>
              ${(usage?.pricePerUrl || 9) * quantity}
            </Text>
          </Box>
        </Group>

        <Button
          fullWidth
          size="md"
          mt="md"
          leftSection={<IconPlus size={16} />}
          loading={checkoutLoading}
          onClick={handleCheckout}
        >
          Add {quantity} URL{quantity > 1 ? 's' : ''} — ${(usage?.pricePerUrl || 9) * quantity}/month
        </Button>
      </Card>

      {/* Pricing Info */}
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#f8fafc' }}>
        <Title order={5} mb="md">
          Pricing
        </Title>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">Free tier</Text>
            <Text size="sm" fw={500}>
              2 URLs included
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Additional URLs</Text>
            <Text size="sm" fw={500}>
              ${usage?.pricePerUrl || 9}/month each
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Pages per URL</Text>
            <Text size="sm" fw={500}>
              {usage?.pagesPerUrl || 100} pages
            </Text>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
