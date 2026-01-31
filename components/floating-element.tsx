'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export default function FloatingElement({
  children,
  delay = 0,
  duration = 4,
  distance = 20,
  className = '',
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Rotating element animation
export function RotatingElement({
  children,
  delay = 0,
  duration = 10,
  className = '',
}: Omit<FloatingElementProps, 'distance'>) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
}

// Pulsing element animation
export function PulsingElement({
  children,
  delay = 0,
  duration = 2,
  className = '',
}: Omit<FloatingElementProps, 'distance'>) {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
