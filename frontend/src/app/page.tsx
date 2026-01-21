import { Box } from '@mantine/core';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTA } from '@/components/landing/CTA';

export const metadata = {
  title: 'WCAG Monitor - Accessibility Testing Made Easy',
  description: 'Monitor your website accessibility with automated WCAG testing. Get alerts, reports, and trends.',
  keywords: 'accessibility,wcag,a11y,testing,monitoring',
};

export default function HomePage() {
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
        <Hero />
        <Features />
        <HowItWorks />
        <PricingSection />
        <CTA />
      </Box>
      <Footer />
    </Box>
  );
}
