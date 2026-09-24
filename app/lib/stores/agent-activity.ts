import { atom } from 'nanostores';

export type AgentStepStatus = 'pending' | 'running' | 'done' | 'error';

export interface AgentStep {
  id: string;
  label: string;
  status: AgentStepStatus;
  detail?: string;
}

export const agentActivityStore = atom<AgentStep[]>([]);

export function resetAgentActivity() {
  agentActivityStore.set([]);
}

export function upsertAgentStep(step: AgentStep) {
  const current = agentActivityStore.get();
  const index = current.findIndex((s) => s.id === step.id);

  if (index === -1) {
    agentActivityStore.set([...current, step]);

    return;
  }

  const next = [...current];
  next[index] = { ...next[index], ...step };
  agentActivityStore.set(next);
}

export function seedBuildPipeline() {
  agentActivityStore.set([
    { id: 'understand', label: 'Understanding requirements', status: 'running' },
    { id: 'plan', label: 'Planning architecture', status: 'pending' },
    { id: 'scaffold', label: 'Creating project structure', status: 'pending' },
    { id: 'deps', label: 'Installing dependencies', status: 'pending' },
    { id: 'build', label: 'Building application', status: 'pending' },
    { id: 'preview', label: 'Starting preview', status: 'pending' },
  ]);
}

export function markPipelineFromArtifact(actions: { type: string; status: string }[]) {
  if (actions.some((a) => a.type === 'file')) {
    upsertAgentStep({ id: 'understand', label: 'Understanding requirements', status: 'done' });
    upsertAgentStep({ id: 'plan', label: 'Planning architecture', status: 'done' });
    upsertAgentStep({ id: 'scaffold', label: 'Creating project structure', status: 'running' });
  }

  if (actions.some((a) => a.type === 'shell' && a.status === 'running')) {
    upsertAgentStep({ id: 'scaffold', label: 'Creating project structure', status: 'done' });
    upsertAgentStep({ id: 'deps', label: 'Installing dependencies', status: 'running' });
  }

  if (actions.every((a) => a.status === 'complete' || a.status === 'failed')) {
    upsertAgentStep({ id: 'deps', label: 'Installing dependencies', status: 'done' });
    upsertAgentStep({ id: 'build', label: 'Building application', status: 'done' });
    upsertAgentStep({ id: 'preview', label: 'Starting preview', status: 'running' });
  }
}
