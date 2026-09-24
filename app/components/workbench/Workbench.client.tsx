import { useStore } from '@nanostores/react';
import { motion, type Variants } from 'framer-motion';
import { memo } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { cubicEasingFn } from '~/utils/easings';
import { renderLogger } from '~/utils/logger';
import { classNames } from '~/utils/classNames';
import { WorkbenchSurface } from './WorkbenchSurface.client';

interface WorkspaceProps {
  chatStarted?: boolean;
  isStreaming?: boolean;
}

const workbenchVariants = {
  closed: {
    width: 0,
    transition: { duration: 0.2, ease: cubicEasingFn },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: { duration: 0.2, ease: cubicEasingFn },
  },
} satisfies Variants;

/** Legacy overlay workbench — IDE mode uses {@link WorkbenchSurface} inside IdeWorkspace. */
export const Workbench = memo(({ chatStarted, isStreaming }: WorkspaceProps) => {
  renderLogger.trace('Workbench');

  const showWorkbench = useStore(workbenchStore.showWorkbench);

  return (
    chatStarted && (
      <motion.div initial="closed" animate={showWorkbench ? 'open' : 'closed'} variants={workbenchVariants} className="z-workbench hidden">
        <div
          className={classNames(
            'fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
            {
              'left-[var(--workbench-left)]': showWorkbench,
              'left-[100%]': !showWorkbench,
            },
          )}
        >
          <div className="absolute inset-0 px-6 h-full">
            <WorkbenchSurface isStreaming={isStreaming} layout="overlay" />
          </div>
        </div>
      </motion.div>
    )
  );
});
