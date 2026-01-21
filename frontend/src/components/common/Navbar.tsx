'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Group,
  Button,
  Container,
  Burger,
  Drawer,
  Stack,
  Text,
  Menu,
  Avatar,
  UnstyledButton,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconLayoutDashboard,
  IconCreditCard,
} from '@tabler/icons-react';
import { useAuth } from '@/lib/auth';

const publicLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Container size="lg" py="md">
          <Group justify="space-between" gap="xl">
            {/* Logo */}
            <Link 
              href="/" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              aria-label="WCAG Monitor - Go to homepage"
            >
              <Box
                style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                }}
              >
                <Text c="white" fw={700} size="lg">W</Text>
              </Box>
              <Text 
                fw={700} 
                size="lg" 
                style={{ 
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                WCAG Monitor
              </Text>
            </Link>

            {/* Desktop Navigation */}
            <Group gap={32} visibleFrom="sm">
              <Group component="nav" gap={8} aria-label="Main navigation">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: isActive(link.href) 
                        ? 'var(--color-brand)' 
                        : 'var(--color-text-secondary)',
                      backgroundColor: isActive(link.href) 
                        ? 'var(--color-bg-accent)' 
                        : 'transparent',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive(link.href)) {
                        e.currentTarget.style.color = 'var(--color-text-primary)';
                        e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive(link.href)) {
                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Group>
            </Group>

            {/* Auth Buttons / User Menu */}
            <Group gap="sm" visibleFrom="sm">
              {user ? (
                <Menu shadow="lg" width={220} position="bottom-end" offset={8}>
                  <Menu.Target>
                    <UnstyledButton 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 12px 6px 6px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        transition: 'all 0.2s ease',
                      }}
                      aria-label="Account menu"
                    >
                      <Avatar 
                        size={32} 
                        radius="md" 
                        color="brand"
                        style={{ fontWeight: 600 }}
                      >
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </Avatar>
                      <Box visibleFrom="md">
                        <Text size="sm" fw={500} style={{ lineHeight: 1.2 }}>
                          {user.name || user.email.split('@')[0]}
                        </Text>
                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.2 }}>
                          {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                        </Text>
                      </Box>
                      <IconChevronDown size={16} style={{ color: 'var(--color-text-tertiary)' }} />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item
                      component={Link}
                      href="/dashboard"
                      leftSection={<IconLayoutDashboard size={16} />}
                    >
                      Dashboard
                    </Menu.Item>
                    <Menu.Item
                      component={Link}
                      href="/dashboard/settings"
                      leftSection={<IconSettings size={16} />}
                    >
                      Settings
                    </Menu.Item>
                    <Menu.Item
                      component={Link}
                      href="/dashboard/billing"
                      leftSection={<IconCreditCard size={16} />}
                    >
                      Billing
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={16} />}
                      onClick={logout}
                    >
                      Sign out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group gap="sm">
                  <Button
                    component={Link}
                    href="/login"
                    variant="subtle"
                    color="gray"
                    size="md"
                    style={{ fontWeight: 500 }}
                  >
                    Sign in
                  </Button>
                  <Button 
                    component={Link} 
                    href="/signup"
                    size="md"
                    style={{ 
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    Get Started
                  </Button>
                </Group>
              )}
            </Group>

            {/* Mobile Menu Button */}
            <Burger 
              opened={opened} 
              onClick={toggle} 
              hiddenFrom="sm" 
              size="sm"
              aria-label="Toggle navigation menu"
            />
          </Group>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} size="lg">Menu</Text>
        }
        padding="lg"
        size="280px"
        hiddenFrom="sm"
        styles={{
          header: { borderBottom: '1px solid var(--color-border)', paddingBottom: 16 },
          body: { paddingTop: 24 },
        }}
      >
        <Stack gap="xs">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 500,
                color: isActive(link.href) 
                  ? 'var(--color-brand)' 
                  : 'var(--color-text-secondary)',
                backgroundColor: isActive(link.href) 
                  ? 'var(--color-bg-accent)' 
                  : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          
          <Box style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, marginTop: 8 }}>
            {user ? (
              <Stack gap="xs">
                <Link
                  href="/dashboard"
                  onClick={close}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  Dashboard
                </Link>
                <Button
                  variant="light"
                  color="red"
                  fullWidth
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  Sign out
                </Button>
              </Stack>
            ) : (
              <Stack gap="sm">
                <Button
                  component={Link}
                  href="/login"
                  variant="default"
                  fullWidth
                  onClick={close}
                >
                  Sign in
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  fullWidth
                  onClick={close}
                >
                  Get Started
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
