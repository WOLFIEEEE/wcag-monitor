'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container, Group, Text, Stack, Box, TextInput, Button, Anchor } from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconArrowRight,
  IconHeart,
} from '@tabler/icons-react';

const footerLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Docs', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Help', href: '#' },
  { label: 'Status', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

const socialLinks = [
  { icon: IconBrandTwitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
  { icon: IconBrandGithub, href: '#', label: 'GitHub', color: '#ffffff' },
  { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn', color: '#0A66C2' },
  { icon: IconMail, href: 'mailto:hello@wcagmonitor.com', label: 'Email', color: '#EA4335' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <Box
      component="footer"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      role="contentinfo"
    >
      {/* Animated gradient orbs */}
      <Box
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animation: 'footerOrb1 15s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-5%',
          width: '35%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
          filter: 'blur(50px)',
          animation: 'footerOrb2 18s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main content - Split horizon layout */}
        <Box
          py={{ base: 60, md: 80 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 60,
          }}
        >
          {/* Top section - Brand + Newsletter */}
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            {/* Left - Brand statement */}
            <Stack gap="lg">
              <Link
                href="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}
                aria-label="WCAG Monitor homepage"
              >
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <Text c="white" fw={800} size="xl">W</Text>
                </Box>
                <Text fw={800} size="xl" c="white" style={{ letterSpacing: '-0.02em' }}>
                  WCAG Monitor
                </Text>
              </Link>

              <Text
                size="xl"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  maxWidth: 400,
                }}
              >
                Making the web{' '}
                <Text
                  component="span"
                  inherit
                  style={{
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  accessible
                </Text>{' '}
                for everyone.
              </Text>

              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.5)', maxWidth: 350, lineHeight: 1.7 }}>
                Automated accessibility monitoring trusted by 2,000+ teams worldwide.
              </Text>
            </Stack>

            {/* Right - Newsletter */}
            <Box
              p="xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: 20,
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Text fw={600} size="lg" c="white" mb="xs">
                Stay updated
              </Text>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }} mb="lg">
                Get accessibility tips and product updates.
              </Text>

              {subscribed ? (
                <Box
                  p="md"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    borderRadius: 12,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <Text size="sm" c="white" fw={500}>
                    ✓ Thanks for subscribing!
                  </Text>
                </Box>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <Group gap="sm">
                    <TextInput
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      radius="xl"
                      size="md"
                      style={{ flex: 1 }}
                      styles={{
                        input: {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.4)',
                          },
                          '&:focus': {
                            borderColor: '#2563eb',
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      radius="xl"
                      size="md"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        fontWeight: 600,
                      }}
                    >
                      <IconArrowRight size={18} />
                    </Button>
                  </Group>
                </form>
              )}
            </Box>
          </Box>

          {/* Navigation links - Horizontal pills */}
          <Box
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
            }}
          >
            {footerLinks.map((link) => (
              <Anchor
                key={link.label}
                component={Link}
                href={link.href}
                px="lg"
                py="xs"
                style={{
                  display: 'inline-block',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 100,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {link.label}
              </Anchor>
            ))}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          py="lg"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Group justify="space-between" wrap="wrap" gap="lg">
            {/* Copyright */}
            <Group gap="xs">
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                © {new Date().getFullYear()} WCAG Monitor
              </Text>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>·</Text>
              <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                Made with{' '}
                <IconHeart
                  size={14}
                  style={{
                    display: 'inline',
                    verticalAlign: 'middle',
                    color: '#ef4444',
                    fill: '#ef4444',
                  }}
                />{' '}
                for accessibility
              </Text>
            </Group>

            {/* Social links */}
            <Group gap="xs">
              {socialLinks.map((social) => (
                <Anchor
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    border: '1px solid transparent',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${social.color}30`;
                    e.currentTarget.style.borderColor = `${social.color}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <social.icon size={18} stroke={1.5} />
                </Anchor>
              ))}
            </Group>
          </Group>
        </Box>
      </Container>

      {/* Animations */}
      <style jsx global>{`
        @keyframes footerOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -10px) scale(1.1); }
        }
        @keyframes footerOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 15px) scale(1.05); }
        }
      `}</style>
    </Box>
  );
}
