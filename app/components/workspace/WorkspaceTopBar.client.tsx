import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { EverixLogo } from '~/components/brand/EverixLogo';
import { AiSettingsButton } from '~/components/settings/AiSettingsButton.client';
import { HeaderActionButtons } from '~/components/header/HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { displayProviderLabel } from '~/lib/llm/provider-registry';
import { llmSettingsStore } from '~/lib/stores/llm-settings';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { classNames } from '~/utils/classNames';

export function WorkspaceTopBar() {
  const llm = useStore(llmSettingsStore);
  const theme = useStore(themeStore);

  return (
    <header className="everix-workspace-topbar flex items-center gap-2 px-3 sm:px-4 h-[var(--header-height)] shrink-0 z-header">
      <button
        type="button"
        className="i-ph:sidebar-simple-duotone text-xl text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary p-1 rounded-md hover:bg-bolt-elements-item-backgroundActive"
        aria-label="Open projects"
        onClick={() => window.dispatchEvent(new CustomEvent('everix:toggle-menu'))}
      />
      <a href="/" className="flex items-center shrink-0 min-w-0" aria-label="Everix AI home">
        <EverixLogo variant="header" className="scale-90 sm:scale-100 origin-left" />
      </a>

      <div className="hidden md:flex items-center gap-1 text-xs text-bolt-elements-textTertiary ml-2">
        <span className="i-ph:folder-notch text-base opacity-70" />
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </div>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center gap-2 text-xs rounded-full border border-bolt-elements-borderColor/60 px-3 py-1 text-bolt-elements-textSecondary">
        <span className="i-ph:sparkle text-accent-500" />
        {displayProviderLabel(llm)}
        <span className="w-1 h-1 rounded-full bg-emerald-500" title="Connected" />
      </div>

      <button
        type="button"
        className="i-ph:git-branch text-lg p-1.5 rounded-md text-bolt-elements-textTertiary opacity-60 cursor-not-allowed"
        title="Git integration (coming soon)"
        disabled
        aria-label="Git"
      />

      <button
        type="button"
        className={classNames(
          'text-lg p-1.5 rounded-md text-bolt-elements-textSecondary hover:bg-bolt-elements-item-backgroundActive',
          theme === 'dark' ? 'i-ph:sun-dim' : 'i-ph:moon-stars',
        )}
        aria-label="Toggle theme"
        onClick={() => toggleTheme()}
      />

      <ClientOnly>
        {() => (
          <div className="flex items-center gap-1">
            <AiSettingsButton />
            <HeaderActionButtons />
          </div>
        )}
      </ClientOnly>
    </header>
  );
}
