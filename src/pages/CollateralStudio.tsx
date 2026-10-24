import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Download, Trash2, RefreshCw, Search, FileText, Save, History, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Card, Badge, Input, Select, Textarea, Modal, ConfirmModal, EmptyState } from '../components/ui';
import { showToast } from '../components/ui';
import type { CollateralAsset, AssetType, AssetStatus } from '../types';
import { formatDate, downloadFile } from '../lib/utils';

const ASSET_TYPES: AssetType[] = ['Pitch Deck', 'Sales Brochure', 'Ad Creative', 'WhatsApp Script'];
const TONES = ['Professional', 'Friendly', 'Aspirational', 'Urgent', 'Educational'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'English + Hindi mix'];
const STATUS_OPTIONS: { value: AssetStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'sent', label: 'Sent' },
];

function generateContent(type: AssetType, brandName: string, audience: string, objective: string, tone: string, language: string, version: number): string {
  const header = `## DEMO CONTENT — Template Generated (v${version})\n*This is template-based content. No AI API was called. For production, connect an AI provider.*\n\n---\n\n`;

  if (type === 'Pitch Deck') return header + `# ${brandName} — Franchise Opportunity Deck

## Slide 1: The Opportunity
${brandName} is expanding across India with a proven franchise model designed for entrepreneurs seeking ${objective.toLowerCase()}.

**Target:** ${audience}
**Tone:** ${tone}
**Language:** ${language}

## Slide 2: Why ${brandName}?
- Established brand with strong customer loyalty
- Asset-light investment model (₹18L onwards)
- Full operational support from day 1
- Proven 18-month break-even

## Slide 3: Investment Overview
| Item | Detail |
|------|--------|
| Investment | ₹18,00,000 |
| Monthly Revenue | ₹6-10 Lakhs |
| Royalty | 6% |
| Break-even | 18-24 months |

## Slide 4: Support Package
✅ 14-day training at HQ
✅ Grand opening marketing
✅ Dedicated relationship manager
✅ Quarterly business reviews

## Slide 5: Call to Action
Ready to join the ${brandName} family?
Contact: franchise@brand.in | +91 9876543210`;

  if (type === 'Sales Brochure') return header + `# ${brandName}
## Your Franchise. Your Future.

### About ${brandName}
Built for speed, designed for success. ${brandName} brings premium quality to every customer interaction.

**Target Audience:** ${audience}
**Campaign Goal:** ${objective}

### The Numbers
- ₹18L initial investment
- ₹8L avg monthly revenue
- 18-month break-even
- 12+ successful outlets

### Why Choose Us?
Our franchisees don't just run a business — they build a legacy. With full support in training, marketing, and operations, you're never alone.

### Get Started Today
📧 franchise@brand.in
📱 +91 9876543210
🌐 www.${brandName.toLowerCase().replace(/\s/g, '')}.in`;

  if (type === 'Ad Creative') return header + `# ${brandName} — Ad Creative

**Format:** Social Media Ad
**Objective:** ${objective}
**Audience:** ${audience}
**Tone:** ${tone}

---

**Headline Option 1:**
"Be Your Own Boss with ${brandName} 🚀"

**Headline Option 2:**
"₹18 Lakhs → ₹10 Lakhs/Month Returns"

**Headline Option 3:**
"Join ${brandName} — India's Fastest Growing QSR Franchise"

**Body Copy:**
Tired of working for someone else? ${brandName} franchise offers you:
✅ Low investment, high returns
✅ Full training & support
✅ Proven business model
✅ Join 12+ successful franchisees

**CTA:** "Enquire Now" / "Book Free Consultation"

**Hashtags:** #Franchise #${brandName.replace(/\s/g, '')} #IndiaFranchise #BusinessOpportunity`;

  return header + `# ${brandName} — WhatsApp Script

**Type:** ${type}
**Audience:** ${audience}
**Objective:** ${objective}

---

**Message 1 (Immediate):**
Hi {name}! 👋 Thanks for your interest in ${brandName} franchise!

Quick intro:
📍 Investment: ₹18L
📈 Revenue: ₹6-10L/month
⏱️ Break-even: 18 months

Reply YES to know more! 🎉

---

**Message 2 (After YES):**
Awesome {name}! Tell me:
1️⃣ Which city?
2️⃣ Investment budget?
3️⃣ Any F&B experience?

---

**Message 3 (After Qualification):**
Perfect fit for ${brandName} in {city}! 🌟

Sharing:
📑 Franchise brochure
💰 ROI model
📋 Application checklist

Want a call with our consultant? 📞`;
}

