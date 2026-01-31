'use client';

import { Button } from "@/components/ui/button"

import { motion } from 'framer-motion';
import AnimatedButton from '@/components/animated-button';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onCTAClick: () => void;
}

export default function HeroSection({ onCTAClick }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-br from-background via-background to-background/95 min-h-screen flex items-center pt-20 md:pt-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 px-4 md:px-8 py-12 md:py-0">
        {/* Eyebrow - Premium Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-accent"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <p className="text-xs md:text-sm font-medium text-accent tracking-wide uppercase">
            Projets Sélectionnés
          </p>
        </motion.div>

        {/* Main Headline - Extra Large */}
        <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-none text-balance">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Moins de
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            projets
          </motion.span>
          <motion.span
            className="block mt-2"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Plus de qualité
          </motion.span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Accompagnement professionnel pour étudiants en PFE. Seulement les projets sérieux, seulement le suivi qui compte.
        </motion.p>

        {/* Rarity Badge */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 backdrop-blur-md"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 102, 255, 0.15)' }}
          >
            <motion.div
              className="text-6xl md:text-7xl font-black text-accent"
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.7, type: 'spring', stiffness: 100 }}
            >
              15
            </motion.div>
            <p className="text-sm md:text-base text-muted-foreground mt-2">projets maximum par service</p>
          </motion.div>
        </motion.div>

        {/* CTA Button with Hover Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-6"
        >
          <AnimatedButton onClick={onCTAClick} size="lg">
            Demander une place
          </AnimatedButton>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 pt-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { label: 'Réponse rapide', value: '48 heures max' },
            { label: 'Suivi personnalisé', value: 'Point fixes' },
            { label: 'Places limitées', value: 'Sérieux garanti' },
          ].map((indicator, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
            >
              <p className="text-sm text-muted-foreground">{indicator.label}</p>
              <p className="text-lg font-semibold text-foreground">{indicator.value}</p>
              {index < 2 && <div className="hidden md:block w-px h-8 bg-border absolute right-0" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
