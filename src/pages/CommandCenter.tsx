import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, TrendingUp, MessageSquare, Bot, UserCheck, AlertTriangle,
  Activity, Coffee, Zap, Clock, Target
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatCard, Card, Badge, ScoreBadge } from '../components/ui';
import { formatDistanceToNow } from '../lib/utils';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function CommandCenter() {
  const { data } = useStore();
  const navigate = useNavigate();

  const totalLeads = data.leads.length;
  const highIntentLeads = data.leads.filter(l => l.intentScore >= 75).length;
  const wonLeads = data.leads.filter(l => l.stage === 'Won').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const activeAgents = data.agents.filter(a => a.status === 'active').length;
  const humanQueue = data.conversations.filter(c => c.status === 'Human Active' || c.status === 'Escalated').length;

  const stages = ['New', 'Contacted', 'Qualified', 'Consultation', 'Proposal', 'Negotiation', 'Won'];
  const funnelData = stages.map(stage => ({
    stage,
    count: data.leads.filter(l => l.stage === stage).length,
  }));

  const readinessData = [
    { name: 'Score 78', value: 78 },
    { name: 'Remaining', value: 22 },
  ];

  const autoData = [
    { name: 'Meta Ads', handled: 34, escalated: 3 },
    { name: 'WhatsApp AI', handled: 47, escalated: 5 },
    { name: 'Email', handled: 28, escalated: 1 },
  ];

  const recentConvs = [...data.conversations]
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .slice(0, 5);

  const recentEvents = [...data.events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Command Center</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">FreshBrew QSR — Franchise Operations Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green"><span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full mr-1" />Live</Badge>
          <Badge variant="yellow">DEMO DATA</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Brands" value={data.brands.length} icon={<Coffee className="w-4 h-4" />} color="blue" onClick={() => navigate('/onboarding')} />
        <StatCard label="Total Leads" value={totalLeads} icon={<Users className="w-4 h-4" />} color="blue" trend={12} onClick={() => navigate('/crm')} />
        <StatCard label="High Intent" value={highIntentLeads} sub="Score ≥75" icon={<Target className="w-4 h-4" />} color="green" onClick={() => navigate('/crm')} />
        <StatCard label="Conversion" value={`${conversionRate}%`} icon={<TrendingUp className="w-4 h-4" />} color="purple" onClick={() => navigate('/crm')} />
        <StatCard label="Active AI Agents" value={activeAgents} icon={<Bot className="w-4 h-4" />} color="blue" onClick={() => navigate('/agents')} />
        <StatCard label="Human Queue" value={humanQueue} sub="needs review" icon={<AlertTriangle className="w-4 h-4" />} color={humanQueue > 0 ? 'yellow' : 'green'} onClick={() => navigate('/agents/whatsapp')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Lead Funnel</h2>
            <button onClick={() => navigate('/crm')} className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer">View CRM →</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-secondary)' }}
              />
              <Bar dataKey="count" fill="#315EFB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Brand Readiness</h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={readinessData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                  <Cell fill="#315EFB" />
                  <Cell fill="#E5E8ED" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-4">
              <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">78</p>
              <p className="text-xs text-[var(--text-muted)]">AI Readiness Score</p>
              <span className="text-xs text-[var(--success)] font-medium mt-2 block">Improving</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Recent Conversations</h2>
            <button onClick={() => navigate('/agents/whatsapp')} className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer">View all →</button>
          </div>
          <div className="space-y-2">
            {recentConvs.map((conv, index) => {
              const avatarStyles = [
                'bg-[var(--accent-subtle)] text-[var(--accent)]',
                'bg-purple-50 text-purple-600',
                'bg-green-50 text-[var(--success)]',
                'bg-orange-50 text-orange-600',
                'bg-pink-50 text-pink-600',
              ];
              return (
              <div
                key={conv.id}
                onClick={() => navigate('/agents/whatsapp')}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarStyles[index % avatarStyles.length]}`}>
                  {conv.leadName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{conv.leadName}</span>
                    <StatusBadge status={conv.status} />
                    {conv.unreadCount > 0 && (
                      <span className="ml-auto w-4 h-4 flex items-center justify-center bg-[var(--accent)] text-white text-xs rounded-full">{conv.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{formatDistanceToNow(conv.lastMessageAt)}</span>
              </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentEvents.map(event => (
              <div key={event.id} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDistanceToNow(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Automation Performance</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Last 30 days</p>
          </div>
          <button onClick={() => navigate('/automations')} className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer">View details →</button>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={autoData} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="handled" fill="#315EFB" radius={[0, 4, 4, 0]} name="AI Handled" />
            <Bar dataKey="escalated" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Escalated" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-3 pt-3 border-t border-[var(--border)]">
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--text-primary)] font-mono">45m</p>
            <p className="text-xs text-[var(--text-muted)]">Avg time saved/lead</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--text-primary)] font-mono">109</p>
            <p className="text-xs text-[var(--text-muted)]">Conversations handled</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--text-primary)] font-mono">82%</p>
            <p className="text-xs text-[var(--text-muted)]">AI resolution rate</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[var(--accent)] font-mono">~81h</p>
            <p className="text-xs text-[var(--text-muted)]">Total hours saved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'blue' | 'yellow' | 'red' | 'green' | 'gray' }> = {
    'AI Active': { label: 'AI', variant: 'blue' },
    'Human Active': { label: 'Human', variant: 'yellow' },
    'Escalated': { label: 'Escalated', variant: 'red' },
    'Resolved': { label: 'Resolved', variant: 'green' },
  };
  const m = map[status] || { label: status, variant: 'gray' };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
