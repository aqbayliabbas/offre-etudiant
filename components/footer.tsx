'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-4 md:px-8 bg-background border-t border-border">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          © Accompagnement PFE
        </motion.p>
      </motion.div>
    </footer>
  );
}
