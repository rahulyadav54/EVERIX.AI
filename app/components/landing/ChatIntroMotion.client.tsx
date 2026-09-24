import { motion } from 'framer-motion';
import { EverixLogo } from '~/components/brand/EverixLogo';
import { APP_SUBTAGLINE, APP_TAGLINE } from '~/utils/branding';
import { cubicEasingFn } from '~/utils/easings';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: cubicEasingFn },
  },
};

export function ChatIntroMotion() {
  return (
    <motion.div
      id="intro"
      className="mt-[16vh] max-w-chat mx-auto flex flex-col items-center px-4 relative z-1"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="mb-6">
        <EverixLogo variant="hero" className="everix-logo-hero" />
      </motion.div>
      <motion.h1
        variants={item}
        className="text-3xl sm:text-4xl text-center font-bold text-bolt-elements-textPrimary mb-2 uppercase tracking-[0.2em] sm:tracking-[0.28em]"
      >
        <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-blue-500 bg-clip-text text-transparent">
          {APP_TAGLINE}
        </span>
      </motion.h1>
      <motion.p variants={item} className="mb-4 text-center text-bolt-elements-textSecondary max-w-lg text-balance">
        {APP_SUBTAGLINE}
      </motion.p>
    </motion.div>
  );
}
