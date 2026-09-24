import { classNames } from '~/utils/classNames';
import { APP_NAME, BRAND_LOGO_SRC } from '~/utils/branding';
import { EverixMark } from './EverixMark';

interface EverixLogoProps {
  className?: string;
  variant?: 'icon' | 'header' | 'mark' | 'hero' | 'full';
  /** Ignored when using the full brand PNG (wordmark is in the artwork). */
  showWordmark?: boolean;
}

const headerLogoClass = 'object-contain h-7 sm:h-8 w-auto max-w-[11rem]';
const heroLogoClass = 'object-contain w-full max-w-[min(92vw,20rem)] sm:max-w-[22rem] h-auto';

export function EverixLogo({ className, variant = 'header' }: EverixLogoProps) {
  if (variant === 'icon') {
    return <EverixMark size="md" className={className} />;
  }

  if (variant === 'hero') {
    return (
      <img
        src={BRAND_LOGO_SRC}
        alt={APP_NAME}
        className={classNames(heroLogoClass, className)}
        decoding="async"
        draggable={false}
      />
    );
  }

  if (variant === 'full' || variant === 'header' || variant === 'mark') {
    return (
      <img
        src={BRAND_LOGO_SRC}
        alt={APP_NAME}
        className={classNames(headerLogoClass, variant === 'full' && 'h-9 max-w-[13rem]', className)}
        decoding="async"
        draggable={false}
      />
    );
  }

  return (
    <span className={classNames('inline-flex items-center gap-2 min-w-0', className)}>
      <EverixMark size="md" />
      <span className="sr-only">{APP_NAME}</span>
    </span>
  );
}
