'use client';

import Link from 'next/link';
import { Container, Title, Text, Box, Stack, Group, Button } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

const steps = [
  {
    num: '01',
    title: 'Create account',
    description: 'Sign up in seconds. No credit card required.',
    visual: (
      <Box
        style={{
          width: '100%',
          height: 120,
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Box style={{ width: 60, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
        <Box style={{ width: 40, height: 32, borderRadius: 6, backgroundColor: '#2563eb' }} />
      </Box>
    ),
  },
  {
    num: '02',
    title: 'Add your URLs',
    description: 'Enter the websites you want to monitor.',
    visual: (
      <Box
        style={{
          width: '100%',
          height: 120,
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {[1, 2].map((i) => (
          <Box
            key={i}
            style={{
              width: '70%',
              height: 24,
              borderRadius: 6,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              paddingInline: 8,
            }}
          >
            <Box style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#10b981' }} />
          </Box>
        ))}
      </Box>
    ),
  },
  {
    num: '03',
    title: 'We scan automatically',
    description: 'Your sites are checked daily or weekly.',
    visual: (
      <Box
        style={{
          width: '100%',
          height: 120,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 6,
          paddingBottom: 16,
        }}
      >
        {[40, 65, 50, 80, 70, 90].map((h, i) => (
          <Box
            key={i}
            style={{
              width: 16,
              height: h,
              borderRadius: 4,
              backgroundColor: i === 5 ? '#f59e0b' : 'white',
            }}
          />
        ))}
      </Box>
    ),
  },
  {
    num: '04',
    title: 'Track & improve',
    description: 'View reports and watch your score improve.',
    visual: (
      <Box
        style={{
          width: '100%',
          height: 120,
          background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '8px solid #8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <Text fw={800} size="xl" style={{ color: '#8b5cf6' }}>94</Text>
        </Box>
      </Box>
    ),
  },
];

export function HowItWorks() {
  return (
    <Box
      component="section"
      py={{ base: 80, md: 120 }}
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
      }}
    >
      {/* Decorative lines */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, var(--color-border) 50%, transparent 100%)',
        }}
      />

      <Container size="lg">
        {/* Header */}
        <Stack align="center" mb={{ base: 60, md: 80 }}>
          <Text
            fw={700}
            size="sm"
            tt="uppercase"
            style={{
              letterSpacing: '0.2em',
              color: 'var(--color-text-tertiary)',
            }}
          >
            How it works
          </Text>
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
            Set it up once,
            <br />
            <Text
              component="span"
              inherit
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              monitor forever
            </Text>
          </Title>
        </Stack>

        {/* Steps - Horizontal scroll on mobile, grid on desktop */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            position: 'relative',
          }}
        >
          {/* Connection line */}
          <Box
            visibleFrom="md"
            style={{
              position: 'absolute',
              top: 60,
              left: '12%',
              right: '12%',
              height: 2,
              background: 'linear-gradient(90deg, #2563eb 0%, #10b981 33%, #f59e0b 66%, #8b5cf6 100%)',
              borderRadius: 1,
              opacity: 0.3,
            }}
          />

          {steps.map((step) => (
            <Box
              key={step.num}
              style={{
                position: 'relative',
              }}
            >
              {/* Step number */}
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Text fw={700} size="sm" c="dimmed">
                  {step.num}
                </Text>
              </Box>

              {/* Visual */}
              <Box mb="lg">
                {step.visual}
              </Box>

              {/* Content */}
              <Text fw={700} size="lg" mb={4}>
                {step.title}
              </Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                {step.description}
              </Text>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Group justify="center" mt={{ base: 60, md: 80 }}>
          <Button
            component={Link}
            href="/signup"
            size="xl"
            radius="xl"
            rightSection={<IconArrowRight size={20} />}
            style={{
              fontWeight: 600,
              height: 60,
              paddingInline: 40,
              fontSize: 18,
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
            }}
          >
            Start monitoring now
          </Button>
        </Group>
      </Container>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </Box>
  );
}
