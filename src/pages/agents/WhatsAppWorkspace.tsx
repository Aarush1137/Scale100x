import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, Send, UserCheck, Bot, AlertTriangle, CheckCircle, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button, Card, Badge, Input, Textarea } from '../../components/ui';
import { showToast } from '../../components/ui';
import { formatDistanceToNow, formatDateTime, intentColor } from '../../lib/utils';
import type { Conversation, Message } from '../../types';

// ─── Intent Detection ─────────────────────────────────────────────────────────
const ESCALATION_TRIGGERS = ['speak to human', 'speak to agent', 'talk to person', 'human please', 'real person', 'legal', 'contract', 'lawsuit', 'refund', 'complaint', 'frustrated', 'disgusted', 'angry', 'pathetic', 'useless'];
const INTENT_PATTERNS = [
  { keywords: ['invest', 'investment', 'cost', 'price', 'how much', 'budget', 'fee'], label: 'Investment Query', score: 75 },
  { keywords: ['roi', 'return', 'profit', 'revenue', 'break even', 'payback'], label: 'ROI Query', score: 80 },
  { keywords: ['city', 'location', 'where', 'area', 'state', 'expand'], label: 'Location Query', score: 65 },
  { keywords: ['document', 'form', 'application', 'apply', 'checklist'], label: 'Document Request', score: 70 },
  { keywords: ['setup', 'timeline', 'how long', 'training', 'support'], label: 'Operational Query', score: 72 },
  { keywords: ['interested', 'want', 'looking for', 'enquiry', 'franchise'], label: 'Interest', score: 68 },
];

const AI_RESPONSES: Record<string, string> = {
  'investment': 'Great question! FreshBrew franchise investment:\n\n💰 Initial Investment: ₹18,00,000\n📋 Working Capital: ₹2,00,000\n📈 Monthly Revenue Potential: ₹6-10 Lakhs\n⏱️ Break-even: 18-24 months\n\nInterested in a detailed ROI breakdown?',
  'cost': 'Here\'s the investment structure for FreshBrew:\n\n• Setup & Equipment: ₹12L\n• Brand License: ₹3L\n• Working Capital: ₹3L\n• **Total: ₹18L**\n\nFinancing options available through our bank partners! 💳',
  'city': 'FreshBrew is expanding to these priority cities:\n\n📍 Mumbai, Delhi, Bangalore\n📍 Hyderabad, Pune, Chennai\n📍 Ahmedabad, Jaipur, Lucknow\n\nWhich city are you based in? We can check availability! 🗺️',
  'document': 'Here are the documents required:\n\n📋 **Required:**\n1. Aadhar/PAN Card\n2. Address Proof\n3. Bank Statements (6 months)\n4. IT Returns (2 years)\n5. Property Lease Agreement\n\nI\'ll email you the complete checklist now! ✉️',
  'roi': 'FreshBrew ROI breakdown:\n\n📊 Monthly at ₹8L revenue:\n- Revenue: ₹8,00,000\n- Operating Profit: ~₹1,92,000\n- Margin: ~24%\n\nAt this rate, break-even in ~18 months! 📈\n\nWant the full financial model?',
  'training': 'Our franchise support is comprehensive:\n\n✅ 14-day hands-on training\n✅ Store design assistance\n✅ Grand opening campaign\n✅ Dedicated RM\n✅ Monthly reviews\n✅ 24/7 helpline\n\nYou\'re never alone! 🤝',
  'default': 'Thank you for your interest in FreshBrew franchise! I\'d love to help you explore this opportunity.\n\nCould you tell me:\n1️⃣ Which city are you based in?\n2️⃣ What\'s your approximate investment budget?\n3️⃣ Do you have any prior business experience?\n\nThis helps me give you accurate information! 😊',
};

function detectIntent(text: string): { label: string; score: number } {
  const lower = text.toLowerCase();
  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some(k => lower.includes(k))) {
      return { label: pattern.label, score: pattern.score };
    }
  }
  return { label: 'General Query', score: 50 };
}

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('invest') || lower.includes('how much') || lower.includes('fee')) return AI_RESPONSES['investment'];
  if (lower.includes('cost') || lower.includes('price')) return AI_RESPONSES['cost'];
  if (lower.includes('city') || lower.includes('location') || lower.includes('where')) return AI_RESPONSES['city'];
  if (lower.includes('document') || lower.includes('form') || lower.includes('apply')) return AI_RESPONSES['document'];
  if (lower.includes('roi') || lower.includes('return') || lower.includes('profit')) return AI_RESPONSES['roi'];
  if (lower.includes('training') || lower.includes('support') || lower.includes('setup')) return AI_RESPONSES['training'];
  return AI_RESPONSES['default'];
}

