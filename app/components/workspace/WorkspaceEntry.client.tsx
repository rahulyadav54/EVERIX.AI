import React from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { LlmStatusBanner } from '~/components/chat/LlmStatusBanner.client';
import { EverixLogo } from '~/components/brand/EverixLogo';
import { APP_TAGLINE } from '~/utils/branding';
import { PromptComposer } from './PromptComposer.client';

const PROJECT_TYPES = [
  { id: 'web', label: 'Web App', icon: 'i-ph:browser' },
  { id: 'saas', label: 'SaaS', icon: 'i-ph:chart-line-up' },
  { id: 'dashboard', label: 'Dashboard', icon: 'i-ph:squares-four' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'i-ph:shopping-bag' },
  { id: 'mobile', label: 'Mobile App', icon: 'i-ph:device-mobile' },
  { id: 'landing', label: 'Landing Page', icon: 'i-ph:layout' },
  { id: 'api', label: 'API', icon: 'i-ph:plugs-connected' },
  { id: 'agent', label: 'AI Agent', icon: 'i-ph:robot' },
];

const STARTER_PROMPTS: Record<string, string> = {
  web: 'Build a modern web app with authentication, dashboard, and responsive UI.',
  saas: 'Build a SaaS dashboard for managing AI agents with billing and team settings.',
  dashboard: 'Create an analytics dashboard with charts, filters, and dark mode.',
  ecommerce: 'Build an e-commerce storefront with product grid, cart, and checkout UI.',
  mobile: 'Build a mobile-first PWA for task management with offline support.',
  landing: 'Create a premium landing page for an AI developer tool with pricing.',
  api: 'Scaffold a REST API with health checks, CRUD routes, and OpenAPI docs.',
  agent: 'Build an AI agent workspace with chat, tools, and activity timeline.',
};

interface WorkspaceEntryProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  input: string;
  isStreaming: boolean;
  enhancingPrompt: boolean;
  promptEnhanced: boolean;
  minHeight: number;
  maxHeight: number;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  handleStop?: () => void;
}

export function WorkspaceEntry(props: WorkspaceEntryProps) {
  return (
    <div className="everix-entry-page flex flex-col flex-1 min-h-0 w-full">
      <div className="everix-entry-ambient" aria-hidden>
        <div className="everix-entry-ambient__orb everix-entry-ambient__orb--a" />
        <div className="everix-entry-ambient__orb everix-entry-ambient__orb--b" />
      </div>
      <div className="everix-entry-inner">
        <ClientOnly>{() => <LlmStatusBanner />}</ClientOnly>

        <header className="everix-entry-hero text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-5">
            <EverixLogo variant="hero" showWordmark={false} className="everix-logo-hero" />
          </div>
          <h1 className="everix-hero-title">What will you build today?</h1>
          <p className="everix-hero-sub">{APP_TAGLINE}</p>
        </header>

        <PromptComposer {...props} chatStarted={false} />

        <div className="mt-6 sm:mt-8">
          <p className="text-xs font-medium uppercase tracking-wider text-bolt-elements-textTertiary mb-3 text-center sm:text-left">
            Start from a template
          </p>
          <div className="everix-template-grid">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className="everix-project-card everix-glass-panel"
                onClick={(event) => props.sendMessage?.(event, STARTER_PROMPTS[type.id])}
              >
                <span className={`${type.icon} text-lg text-accent-500 shrink-0`} aria-hidden />
                <span className="text-sm font-medium text-bolt-elements-textPrimary truncate">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
