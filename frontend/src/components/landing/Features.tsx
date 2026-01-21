'use client';

import { Container, Title, Text, Box, Stack, Group } from '@mantine/core';
import {
  IconRadar,
  IconFileAnalytics,
  IconBellRinging,
  IconTrendingUp,
  IconShieldCheck,
  IconLayoutDashboard,
} from '@tabler/icons-react';

const features = [
  {
    icon: IconRadar,
    title: 'Continuous Monitoring',
    description: 'Your sites are scanned automatically on a schedule. Daily or weekly — you choose. Never miss an accessibility regression.',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  },
  {
    icon: IconFileAnalytics,
    title: 'Detailed Reports',
    description: 'Get clear, actionable reports showing exactly what needs fixing. Each issue includes the code snippet and how to resolve it.',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  },
  {
    icon: IconBellRinging,
    title: 'Email Alerts',
    description: 'Receive notifications when new issues are detected. Stay informed without constantly checking your dashboard.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  },
  {
    icon: IconTrendingUp,
    title: 'Track Your Progress',
    description: 'See how your accessibility score changes over time. Visualize improvements and catch regressions early.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  },
  {
    icon: IconShieldCheck,
    title: 'WCAG 2.0, 2.1 & 2.2',
    description: 'Test against all WCAG versions and conformance levels (A, AA, AAA). Stay compliant with the latest standards.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
  },
  {
    icon: IconLayoutDashboard,
    title: 'Your Personal Dashboard',
    description: 'All your monitored sites in one place. View scores, issues, and history at a glance. Simple, clean, and focused on what matters.',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  },
];

export function Features() {
  return (
    <Box
      component="section"
      id="features"
      py={{ base: 80, md: 120 }}
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Container size="lg" style={{ position: 'relative' }}>
        {/* Section header */}
        <Box mb={{ base: 60, md: 80 }}>
          <Group justify="center" mb="md">
            <Box
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                borderRadius: 100,
                padding: '8px 20px',
              }}
            >
              <Text size="sm" fw={600} c="white">
                Features
              </Text>
            </Box>
          </Group>
          <Title
            order={2}
            ta="center"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Accessibility monitoring
            <br />
            <Text
              component="span"
              inherit
              c="dimmed"
              style={{ fontWeight: 600 }}
            >
              that works while you sleep
            </Text>
          </Title>
        </Box>

        {/* Bento grid layout */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {features.map((feature, index) => {
            // Create varying sizes for bento effect
            const gridStyles: Record<number, React.CSSProperties> = {
              0: { gridColumn: 'span 2', gridRow: 'span 1' },
              1: { gridColumn: 'span 2', gridRow: 'span 1' },
              2: { gridColumn: 'span 2', gridRow: 'span 1' },
              3: { gridColumn: 'span 3', gridRow: 'span 1' },
              4: { gridColumn: 'span 3', gridRow: 'span 1' },
              5: { gridColumn: '1 / -1', gridRow: 'span 1' },
            };

            return (
              <Box
                key={feature.title}
                p={{ base: 24, md: 32 }}
                style={{
                  ...gridStyles[index],
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 24,
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = feature.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {/* Gradient blob */}
                <Box
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: feature.gradient,
                    opacity: 0.1,
                    filter: 'blur(40px)',
                    transition: 'all 0.3s ease',
                  }}
                />

                <Stack gap="md" style={{ position: 'relative' }}>
                  <Box
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 20px ${feature.color}40`,
                    }}
                  >
                    <feature.icon size={28} color="white" stroke={1.5} />
                  </Box>

                  <Box>
                    <Text fw={700} size="lg" mb={8}>
                      {feature.title}
                    </Text>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1.7, maxWidth: index === 5 ? 600 : undefined }}>
                      {feature.description}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .features-grid > div {
            grid-column: span 6 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </Box>
  );
}
