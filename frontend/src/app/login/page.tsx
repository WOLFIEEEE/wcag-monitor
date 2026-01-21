'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconArrowRight, IconShieldCheck, IconRadar, IconChartLine, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Please enter a valid email'),
      password: (val) => (val.length >= 1 ? null : 'Password is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      notifications.show({
        title: 'Welcome back!',
        message: 'You have been successfully signed in',
        color: 'green',
      });
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid email or password. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Sign in failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr',
      }}
    >
      {/* Left side - Decorative (hidden on mobile) */}
      <Box
        visibleFrom="md"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '45%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          style={{
            position: 'absolute',
            top: '10%',
            left: '20%',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float1 8s ease-in-out infinite',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 250,
            height: 250,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float2 10s ease-in-out infinite',
          }}
        />

        {/* Grid pattern */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <Box style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 60 }}>
            <Box
              style={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              }}
            >
              <Text c="white" fw={800} size="xl">W</Text>
            </Box>
            <Text c="white" fw={700} size="xl" style={{ letterSpacing: '-0.02em' }}>
              WCAG Monitor
            </Text>
          </Link>

          <Title
            order={1}
            c="white"
            mb="lg"
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Monitor accessibility.
            <br />
            <Text
              component="span"
              inherit
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ship with confidence.
            </Text>
          </Title>

          <Text
            size="lg"
            mb={48}
            style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 400, lineHeight: 1.7 }}
          >
            Your personal dashboard for continuous WCAG monitoring. 
            Track accessibility issues before your users find them.
          </Text>

          {/* Features */}
          <Stack gap="lg">
            {[
              { icon: IconRadar, text: 'Automated daily & weekly scans' },
              { icon: IconChartLine, text: 'Track your progress over time' },
              { icon: IconShieldCheck, text: 'WCAG 2.0, 2.1 & 2.2 compliance' },
            ].map((item) => (
              <Group key={item.text} gap="md">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon size={20} style={{ color: '#60a5fa' }} />
                </Box>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{item.text}</Text>
              </Group>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right side - Form */}
      <Box
        style={{
          marginLeft: 'auto',
          width: '100%',
          maxWidth: '55%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          backgroundColor: '#ffffff',
        }}
        hiddenFrom="md"
        // This is for mobile - full width
      />
      <Box
        style={{
          marginLeft: 'auto',
          width: '55%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          backgroundColor: '#ffffff',
        }}
        visibleFrom="md"
      >
        <Box style={{ width: '100%', maxWidth: 400 }}>
          <Title
            order={1}
            mb="xs"
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back
          </Title>
          <Text c="dimmed" mb={32}>
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/signup" fw={600} c="blue">
              Sign up for free
            </Anchor>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  title="Sign in failed"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="you@company.com"
                size="md"
                radius="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: {
                    height: 48,
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    '&:focus': {
                      borderColor: '#2563eb',
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
                {...form.getInputProps('email')}
              />

              <Box>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>Password</Text>
                  <Anchor
                    component={Link}
                    href="/forgot-password"
                    size="sm"
                    c="blue"
                    fw={500}
                  >
                    Forgot password?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="Enter your password"
                  size="md"
                  radius="md"
                  styles={{
                    input: {
                      height: 48,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      '&:focus': {
                        borderColor: '#2563eb',
                        backgroundColor: '#ffffff',
                      },
                    },
                  }}
                  {...form.getInputProps('password')}
                />
              </Box>

              <Checkbox
                label="Keep me signed in"
                size="sm"
                styles={{
                  label: { color: '#64748b' },
                }}
                {...form.getInputProps('remember', { type: 'checkbox' })}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                radius="md"
                loading={loading}
                rightSection={!loading && <IconArrowRight size={18} />}
                style={{
                  height: 52,
                  fontWeight: 600,
                  fontSize: 16,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                Sign in
              </Button>
            </Stack>
          </form>

          <Text c="dimmed" size="xs" ta="center" mt={32}>
            By signing in, you agree to our{' '}
            <Anchor href="#" size="xs" c="dimmed" td="underline">Terms</Anchor>
            {' '}and{' '}
            <Anchor href="#" size="xs" c="dimmed" td="underline">Privacy Policy</Anchor>
          </Text>
        </Box>
      </Box>

      {/* Mobile version - Full width form */}
      <Box
        hiddenFrom="md"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 24px',
          backgroundColor: '#ffffff',
        }}
      >
        <Box style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
          {/* Mobile Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <Box
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text c="white" fw={700} size="lg">W</Text>
            </Box>
            <Text fw={700} size="lg">WCAG Monitor</Text>
          </Link>

          <Title
            order={1}
            mb="xs"
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back
          </Title>
          <Text c="dimmed" mb={32}>
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/signup" fw={600} c="blue">
              Sign up free
            </Anchor>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  title="Sign in failed"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Email"
                placeholder="you@company.com"
                size="md"
                radius="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { height: 48, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
                }}
                {...form.getInputProps('email')}
              />

              <Box>
                <Group justify="space-between" mb={8}>
                  <Text size="sm" fw={500}>Password</Text>
                  <Anchor component={Link} href="/forgot-password" size="sm" c="blue" fw={500}>
                    Forgot?
                  </Anchor>
                </Group>
                <PasswordInput
                  placeholder="Enter your password"
                  size="md"
                  radius="md"
                  styles={{
                    input: { height: 48, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
                  }}
                  {...form.getInputProps('password')}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                size="lg"
                radius="md"
                loading={loading}
                rightSection={!loading && <IconArrowRight size={18} />}
                style={{
                  height: 52,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                }}
              >
                Sign in
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, 15px); }
        }
      `}</style>
    </Box>
  );
}
