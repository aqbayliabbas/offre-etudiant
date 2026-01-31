'use client';

import { motion } from 'framer-motion';

interface AnimatedTextProps {
  children: string;
  className?: string;
  stagger?: boolean;
  blurReveal?: boolean;
}

export default function AnimatedText({
  children,
  className = '',
  stagger = true,
  blurReveal = false,
}: AnimatedTextProps) {
  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger ? 0.08 : 0,
        delayChildren: 0,
      },
    },
  };

  const wordVariants = {
    hidden: blurReveal ? { opacity: 0, filter: 'blur(10px)' } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      ...(blurReveal ? { filter: 'blur(0px)' } : { y: 0 }),
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={wordVariants} className="inline-block mr-1.5">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
