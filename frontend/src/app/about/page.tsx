'use client';

import {
  Box,
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  List,
  ThemeIcon,
  Group,
  Button,
} from '@mantine/core';
import {
  IconCheck,
  IconEye,
  IconHeart,
  IconShieldCheck,
  IconUsers,
  IconArrowRight,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

const values = [
  {
    icon: IconEye,
    title: 'Accessibility First',
    description: 'We believe the web should be accessible to everyone, regardless of ability. It\'s not just compliance—it\'s the right thing to do.',
  },
  {
    icon: IconHeart,
    title: 'User-Centered',
    description: 'We build tools that developers actually want to use. Clean interfaces, actionable insights, and seamless workflows.',
  },
  {
    icon: IconShieldCheck,
    title: 'Trust & Transparency',
    description: 'We\'re honest about what our tool can and can\'t do. No marketing fluff, just reliable accessibility testing.',
  },
  {
    icon: IconUsers,
    title: 'Community Driven',
    description: 'We actively contribute to accessibility standards and open-source projects. Rising tides lift all boats.',
  },
];

const wcagPrinciples = [
  {
    name: 'Perceivable',
    description: 'Information and user interface components must be presentable to users in ways they can perceive.',
  },
  {
    name: 'Operable',
    description: 'User interface components and navigation must be operable by all users.',
  },
  {
    name: 'Understandable',
    description: 'Information and the operation of the user interface must be understandable.',
  },
  {
    name: 'Robust',
    description: 'Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.',
  },
];

export default function AboutPage() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Box component="main" id="main-content" style={{ flex: 1 }}>
        {/* Hero */}
        <Box
          py={{ base: 60, md: 100 }}
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <Container size="md">
            <Stack align="center" gap="lg">
              <Text
                fw={600}
                size="sm"
                tt="uppercase"
                style={{
                  letterSpacing: '0.1em',
                  color: 'var(--color-brand)',
                }}
              >
                About Us
              </Text>
              <Title
                order={1}
                ta="center"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  maxWidth: 700,
                }}
              >
                Making the web accessible for everyone
              </Title>
              <Text
                size="lg"
                c="dimmed"
                ta="center"
                maw={600}
                style={{ lineHeight: 1.8 }}
              >
                WCAG Monitor was founded on a simple belief: everyone deserves 
                equal access to the web. We build tools that help teams create 
                inclusive digital experiences.
              </Text>
            </Stack>
          </Container>
        </Box>

        {/* Mission */}
        <Box py={{ base: 60, md: 80 }} style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          <Container size="lg">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 60 }}>
              <Box>
                <Text
                  fw={600}
                  size="sm"
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.1em',
                    color: 'var(--color-brand)',
                  }}
                  mb="md"
                >
                  Our Mission
                </Text>
                <Title
                  order={2}
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                  }}
                  mb="lg"
                >
                  Empowering developers to build accessible websites
                </Title>
                <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }} mb="lg">
                  Over 1 billion people worldwide live with some form of disability. 
                  Yet, according to WebAIM's annual survey, 96% of home pages have 
                  detectable accessibility errors.
                </Text>
                <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }} mb="lg">
                  We're on a mission to change that. By providing automated, 
                  continuous accessibility monitoring, we help teams catch and 
                  fix issues before they impact users.
                </Text>
                <Text c="dimmed" size="md" style={{ lineHeight: 1.8 }}>
                  Accessibility isn't a feature—it's a fundamental requirement 
                  for a truly inclusive web.
                </Text>
              </Box>
              <Box
                p="xl"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Title order={3} size="h4" mb="lg">
                  What is WCAG?
                </Title>
                <Text c="dimmed" size="sm" style={{ lineHeight: 1.8 }} mb="lg">
                  The Web Content Accessibility Guidelines (WCAG) are internationally 
                  recognized standards developed by W3C. They're organized around 
                  four core principles:
                </Text>
                <Stack gap="md">
                  {wcagPrinciples.map((principle) => (
                    <Box key={principle.name}>
                      <Text fw={600} size="sm" mb={4}>
                        {principle.name}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ lineHeight: 1.7 }}>
                        {principle.description}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Values */}
        <Box py={{ base: 60, md: 80 }} style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <Container size="lg">
            <Stack align="center" mb={{ base: 40, md: 48 }}>
              <Text
                fw={600}
                size="sm"
                tt="uppercase"
                style={{
                  letterSpacing: '0.1em',
                  color: 'var(--color-brand)',
                }}
              >
                Our Values
              </Text>
              <Title
                order={2}
                ta="center"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                What drives us forward
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 24, md: 32 }}>
              {values.map((value) => (
                <Box
                  key={value.title}
                  p="xl"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <ThemeIcon
                    size={48}
                    radius="xl"
                    variant="light"
                    color="brand"
                    mb="md"
                  >
                    <value.icon size={24} stroke={1.5} />
                  </ThemeIcon>
                  <Text fw={600} size="lg" mb="xs">
                    {value.title}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
                    {value.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        {/* Compliance */}
        <Box py={{ base: 60, md: 80 }} style={{ backgroundColor: 'var(--color-bg-primary)' }}>
          <Container size="md">
            <Stack align="center" gap="lg">
              <Title
                order={2}
                ta="center"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Standards we test against
              </Title>
              <Text
                c="dimmed"
                ta="center"
                maw={500}
                style={{ lineHeight: 1.7 }}
              >
                WCAG Monitor tests your websites against the latest 
                accessibility standards and guidelines.
              </Text>
              <List
                spacing="md"
                size="md"
                center
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                <List.Item>WCAG 2.0 Level A, AA, and AAA</List.Item>
                <List.Item>WCAG 2.1 Level A, AA, and AAA</List.Item>
                <List.Item>WCAG 2.2 Level A, AA, and AAA</List.Item>
                <List.Item>Section 508 Compliance</List.Item>
                <List.Item>ADA Compliance Guidelines</List.Item>
              </List>
            </Stack>
          </Container>
        </Box>

        {/* CTA */}
        <Box
          py={{ base: 60, md: 80 }}
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
          }}
        >
          <Container size="sm">
            <Stack align="center" gap="lg">
              <Title
                order={2}
                ta="center"
                c="white"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Join us in making the web accessible
              </Title>
              <Text
                ta="center"
                maw={400}
                style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}
              >
                Start monitoring your website's accessibility today. 
                It's free to get started.
              </Text>
              <Button
                component={Link}
                href="/signup"
                size="lg"
                radius="md"
                variant="white"
                color="dark"
                rightSection={<IconArrowRight size={18} />}
                style={{
                  fontWeight: 600,
                  padding: '12px 28px',
                  height: 'auto',
                }}
              >
                Get Started Free
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
