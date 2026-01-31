'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/scroll-reveal';
import { Devices, Books } from '@phosphor-icons/react';

export default function ServicesSection() {
  return (
    <section className="w-full py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background/95 to-background border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          {/* Section Title */}
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4 text-balance text-center">
            Services
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-lg text-muted-foreground mb-16 text-center">
            Accompagnement complet avec qualité garantie
          </p>
        </ScrollReveal>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Web & Mobile Development */}
          <motion.div
            className="group relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/40 hover:border-accent/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Devices className="w-6 h-6 text-accent" weight="duotone" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Développement Web & Mobile
              </h3>
              <div className="space-y-3 text-muted-foreground text-base leading-relaxed mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Applications complètes et robustes</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Architecture claire et scalable</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Code propre et bien documenté</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-1">Tarif</p>
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  25 000 – 50 000 DA
                </p>
              </div>
            </div>
          </motion.div>

          {/* Academic Writing */}
          <motion.div
            className="group relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-border/40 hover:border-accent/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Books className="w-6 h-6 text-accent" weight="duotone" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Rédaction académique
              </h3>
              <div className="space-y-3 text-muted-foreground text-base leading-relaxed mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>PFE, mémoires, rapports structurés</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Arguments logiques et pertinents</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Normes universitaires respectées</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground mb-1">Tarif</p>
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  5 000 – 10 000 DA
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
