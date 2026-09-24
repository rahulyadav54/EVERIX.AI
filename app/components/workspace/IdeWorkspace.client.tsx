import type { Message } from 'ai';
import React, { type RefCallback } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useStore } from '@nanostores/react';
import { Messages } from '~/components/chat/Messages.client';
import { WorkbenchSurface } from '~/components/workbench/WorkbenchSurface.client';
import { mobileWorkspaceTab } from '~/lib/stores/workspace-ui';
import { classNames } from '~/utils/classNames';
import { AgentActivityPanel } from './AgentActivityPanel.client';
import { PromptComposer } from './PromptComposer.client';
import { WorkspaceTopBar } from './WorkspaceTopBar.client';

interface IdeWorkspaceProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  minComposerHeight: number;
  maxComposerHeight: number;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  handleStop?: () => void;
}

export function IdeWorkspace({
  textareaRef,
  messageRef,
  scrollRef,
  isStreaming,
  messages,
  enhancingPrompt,
  promptEnhanced,
  input = '',
  minComposerHeight,
  maxComposerHeight,
  sendMessage,
  handleInputChange,
  enhancePrompt,
  handleStop,
}: IdeWorkspaceProps) {
  const mobileTab = useStore(mobileWorkspaceTab);

  const composer = (
    <PromptComposer
      chatStarted
      textareaRef={textareaRef}
      input={input}
      isStreaming={!!isStreaming}
      enhancingPrompt={!!enhancingPrompt}
      promptEnhanced={!!promptEnhanced}
      minHeight={minComposerHeight}
      maxHeight={maxComposerHeight}
      sendMessage={sendMessage}
      handleInputChange={handleInputChange}
      enhancePrompt={enhancePrompt}
      handleStop={handleStop}
    />
  );

  return (
    <div className="everix-ide-root flex flex-col h-full w-full min-h-0">
      <WorkspaceTopBar />

      <div className="hidden lg:flex flex-1 min-h-0">
        <PanelGroup direction="horizontal" className="flex-1 min-h-0">
          <Panel defaultSize={28} minSize={22} maxSize={38} className="min-h-0">
            <div className="everix-agent-rail h-full">
              <div className="everix-agent-rail__pipeline">
                <AgentActivityPanel compact />
              </div>
              <div ref={scrollRef} className="everix-agent-rail__messages">
                <ClientOnly>
                  {() => (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full max-w-none gap-3"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  )}
                </ClientOnly>
              </div>
              <div className="everix-agent-rail__composer">{composer}</div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-bolt-elements-borderColor/50 hover:bg-accent-500/50 transition-colors" />

          <Panel defaultSize={72} minSize={45} className="min-h-0 p-2">
            <WorkbenchSurface isStreaming={isStreaming} layout="embedded" />
          </Panel>
        </PanelGroup>
      </div>

      <div className="flex lg:hidden flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {mobileTab === 'agent' && (
            <>
              <div className="everix-agent-rail__pipeline shrink-0">
                <AgentActivityPanel compact />
              </div>
              <div ref={scrollRef} className="everix-agent-rail__messages flex-1 px-2">
                <Messages
                  ref={messageRef}
                  className="flex flex-col w-full gap-3 pb-2"
                  messages={messages}
                  isStreaming={isStreaming}
                />
              </div>
              <div className="everix-agent-rail__composer shrink-0">{composer}</div>
            </>
          )}
          {mobileTab !== 'agent' && (
            <div className="flex-1 min-h-0 p-1.5">
              <WorkbenchSurface
                isStreaming={isStreaming}
                layout="embedded"
                mobileView={mobileTab === 'preview' ? 'preview' : 'code'}
              />
            </div>
          )}
        </div>
        <MobileNav active={mobileTab} />
      </div>
    </div>
  );
}

function MobileNav({ active }: { active: string }) {
  const items = [
    { id: 'agent', label: 'Agent', icon: 'i-ph:sparkle' },
    { id: 'files', label: 'Files', icon: 'i-ph:folder' },
    { id: 'code', label: 'Code', icon: 'i-ph:code' },
    { id: 'preview', label: 'Preview', icon: 'i-ph:browser' },
  ] as const;

  return (
    <nav className="everix-mobile-nav grid grid-cols-4 gap-0.5 px-2 pt-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={classNames(
            'flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] font-medium',
            active === item.id ? 'text-accent-500 bg-accent-500/10' : 'text-bolt-elements-textTertiary',
          )}
          onClick={() => mobileWorkspaceTab.set(item.id)}
        >
          <span className={`${item.icon} text-lg`} aria-hidden />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