export default function CollateralStudio() {
  const { data, createAsset, updateAsset, deleteAsset } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(data.assets[0]?.id || null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Create form
  const [newForm, setNewForm] = useState({
    name: '',
    type: 'Pitch Deck' as AssetType,
    targetAudience: '',
    campaignObjective: '',
    language: 'English',
    tone: 'Professional',
  });

  const selectedAsset = data.assets.find(a => a.id === selectedAssetId);

  const filtered = data.assets.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  function handleCreate() {
    if (!newForm.name.trim()) { showToast('Asset name required', 'error'); return; }
    const brand = data.brands[0];
    const content = generateContent(newForm.type, brand?.name || 'Brand', newForm.targetAudience, newForm.campaignObjective, newForm.tone, newForm.language, 1);
    const asset: CollateralAsset = {
      id: uuidv4(),
      name: newForm.name,
      type: newForm.type,
      brandId: brand?.id || '',
      status: 'draft',
      content,
      targetAudience: newForm.targetAudience,
      campaignObjective: newForm.campaignObjective,
      language: newForm.language,
      tone: newForm.tone,
      versions: [{ id: uuidv4(), content, label: 'v1', createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createAsset(asset);
    setSelectedAssetId(asset.id);
    setCreateOpen(false);
    showToast('Asset created!');
  }

  function handleRegenerate() {
    if (!selectedAsset) return;
    const brand = data.brands[0];
    const versionNum = selectedAsset.versions.length + 1;
    const newContent = generateContent(selectedAsset.type, brand?.name || 'Brand', selectedAsset.targetAudience, selectedAsset.campaignObjective, selectedAsset.tone, selectedAsset.language, versionNum);
    const newVersion = { id: uuidv4(), content: newContent, label: `v${versionNum}`, createdAt: new Date().toISOString() };
    updateAsset(selectedAsset.id, {
      content: newContent,
      versions: [...selectedAsset.versions, newVersion],
    });
    showToast('New version generated');
  }

  function handleContentChange(content: string) {
    if (!selectedAssetId) return;
    updateAsset(selectedAssetId, { content });
  }

  function handleStatusChange(status: AssetStatus) {
    if (!selectedAssetId) return;
    updateAsset(selectedAssetId, { status });
    showToast(`Status updated to ${status}`);
  }

  function handleDownload() {
    if (!selectedAsset) return;
    downloadFile(selectedAsset.content, `${selectedAsset.name.replace(/\s/g, '_')}.md`);
  }

  const statusBadge = (s: AssetStatus) => {
    const map = { draft: 'gray', review: 'yellow', approved: 'green', sent: 'blue' } as const;
    return <Badge variant={map[s]}>{s}</Badge>;
  };

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      {/* Left: Asset List */}
      <div className="w-64 flex-shrink-0 border-r border-[var(--border)] flex flex-col bg-white">
        <div className="p-3 border-b border-[var(--border)] space-y-2">
          <Button size="sm" className="w-full gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> New Asset
          </Button>
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="w-3.5 h-3.5" />} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 && <EmptyState title="No assets" description="Create your first asset" />}
          {filtered.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`p-3 cursor-pointer border-b border-[var(--border)]/50 transition-colors ${selectedAssetId === asset.id ? 'bg-blue-600/10 border-l-2 border-l-blue-600' : 'hover:bg-[var(--bg-hover)]'}`}
            >
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">{asset.name}</p>
                {statusBadge(asset.status)}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{asset.type}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDate(asset.updatedAt)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Editor */}
      {selectedAsset ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 border-b border-[var(--border)] flex-shrink-0">
            <div className="flex-1 min-w-0">
              <input
                className="text-sm font-semibold text-[var(--text-primary)] bg-transparent focus:outline-none border-b border-transparent focus:border-blue-600 pb-0.5 w-full max-w-xs"
                value={selectedAsset.name}
                onChange={e => updateAsset(selectedAsset.id, { name: e.target.value })}
              />
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="gray">{selectedAsset.type}</Badge>
                {statusBadge(selectedAsset.status)}
                <Badge variant="yellow">DEMO</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedAsset.status}
                onChange={e => handleStatusChange(e.target.value as AssetStatus)}
                className="bg-[var(--bg-app)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text-secondary)] focus:outline-none"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <Button size="xs" variant="secondary" onClick={() => setShowHistory(!showHistory)} className="gap-1">
                <History className="w-3 h-3" /> History
              </Button>
              <Button size="xs" variant="secondary" onClick={handleRegenerate} className="gap-1">
                <RefreshCw className="w-3 h-3" /> Regenerate
              </Button>
              <Button size="xs" variant="secondary" onClick={handleDownload} className="gap-1">
                <Download className="w-3 h-3" /> Download
              </Button>
              <Button size="xs" variant="danger" onClick={() => setDeleteConfirm(selectedAsset.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Content Area */}
            <textarea
              value={selectedAsset.content}
              onChange={e => handleContentChange(e.target.value)}
              className="flex-1 bg-[var(--bg-app)] text-[var(--text-primary)] text-sm p-4 resize-none focus:outline-none font-mono leading-relaxed"
              spellCheck={false}
            />

            {/* History Sidebar */}
            {showHistory && (
              <div className="w-48 border-l border-[var(--border)] p-3 space-y-2 overflow-y-auto">
                <p className="text-xs font-medium text-[var(--text-secondary)]">Version History</p>
                {selectedAsset.versions.length === 0 && <p className="text-xs text-[var(--text-muted)]">No versions yet</p>}
                {[...selectedAsset.versions].reverse().map(v => (
                  <div key={v.id} className="p-2 bg-[var(--bg-app)] border border-[var(--border)] rounded-lg cursor-pointer hover:border-blue-600/40"
                    onClick={() => updateAsset(selectedAsset.id, { content: v.content })}>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">{v.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(v.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No asset selected"
            description="Select an asset from the list or create a new one"
            action={<Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Create Asset</Button>}
          />
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Asset" size="md">
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-yellow-900/10 border border-yellow-800/20 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)] flex-shrink-0" />
            <p className="text-xs text-yellow-300">Content is template-generated. No AI API is called in demo mode.</p>
          </div>
          <Input label="Asset Name" placeholder="FreshBrew Pitch Deck Q1 2025" value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} />
          <Select label="Asset Type" value={newForm.type} onChange={e => setNewForm(f => ({ ...f, type: e.target.value as AssetType }))}
            options={ASSET_TYPES.map(t => ({ value: t, label: t }))} />
          <Input label="Target Audience" placeholder="Aspiring franchise investors" value={newForm.targetAudience} onChange={e => setNewForm(f => ({ ...f, targetAudience: e.target.value }))} />
          <Input label="Campaign Objective" placeholder="Lead generation" value={newForm.campaignObjective} onChange={e => setNewForm(f => ({ ...f, campaignObjective: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Language" value={newForm.language} onChange={e => setNewForm(f => ({ ...f, language: e.target.value }))}
              options={LANGUAGES.map(l => ({ value: l, label: l }))} />
            <Select label="Tone" value={newForm.tone} onChange={e => setNewForm(f => ({ ...f, tone: e.target.value }))}
              options={TONES.map(t => ({ value: t, label: t }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} className="flex-1 gap-2"><FileText className="w-4 h-4" /> Generate</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            deleteAsset(deleteConfirm);
            setSelectedAssetId(data.assets.find(a => a.id !== deleteConfirm)?.id || null);
            showToast('Asset deleted', 'info');
          }
        }}
        title="Delete Asset"
        message="This will permanently delete this collateral asset. Are you sure?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
