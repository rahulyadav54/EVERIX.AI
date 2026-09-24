import { classNames } from '~/utils/classNames';
import { APP_NAME, BRAND_LOGO_SRC } from '~/utils/branding';

interface EverixLogoProps {
  className?: string;
  /** Compact size for the header; larger for marketing hero */
  variant?: 'header' | 'hero';
}

export function EverixLogo({ className, variant = 'header' }: EverixLogoProps) {
  const isHero = variant === 'hero';

  return (
    <span className="inline-flex items-center">
      <img
        src={BRAND_LOGO_SRC}
        alt={APP_NAME}
        className={classNames(
          'object-contain',
          isHero ? 'h-36 sm:h-44 w-auto max-w-[min(100%,22rem)]' : 'h-9 w-auto max-w-[10.5rem]',
          className,
        )}
        decoding="async"
      />
    </span>
  );
}
