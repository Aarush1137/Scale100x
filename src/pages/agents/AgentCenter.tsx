import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Phone, Mail, Zap, Settings, Play, Pause, Activity } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Card, Badge, Input } from '../../components/ui';
import { showToast } from '../../components/ui';
import { formatDistanceToNow } from '../../lib/utils';
import type { AgentConfig } from '../../types';

const AGENT_ICONS = {
  meta_ads: Zap,
  whatsapp: MessageSquare,
  voice: Phone,
  email: Mail,
};

export default function AgentCenter() {
  const { data, updateAgent } = useStore();
  const navigate = useNavigate();
  const [configOpen, setConfigOpen] = useState<string | null>(null);

  function toggleStatus(agent: AgentConfig) {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    updateAgent(agent.id, { status: newStatus });
    showToast(`${agent.name} ${newStatus === 'active' ? 'resumed' : 'paused'}`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">AI Agent Center</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage and monitor AI sales agents</p>
        </div>
        <Button onClick={() => navigate('/agents/whatsapp')} className="gap-2">
          <MessageSquare className="w-4 h-4" /> WhatsApp Workspace
        </Button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Agents', value: data.agents.filter(a => a.status === 'active').length, color: 'text-[var(--success)]' },
          { label: 'Total Conversations', value: data.agents.reduce((s, a) => s + a.conversationCount, 0), color: 'text-[var(--accent)]' },
          { label: 'Human Queue', value: data.conversations.filter(c => c.status === 'Human Active' || c.status === 'Escalated').length, color: 'text-[var(--warning)]' },
          { label: 'Resolved Today', value: data.conversations.filter(c => c.status === 'Resolved').length, color: 'text-[var(--success)]' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.agents.map(agent => {
          const Icon = AGENT_ICONS[agent.type];
          const isOpen = configOpen === agent.id;
          return (
            <Card key={agent.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.status === 'active' ? 'bg-blue-900/30' : 'bg-[var(--bg-hover)]'}`}>
                    <Icon className={`w-5 h-5 ${agent.status === 'active' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{agent.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                      <Badge variant={agent.status === 'active' ? 'green' : agent.status === 'paused' ? 'yellow' : 'gray'}>
                        {agent.status}
                      </Badge>
                      <Badge variant="gray">DEMO/SIMULATED</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    variant={agent.status === 'active' ? 'secondary' : 'success'}
                    onClick={() => toggleStatus(agent)}
                    className="gap-1"
                  >
                    {agent.status === 'active' ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Resume</>}
                  </Button>
                  <Button size="xs" variant="ghost" onClick={() => setConfigOpen(isOpen ? null : agent.id)}>
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">{agent.purpose}</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[var(--bg-app)] rounded-lg p-2">
                  <p className="text-xs text-[var(--text-muted)]">Conversations</p>
                  <p className="text-sm font-bold font-mono text-[var(--text-primary)]">{agent.conversationCount}</p>
                </div>
                <div className="bg-[var(--bg-app)] rounded-lg p-2">
                  <p className="text-xs text-[var(--text-muted)]">Last Activity</p>
                  <p className="text-xs text-[var(--text-secondary)]">{formatDistanceToNow(agent.lastActivity)}</p>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-[var(--border)] pt-3 space-y-3">
                  <p className="text-xs font-medium text-[var(--text-secondary)]">Configuration</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Qualification threshold</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number" min={0} max={100} value={agent.qualificationThreshold}
                          onChange={e => updateAgent(agent.id, { qualificationThreshold: parseInt(e.target.value) })}
                          className="w-14 bg-[var(--bg-app)] border border-[var(--border)] rounded px-2 py-0.5 text-xs text-[var(--text-primary)] text-center focus:outline-none"
                        />
                        <span className="text-xs text-[var(--text-muted)]">score</span>
                      </div>
                    </div>
                    {agent.type === 'whatsapp' && (
                      <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">Escalation keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.escalationKeywords.map(kw => (
                            <span key={kw} className="text-xs bg-red-900/20 text-[var(--danger)] border border-red-800/20 px-2 py-0.5 rounded">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {Object.entries(agent.config).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)] capitalize">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="text-xs text-[var(--text-secondary)] font-mono">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Agent Activity</h2>
          <Activity className="w-4 h-4 text-[var(--text-muted)]" />
        </div>
        <div className="space-y-2">
          {data.events.filter(e => ['human_takeover', 'ai_resume', 'message_sent', 'agent_updated', 'agent_paused'].includes(e.type)).slice(0, 8).map(event => (
            <div key={event.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)]/50">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.type === 'human_takeover' ? 'bg-yellow-400' : event.type === 'ai_resume' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              <p className="text-xs text-[var(--text-secondary)] flex-1">{event.description}</p>
              <span className="text-xs text-[var(--text-muted)]">{formatDistanceToNow(event.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
