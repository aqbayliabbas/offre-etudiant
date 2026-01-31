'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const directionVariants = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  };

  const variant = directionVariants[direction];

  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
export function ScrollRevealGroup({
  children,
  className = '',
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