function shouldEscalate(text: string): string | null {
  const lower = text.toLowerCase();
  for (const trigger of ESCALATION_TRIGGERS) {
    if (lower.includes(trigger)) {
      if (trigger === 'legal' || trigger === 'contract') return 'Legal/financial commitment questions';
      if (['frustrated', 'angry', 'pathetic', 'complaint'].includes(trigger)) return 'Frustration/complaint language detected';
      if (['speak to human', 'human please', 'real person', 'talk to person', 'speak to agent'].includes(trigger)) return 'User requested human agent';
      return 'Escalation trigger detected';
    }
  }
  return null;
}

export default function WhatsAppWorkspace() {
  const { data, sendMessage, humanTakeover, resumeAutomation, updateConversation } = useStore();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(data.conversations[0]?.id || null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [noteText, setNoteText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = data.conversations.find(c => c.id === selectedConvId);
  const convMessages = data.messages.filter(m => m.conversationId === selectedConvId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length, selectedConvId]);

  // Mark as read on select
  useEffect(() => {
    if (selectedConvId) updateConversation(selectedConvId, { unreadCount: 0 });
  }, [selectedConvId]);

  function handleSend() {
    if (!messageText.trim() || !selectedConvId || !selectedConv) return;

    // Check for escalation
    const escalationReason = shouldEscalate(messageText);

    // Send user message
    sendMessage({
      conversationId: selectedConvId,
      direction: 'inbound',
      sender: 'lead',
      content: messageText,
      ...detectIntent(messageText),
      timestamp: new Date().toISOString(),
    });

    const text = messageText;
    setMessageText('');

    // If conversation is AI Active, simulate AI response
    if (selectedConv.status === 'AI Active') {
      if (escalationReason) {
        // Escalate
        setTimeout(() => {
          sendMessage({
            conversationId: selectedConvId,
            direction: 'outbound',
            sender: 'ai',
            content: 'I understand you need more personalized assistance. Let me connect you with one of our senior franchise consultants who can help you better. Please hold on! 🙏',
            intentLabel: 'Escalation',
            confidence: 0.98,
            timestamp: new Date().toISOString(),
          });
          humanTakeover(selectedConvId, escalationReason, 'Franchise Consultant');
          showToast(`Conversation escalated: ${escalationReason}`, 'info');
        }, 1000);
      } else {
        // AI reply
        setTimeout(() => {
          const { label, score } = detectIntent(text);
          sendMessage({
            conversationId: selectedConvId,
            direction: 'outbound',
            sender: 'ai',
            content: getAIResponse(text),
            intentLabel: label,
            confidence: score / 100,
            timestamp: new Date().toISOString(),
          });
        }, 1200);
      }
    }
  }

  function handleHumanTakeover() {
    if (!selectedConvId) return;
    humanTakeover(selectedConvId, 'Manual takeover by team', 'Support Agent');
    showToast('Human takeover activated');
  }

  function handleResumeAI() {
    if (!selectedConvId) return;
    resumeAutomation(selectedConvId);
    sendMessage({
      conversationId: selectedConvId,
      direction: 'outbound',
      sender: 'ai',
      content: 'Thank you for your patience! I\'m back and happy to continue assisting you. How can I help? 😊',
      intentLabel: 'AI Resumed',
      confidence: 1.0,
      timestamp: new Date().toISOString(),
    });
    showToast('AI automation resumed');
  }

  const filteredConvs = data.conversations.filter(c => {
    if (search && !c.leadName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      {/* Left: Conversation List */}
      <div className={`flex-shrink-0 w-full md:w-72 border-r border-[var(--border)] flex flex-col ${selectedConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 border-b border-[var(--border)] space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] flex-1">WhatsApp</h2>
            <Badge variant="yellow">DEMO</Badge>
          </div>
          <Input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="w-3.5 h-3.5" />} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none"
          >
            <option value="">All Status</option>
            <option>AI Active</option>
            <option>Human Active</option>
            <option>Escalated</option>
            <option>Resolved</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConvId(conv.id)}
              className={`p-3 border-b border-[var(--border)]/50 cursor-pointer transition-colors ${selectedConvId === conv.id ? 'bg-[var(--accent-subtle)] border-l-2 border-l-[var(--accent)]' : 'hover:bg-[var(--bg-hover)]'}`}
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-xs font-bold text-[var(--accent)] flex-shrink-0">
                  {conv.leadName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-primary)]">{conv.leadName}</span>
                    <span className="text-xs text-[var(--text-muted)]">{formatDistanceToNow(conv.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StatusDot status={conv.status} />
                    {conv.unreadCount > 0 && (
                      <span className="ml-auto w-4 h-4 flex items-center justify-center bg-[var(--accent)] text-white text-xs rounded-full">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Conversation Thread */}
      {selectedConv ? (
        <div className={`flex-1 flex overflow-hidden ${!selectedConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-3 border-b border-[var(--border)] flex-shrink-0">
              <button onClick={() => setSelectedConvId(null)} className="md:hidden flex items-center gap-1 text-sm text-[var(--accent)] flex-shrink-0 mr-1">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-9 h-9 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-sm font-bold text-[var(--accent)] flex-shrink-0">
                {selectedConv.leadName[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedConv.leadName}</p>
                <div className="flex items-center gap-2">
                  <StatusDot status={selectedConv.status} />
                  <span className="text-xs text-[var(--text-muted)]">{selectedConv.phone}</span>
                  <Badge variant="gray">{selectedConv.intentLabel}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedConv.status === 'AI Active' && (
                  <Button size="xs" variant="secondary" onClick={handleHumanTakeover} className="gap-1">
                    <UserCheck className="w-3 h-3" /> Take Over
                  </Button>
                )}
                {(selectedConv.status === 'Human Active' || selectedConv.status === 'Escalated') && (
                  <Button size="xs" variant="primary" onClick={handleResumeAI} className="gap-1">
                    <Bot className="w-3 h-3" /> Resume AI
                  </Button>
                )}
              </div>
            </div>

            {/* Escalation Banner */}
            {selectedConv.escalationReason && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--warning-bg)] border-b border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)]" />
                <span className="text-xs text-[var(--warning)]">Escalated: {selectedConv.escalationReason}</span>
                {selectedConv.assignedTo && <span className="text-xs text-[var(--warning)] ml-1">→ {selectedConv.assignedTo}</span>}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {convMessages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[var(--border)] p-3 flex-shrink-0">
              {selectedConv.status === 'Resolved' ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-[var(--text-muted)]">
                  <CheckCircle className="w-4 h-4 text-[var(--success)]" /> Conversation resolved
                </div>
              ) : (
                <div className="flex gap-2">
                  <textarea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={selectedConv.status === 'AI Active' ? 'Type a message (AI will also respond)...' : 'Type a message...'}
                    className="flex-1 bg-[var(--bg-app)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-600 resize-none"
                    rows={2}
                  />
                  <Button onClick={handleSend} disabled={!messageText.trim()} className="gap-1 self-end">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                {selectedConv.status === 'AI Active' && (
                  <div className="flex items-center gap-1 text-xs text-[var(--accent)]">
                    <Bot className="w-3 h-3" /> AI responding automatically
                  </div>
                )}
                {(selectedConv.status === 'Human Active' || selectedConv.status === 'Escalated') && (
                  <div className="flex items-center gap-1 text-xs text-[var(--warning)]">
                    <UserCheck className="w-3 h-3" /> Human active — AI paused
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Qualification Panel */}
          <div className="w-56 flex-shrink-0 border-l border-[var(--border)] overflow-y-auto p-3 space-y-3">
            <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">Qualification</p>
            <div className="text-center">
              <p className={`text-3xl font-bold font-mono ${intentColor(selectedConv.intentScore)}`}>{selectedConv.intentScore}</p>
              <p className="text-xs text-[var(--text-muted)]">Intent Score</p>
            </div>
            {Object.entries(selectedConv.qualification).filter(([k]) => k !== 'intentScore').map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-[var(--text-muted)] capitalize">{key}</span>
                <span className="text-xs text-[var(--text-primary)] font-medium">{String(val) || '—'}</span>
              </div>
            ))}

            <div className="border-t border-[var(--border)] pt-3">
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Internal Notes</p>
              <Textarea
                value={noteText || selectedConv.internalNotes}
                onChange={e => setNoteText(e.target.value)}
                onBlur={() => {
                  if (noteText) updateConversation(selectedConv.id, { internalNotes: noteText });
                }}
                placeholder="Add notes..."
                rows={4}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] text-sm">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound';
  const isAI = message.sender === 'ai';
  const isHuman = message.sender === 'human';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] space-y-1`}>
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isOutbound
            ? isAI ? 'bg-[var(--accent)] text-white rounded-tr-none' : 'bg-[var(--success)] text-white rounded-tr-none'
            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border)] rounded-tl-none'
        }`}>
          {message.content}
        </div>
        <div className={`flex items-center gap-2 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
          {isOutbound && (
            <Badge variant={isAI ? 'blue' : 'green'}>
              {isAI ? <><Bot className="w-2.5 h-2.5 mr-1" />AI</> : <><UserCheck className="w-2.5 h-2.5 mr-1" />Human</>}
            </Badge>
          )}
          {message.intentLabel && (
            <span className="text-xs text-[var(--text-muted)]">{message.intentLabel}</span>
          )}
          <span className="text-xs text-[var(--text-muted)]">{formatDistanceToNow(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'AI Active': 'bg-blue-400',
    'Human Active': 'bg-yellow-400',
    'Escalated': 'bg-red-400',
    'Resolved': 'bg-emerald-400',
  };
  const labels: Record<string, string> = {
    'AI Active': 'AI Active',
    'Human Active': 'Human Active',
    'Escalated': 'Escalated',
    'Resolved': 'Resolved',
  };
  return (
    <div className="flex items-center gap-1">
      <div className={`w-1.5 h-1.5 rounded-full ${colors[status] || 'bg-[var(--text-muted)]'}`} />
      <span className="text-xs text-[var(--text-muted)]">{labels[status] || status}</span>
    </div>
  );
}
