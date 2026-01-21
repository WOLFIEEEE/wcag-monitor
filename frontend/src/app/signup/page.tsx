'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Box,
  Progress,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconArrowRight, IconCheck, IconSparkles, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth';

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
  return strength;
}

function getStrengthColor(strength: number): string {
  if (strength < 50) return 'red';
  if (strength < 75) return 'orange';
  return 'green';
}

function getStrengthText(strength: number): string {
  if (strength < 50) return 'Weak';
  if (strength < 75) return 'Good';
  return 'Strong';
}

const benefits = [
  'Monitor 2 URLs free forever',
  'Automated weekly scans',
  'Detailed accessibility reports',
  'No credit card required',
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (val) => (val.trim().length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Please enter a valid email'),
      password: (val) => (val.length >= 8 ? null : 'Password must be at least 8 characters'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    try {
      await signup(values.name, values.email, values.password);
      notifications.show({
        title: 'Account created!',
        message: 'Welcome to WCAG Monitor',
        color: 'green',
      });
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Sign up failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.values.password);

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
            top: '15%',
            right: '10%',
            width: 350,
            height: 350,
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float1 10s ease-in-out infinite',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '15%',
            width: 280,
            height: 280,
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float2 8s ease-in-out infinite',
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Text c="white" fw={800} size="xl">W</Text>
            </Box>
            <Text c="white" fw={700} size="xl" style={{ letterSpacing: '-0.02em' }}>
              WCAG Monitor
            </Text>
          </Link>

          <Box
            mb="xl"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 100,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <IconSparkles size={16} style={{ color: '#10b981' }} />
            <Text size="sm" c="white" fw={500}>
              Start free, no credit card needed
            </Text>
          </Box>

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
            Start monitoring
            <br />
            <Text
              component="span"
              inherit
              style={{
                background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              in 30 seconds
            </Text>
          </Title>

          <Text
            size="lg"
            mb={48}
            style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 400, lineHeight: 1.7 }}
          >
            Join thousands of website owners using WCAG Monitor to keep their sites accessible.
          </Text>

          {/* Benefits */}
          <Stack gap="md">
            {benefits.map((benefit) => (
              <Group key={benefit} gap="md">
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconCheck size={14} style={{ color: '#10b981' }} />
                </Box>
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{benefit}</Text>
              </Group>
            ))}
          </Stack>

          {/* Social proof */}
          <Box
            mt={48}
            p="lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Group gap="md">
              <Box style={{ display: 'flex' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box
                    key={i}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${i * 80}, 70%, 50%) 0%, hsl(${i * 80}, 70%, 40%) 100%)`,
                      border: '2px solid #1e293b',
                      marginLeft: i > 1 ? -8 : 0,
                    }}
                  />
                ))}
              </Box>
              <Box>
                <Text size="sm" c="white" fw={600}>2,000+ sites monitored</Text>
                <Text size="xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Trusted by developers worldwide</Text>
              </Box>
            </Group>
          </Box>
        </Box>
      </Box>

      {/* Right side - Form */}
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
            Create your account
          </Title>
          <Text c="dimmed" mb={32}>
            Already have an account?{' '}
            <Anchor component={Link} href="/login" fw={600} c="blue">
              Sign in
            </Anchor>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  title="Sign up failed"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Full name"
                placeholder="John Doe"
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
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Work email"
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
                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
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
                  {...form.getInputProps('password')}
                />
                {form.values.password.length > 0 && (
                  <Box mt="sm">
                    <Group justify="space-between" mb={6}>
                      <Text size="xs" c="dimmed">Password strength</Text>
                      <Text size="xs" fw={500} c={getStrengthColor(passwordStrength)}>
                        {getStrengthText(passwordStrength)}
                      </Text>
                    </Group>
                    <Progress
                      value={passwordStrength}
                      color={getStrengthColor(passwordStrength)}
                      size={4}
                      radius="xl"
                    />
                  </Box>
                )}
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
                  fontSize: 16,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                }}
              >
                Create free account
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                By creating an account, you agree to our{' '}
                <Anchor href="#" size="xs" c="dimmed" td="underline">Terms</Anchor>
                {' '}and{' '}
                <Anchor href="#" size="xs" c="dimmed" td="underline">Privacy Policy</Anchor>
              </Text>
            </Stack>
          </form>
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
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Box
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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

          <Box
            my="md"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 100,
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
            }}
          >
            <IconSparkles size={14} style={{ color: '#10b981' }} />
            <Text size="xs" c="green" fw={500}>Free forever for 2 URLs</Text>
          </Box>

          <Title
            order={1}
            mb="xs"
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Create your account
          </Title>
          <Text c="dimmed" mb={24}>
            Already have an account?{' '}
            <Anchor component={Link} href="/login" fw={600} c="blue">
              Sign in
            </Anchor>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  title="Sign up failed"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Full name"
                placeholder="John Doe"
                size="md"
                radius="md"
                styles={{
                  label: { marginBottom: 6, fontWeight: 500 },
                  input: { height: 48, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
                }}
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Email"
                placeholder="you@company.com"
                size="md"
                radius="md"
                styles={{
                  label: { marginBottom: 6, fontWeight: 500 },
                  input: { height: 48, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
                }}
                {...form.getInputProps('email')}
              />

              <Box>
                <PasswordInput
                  label="Password"
                  placeholder="Min 8 characters"
                  size="md"
                  radius="md"
                  styles={{
                    label: { marginBottom: 6, fontWeight: 500 },
                    input: { height: 48, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' },
                  }}
                  {...form.getInputProps('password')}
                />
                {form.values.password.length > 0 && (
                  <Box mt="xs">
                    <Progress
                      value={passwordStrength}
                      color={getStrengthColor(passwordStrength)}
                      size={4}
                      radius="xl"
                    />
                  </Box>
                )}
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
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                Create free account
              </Button>
            </Stack>
          </form>

          {/* Mobile benefits */}
          <Box
            mt={24}
            p="md"
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}
          >
            <Stack gap="xs">
              {benefits.slice(0, 3).map((benefit) => (
                <Group key={benefit} gap="xs">
                  <IconCheck size={16} style={{ color: '#10b981' }} />
                  <Text size="sm" c="dimmed">{benefit}</Text>
                </Group>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
        }
      `}</style>
    </Box>
  );
}
