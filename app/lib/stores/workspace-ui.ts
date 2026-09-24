import { atom } from 'nanostores';

export type MobileWorkspaceTab = 'agent' | 'files' | 'code' | 'preview';
export type BottomDockTab = 'terminal' | 'problems' | 'console' | 'logs';

export const mobileWorkspaceTab = atom<MobileWorkspaceTab>('agent');
export const bottomDockTab = atom<BottomDockTab>('terminal');
