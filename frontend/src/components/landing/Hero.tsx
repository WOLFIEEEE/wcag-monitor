'use client';

import Link from 'next/link';
import { Container, Title, Text, Button, Group, Box, Badge, Stack } from '@mantine/core';
import { IconArrowRight, IconEye } from '@tabler/icons-react';

export function Hero() {
  return (
    <Box
      component="section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
    >
      {/* Animated mesh gradient background */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 60% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 30%)
          `,
          animation: 'meshMove 20s ease-in-out infinite',
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'linear-gradient(180deg, black 0%, transparent 80%)',
        }}
      />

      {/* Floating elements */}
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)',
          transform: 'rotate(-15deg)',
          animation: 'float1 6s ease-in-out infinite',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '25%',
          right: '12%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)',
          animation: 'float2 8s ease-in-out infinite',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
          transform: 'rotate(30deg)',
          animation: 'float3 7s ease-in-out infinite',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '8%',
          width: 50,
          height: 50,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          boxShadow: '0 12px 30px rgba(139, 92, 246, 0.3)',
          transform: 'rotate(15deg)',
          animation: 'float1 9s ease-in-out infinite reverse',
        }}
      />

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }} py={60}>
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 60,
            alignItems: 'center',
          }}
        >
          {/* Left content */}
          <Stack align="center" gap="xl">
            <Badge
              size="xl"
              variant="light"
              color="brand"
              radius="xl"
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              ✨ Now with WCAG 2.2 support
            </Badge>

            <Title
              order={1}
              ta="center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                maxWidth: 900,
              }}
            >
              Monitor your site&apos;s
              <br />
              <Text
                component="span"
                inherit
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                accessibility 24/7
              </Text>
            </Title>

            <Text
              size="xl"
              c="dimmed"
              ta="center"
              maw={560}
              style={{ lineHeight: 1.8, fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            >
              Continuous WCAG monitoring that automatically scans your website and 
              alerts you when accessibility issues arise. Your personal dashboard 
              to track compliance effortlessly.
            </Text>

            <Group gap="lg" mt="md" wrap="wrap" justify="center">
              <Button
                component={Link}
                href="/signup"
                size="xl"
                radius="xl"
                rightSection={<IconArrowRight size={20} />}
                style={{
                  fontWeight: 600,
                  height: 60,
                  paddingInline: 36,
                  fontSize: 18,
                  boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
                }}
              >
                Start monitoring free
              </Button>
              <Button
                component={Link}
                href="#features"
                size="xl"
                radius="xl"
                variant="default"
                leftSection={<IconEye size={20} />}
                style={{
                  fontWeight: 500,
                  height: 60,
                  paddingInline: 32,
                  fontSize: 18,
                  borderColor: 'var(--color-border)',
                }}
              >
                See how it works
              </Button>
            </Group>

            {/* Social proof */}
            <Group gap="xl" mt="xl" wrap="wrap" justify="center">
              <Group gap={8}>
                <Box style={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Box
                      key={i}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%) 0%, hsl(${i * 60}, 70%, 40%) 100%)`,
                        border: '2px solid white',
                        marginLeft: i > 1 ? -10 : 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </Box>
                <Box>
                  <Text fw={600} size="sm">2,000+</Text>
                  <Text size="xs" c="dimmed">Sites monitored</Text>
                </Box>
              </Group>
              <Box style={{ width: 1, height: 40, backgroundColor: 'var(--color-border)' }} visibleFrom="sm" />
              <Box>
                <Group gap={4}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Text key={i} style={{ color: '#f59e0b', fontSize: 18 }}>★</Text>
                  ))}
                </Group>
                <Text size="xs" c="dimmed">4.9/5 average score</Text>
              </Box>
            </Group>
          </Stack>
        </Box>
      </Container>

      {/* Browser mockup floating at bottom */}
      <Box
        style={{
          position: 'absolute',
          bottom: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 1000,
          perspective: '1000px',
        }}
      >
        <Box
          style={{
            background: 'white',
            borderRadius: '16px 16px 0 0',
            border: '1px solid var(--color-border)',
            boxShadow: '0 -20px 60px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transform: 'rotateX(10deg)',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Browser chrome */}
          <Box
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Group gap={6}>
              <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <Box style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
            </Group>
            <Box
              style={{
                flex: 1,
                maxWidth: 400,
                height: 32,
                backgroundColor: 'white',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                paddingInline: 12,
              }}
            >
              <Text size="sm" c="dimmed">monitor.thewcag.com/dashboard</Text>
            </Box>
          </Box>

          {/* Dashboard preview */}
          <Box p="lg" style={{ backgroundColor: '#f8fafc', height: 300 }}>
            <Group gap="md" mb="md">
              {[
                { label: 'Accessibility Score', value: '94%', color: '#10b981' },
                { label: 'Issues Found', value: '12', color: '#f59e0b' },
                { label: 'Pages Scanned', value: '156', color: '#2563eb' },
              ].map((stat) => (
                <Box
                  key={stat.label}
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    padding: '16px 20px',
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Text size="xs" c="dimmed" fw={500}>{stat.label}</Text>
                  <Text size="xl" fw={700} style={{ color: stat.color }}>{stat.value}</Text>
                </Box>
              ))}
            </Group>
          </Box>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(-15deg); }
          50% { transform: translateY(-25px) rotate(-10deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(30deg); }
          50% { transform: translateY(-15px) rotate(35deg); }
        }
        @keyframes meshMove {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(2deg); }
        }
      `}</style>
    </Box>
  );
}
