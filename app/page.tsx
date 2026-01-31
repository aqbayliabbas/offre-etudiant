'use client';

import { useState, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/hero-section';
import LoadingSkeleton from '@/components/loading-skeleton';

// Lazy load sections
const ServicesSection = dynamic(() => import('@/components/services-section'), {
  loading: () => <LoadingSkeleton />,
  ssr: true,
});

const PhilosophySection = dynamic(() => import('@/components/philosophy-section'), {
  loading: () => <LoadingSkeleton />,
  ssr: true,
});

const FormSection = dynamic(() => import('@/components/form-section'), {
  loading: () => <LoadingSkeleton />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/footer'), {
  loading: () => null,
  ssr: true,
});

export default function Home() {
  const [formRef, setFormRef] = useState<HTMLDivElement | null>(null);

  const scrollToForm = () => {
    formRef?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection onCTAClick={scrollToForm} />
      <Suspense fallback={<LoadingSkeleton />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <PhilosophySection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <div ref={setFormRef}>
          <FormSection />
        </div>
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </main>
  );
}
