import { BRAND_MARK_SRC, APP_NAME } from '~/utils/branding';
import { classNames } from '~/utils/classNames';

const sizeClass = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
  xl: 'h-14 w-14 sm:h-16 sm:w-16',
  hero: 'h-16 w-16 sm:h-20 sm:w-20',
} as const;

interface EverixMarkProps {
  size?: keyof typeof sizeClass;
  className?: string;
  /** Set false for decorative uses (avatars). */
  withAlt?: boolean;
}

export function EverixMark({ size = 'md', className, withAlt = false }: EverixMarkProps) {
  return (
    <span
      className={classNames(
        'inline-flex overflow-hidden shrink-0 select-none items-center justify-start',
        sizeClass[size],
        className,
      )}
      aria-hidden={!withAlt}
    >
      <img
        src={BRAND_MARK_SRC}
        alt={withAlt ? APP_NAME : ''}
        className="h-full w-auto max-w-none object-left object-cover"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
