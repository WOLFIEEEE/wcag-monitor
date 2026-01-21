'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Card,
  Title,
  Text,
  TextInput,
  Button,
  Anchor,
  Alert,
  Box,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { auth } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) =>
        !/^\S+@\S+$/.test(value) ? 'Invalid email address' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      await auth.forgotPassword(values.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
      }}
    >
      <Navbar />
      <Box
        component="main"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <Container size="xs" style={{ width: '100%' }}>
          <Card shadow="md" padding="xl" radius="md" style={{ backgroundColor: '#ffffff' }}>
            <Box ta="center" mb="xl">
              <Title order={2} mb="sm">
                Reset Password
              </Title>
              <Text c="dimmed" size="sm">
                Enter your email and we&apos;ll send you a reset link
              </Text>
            </Box>

            {success ? (
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                variant="light"
                title="Check your email"
              >
                If an account exists with this email, you&apos;ll receive a
                password reset link shortly.
              </Alert>
            ) : (
              <Stack gap="md">
                {error && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                  >
                    {error}
                  </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="md">
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      {...form.getInputProps('email')}
                    />

                    <Button type="submit" fullWidth loading={loading}>
                      Send Reset Link
                    </Button>
                  </Stack>
                </form>
              </Stack>
            )}

            <Text size="sm" c="dimmed" ta="center" mt="xl">
              Remember your password?{' '}
              <Anchor component={Link} href="/login" fw={500}>
                Sign in
              </Anchor>
            </Text>
          </Card>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
