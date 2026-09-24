import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { SendButton } from '~/components/chat/SendButton.client';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';

interface PromptComposerProps {
  chatStarted: boolean;
  input: string;
  isStreaming: boolean;
  enhancingPrompt: boolean;
  promptEnhanced: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  minHeight: number;
  maxHeight: number;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  handleStop?: () => void;
}

export function PromptComposer({
  chatStarted,
  input,
  isStreaming,
  enhancingPrompt,
  promptEnhanced,
  textareaRef,
  minHeight,
  maxHeight,
  sendMessage,
  handleInputChange,
  enhancePrompt,
  handleStop,
}: PromptComposerProps) {
  const landingShell = !chatStarted;

  return (
    <div className={classNames(landingShell ? 'everix-prompt-border' : 'everix-glass-panel rounded-xl w-full')}>
      {landingShell && <span className="everix-prompt-border__spark" aria-hidden />}
      <div className={classNames('overflow-hidden', landingShell ? 'everix-prompt-border__inner' : 'rounded-xl')}>
        {!chatStarted && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 sm:px-4 pt-3 text-[11px]">
            <span className="rounded-md border border-accent-500/30 bg-accent-500/10 text-accent-500 px-2 py-0.5 font-medium">
              Web App
            </span>
            <span className="rounded-md border border-bolt-elements-borderColor/50 px-2 py-0.5 text-bolt-elements-textTertiary">
              Attach (soon)
            </span>
            <span className="rounded-md border border-bolt-elements-borderColor/50 px-2 py-0.5 text-bolt-elements-textTertiary hidden xs:inline">
              Voice (soon)
            </span>
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="w-full px-3 sm:px-4 pt-3 sm:pt-4 pr-14 focus:outline-none resize-none text-sm sm:text-base text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent min-h-[4.75rem]"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage?.(event);
            }
          }}
          value={input}
          onChange={(event) => handleInputChange?.(event)}
          style={{ minHeight, maxHeight }}
          placeholder={chatStarted ? 'Ask Everix to change the app…' : 'What do you want to build?'}
          translate="no"
        />
        <ClientOnly>
          {() => (
            <SendButton
              show={input.length > 0 || isStreaming}
              isStreaming={isStreaming}
              onClick={(event) => {
                if (isStreaming) {
                  handleStop?.();
                  return;
                }
                sendMessage?.(event);
              }}
            />
          )}
        </ClientOnly>
        <div className="flex flex-wrap justify-between gap-2 text-sm px-3 sm:px-4 pb-3 pt-1">
          <IconButton
            title="Enhance prompt"
            disabled={input.length === 0 || enhancingPrompt}
            className={classNames('text-xs sm:text-sm', {
              'opacity-100!': enhancingPrompt,
              'text-bolt-elements-item-contentAccent! pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent!':
                promptEnhanced,
            })}
            onClick={() => enhancePrompt?.()}
          >
            {enhancingPrompt ? (
              <>
                <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-lg" />
                <span className="ml-1.5 hidden sm:inline">Enhancing…</span>
              </>
            ) : (
              <>
                  <div className="i-ph:sparkle text-lg text-accent-500" />
                {promptEnhanced && <span className="ml-1.5 hidden sm:inline">Enhanced</span>}
              </>
            )}
          </IconButton>
          <div className="text-[10px] sm:text-xs text-bolt-elements-textTertiary self-center">
            <kbd className="kdb">Enter</kbd> build
            <span className="hidden sm:inline">
              {' '}
              · <kbd className="kdb">Shift</kbd>+<kbd className="kdb">Enter</kbd> newline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
