'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  TextInput,
  PasswordInput,
  Button,
  Switch,
  Select,
  Group,
  Alert,
  Divider,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/lib/auth';
import { auth } from '@/lib/api';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm({
    initialValues: {
      name: user?.name || '',
      notifications: {
        email: user?.notifications?.email ?? true,
        frequency: user?.notifications?.frequency || 'weekly',
        alertOnError: user?.notifications?.alertOnError ?? true,
      },
    },
  });

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) =>
        value.length < 8 ? 'Password must be at least 8 characters' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    setProfileLoading(true);
    try {
      await auth.updateProfile(values);
      await refreshUser();
      notifications.show({
        title: 'Profile updated',
        message: 'Your settings have been saved',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (err) {
      notifications.show({
        title: 'Update failed',
        message: err instanceof Error ? err.message : 'Failed to update profile',
        color: 'red',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await auth.changePassword(values.currentPassword, values.newPassword);
      passwordForm.reset();
      notifications.show({
        title: 'Password changed',
        message: 'Your password has been updated',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Failed to change password'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">
        Settings
      </Title>

      {/* Profile Settings */}
      <Card shadow="sm" padding="lg" radius="md" mb="md" style={{ backgroundColor: '#ffffff' }}>
        <Title order={4} mb="md">
          Profile
        </Title>
        <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              value={user?.email || ''}
              disabled
            />
            <TextInput
              label="Name"
              placeholder="Your name"
              {...profileForm.getInputProps('name')}
            />

            <Divider label="Notifications" labelPosition="left" my="md" />

            <Switch
              label="Email notifications"
              description="Receive scan results and alerts via email"
              {...profileForm.getInputProps('notifications.email', {
                type: 'checkbox',
              })}
            />

            <Select
              label="Notification frequency"
              data={[
                { value: 'daily', label: 'Daily digest' },
                { value: 'weekly', label: 'Weekly digest' },
              ]}
              {...profileForm.getInputProps('notifications.frequency')}
            />

            <Switch
              label="Alert on new errors"
              description="Get immediate alerts when new accessibility errors are found"
              {...profileForm.getInputProps('notifications.alertOnError', {
                type: 'checkbox',
              })}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={profileLoading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>

      {/* Change Password */}
      <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#ffffff' }}>
        <Title order={4} mb="md">
          Change Password
        </Title>

        {passwordError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            mb="md"
          >
            {passwordError}
          </Alert>
        )}

        <form onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Your current password"
              {...passwordForm.getInputProps('currentPassword')}
            />
            <PasswordInput
              label="New Password"
              placeholder="At least 8 characters"
              {...passwordForm.getInputProps('newPassword')}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              {...passwordForm.getInputProps('confirmPassword')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={passwordLoading}>
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
