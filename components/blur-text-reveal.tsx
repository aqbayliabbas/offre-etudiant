'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface BlurTextRevealProps {
  children: string;
  className?: string;
}

export default function BlurTextReveal({ children, className = '' }: BlurTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [10, 0]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, filter: blur.get ? blur : 'blur(10px)' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlurTextWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {word}{' '}
    </motion.span>
  );
}
