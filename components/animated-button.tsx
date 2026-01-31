'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}: AnimatedButtonProps) {
  const baseStyles =
    'relative font-semibold rounded-full transition-all duration-300 overflow-hidden inline-flex items-center justify-center';

  const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 md:px-12 py-4 md:py-5 text-base md:text-lg',
  };

  const variantMap = {
    primary:
      'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-lg hover:shadow-accent/30',
    secondary:
      'bg-card/50 border border-border/50 text-foreground hover:bg-card hover:border-border',
  };

  const disabledStyles = disabled ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${sizeMap[size]} ${variantMap[variant]} ${disabledStyles} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated background on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent"
        initial={{ opacity: 0, x: '-100%' }}
        whileHover={{ opacity: 1, x: '100%' }}
        transition={{ duration: 0.5 }}
      />

      {/* Bottom underline animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-accent-foreground/50"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
