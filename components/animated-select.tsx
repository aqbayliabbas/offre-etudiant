'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

interface AnimatedSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AnimatedSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 text-left bg-card/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:border-border flex items-center justify-between group"
        whileHover={{ borderColor: 'var(--border)' }}
      >
        <span className="text-foreground">{selectedLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown className="w-5 h-5 text-muted-foreground" weight="bold" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border/50 rounded-2xl backdrop-blur-md shadow-lg shadow-black/10 overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-5 py-3 text-left transition-colors duration-200 ${value === option.value
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-foreground hover:bg-accent/5'
                  }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Check className="w-5 h-5 text-accent" weight="bold" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
