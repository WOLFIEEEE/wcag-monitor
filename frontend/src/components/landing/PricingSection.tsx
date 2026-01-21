'use client';

import Link from 'next/link';
import { Container, Title, Text, Box, Stack, Group, Button, Badge } from '@mantine/core';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';

const plans = [
  {
    name: 'Free',
    description: 'For personal sites and small projects',
    price: '$0',
    period: 'forever',
    features: [
      '2 URLs monitored',
      'Up to 100 pages per URL',
      'Weekly automated scans',
      'Basic issue reports',
      'Personal dashboard',
    ],
    cta: 'Start Monitoring Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For businesses and growing websites',
    price: '$9',
    period: 'per URL / month',
    features: [
      'Unlimited URLs',
      'Up to 500 pages per URL',
      'Daily automated scans',
      'Detailed PDF reports',
      'Email alerts on new issues',
      'Historical trends & analytics',
      'Priority support',
    ],
    cta: 'Start Pro Monitoring',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Unlimited URLs & pages',
      'Hourly monitoring available',
      'Custom WCAG configurations',
      'White-label reports',
      'Team member access',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '#',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <Box
      component="section"
      id="pricing"
      py={{ base: 60, md: 100 }}
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <Container size="lg">
        <Stack align="center" mb={{ base: 40, md: 60 }}>
          <Text
            fw={600}
            size="sm"
            tt="uppercase"
            style={{
              letterSpacing: '0.1em',
              color: 'var(--color-brand)',
            }}
          >
            Pricing
          </Text>
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Simple monitoring pricing
          </Title>
          <Text
            size="lg"
            c="dimmed"
            ta="center"
            maw={500}
            style={{ lineHeight: 1.7 }}
          >
            Start free with 2 URLs. Scale as your monitoring needs grow.
          </Text>
        </Stack>

        {/* Pricing Cards */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {plans.map((plan) => (
            <Box
              key={plan.name}
              p="xl"
              style={{
                backgroundColor: plan.popular ? 'var(--color-text-primary)' : 'var(--color-bg-primary)',
                borderRadius: '20px',
                border: plan.popular ? 'none' : '1px solid var(--color-border)',
                position: 'relative',
                transform: plan.popular ? 'scale(1.02)' : 'none',
                boxShadow: plan.popular ? '0 20px 50px rgba(0, 0, 0, 0.15)' : 'none',
              }}
            >
              {plan.popular && (
                <Badge
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  Most Popular
                </Badge>
              )}

              <Stack gap="md">
                <Box>
                  <Text 
                    fw={600} 
                    size="lg" 
                    c={plan.popular ? 'white' : undefined}
                  >
                    {plan.name}
                  </Text>
                  <Text 
                    size="sm" 
                    c={plan.popular ? 'rgba(255,255,255,0.7)' : 'dimmed'}
                    mt={4}
                  >
                    {plan.description}
                  </Text>
                </Box>

                <Box py="md">
                  <Group gap={4} align="baseline">
                    <Text
                      style={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        color: plan.popular ? 'white' : 'var(--color-text-primary)',
                      }}
                    >
                      {plan.price}
                    </Text>
                    <Text 
                      size="sm" 
                      c={plan.popular ? 'rgba(255,255,255,0.7)' : 'dimmed'}
                    >
                      {plan.period}
                    </Text>
                  </Group>
                </Box>

                <Button
                  component={Link}
                  href={plan.href}
                  size="md"
                  radius="md"
                  fullWidth
                  variant={plan.popular ? 'white' : 'filled'}
                  color={plan.popular ? undefined : 'brand'}
                  rightSection={<IconArrowRight size={16} />}
                  style={{
                    fontWeight: 600,
                    height: 48,
                  }}
                >
                  {plan.cta}
                </Button>

                <Stack gap="xs" mt="md">
                  {plan.features.map((feature) => (
                    <Group key={feature} gap="sm" wrap="nowrap">
                      <IconCheck 
                        size={18} 
                        style={{ 
                          color: plan.popular ? '#10b981' : 'var(--color-success)',
                          flexShrink: 0,
                        }} 
                      />
                      <Text 
                        size="sm" 
                        c={plan.popular ? 'rgba(255,255,255,0.85)' : 'dimmed'}
                      >
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Box>

        {/* FAQ Link */}
        <Group justify="center" mt={48}>
          <Text size="sm" c="dimmed">
            Have questions?{' '}
            <Text
              component={Link}
              href="/pricing"
              c="brand"
              fw={500}
              style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              View FAQ
            </Text>
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
