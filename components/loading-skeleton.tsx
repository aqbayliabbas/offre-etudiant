'use client';

import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="w-full py-20 md:py-32 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Title skeleton */}
        <motion.div
          className="h-12 bg-gradient-to-r from-muted to-muted/50 rounded-lg mb-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Subtitle skeleton */}
        <motion.div
          className="h-6 bg-gradient-to-r from-muted to-muted/50 rounded-lg mb-12 max-w-md mx-auto"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />

        {/* Content skeletons */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-64 bg-gradient-to-r from-muted to-muted/50 rounded-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
