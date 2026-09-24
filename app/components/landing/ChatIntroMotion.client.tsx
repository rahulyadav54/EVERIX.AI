import { motion } from 'framer-motion';
import { EverixLogo } from '~/components/brand/EverixLogo';
import { APP_SUBTAGLINE } from '~/utils/branding';
import { cubicEasingFn } from '~/utils/easings';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: cubicEasingFn },
  },
};

export function ChatIntroMotion() {
  return (
    <motion.div
      id="intro"
      className="mt-[12vh] sm:mt-[14vh] max-w-chat mx-auto flex flex-col items-center px-4 relative z-1 text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="mb-5">
        <EverixLogo variant="hero" className="everix-logo-hero mx-auto scale-[0.92] sm:scale-100" />
      </motion.div>
      <motion.p
        variants={item}
        className="mb-2 text-base sm:text-lg text-bolt-elements-textSecondary max-w-md text-balance leading-relaxed"
      >
        {APP_SUBTAGLINE}
      </motion.p>
      <motion.p variants={item} className="text-xs text-bolt-elements-textTertiary">
        Default: Google Gemini — change provider anytime via the gear icon.
      </motion.p>
    </motion.div>
  );
}
