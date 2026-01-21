'use client';

import {
  Box,
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Anchor,
  SimpleGrid,
  Badge,
  Collapse,
  UnstyledButton,
} from '@mantine/core';
import { IconCheck, IconArrowRight, IconPlus, IconMinus } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

const plans = [
  {
    name: 'Free',
    tagline: 'For personal sites',
    price: '$0',
    period: 'forever free',
    features: ['2 URLs monitored', '100 pages/URL', 'Weekly scans', 'Basic reports'],
    cta: 'Start Free',
    href: '/signup',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    textColor: '#0f172a',
    popular: false,
  },
  {
    name: 'Pro',
    tagline: 'For businesses',
    price: '$9',
    period: 'per URL/month',
    features: ['Unlimited URLs', '500 pages/URL', 'Daily scans', 'PDF reports', 'Email alerts', 'Trends'],
    cta: 'Start Monitoring',
    href: '/signup?plan=pro',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    textColor: '#ffffff',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'For large orgs',
    price: 'Custom',
    period: 'contact us',
    features: ['Unlimited everything', 'Hourly monitoring', 'White-label', 'Custom rules', 'Dedicated support', 'SLA'],
    cta: 'Contact Sales',
    href: '#',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    textColor: '#ffffff',
    popular: false,
  },
];

const faqData = [
  {
    id: 'free-plan',
    question: 'What\'s included in the Free plan?',
    answer: 'Monitor 2 URLs with up to 100 pages each. Get weekly scans and basic reports. Perfect for personal projects.',
  },
  {
    id: 'pro-pricing',
    question: 'How does Pro pricing work?',
    answer: '$9/month per URL. Monitor 5 URLs = $45/month. Each URL gets daily scans, PDF reports, and email alerts.',
  },
  {
    id: 'change-plan',
    question: 'Can I change plans anytime?',
    answer: 'Yes! Upgrade or downgrade instantly. We prorate charges automatically.',
  },
  {
    id: 'cancel',
    question: 'What if I want to cancel?',
    answer: 'Cancel anytime with one click. No questions asked. You keep access until billing period ends.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        py="lg"
        w="100%"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text fw={500} size="md">
          {question}
        </Text>
        {opened ? (
          <IconMinus size={18} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
        ) : (
          <IconPlus size={18} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
        )}
      </UnstyledButton>
      <Collapse in={opened}>
        <Text size="sm" c="dimmed" pb="lg" style={{ lineHeight: 1.7 }}>
          {answer}
        </Text>
      </Collapse>
    </Box>
  );
}

