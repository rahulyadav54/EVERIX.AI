import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { EverixLogo } from '~/components/brand/EverixLogo';
import { AiSettingsButton } from '~/components/settings/AiSettingsButton.client';
export function Header() {
  const chat = useStore(chatStore);

  if (chat.started) {
    return null;
  }

  return (
    <header
      className={classNames(
        'everix-header-bar everix-entry-header-bar flex items-center px-4 sm:px-5 border-b h-[var(--header-height)] sticky top-0 z-header',
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        },
      )}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary min-w-0">
        <button
          type="button"
          className="i-ph:sidebar-simple-duotone text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-theme p-1 -ml-1 rounded-md hover:bg-bolt-elements-item-backgroundActive"
          aria-label="Open chat history"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('everix:toggle-menu'));
          }}
        />
        <a href="/" className="flex items-center shrink-0">
          <EverixLogo variant="header" />
        </a>
      </div>
      <span className="flex-1 px-3 sm:px-6 truncate text-center text-bolt-elements-textSecondary font-medium text-sm">
        New workspace
      </span>
      <ClientOnly>
        {() => (
          <div className="flex items-center gap-1 shrink-0">
            <AiSettingsButton />
            {chat.started && (
              <div className="mr-1">
                <HeaderActionButtons />
              </div>
            )}
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
