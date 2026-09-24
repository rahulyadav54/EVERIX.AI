import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cubicEasingFn } from '~/utils/easings';

interface PromptEntranceMotionProps {
  children: ReactNode;
  chatStarted: boolean;
}

export function PromptEntranceMotion({ children, chatStarted }: PromptEntranceMotionProps) {
  return (
    <motion.div
      className="relative w-full max-w-chat mx-auto z-prompt"
      initial={chatStarted ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: chatStarted ? 0 : 0.28, ease: cubicEasingFn }}
    >
      {children}
    </motion.div>
  );
}
