import { useStore } from '@nanostores/react';
import { agentActivityStore } from '~/lib/stores/agent-activity';
import { classNames } from '~/utils/classNames';

export function AgentActivityPanel({ compact }: { compact?: boolean }) {
  const steps = useStore(agentActivityStore);

  if (steps.length === 0) {
    return (
      <p className="text-[11px] text-bolt-elements-textTertiary px-0.5">
        Everix agent · <span className="text-bolt-elements-textSecondary">ready</span>
      </p>
    );
  }

  return (
    <div className={classNames('space-y-1', compact ? 'text-[11px]' : 'text-xs')}>
      <p className="text-[10px] uppercase tracking-wider text-bolt-elements-textTertiary font-medium mb-2">
        Build pipeline
      </p>
      {steps.map((step) => (
        <div
          key={step.id}
          className={classNames('everix-agent-step flex items-start gap-2 rounded-md px-2 py-1', {
            'is-running': step.status === 'running',
          })}
        >
          <StepIcon status={step.status} />
          <div className="min-w-0">
            <p className="text-bolt-elements-textPrimary leading-snug">{step.label}</p>
            {step.detail && <p className="text-bolt-elements-textTertiary truncate">{step.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepIcon({ status }: { status: string }) {
  if (status === 'done') {
    return <span className="i-ph:check-circle text-emerald-500 shrink-0 mt-0.5" />;
  }

  if (status === 'error') {
    return <span className="i-ph:warning-circle text-orange-500 shrink-0 mt-0.5" />;
  }

  if (status === 'running') {
    return <span className="i-svg-spinners:90-ring-with-bg text-accent-500 shrink-0 mt-0.5 everix-agent-step-dot" />;
  }

  return <span className="w-3.5 h-3.5 rounded-full border border-bolt-elements-borderColor shrink-0 mt-0.5" />;
}
