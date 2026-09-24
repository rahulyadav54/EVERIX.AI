import { BRAND_MARK_SRC, APP_NAME } from '~/utils/branding';
import { classNames } from '~/utils/classNames';

const sizeClass = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
  xl: 'h-11 w-11 sm:h-12 sm:w-12',
  hero: 'h-14 w-14 sm:h-16 sm:w-16',
} as const;

interface EverixMarkProps {
  size?: keyof typeof sizeClass;
  className?: string;
  /** Set false for decorative uses (avatars). */
  withAlt?: boolean;
}

/** Crops the emblem from the top of the portrait brand PNG. */
export function EverixMark({ size = 'md', className, withAlt = false }: EverixMarkProps) {
  return (
    <span
      className={classNames(
        'inline-flex overflow-hidden shrink-0 select-none rounded-lg ring-1 ring-white/10',
        sizeClass[size],
        className,
      )}
      aria-hidden={!withAlt}
    >
      <img
        src={BRAND_MARK_SRC}
        alt={withAlt ? APP_NAME : ''}
        className="block w-full h-auto min-h-[340%] max-w-none object-cover object-top pointer-events-none"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
