import { json, type MetaFunction } from '@remix-run/node';
import { ClientOnly } from 'remix-utils/client-only';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { APP_META_DESCRIPTION, APP_NAME } from '~/utils/branding';

function EverixClientFallback() {
  return (
    <div
      className="flex-1 min-h-0 w-full bg-bolt-elements-background-depth-1 everix-ide-root"
      aria-busy="true"
      aria-label="Loading Everix workspace"
    />
  );
}

export const meta: MetaFunction = () => {
  return [{ title: APP_NAME }, { name: 'description', content: APP_META_DESCRIPTION }];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="flex flex-col h-full min-h-dvh w-full overflow-hidden">
      <Header />
      <ClientOnly fallback={<EverixClientFallback />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
