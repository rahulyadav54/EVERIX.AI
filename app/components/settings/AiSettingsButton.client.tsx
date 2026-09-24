import { useEffect, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { AiSettingsDialog } from './AiSettingsDialog.client';

export function AiSettingsButton() {
  const [open, setOpen] = useState(false);
  const [openTab, setOpenTab] = useState<'everix' | 'apikeys' | undefined>();

  useEffect(() => {
    const openSettings = (event: Event) => {
      const tab = (event as CustomEvent<{ tab?: 'apikeys' }>).detail?.tab;
      setOpenTab(tab);
      setOpen(true);
    };

    window.addEventListener('everix:open-ai-settings', openSettings);

    return () => window.removeEventListener('everix:open-ai-settings', openSettings);
  }, []);

  return (
    <>
      <IconButton
        title="AI settings & API keys"
        onClick={() => {
          setOpenTab(undefined);
          setOpen(true);
        }}
      >
        <div className="i-ph:gear-six text-lg" />
      </IconButton>
      <AiSettingsDialog
        open={open}
        initialTab={openTab}
        onClose={() => {
          setOpen(false);
          setOpenTab(undefined);
        }}
      />
    </>
  );
}
