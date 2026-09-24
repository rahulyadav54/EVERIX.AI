import type { Message } from 'ai';
import { motion } from 'framer-motion';
import React from 'react';
import { classNames } from '~/utils/classNames';
import { EverixMark } from '~/components/brand/EverixMark';
import { cubicEasingFn } from '~/utils/easings';
import { AssistantMessage } from './AssistantMessage';
import { UserMessage } from './UserMessage';

interface MessagesProps {
  id?: string;
  className?: string;
  isStreaming?: boolean;
  messages?: Message[];
}

export const Messages = React.forwardRef<HTMLDivElement, MessagesProps>((props: MessagesProps, ref) => {
  const { id, isStreaming = false, messages = [] } = props;

  return (
    <div id={id} ref={ref} className={props.className}>
      {messages.length > 0
        ? messages.map((message, index) => {
            const { role, content } = message;
            const isUserMessage = role === 'user';
            const isFirst = index === 0;
            const isLast = index === messages.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: cubicEasingFn }}
                className={classNames(
                  'everix-message-row flex gap-3 sm:gap-4 px-4 py-5 sm:px-5 w-full',
                  isUserMessage ? 'everix-message-row--user' : 'everix-message-row--assistant',
                  {
                    'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                      !isUserMessage && isStreaming && isLast,
                    'mt-3': !isFirst,
                  },
                )}
              >
                {isUserMessage ? (
                  <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary rounded-full shrink-0 self-start border border-bolt-elements-borderColor">
                    <div className="i-ph:user-fill text-lg" />
                  </div>
                ) : (
                  <div
                    className="everix-assistant-avatar flex items-center justify-center w-8 h-8 rounded-full shrink-0 self-start overflow-hidden p-0.5"
                    aria-hidden
                  >
                    <EverixMark size="xs" className="rounded-md" />
                  </div>
                )}
                <div className="grid grid-col-1 w-full min-w-0">
                  {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
                </div>
              </motion.div>
            );
          })
        : null}
      {isStreaming && (
        <div className="text-center w-full text-bolt-elements-textSecondary i-svg-spinners:3-dots-fade text-4xl mt-4"></div>
      )}
    </div>
  );
});
