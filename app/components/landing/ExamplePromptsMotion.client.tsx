import { motion } from 'framer-motion';
import { cubicEasingFn } from '~/utils/easings';

interface ExamplePromptsMotionProps {
  prompts: { text: string }[];
  onSelect: (event: React.MouseEvent<HTMLButtonElement>, text: string) => void;
}

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.45 },
  },
};

const row = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: cubicEasingFn },
  },
};

export function ExamplePromptsMotion({ prompts, onSelect }: ExamplePromptsMotionProps) {
  return (
    <motion.div
      id="examples"
      className="relative w-full max-w-xl mx-auto mt-8 flex justify-center z-1"
      variants={list}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col gap-2 w-full px-4 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
        {prompts.map((examplePrompt, index) => (
          <motion.button
            key={index}
            type="button"
            variants={row}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(event) => onSelect(event, examplePrompt.text)}
            className="example-prompt-chip group flex items-center w-full gap-3 justify-between rounded-full border border-bolt-elements-borderColor/80 bg-bolt-elements-background-depth-1/60 backdrop-blur-sm px-4 py-2.5 text-sm text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary hover:border-accent-500/40"
          >
            <span className="text-left">{examplePrompt.text}</span>
            <motion.div
              className="i-ph:arrow-bend-down-left shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
