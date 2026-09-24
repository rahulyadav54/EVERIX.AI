import type { Message } from 'ai';
import React, { type RefCallback } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { IdeWorkspace } from '~/components/workspace/IdeWorkspace.client';
import { WorkspaceEntry } from '~/components/workspace/WorkspaceEntry.client';
import { classNames } from '~/utils/classNames';
import styles from './BaseChat.module.scss';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
}

const TEXTAREA_MIN_HEIGHT = 76;

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 220 : 200;

    const workspaceShell = (
      <div
        className="flex-1 min-h-0 w-full bg-bolt-elements-background-depth-1 animate-pulse"
        aria-hidden
      />
    );

    if (chatStarted) {
      return (
        <div ref={ref} className={classNames(styles.BaseChat, 'h-full w-full min-h-0')} data-chat-visible={showChat}>
          <ClientOnly>{() => <Menu />}</ClientOnly>
          <ClientOnly fallback={workspaceShell}>
            {() => (
              <IdeWorkspace
                textareaRef={textareaRef}
                messageRef={messageRef}
                scrollRef={scrollRef}
                isStreaming={isStreaming}
                messages={messages}
                enhancingPrompt={enhancingPrompt}
                promptEnhanced={promptEnhanced}
                input={input}
                minComposerHeight={TEXTAREA_MIN_HEIGHT}
                maxComposerHeight={TEXTAREA_MAX_HEIGHT}
                sendMessage={sendMessage}
                handleInputChange={handleInputChange}
                enhancePrompt={enhancePrompt}
                handleStop={handleStop}
              />
            )}
          </ClientOnly>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1',
        )}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <ClientOnly fallback={workspaceShell}>
          {() => (
            <WorkspaceEntry
              textareaRef={textareaRef}
              input={input}
              isStreaming={isStreaming}
              enhancingPrompt={enhancingPrompt}
              promptEnhanced={promptEnhanced}
              minHeight={TEXTAREA_MIN_HEIGHT}
              maxHeight={TEXTAREA_MAX_HEIGHT}
              sendMessage={sendMessage}
              handleInputChange={handleInputChange}
              enhancePrompt={enhancePrompt}
              handleStop={handleStop}
            />
          )}
        </ClientOnly>
      </div>
    );
  },
);
