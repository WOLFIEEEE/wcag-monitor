'use client';

import Link from 'next/link';
import { Container, Title, Text, Box, Stack, Group, Button } from '@mantine/core';
import { IconArrowRight, IconRadar } from '@tabler/icons-react';

export function CTA() {
  return (
    <Box
      component="section"
      py={{ base: 80, md: 120 }}
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container size="lg">
        <Box
          p={{ base: 40, md: 80 }}
          style={{
            position: 'relative',
            borderRadius: 40,
            overflow: 'hidden',
          }}
        >
          {/* Animated gradient background */}
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            }}
          />

          {/* Animated gradient orbs */}
          <Box
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '50%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 60%)',
              filter: 'blur(60px)',
              animation: 'orbFloat1 8s ease-in-out infinite',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: '-30%',
              right: '-10%',
              width: '60%',
              height: '80%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%)',
              filter: 'blur(60px)',
              animation: 'orbFloat2 10s ease-in-out infinite',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              top: '20%',
              right: '20%',
              width: '30%',
              height: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 60%)',
              filter: 'blur(40px)',
              animation: 'orbFloat3 12s ease-in-out infinite',
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
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <Stack
            align="center"
            gap="xl"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <IconRadar size={16} style={{ color: '#10b981' }} />
              <Text size="sm" c="white" fw={500}>
                Monitor 2 URLs free forever
              </Text>
            </Box>

            <Title
              order={2}
              ta="center"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'white',
                maxWidth: 700,
              }}
            >
              Start monitoring your site&apos;s accessibility today
            </Title>

            <Text
              size="xl"
              ta="center"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: 480,
                lineHeight: 1.7,
              }}
            >
              Join thousands of website owners who trust us to keep their sites accessible and compliant.
            </Text>

            <Group gap="md" mt="md">
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
                  background: 'white',
                  color: '#0f172a',
                }}
              >
                Start monitoring free
              </Button>
              <Button
                component={Link}
                href="/pricing"
                size="xl"
                radius="xl"
                variant="outline"
                style={{
                  fontWeight: 500,
                  height: 60,
                  paddingInline: 32,
                  fontSize: 18,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
              >
                View pricing
              </Button>
            </Group>

            {/* Trust indicators */}
            <Group gap="xl" mt="lg" wrap="wrap" justify="center">
              {['No credit card needed', 'Cancel anytime', 'Setup in 30 seconds'].map((item) => (
                <Group key={item} gap={8}>
                  <Box
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                    }}
                  />
                  <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {item}
                  </Text>
                </Group>
              ))}
            </Group>
          </Stack>
        </Box>
      </Container>

      <style jsx global>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 30px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }
      `}</style>
    </Box>
  );
}
