import { classNames } from '~/utils/classNames';
import { APP_NAME, APP_NAME_SHORT, BRAND_LOGO_SRC } from '~/utils/branding';
import { EverixMark } from './EverixMark';

interface EverixLogoProps {
  className?: string;
  variant?: 'icon' | 'header' | 'mark' | 'hero' | 'full';
  showWordmark?: boolean;
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={classNames('font-semibold tracking-tight text-bolt-elements-textPrimary truncate', className)}>
      {APP_NAME_SHORT}
      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
        {' '}
        AI
      </span>
    </span>
  );
}

/** Wide marketing lockup only — capped height so portrait PNGs do not blow up the layout. */
function BrandArtwork({ className }: { className?: string }) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={APP_NAME}
      className={classNames('object-contain w-auto max-h-10 max-w-[9rem] sm:max-h-11 sm:max-w-[10rem]', className)}
      decoding="async"
      draggable={false}
    />
  );
}

export function EverixLogo({ className, variant = 'header', showWordmark = true }: EverixLogoProps) {
  if (variant === 'icon') {
    return <EverixMark size="md" className={className} />;
  }

  if (variant === 'full') {
    return <BrandArtwork className={className} />;
  }

  if (variant === 'hero') {
    return (
      <span className={classNames('inline-flex flex-col items-center gap-2 sm:gap-2.5', className)}>
        <EverixMark size="hero" className="everix-logo-hero" withAlt />
        {showWordmark && <Wordmark className="text-base sm:text-lg" />}
      </span>
    );
  }

  return (
    <span className={classNames('inline-flex items-center gap-2 min-w-0', className)}>
      <EverixMark size={variant === 'mark' ? 'sm' : 'md'} />
      {showWordmark && <Wordmark className="text-sm sm:text-base" />}
      <span className="sr-only">{APP_NAME}</span>
    </span>
  );
}
