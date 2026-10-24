import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, Plus, ChevronRight, ChevronDown, Filter, AlertTriangle, MessageSquare, CheckSquare, Square } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Card, Badge, Input, Select, Textarea, Modal, Drawer, ScoreBadge } from '../components/ui';
import { showToast } from '../components/ui';
import type { Lead, Stage, Priority, LeadSource } from '../types';
import { formatDate, formatCurrency, stageBadgeVariant, intentColor, formatDistanceToNow } from '../lib/utils';

const STAGES: Stage[] = ['New', 'Contacted', 'Qualified', 'Consultation', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const SOURCES: LeadSource[] = ['Meta Ads', 'WhatsApp', 'Website', 'Referral', 'LinkedIn', 'Cold Outreach'];

export default function SalesCRM() {
  const { data, changeLeadStage, addLeadNote, addLeadTask, toggleLeadTask, updateLead, createLead } = useStore();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof Lead>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState('');

  const [newLead, setNewLead] = useState({
    name: '', email: '', phone: '', city: '', budget: '', stage: 'New' as Stage,
    source: 'Meta Ads' as LeadSource, priority: 'Medium' as Priority,
  });

  const now = Date.now();
  const isOverdue = (lead: Lead) => lead.followUpDate && new Date(lead.followUpDate).getTime() < now && lead.stage !== 'Won' && lead.stage !== 'Lost';

  const filtered = data.leads
    .filter(l => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (stageFilter && l.stage !== stageFilter) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      if (priorityFilter && l.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortAsc ? cmp : -cmp;
    });

  function handleSort(key: keyof Lead) {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(false); }
  }

  function handleCreateLead() {
    if (!newLead.name.trim()) { showToast('Lead name required', 'error'); return; }
    const lead: Lead = {
      id: uuidv4(),
      name: newLead.name, email: newLead.email, phone: newLead.phone,
      city: newLead.city, budget: parseInt(newLead.budget) || 0,
      stage: newLead.stage, source: newLead.source, priority: newLead.priority,
      intentScore: 50, brandId: data.brands[0]?.id || '', ownerId: 'user-demo',
      notes: '', followUpDate: null, conversationId: null, tasks: [],
      activities: [{ id: uuidv4(), type: 'created', description: `Lead created via ${newLead.source}`, timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    createLead(lead);
    setCreateOpen(false);
    setNewLead({ name: '', email: '', phone: '', city: '', budget: '', stage: 'New', source: 'Meta Ads', priority: 'Medium' });
    showToast(`Lead ${lead.name} created`);
  }

  function handleAddNote() {
    if (!selectedLead || !newNote.trim()) return;
    addLeadNote(selectedLead.id, newNote);
    setNewNote('');
    showToast('Note saved');
  }

  function handleAddTask() {
    if (!selectedLead || !newTask.trim()) return;
    addLeadTask(selectedLead.id, newTask, null);
    setNewTask('');
    showToast('Task added');
  }

  // Keep drawer in sync
  const drawerLead = selectedLead ? data.leads.find(l => l.id === selectedLead.id) : null;

  const SortIcon = ({ k }: { k: keyof Lead }) => (
    sortKey === k ? (sortAsc ? <ChevronRight className="w-3 h-3 rotate-90" /> : <ChevronDown className="w-3 h-3" />) : null
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Sales CRM</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{data.leads.length} leads across {STAGES.length} stages</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> New Lead</Button>
      </div>

      {/* Pipeline Summary */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STAGES.map(stage => {
          const count = data.leads.filter(l => l.stage === stage).length;
          return (
            <button key={stage} onClick={() => setStageFilter(stageFilter === stage ? '' : stage)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${stageFilter === stage ? 'bg-blue-600 text-[var(--text-primary)]' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {stage} <span className="ml-1 font-bold font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input placeholder="Search by name or city..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="w-3.5 h-3.5" />} />
        </div>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
          className="bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none">
          <option value="">All Sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none">
          <option value="">All Priority</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {[
                  { label: 'Name', key: 'name' as keyof Lead },
                  { label: 'City', key: 'city' as keyof Lead },
                  { label: 'Budget', key: 'budget' as keyof Lead },
                  { label: 'Stage', key: 'stage' as keyof Lead },
                  { label: 'Source', key: 'source' as keyof Lead },
                  { label: 'Intent', key: 'intentScore' as keyof Lead },
                  { label: 'Priority', key: 'priority' as keyof Lead },
                  { label: 'Follow-up', key: 'followUpDate' as keyof Lead },
                ].map(col => (
                  <th key={col.key} className="text-left py-3 px-4 text-xs text-[var(--text-secondary)] font-medium cursor-pointer hover:text-[var(--text-primary)] select-none"
                    onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1">{col.label}<SortIcon k={col.key} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}
                  className={`border-b border-[var(--border)]/50 hover:bg-[var(--bg-hover)]/50 cursor-pointer transition-colors ${isOverdue(lead) ? 'bg-[var(--danger-bg)]' : ''}`}
                  onClick={() => setSelectedLead(lead)}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-xs font-bold text-[var(--accent)] flex-shrink-0">{lead.name[0]}</div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{lead.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] text-xs">{lead.city}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] font-mono text-xs">{formatCurrency(lead.budget)}</td>
                  <td className="py-3 px-4"><Badge variant={stageBadgeVariant(lead.stage)}>{lead.stage}</Badge></td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] text-xs">{lead.source}</td>
                  <td className="py-3 px-4"><ScoreBadge score={lead.intentScore} /></td>
                  <td className="py-3 px-4">
                    <Badge variant={lead.priority === 'High' ? 'red' : lead.priority === 'Medium' ? 'yellow' : 'gray'}>{lead.priority}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    {lead.followUpDate ? (
                      <span className={`text-xs ${isOverdue(lead) ? 'text-[var(--danger)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                        {isOverdue(lead) && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                        {formatDate(lead.followUpDate)}
                      </span>
                    ) : <span className="text-[var(--text-muted)] text-xs">—</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-[var(--text-muted)] text-sm">No leads match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Drawer */}
      <Drawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title={drawerLead?.name || ''} width="w-[520px]">
        {drawerLead && (
          <div className="space-y-4">
            {/* Contact */}
            <Card className="p-4 space-y-2">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">Contact</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-[var(--text-muted)]">Email</p><p className="text-[var(--text-primary)]">{drawerLead.email}</p></div>
                <div><p className="text-[var(--text-muted)]">Phone</p><p className="text-[var(--text-primary)]">{drawerLead.phone}</p></div>
                <div><p className="text-[var(--text-muted)]">City</p><p className="text-[var(--text-primary)]">{drawerLead.city}</p></div>
                <div><p className="text-[var(--text-muted)]">Budget</p><p className="text-[var(--text-primary)] font-mono">{formatCurrency(drawerLead.budget)}</p></div>
                <div><p className="text-[var(--text-muted)]">Source</p><p className="text-[var(--text-primary)]">{drawerLead.source}</p></div>
                <div><p className="text-[var(--text-muted)]">Intent</p><p className={`font-bold font-mono ${intentColor(drawerLead.intentScore)}`}>{drawerLead.intentScore}</p></div>
              </div>
            </Card>

            {/* Stage */}
            <Card className="p-4">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-3">Pipeline Stage</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.map(stage => (
                  <button key={stage}
                    onClick={() => { changeLeadStage(drawerLead.id, stage, drawerLead.stage); showToast(`Moved to ${stage}`); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${drawerLead.stage === stage ? 'bg-blue-600 text-[var(--text-primary)]' : 'bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}>
                    {stage}
                  </button>
                ))}
              </div>
              {drawerLead.followUpDate && (
                <div className={`flex items-center gap-2 mt-3 p-2 rounded-lg text-xs ${isOverdue(drawerLead) ? 'bg-[var(--danger-bg)] text-[var(--danger)]' : 'bg-[var(--bg-app)] text-[var(--text-secondary)]'}`}>
                  {isOverdue(drawerLead) && <AlertTriangle className="w-3 h-3" />}
                  Follow-up: {formatDate(drawerLead.followUpDate)}
                </div>
              )}
              <div className="mt-2">
                <label className="text-xs text-[var(--text-muted)]">Set Follow-up Date</label>
                <input type="date" className="mt-1 w-full bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
                  value={drawerLead.followUpDate ? drawerLead.followUpDate.split('T')[0] : ''}
                  onChange={e => updateLead(drawerLead.id, { followUpDate: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-4">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-2">Notes</p>
              {drawerLead.notes && <p className="text-xs text-[var(--text-secondary)] mb-2 p-2 bg-[var(--bg-app)] rounded-lg">{drawerLead.notes}</p>}
              <div className="flex gap-2">
                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..."
                  className="flex-1 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none" rows={2} />
                <Button size="xs" onClick={handleAddNote}>Save</Button>
              </div>
            </Card>

            {/* Tasks */}
            <Card className="p-4">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-2">Tasks</p>
              <div className="space-y-2 mb-3">
                {drawerLead.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleLeadTask(drawerLead.id, task.id)}>
                    {task.completed ? <CheckSquare className="w-4 h-4 text-[var(--success)] flex-shrink-0" /> : <Square className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />}
                    <span className={`text-xs flex-1 ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>{task.title}</span>
                    {task.dueDate && <span className="text-xs text-[var(--text-muted)]">{formatDate(task.dueDate)}</span>}
                  </div>
                ))}
                {drawerLead.tasks.length === 0 && <p className="text-xs text-[var(--text-muted)]">No tasks yet</p>}
              </div>
              <div className="flex gap-2">
                <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a task..."
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none" />
                <Button size="xs" onClick={handleAddTask}>Add</Button>
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card className="p-4">
              <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mb-2">Activity Timeline</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...drawerLead.activities].reverse().map(activity => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-[var(--text-secondary)]">{activity.description}</p>
                      <p className="text-xs text-[var(--text-muted)]">{formatDistanceToNow(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* WhatsApp */}
            {drawerLead.conversationId && (
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                  <p className="text-xs font-medium text-[var(--text-secondary)]">WhatsApp Conversation Linked</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">ID: {drawerLead.conversationId.slice(0, 20)}...</p>
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* Create Lead Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Lead" size="md">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name *" placeholder="Rahul Sharma" value={newLead.name} onChange={e => setNewLead(f => ({ ...f, name: e.target.value }))} />
            <Input label="Phone" type="tel" placeholder="+91 9876543210" value={newLead.phone} onChange={e => setNewLead(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" type="email" placeholder="rahul@gmail.com" value={newLead.email} onChange={e => setNewLead(f => ({ ...f, email: e.target.value }))} />
            <Input label="City" placeholder="Mumbai" value={newLead.city} onChange={e => setNewLead(f => ({ ...f, city: e.target.value }))} />
            <Input label="Budget (₹)" type="number" placeholder="1800000" value={newLead.budget} onChange={e => setNewLead(f => ({ ...f, budget: e.target.value }))} />
            <Select label="Stage" value={newLead.stage} onChange={e => setNewLead(f => ({ ...f, stage: e.target.value as Stage }))} options={STAGES.map(s => ({ value: s, label: s }))} />
            <Select label="Source" value={newLead.source} onChange={e => setNewLead(f => ({ ...f, source: e.target.value as LeadSource }))} options={SOURCES.map(s => ({ value: s, label: s }))} />
            <Select label="Priority" value={newLead.priority} onChange={e => setNewLead(f => ({ ...f, priority: e.target.value as Priority }))} options={PRIORITIES.map(p => ({ value: p, label: p }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreateLead} className="flex-1">Create Lead</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
