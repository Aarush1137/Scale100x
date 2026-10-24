import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AppData, Lead, Conversation, Message, CollateralAsset, AuditEvent, AgentConfig, Brand, OnboardingSession } from '../types';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'scale100x_data';

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppData;
      return parsed;
    }
  } catch {
    // corrupted data, reset
  }
  const fresh = JSON.parse(JSON.stringify(seedData)) as AppData;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save to localStorage');
  }
}

// Singleton store
let globalData: AppData = loadData();
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

function setGlobalData(updater: (prev: AppData) => AppData) {
  globalData = updater(globalData);
  saveData(globalData);
  notify();
}

export function useStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate(n => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const addEvent = useCallback((type: string, description: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) => {
    const event: AuditEvent = {
      id: uuidv4(),
      type,
      description,
      entityType,
      entityId,
      userId: 'user-demo',
      metadata,
      timestamp: new Date().toISOString(),
    };
    setGlobalData(d => ({ ...d, events: [event, ...d.events] }));
    return event;
  }, []);

  return {
    data: globalData,

    // Brand actions
    upsertBrand: useCallback((brand: Brand) => {
      setGlobalData(d => {
        const idx = d.brands.findIndex(b => b.id === brand.id);
        const brands = idx >= 0 ? d.brands.map((b, i) => i === idx ? brand : b) : [...d.brands, brand];
        return { ...d, brands };
      });
      addEvent('brand_updated', `Brand updated: ${brand.name}`, 'brand', brand.id);
    }, [addEvent]),

    // Lead actions
    createLead: useCallback((lead: Lead) => {
      setGlobalData(d => ({ ...d, leads: [...d.leads, lead] }));
      addEvent('lead_created', `Lead created: ${lead.name}`, 'lead', lead.id);
    }, [addEvent]),

    updateLead: useCallback((id: string, updates: Partial<Lead>) => {
      setGlobalData(d => ({
        ...d,
        leads: d.leads.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
      }));
    }, []),

    changeLeadStage: useCallback((id: string, newStage: Lead['stage'], oldStage: string) => {
      const ts = new Date().toISOString();
      const activity = { id: uuidv4(), type: 'stage_change' as const, description: `Moved from ${oldStage} to ${newStage}`, timestamp: ts };
      setGlobalData(d => ({
        ...d,
        leads: d.leads.map(l => l.id === id ? {
          ...l,
          stage: newStage,
          updatedAt: ts,
          activities: [...l.activities, activity],
        } : l),
      }));
      addEvent('stage_change', `Lead stage changed to ${newStage}`, 'lead', id, { from: oldStage, to: newStage });
    }, [addEvent]),

    addLeadNote: useCallback((id: string, note: string) => {
      const activity = { id: uuidv4(), type: 'note' as const, description: note, timestamp: new Date().toISOString() };
      setGlobalData(d => ({
        ...d,
        leads: d.leads.map(l => l.id === id ? {
          ...l,
          notes: note,
          updatedAt: new Date().toISOString(),
          activities: [...l.activities, activity],
        } : l),
      }));
    }, []),

    addLeadTask: useCallback((leadId: string, title: string, dueDate: string | null) => {
      const task = { id: uuidv4(), title, completed: false, dueDate, createdAt: new Date().toISOString() };
      setGlobalData(d => ({
        ...d,
        leads: d.leads.map(l => l.id === leadId ? { ...l, tasks: [...l.tasks, task] } : l),
      }));
    }, []),

    toggleLeadTask: useCallback((leadId: string, taskId: string) => {
      setGlobalData(d => ({
        ...d,
        leads: d.leads.map(l => l.id === leadId ? {
          ...l,
          tasks: l.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
        } : l),
      }));
    }, []),

    // Conversation actions
    updateConversation: useCallback((id: string, updates: Partial<Conversation>) => {
      setGlobalData(d => ({
        ...d,
        conversations: d.conversations.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c),
      }));
    }, []),

    humanTakeover: useCallback((convId: string, reason: string, assignedTo: string) => {
      const ts = new Date().toISOString();
      setGlobalData(d => ({
        ...d,
        conversations: d.conversations.map(c => c.id === convId ? {
          ...c,
          status: 'Human Active' as const,
          humanTakeoverAt: ts,
          escalationReason: reason,
          assignedTo,
          updatedAt: ts,
        } : c),
      }));
      addEvent('human_takeover', `Human takeover: ${reason}`, 'conversation', convId, { reason, assignedTo });
    }, [addEvent]),

    resumeAutomation: useCallback((convId: string) => {
      const ts = new Date().toISOString();
      setGlobalData(d => ({
        ...d,
        conversations: d.conversations.map(c => c.id === convId ? {
          ...c,
          status: 'AI Active' as const,
          humanTakeoverAt: null,
          escalationReason: null,
          updatedAt: ts,
        } : c),
      }));
      addEvent('ai_resume', 'AI automation resumed', 'conversation', convId);
    }, [addEvent]),

    // Message actions
    sendMessage: useCallback((msg: Omit<Message, 'id'>) => {
      const newMsg: Message = { ...msg, id: uuidv4() };
      setGlobalData(d => ({
        ...d,
        messages: [...d.messages, newMsg],
        conversations: d.conversations.map(c => c.id === msg.conversationId ? {
          ...c,
          lastMessage: msg.content,
          lastMessageAt: msg.timestamp,
          updatedAt: msg.timestamp,
        } : c),
      }));
      addEvent('message_sent', `Message sent in conversation`, 'message', newMsg.id);
      return newMsg;
    }, [addEvent]),

    // Agent actions
    updateAgent: useCallback((id: string, updates: Partial<AgentConfig>) => {
      setGlobalData(d => ({
        ...d,
        agents: d.agents.map(a => a.id === id ? { ...a, ...updates } : a),
      }));
      addEvent('agent_updated', `Agent configuration updated`, 'agent', id);
    }, [addEvent]),

    // Asset actions
    createAsset: useCallback((asset: CollateralAsset) => {
      setGlobalData(d => ({ ...d, assets: [...d.assets, asset] }));
      addEvent('asset_created', `Collateral created: ${asset.name}`, 'asset', asset.id);
    }, [addEvent]),

    updateAsset: useCallback((id: string, updates: Partial<CollateralAsset>) => {
      setGlobalData(d => ({
        ...d,
        assets: d.assets.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a),
      }));
    }, []),

    deleteAsset: useCallback((id: string) => {
      setGlobalData(d => ({ ...d, assets: d.assets.filter(a => a.id !== id) }));
      addEvent('asset_deleted', 'Collateral asset deleted', 'asset', id);
    }, [addEvent]),

    // Onboarding
    upsertOnboardingSession: useCallback((session: OnboardingSession) => {
      setGlobalData(d => {
        const idx = d.onboardingSessions.findIndex(s => s.id === session.id);
        const sessions = idx >= 0
          ? d.onboardingSessions.map((s, i) => i === idx ? session : s)
          : [...d.onboardingSessions, session];
        return { ...d, onboardingSessions: sessions };
      });
    }, []),

    // Workflow
    runWorkflowSample: useCallback(() => {
      const run = {
        id: uuidv4(),
        workflowId: 'workflow-001',
        status: 'success' as const,
        triggeredBy: 'Manual Sample Run',
        leadId: null,
        leadName: 'Sample Lead',
        steps: [
          { stepId: 'step-1', status: 'success', timestamp: new Date().toISOString() },
          { stepId: 'step-2', status: 'success', timestamp: new Date().toISOString() },
          { stepId: 'step-3', status: 'success', timestamp: new Date().toISOString() },
          { stepId: 'step-4', status: 'success', timestamp: new Date().toISOString() },
        ],
        startedAt: new Date(Date.now() - 5000).toISOString(),
        completedAt: new Date().toISOString(),
      };
      setGlobalData(d => ({
        ...d,
        workflowRuns: [run, ...d.workflowRuns],
        workflows: d.workflows.map(w => w.id === 'workflow-001' ? { ...w, runsCount: w.runsCount + 1, leadsProcessed: w.leadsProcessed + 1, lastRunAt: new Date().toISOString() } : w),
      }));
      addEvent('workflow_run', 'Sample workflow run executed', 'workflow', 'workflow-001');
    }, [addEvent]),

    toggleWorkflow: useCallback((id: string) => {
      setGlobalData(d => ({
        ...d,
        workflows: d.workflows.map(w => w.id === id ? { ...w, status: w.status === 'running' ? 'paused' : 'running' } : w),
      }));
    }, []),

    // Reset
    resetData: useCallback(() => {
      const fresh = JSON.parse(JSON.stringify(seedData)) as AppData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      globalData = fresh;
      notify();
    }, []),

    addEvent,
  };
}
