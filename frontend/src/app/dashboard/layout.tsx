'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppShell,
  NavLink,
  Group,
  Text,
  Avatar,
  Menu,
  UnstyledButton,
  Loader,
  Center,
  Box,
  Stack,
} from '@mantine/core';
import {
  IconDashboard,
  IconWorld,
  IconChartLine,
  IconSettings,
  IconCreditCard,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react';
import { useAuth } from '@/lib/auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: IconDashboard },
  { label: 'Sites', href: '/dashboard/sites', icon: IconWorld },
  { label: 'Reports', href: '/dashboard/reports', icon: IconChartLine },
  { label: 'Settings', href: '/dashboard/settings', icon: IconSettings },
  { label: 'Billing', href: '/dashboard/billing', icon: IconCreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 260, breakpoint: 'sm' }}
      padding="md"
      styles={{
        main: {
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
        },
      }}
    >
      <AppShell.Header
        style={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <Box
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Text c="white" fw={700} size="sm">W</Text>
            </Box>
            <Text fw={700} size="lg" c="dark" visibleFrom="sm">
              WCAG Monitor
            </Text>
          </Link>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 8,
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar size="sm" radius="xl" color="blue">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </Avatar>
                <Box visibleFrom="sm">
                  <Text size="sm" fw={500}>
                    {user.name || user.email.split('@')[0]}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </Text>
                </Box>
                <IconChevronDown size={14} style={{ color: '#64748b' }} />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                component={Link}
                href="/dashboard/settings"
                leftSection={<IconSettings size={14} />}
              >
                Settings
              </Menu.Item>
              <Menu.Item
                component={Link}
                href="/dashboard/billing"
                leftSection={<IconCreditCard size={14} />}
              >
                Billing
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
        }}
      >
        <Stack gap={4}>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              leftSection={<item.icon size={18} />}
              active={
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href)
              }
              style={{
                borderRadius: 8,
                marginBottom: 4,
              }}
              styles={{
                label: {
                  fontWeight: 500,
                },
              }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
