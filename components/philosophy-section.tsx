'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/scroll-reveal';

export default function PhilosophySection() {
  return (
    <section className="w-full py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-background/95 border-t border-border/50">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-8 text-balance text-center">
            Notre approche
          </h2>
        </ScrollReveal>

        {/* Philosophy Box */}
        <motion.div
          className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-card/50 to-card/20 border border-border/40 backdrop-blur-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-lg md:text-2xl leading-relaxed text-foreground text-balance mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Chaque projet est traité comme un <span className="font-semibold text-accent">livrable professionnel</span>. Le nombre limité à 15 projets par service garantit un travail maîtrisé, un suivi personnalisé et des résultats conformes aux exigences académiques.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '15', label: 'projets maximum' },
              { value: '100%', label: 'suivi personnel' },
              { value: '∞', label: 'qualité prioritaire' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-background/50 border border-border/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-3xl font-bold text-accent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1, type: 'spring', stiffness: 100 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
