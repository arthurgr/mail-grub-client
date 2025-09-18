import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Mode = 'sync' | 'popLayout' | 'wait';

interface ModalAnimationProps {
  isOpen: boolean;
  children: React.ReactNode;
  motionKey?: React.Key;
  duration?: number;
  mode?: Mode;
  className?: string;
}

export default function ModalAnimation({
  isOpen,
  children,
  motionKey = 'modal',
  duration = 0.2,
  mode = 'wait',
  className,
}: ModalAnimationProps) {
  return (
    <AnimatePresence initial={false} mode={mode}>
      {isOpen && (
        <motion.div
          key={motionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