export default function PricingPage() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <Navbar />
      
      <Box component="main" id="main-content" style={{ flex: 1 }}>
        {/* Hero - Unique angled design */}
        <Box
          style={{
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 80,
            paddingBottom: 120,
          }}
        >
          {/* Animated gradient background */}
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
            }}
          />
          
          {/* Floating shapes */}
          <Box
            style={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 200,
              height: 200,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, transparent 100%)',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: '30%',
              right: '15%',
              width: 150,
              height: 150,
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
              animation: 'float 8s ease-in-out infinite reverse',
            }}
          />

          <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
            <Stack align="center" gap="lg">
              <Badge
                size="lg"
                variant="light"
                color="brand"
                radius="xl"
                style={{ padding: '8px 20px' }}
              >
                Simple Pricing
              </Badge>
              <Title
                order={1}
                ta="center"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                One price.
                <br />
                <Text
                  component="span"
                  inherit
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Unlimited value.
                </Text>
              </Title>
              <Text size="xl" c="dimmed" ta="center" maw={400}>
                Start free, scale when ready. No hidden fees.
              </Text>
            </Stack>
          </Container>
        </Box>

        {/* Pricing Cards - Unique stacked design */}
        <Container size="lg" style={{ marginTop: -60, position: 'relative', zIndex: 2 }}>
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {plans.map((plan, index) => (
              <Box
                key={plan.name}
                p="xl"
                style={{
                  background: plan.gradient,
                  borderRadius: 24,
                  border: plan.popular ? 'none' : '1px solid var(--color-border)',
                  boxShadow: plan.popular
                    ? '0 25px 50px -12px rgba(37, 99, 235, 0.35)'
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                  transform: plan.popular ? 'scale(1.05)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {plan.popular && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: -35,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '6px 40px',
                      fontSize: 12,
                      fontWeight: 600,
                      transform: 'rotate(45deg)',
                    }}
                  >
                    POPULAR
                  </Box>
                )}

                <Stack gap="md">
                  <Box>
                    <Text size="sm" fw={500} style={{ color: plan.popular ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)' }}>
                      {plan.tagline}
                    </Text>
                    <Text
                      fw={700}
                      size="xl"
                      mt={4}
                      style={{ color: plan.textColor }}
                    >
                      {plan.name}
                    </Text>
                  </Box>

                  <Group align="baseline" gap={4}>
                    <Text
                      style={{
                        fontSize: '3.5rem',
                        fontWeight: 800,
                        lineHeight: 1,
                        color: plan.textColor,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {plan.price}
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: plan.popular ? 'rgba(255,255,255,0.6)' : 'var(--color-text-tertiary)',
                      }}
                    >
                      {plan.period}
                    </Text>
                  </Group>

                  <Button
                    component={Link}
                    href={plan.href}
                    size="lg"
                    radius="xl"
                    fullWidth
                    variant={plan.popular ? 'white' : 'filled'}
                    color={plan.popular ? undefined : 'dark'}
                    rightSection={<IconArrowRight size={18} />}
                    style={{
                      fontWeight: 600,
                      height: 52,
                      marginTop: 8,
                    }}
                  >
                    {plan.cta}
                  </Button>

                  <Stack gap={8} mt="md">
                    {plan.features.map((feature) => (
                      <Group key={feature} gap={10} wrap="nowrap">
                        <Box
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: plan.popular ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconCheck
                            size={12}
                            style={{
                              color: plan.popular ? '#10b981' : 'var(--color-brand)',
                            }}
                          />
                        </Box>
                        <Text
                          size="sm"
                          style={{
                            color: plan.popular ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)',
                          }}
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
        </Container>

        {/* Stats Section - Unique horizontal scroll feel */}
        <Box py={80}>
          <Container size="lg">
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1,
                backgroundColor: 'var(--color-border)',
                borderRadius: 20,
                overflow: 'hidden',
              }}
            >
              {[
                { value: '10K+', label: 'Sites Monitored' },
                { value: '99.9%', label: 'Uptime' },
                { value: '2M+', label: 'Issues Found' },
                { value: '4.9/5', label: 'User Rating' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  py={40}
                  px={24}
                  ta="center"
                  style={{ backgroundColor: 'var(--color-bg-primary)' }}
                >
                  <Text
                    fw={800}
                    style={{
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text size="sm" c="dimmed" mt={4}>
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* FAQ - Clean minimal design */}
        <Box py={80} style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
          <Container size="sm">
            <Stack align="center" mb={48}>
              <Text
                fw={600}
                size="sm"
                tt="uppercase"
                style={{ letterSpacing: '0.1em', color: 'var(--color-brand)' }}
              >
                FAQ
              </Text>
              <Title
                order={2}
                ta="center"
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  fontWeight: 700,
                }}
              >
                Questions? Answers.
              </Title>
            </Stack>

            <Box
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
              px="xl"
            >
              {faqData.map((faq) => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </Box>

            <Group justify="center" mt={32}>
              <Text size="sm" c="dimmed">
                More questions?{' '}
                <Anchor href="mailto:hello@wcagmonitor.com" fw={500}>
                  Email us
                </Anchor>
              </Text>
            </Group>
          </Container>
        </Box>

        {/* CTA - Unique glass morphism */}
        <Box py={100}>
          <Container size="md">
            <Box
              p={{ base: 40, md: 60 }}
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
                borderRadius: 32,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glass overlay */}
              <Box
                style={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <Box
                style={{
                  position: 'absolute',
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%',
                  filter: 'blur(30px)',
                }}
              />

              <Stack align="center" gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                <Title
                  order={2}
                  ta="center"
                  c="white"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: 700,
                  }}
                >
                  Ready to make your site accessible?
                </Title>
                <Text
                  ta="center"
                  style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 400 }}
                >
                  Join 10,000+ teams building inclusive web experiences.
                </Text>
                <Group gap="md" mt="md">
                  <Button
                    component={Link}
                    href="/signup"
                    size="lg"
                    radius="xl"
                    variant="white"
                    color="dark"
                    rightSection={<IconArrowRight size={18} />}
                    style={{ fontWeight: 600, height: 52, paddingInline: 32 }}
                  >
                    Get Started Free
                  </Button>
                </Group>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
      
      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
}
