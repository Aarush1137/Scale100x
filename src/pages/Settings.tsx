import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Bot, Link, RotateCcw, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Card, Badge, Input, Tabs, ConfirmModal } from '../components/ui';
import { showToast } from '../components/ui';
import { formatDateTime } from '../lib/utils';

const TABS = [
  { id: 'workspace', label: 'Workspace', icon: <SettingsIcon className="w-3.5 h-3.5" /> },
  { id: 'agents', label: 'Agents', icon: <Bot className="w-3.5 h-3.5" /> },
  { id: 'integrations', label: 'Integrations', icon: <Link className="w-3.5 h-3.5" /> },
  { id: 'events', label: 'Event Log', icon: <Database className="w-3.5 h-3.5" /> },
  { id: 'demo', label: 'Demo Controls', icon: <RotateCcw className="w-3.5 h-3.5" /> },
];

export default function Settings() {
  const { data, resetData, updateAgent } = useStore();
  const [activeTab, setActiveTab] = useState('workspace');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [wsName, setWsName] = useState('FreshBrew QSR Demo Workspace');

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Configure workspace, agents, and integrations</p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'workspace' && (
        <div className="space-y-4 max-w-xl">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Workspace Settings</h2>
            <Input label="Workspace Name" value={wsName} onChange={e => setWsName(e.target.value)} />
            <div>
              <label className="text-sm text-[var(--text-secondary)] font-medium">Default Brand</label>
              <select className="mt-1 w-full bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none">
                {data.brands.map(b => <option key={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--bg-app)] rounded-lg">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Demo Mode</p>
                <p className="text-xs text-[var(--text-muted)]">All data is stored in localStorage</p>
              </div>
              <Badge variant="yellow">ENABLED</Badge>
            </div>
            <Button onClick={() => showToast('Workspace settings saved')}>Save Changes</Button>
          </Card>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="space-y-4 max-w-2xl">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Agent Configuration</h2>
            {data.agents.map(agent => (
              <div key={agent.id} className="p-4 bg-[var(--bg-app)] border border-[var(--border)] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{agent.name}</p>
                  <Badge variant={agent.status === 'active' ? 'green' : 'yellow'}>{agent.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-muted)]">Qualification Threshold</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="range" min={0} max={100} value={agent.qualificationThreshold}
                        onChange={e => updateAgent(agent.id, { qualificationThreshold: parseInt(e.target.value) })}
                        className="flex-1" />
                      <span className="text-xs text-[var(--text-secondary)] font-mono w-8">{agent.qualificationThreshold}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-muted)]">Response Delay (sec)</label>
                    <input type="number" min={0} max={300} value={agent.responseDelay}
                      onChange={e => updateAgent(agent.id, { responseDelay: parseInt(e.target.value) })}
                      className="mt-1 w-full bg-white border border-[var(--border)] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none" />
                  </div>
                </div>
                {agent.type === 'whatsapp' && (
                  <div>
                    <label className="text-xs text-[var(--text-muted)]">Escalation Keywords</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.escalationKeywords.map(kw => (
                        <span key={kw} className="text-xs bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200 px-2 py-0.5 rounded">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button onClick={() => showToast('Agent settings saved')}>Save Agent Config</Button>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-3 max-w-2xl">
          {[
            { name: 'Meta Ads / Facebook', desc: 'Lead webhook for franchise ads', status: 'DEMO' },
            { name: 'Wati (WhatsApp Business)', desc: 'WhatsApp API for automated messaging', status: 'DEMO' },
            { name: 'Supabase (Database)', desc: 'Real-time database and auth', status: 'DEMO' },
            { name: 'Mailmodo (Email)', desc: 'Email sequences and nurture campaigns', status: 'DEMO' },
            { name: 'Sarvam AI (Voice)', desc: 'Hindi/English voice AI for calls', status: 'NOT CONFIGURED' },
            { name: 'Slack', desc: 'Team notifications and alerts', status: 'DEMO' },
            { name: 'Make.com (Automation)', desc: 'Workflow automation and webhooks', status: 'DEMO' },
          ].map(int => (
            <Card key={int.name} className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center">
                <Link className="w-4 h-4 text-[var(--text-secondary)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{int.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{int.desc}</p>
              </div>
              <Badge variant={int.status === 'NOT CONFIGURED' ? 'red' : 'yellow'}>{int.status}</Badge>
              <Button size="xs" variant="secondary" disabled={true}>Configure</Button>
            </Card>
          ))}
          <div className="p-3 bg-[var(--accent-subtle)] border border-blue-200 rounded-lg">
            <p className="text-xs text-[var(--accent)]">All integrations run in simulation mode. To connect live services, add API credentials via environment variables (see .env.example).</p>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Audit Event Log</h2>
            <span className="text-xs text-[var(--text-muted)]">{data.events.length} events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">Time</th>
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">Type</th>
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">Description</th>
                  <th className="text-left py-2 px-3 text-[var(--text-secondary)]">Entity</th>
                </tr>
              </thead>
              <tbody>
                {[...data.events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(event => (
                  <tr key={event.id} className="border-b border-[var(--border)]/50">
                    <td className="py-2 px-3 text-[var(--text-muted)] whitespace-nowrap">{formatDateTime(event.timestamp)}</td>
                    <td className="py-2 px-3"><Badge variant="gray">{event.type.replace(/_/g, ' ')}</Badge></td>
                    <td className="py-2 px-3 text-[var(--text-secondary)]">{event.description}</td>
                    <td className="py-2 px-3 text-[var(--text-muted)] font-mono">{event.entityType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'demo' && (
        <div className="space-y-4 max-w-lg">
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Demo Controls</h2>
            <p className="text-xs text-[var(--text-secondary)]">Manage demo data and reset the application to its initial seed state.</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Brands', count: data.brands.length },
                { label: 'Leads', count: data.leads.length },
                { label: 'Conversations', count: data.conversations.length },
                { label: 'Messages', count: data.messages.length },
                { label: 'Assets', count: data.assets.length },
                { label: 'Events', count: data.events.length },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between p-2 bg-[var(--bg-app)] rounded-lg">
                  <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
                  <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{stat.count}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[var(--danger-bg)] border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--danger)]">Reset will delete all your changes and restore the original seed data. This cannot be undone.</p>
            </div>

            <Button variant="danger" onClick={() => setResetConfirm(true)} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset to Seed Data
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">localStorage Usage</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              All application data is stored in browser localStorage under the key <code className="text-[var(--accent)] font-mono">scale100x_data</code>.
              No server, no database, no API calls in demo mode.
            </p>
            <div className="mt-3 p-2 bg-[var(--bg-app)] rounded-lg">
              <p className="text-xs font-mono text-[var(--text-secondary)]">~{Math.round(JSON.stringify(data).length / 1024)}KB used</p>
            </div>
          </Card>
        </div>
      )}

      <ConfirmModal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={() => {
          resetData();
          showToast('Data reset to seed state');
        }}
        title="Reset Demo Data"
        message="This will restore all data to the original seed state. All changes, new leads, messages, and assets will be lost."
        confirmLabel="Reset Now"
        variant="danger"
      />
    </div>
  );
}
