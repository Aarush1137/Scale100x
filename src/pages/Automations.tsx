import React from 'react';
import { Play, Pause, Zap, ChevronRight, Activity, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Card, Badge } from '../components/ui';
import { showToast } from '../components/ui';
import { formatDistanceToNow } from '../lib/utils';
import type { WorkflowStep } from '../types';

const STEP_TYPE_COLORS = {
  trigger: 'border-blue-400 bg-[var(--accent-subtle)]',
  action: 'border-[var(--border)] bg-[var(--bg-app)]',
  condition: 'border-amber-400 bg-[var(--warning-bg)]',
  human_checkpoint: 'border-orange-400 bg-orange-50',
};

const STEP_TYPE_LABELS = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  human_checkpoint: 'Human Checkpoint',
};

export default function Automations() {
  const { data, runWorkflowSample, toggleWorkflow } = useStore();
  const workflow = data.workflows[0];
  const runs = data.workflowRuns.slice(0, 20);

  const timeSaved = workflow ? workflow.leadsProcessed * 45 : 0;
  const hoursSaved = Math.floor(timeSaved / 60);
  const minutesSaved = timeSaved % 60;

  function handleRunSample() {
    runWorkflowSample();
    showToast('Sample workflow execution started');
  }

  function handleToggle() {
    if (workflow) {
      toggleWorkflow(workflow.id);
      showToast(workflow.status === 'running' ? 'Workflow paused' : 'Workflow resumed');
    }
  }

  if (!workflow) return <div className="p-6 text-[var(--text-muted)]">No workflows configured</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Automation Workflows</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">End-to-end franchise lead automation pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="yellow">DEMO/SIMULATED</Badge>
          <Button size="sm" variant="secondary" onClick={handleRunSample} className="gap-2">
            <Zap className="w-4 h-4" /> Run Sample
          </Button>
          <Button
            size="sm"
            variant={workflow.status === 'running' ? 'secondary' : 'success'}
            onClick={handleToggle}
            className="gap-2"
          >
            {workflow.status === 'running' ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-mono text-[var(--accent)]">{workflow.runsCount}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Total Runs</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-mono text-[var(--success)]">{workflow.leadsProcessed}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Leads Processed</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-mono text-[var(--warning)]">{hoursSaved}h {minutesSaved}m</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Time Saved</p>
          <p className="text-xs text-[var(--text-muted)]">45 min/lead est.</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <div className={`w-2 h-2 rounded-full ${workflow.status === 'running' ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'}`} />
            <p className="text-sm font-bold text-[var(--text-primary)] capitalize">{workflow.status}</p>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Workflow Status</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{workflow.name}</h2>
          <Badge variant={workflow.status === 'running' ? 'green' : 'yellow'}>{workflow.status}</Badge>
        </div>

        <div className="flex items-start gap-2 overflow-x-auto pb-4">
          {workflow.steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex-shrink-0 w-44 border rounded-xl p-3 ${STEP_TYPE_COLORS[step.type]}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={step.type === 'human_checkpoint' ? 'orange' : step.type === 'condition' ? 'yellow' : step.type === 'trigger' ? 'blue' : 'gray'}>
                    {STEP_TYPE_LABELS[step.type]}
                  </Badge>
                  {step.type === 'human_checkpoint' && <UserCheck className="w-3.5 h-3.5 text-orange-500" />}
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">{step.name}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2">{step.description}</p>
                <div className="space-y-1">
                  {step.dataPassed.slice(0, 3).map(d => (
                    <span key={d} className="inline-block text-xs bg-[var(--bg-hover)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded mr-1 mb-0.5 font-mono">{d}</span>
                  ))}
                  {step.dataPassed.length > 3 && <span className="text-xs text-[var(--text-muted)]">+{step.dataPassed.length - 3} more</span>}
                </div>
              </div>
              {idx < workflow.steps.length - 1 && (
                <div className="flex items-center flex-shrink-0 mt-6">
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Integration Status</p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Meta Ads Webhook', status: 'DEMO' },
              { name: 'Wati WhatsApp API', status: 'DEMO' },
              { name: 'Supabase CRM', status: 'SIMULATED' },
              { name: 'Slack Notifications', status: 'DEMO' },
              { name: 'Email via Mailmodo', status: 'DEMO' },
            ].map(int => (
              <div key={int.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg">
                <AlertCircle className="w-3 h-3 text-[var(--warning)]" />
                <span className="text-xs text-[var(--text-secondary)]">{int.name}</span>
                <Badge variant="yellow">{int.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Execution Log</h2>
          <Activity className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Run ID</th>
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Lead</th>
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Trigger</th>
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Status</th>
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Steps</th>
                <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Started</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(run => (
                <tr key={run.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)]">
                  <td className="py-2 px-3 text-[var(--text-muted)] font-mono">{run.id.slice(0, 8)}</td>
                  <td className="py-2 px-3 text-[var(--text-secondary)]">{run.leadName || 'Sample'}</td>
                  <td className="py-2 px-3 text-[var(--text-secondary)]">{run.triggeredBy}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {run.status === 'success' ? <CheckCircle className="w-3 h-3 text-[var(--success)]" /> : <AlertCircle className="w-3 h-3 text-[var(--danger)]" />}
                      <span className={run.status === 'success' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>{run.status}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[var(--text-secondary)]">{run.steps.length}/{workflow.steps.length}</td>
                  <td className="py-2 px-3 text-[var(--text-muted)]">{formatDistanceToNow(run.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Time Savings Calculation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-[var(--bg-app)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-muted)]">Manual time/lead</p>
            <p className="text-lg font-bold font-mono text-[var(--text-primary)]">45 min</p>
            <p className="text-xs text-[var(--text-muted)]">Qualification + entry</p>
          </div>
          <div className="bg-[var(--bg-app)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-muted)]">AI time/lead</p>
            <p className="text-lg font-bold font-mono text-[var(--success)]">&lt;2 min</p>
            <p className="text-xs text-[var(--text-muted)]">Automated</p>
          </div>
          <div className="bg-[var(--bg-app)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-muted)]">Leads processed</p>
            <p className="text-lg font-bold font-mono text-[var(--accent)]">{workflow.leadsProcessed}</p>
            <p className="text-xs text-[var(--text-muted)]">This month</p>
          </div>
          <div className="bg-[var(--bg-app)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-muted)]">Total saved</p>
            <p className="text-lg font-bold font-mono text-[var(--warning)]">{hoursSaved}h {minutesSaved}m</p>
            <p className="text-xs text-[var(--text-muted)]">This month</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
